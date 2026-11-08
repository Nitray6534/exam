import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStats(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) return;
    try {
      const data = await api.me();
      setUser(data.user);
      setStats(data.stats);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refresh();
    const onUnauthorized = () => logout();
    window.addEventListener('skilllearn:unauthorized', onUnauthorized);
    return () => window.removeEventListener('skilllearn:unauthorized', onUnauthorized);
  }, [refresh, logout]);

  const handleAuth = useCallback((data) => {
    tokenStore.set(data.token);
    setUser(data.user);
  }, []);

  const value = useMemo(
    () => ({
      user,
      stats,
      loading,
      refresh,
      logout,
      login: async (payload) => handleAuth(await api.login(payload)),
      register: async (payload) => handleAuth(await api.register(payload)),
    }),
    [user, stats, loading, refresh, logout, handleAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
