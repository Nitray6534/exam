import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes } from '../theme';

const KEY = 'skilllearn_theme';
const ThemeContext = createContext({ colors: palettes.light, dark: false, toggle: () => {} });

// Tema mengikuti pengaturan HP sampai pengguna memilih terang/gelap sendiri.
export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [mode, setMode] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((saved) => saved && setMode(saved))
      .catch(() => {});
  }, []);

  const dark = mode === 'dark' || (mode === 'system' && system === 'dark');

  const toggle = useCallback(() => {
    const next = dark ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem(KEY, next).catch(() => {});
  }, [dark]);

  const value = useMemo(() => ({ colors: dark ? palettes.dark : palettes.light, dark, toggle }), [dark, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// Membuat StyleSheet dari fungsi (colors) => styles, dibuat ulang hanya saat tema berganti.
export function useStyles(factory) {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [factory, colors]);
}
