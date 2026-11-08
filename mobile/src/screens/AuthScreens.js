import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { Button, ErrorBox, Input, Logo, T } from '../components/ui';
import { radius } from '../theme';
import { useTheme, useStyles } from '../context/ThemeContext';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthShell({ title, subtitle, children, footer }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.panel }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          <View style={styles.glow} />
          <Logo light />
          <T weight="extrabold" size={28} color="#fff" style={{ marginTop: 28, lineHeight: 36 }}>
            {title}
          </T>
          <T color="rgba(255,255,255,0.8)" style={{ marginTop: 6 }}>
            {subtitle}
          </T>
          <View style={styles.badges}>
            {[
              ['code', '#3B78F2'],
              ['pen-tool', '#EC5C93'],
              ['trending-up', '#F7AE36'],
              ['shield', '#64748B'],
            ].map(([icon, bg]) => (
              <View key={icon} style={[styles.badge, { backgroundColor: bg }]}>
                <Feather name={icon} size={16} color="#fff" />
              </View>
            ))}
            <T weight="semibold" size={13} color="rgba(255,255,255,0.85)" style={{ marginLeft: 6 }}>
              5 bidang · artikel, video, kuis, latihan
            </T>
          </View>
        </View>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 28 }]}>
          {children}
          {footer}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function LoginScreen({ navigation }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const next = {};
    if (!EMAIL_RX.test(email.trim())) next.email = 'Masukkan email yang valid';
    if (!password) next.password = 'Password wajib diisi';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setServerError('');
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan belajarmu."
      footer={
        <View style={styles.switchRow}>
          <T color={colors.text2}>Belum punya akun? </T>
          <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="link">
            <T weight="bold" color={colors.primaryText}>
              Daftar sekarang
            </T>
          </Pressable>
        </View>
      }
    >
      <T weight="extrabold" size={22}>
        Masuk
      </T>
      <ErrorBox message={serverError} />
      <Input
        label="Email"
        icon="mail"
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={(v) => (setEmail(v), setErrors((e) => ({ ...e, email: undefined })))}
        error={errors.email}
      />
      <Input
        label="Password"
        icon="lock"
        placeholder="Masukkan password"
        secure
        autoComplete="current-password"
        value={password}
        onChangeText={(v) => (setPassword(v), setErrors((e) => ({ ...e, password: undefined })))}
        error={errors.password}
        onSubmitEditing={submit}
      />
      <Button title="Masuk" onPress={submit} loading={loading} style={{ marginTop: 4 }} />
    </AuthShell>
  );
}

function strengthOf(pw) {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw)) s += 1;
  if (pw.length >= 12 || /[^A-Za-z0-9]/.test(pw)) s += 1;
  return s;
}

export function RegisterScreen({ navigation }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => strengthOf(form.password), [form.password]);

  const set = (key) => (v) => {
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Nama minimal 2 karakter';
    if (!EMAIL_RX.test(form.email.trim())) next.email = 'Masukkan email yang valid';
    if (form.password.length < 8) next.password = 'Password minimal 8 karakter';
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      next.password = 'Password harus mengandung huruf dan angka';
    if (form.confirm !== form.password) next.confirm = 'Konfirmasi password tidak sama';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setServerError('');
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = [colors.line, colors.danger, '#E3A008', colors.success][strength];
  const strengthLabel = ['Terlalu lemah', 'Lemah', 'Cukup', 'Kuat'][strength];

  return (
    <AuthShell
      title="Buat akun SkillLearn"
      subtitle="Gratis. Daftar sekali, akses semua materi."
      footer={
        <View style={styles.switchRow}>
          <T color={colors.text2}>Sudah punya akun? </T>
          <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="link">
            <T weight="bold" color={colors.primaryText}>
              Masuk
            </T>
          </Pressable>
        </View>
      }
    >
      <T weight="extrabold" size={22}>
        Daftar
      </T>
      <ErrorBox message={serverError} />
      <Input label="Nama lengkap" icon="user" placeholder="Contoh: Dony Pratama" value={form.name} onChangeText={set('name')} error={errors.name} />
      <Input
        label="Email"
        icon="mail"
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={set('email')}
        error={errors.email}
      />
      <Input
        label="Password"
        icon="lock"
        placeholder="Minimal 8 karakter"
        secure
        value={form.password}
        onChangeText={set('password')}
        error={errors.password}
        hint="Gunakan kombinasi huruf dan angka"
      />
      {form.password.length > 0 && (
        <View style={styles.strength}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={[styles.strengthBar, { backgroundColor: strength >= n ? strengthColor : colors.line }]} />
          ))}
          <T size={13} color={colors.text2} style={{ marginLeft: 6 }}>
            {strengthLabel}
          </T>
        </View>
      )}
      <Input
        label="Konfirmasi password"
        icon="lock"
        placeholder="Ulangi password"
        secure
        value={form.confirm}
        onChangeText={set('confirm')}
        error={errors.confirm}
      />
      <Button title="Daftar" onPress={submit} loading={loading} style={{ marginTop: 4 }} />
    </AuthShell>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 48, overflow: 'hidden' },
  glow: {
    position: 'absolute',
    right: -90,
    top: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  badges: { flexDirection: 'row', alignItems: 'center', marginTop: 22, gap: 6 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.panel,
  },
  sheet: {
    flex: 1,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 16,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
  },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  strength: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: -8 },
  strengthBar: { width: 36, height: 5, borderRadius: 99 },
});
