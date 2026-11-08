import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setUnauthorizedHandler, tokenStore } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(async () => {
    await tokenStore.clear();
    setUser(null);
    setStats(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await api.me();
      setUser(data.user);
      setStats(data.stats);
    } catch (err) {
      if (err.status === 401) await logout();
    }
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    (async () => {
      const token = await tokenStore.load();
      if (token) await refresh();
      setBooting(false);
    })();
  }, [refresh, logout]);

  const handleAuth = useCallback(async (data) => {
    await tokenStore.set(data.token);
    setUser(data.user);
  }, []);

  const value = useMemo(
    () => ({
      user,
      stats,
      booting,
      refresh,
      logout,
      login: async (payload) => handleAuth(await api.login(payload)),
      register: async (payload) => handleAuth(await api.register(payload)),
    }),
    [user, stats, booting, refresh, logout, handleAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
