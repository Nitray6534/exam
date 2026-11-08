import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'skilllearn_theme';
const ThemeContext = createContext({ dark: false, toggle: () => {} });

const readStored = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const systemPrefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

// Tema: ikut pengaturan sistem sampai pengguna memilih terang/gelap sendiri.
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => readStored() || 'system');
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const dark = mode === 'dark' || (mode === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#12101C' : '#5B21B6');
  }, [dark]);

  const toggle = useCallback(() => {
    const next = dark ? 'light' : 'dark';
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage tidak tersedia */
    }
  }, [dark]);

  const value = useMemo(() => ({ dark, mode, toggle }), [dark, mode, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
