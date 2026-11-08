import { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { font, radius, categoryMeta, categoryColors, typeMeta, formatDuration } from '../theme';
import { useTheme, useStyles } from '../context/ThemeContext';

/* ---------- Typography ---------- */
const WEIGHT = {
  regular: font.regular,
  medium: font.medium,
  semibold: font.semibold,
  bold: font.bold,
  extrabold: font.extrabold,
};

export function T({ weight = 'regular', size = 15, color, style, ...props }) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: WEIGHT[weight], fontSize: size, color: color ?? colors.text, lineHeight: Math.round(size * 1.45) },
        style,
      ]}
    />
  );
}

/* ---------- Logo ---------- */
export function Logo({ light = false, size = 32 }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.logo}>
      <Image source={light ? LOGO_LIGHT : LOGO} style={{ width: size, height: size }} accessibilityIgnoresInvertColors />
      <T weight="extrabold" size={size * 0.62} color={light ? '#fff' : colors.text}>
        Skill
        <T weight="extrabold" size={size * 0.62} color={light ? '#fff' : colors.primaryText}>
          Learn
        </T>
      </T>
    </View>
  );
}

const LOGO = require('../../assets/logo-mark.png');
const LOGO_LIGHT = require('../../assets/logo-mark-light.png');

/* ---------- Button ---------- */
export function Button({ title, onPress, variant = 'primary', icon, disabled, loading, style, small }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const v = buttonTones(colors)[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        (disabled || loading) && { opacity: 0.55 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon && <Feather name={icon} size={small ? 15 : 18} color={v.fg} />}
          <T weight="bold" size={small ? 14 : 15} color={v.fg}>
            {title}
          </T>
        </>
      )}
    </Pressable>
  );
}

const buttonTones = (colors) => ({
  primary: { bg: colors.primary, fg: '#fff', border: colors.primary },
  secondary: { bg: colors.surface, fg: colors.text, border: colors.lineStrong },
  favorite: { bg: colors.accentSoft, fg: colors.accentText, border: colors.accent },
  danger: { bg: 'transparent', fg: colors.danger, border: colors.dangerBorder },
});

/* ---------- Input ---------- */
export function Input({ label, icon, error, hint, secure, ...props }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <T weight="bold" size={14}>
        {label}
      </T>
      <View
        style={[
          styles.input,
          focused && { borderColor: colors.primary },
          error && { borderColor: colors.danger },
        ]}
      >
        {icon && <Feather name={icon} size={18} color={colors.text3} />}
        <TextInput
          {...props}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.inputField}
          accessibilityLabel={label}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Tampilkan password' : 'Sembunyikan password'}
          >
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.text3} />
          </Pressable>
        )}
      </View>
      {(error || hint) && (
        <T size={13} weight={error ? 'semibold' : 'regular'} color={error ? colors.danger : colors.text3}>
          {error || hint}
        </T>
      )}
    </View>
  );
}

/* ---------- Progress ---------- */
export function ProgressBar({ value = 0, height = 8, track }) {
  const { colors } = useTheme();
  const v = Math.max(0, Math.min(100, value));
  return (
    <View
      style={{ height, borderRadius: 99, backgroundColor: track ?? colors.line, overflow: 'hidden' }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: v }}
    >
      <LinearGradient
        colors={[colors.accent, colors.accentStrong]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${v}%`, height: '100%', borderRadius: 99 }}
      />
    </View>
  );
}

/* ---------- Cover art ---------- */
export function Cover({ category, type, height = 140, rounded = 0, showType = true, iconSize = 120, style }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const cat = categoryMeta(category);
  const t = typeMeta(type);
  const small = height < 70;
  return (
    <LinearGradient
      colors={[cat.from, cat.to]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ height, borderRadius: rounded, overflow: 'hidden' }, style]}
    >
      <Feather
        name={cat.icon}
        size={small ? height * 0.5 : iconSize}
        color={small ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)'}
        style={
          small
            ? { position: 'absolute', alignSelf: 'center', top: height * 0.25 }
            : { position: 'absolute', right: -12, bottom: -18, transform: [{ rotate: '-12deg' }] }
        }
      />
      {showType && (
        <View style={styles.typeBadge}>
          <Feather name={t.icon} size={13} color="#1B1630" />
          <T weight="bold" size={12} color="#1B1630">
            {t.label}
          </T>
        </View>
      )}
    </LinearGradient>
  );
}

export function CategoryTag({ category }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const cat = categoryColors(category, dark);
  return (
    <View style={[styles.tag, { backgroundColor: cat.soft }]}>
      <T weight="bold" size={12} color={cat.fg}>
        {cat.name}
      </T>
    </View>
  );
}

export function FavoriteButton({ active, onPress, size = 38 }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Hapus dari favorit' : 'Simpan ke favorit'}
      style={[styles.favBtn, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={size * 0.5} color={active ? colors.accentStrong : colors.text2} />
    </Pressable>
  );
}

/* ---------- Material card ---------- */
export function MaterialCard({ material, onPress, onToggleFavorite }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const { title, summary, category, type, level, durationMinutes, isFavorite, progress, completed } = material;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      <Cover category={category} type={type} />
      {onToggleFavorite && (
        <View style={{ position: 'absolute', top: 12, right: 12 }}>
          <FavoriteButton active={isFavorite} onPress={() => onToggleFavorite(material)} />
        </View>
      )}
      <View style={styles.cardBody}>
        <CategoryTag category={category} />
        <T weight="extrabold" size={17} numberOfLines={2} style={{ marginTop: 10, marginBottom: 4 }}>
          {title}
        </T>
        <T size={14} color={colors.text2} numberOfLines={2}>
          {summary}
        </T>
        <View style={styles.cardMeta}>
          <T weight="semibold" size={13} color={colors.text3}>
            {level} · {formatDuration(durationMinutes)}
          </T>
          {completed && <Pill label="Selesai" />}
        </View>
        {progress > 0 && !completed && (
          <View style={styles.cardProgress}>
            <View style={{ flex: 1 }}>
              <ProgressBar value={progress} height={6} />
            </View>
            <T weight="bold" size={12} color={colors.text2}>
              {progress}%
            </T>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function Pill({ label, tone = 'done' }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const t = tone === 'done' ? { bg: colors.successBg, fg: colors.successText } : { bg: colors.primarySofter, fg: colors.primaryText };
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <T weight="bold" size={12} color={t.fg}>
        {label}
      </T>
    </View>
  );
}

/* ---------- States ---------- */
export function Loading({ label = 'Memuat...' }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primaryText} size="large" />
      <T weight="semibold" color={colors.text3}>
        {label}
      </T>
    </View>
  );
}

export function EmptyState({ icon, title, text, action }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={28} color={colors.accentText} />
      </View>
      <T weight="extrabold" size={18} style={{ textAlign: 'center' }}>
        {title}
      </T>
      <T color={colors.text2} style={{ textAlign: 'center', marginBottom: 8 }}>
        {text}
      </T>
      {action}
    </View>
  );
}

export function ErrorBox({ message }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  if (!message) return null;
  return (
    <View style={styles.errorBox} accessibilityRole="alert">
      <Feather name="alert-circle" size={18} color={colors.dangerText} />
      <T weight="semibold" size={14} color={colors.dangerText} style={{ flex: 1 }}>
        {message}
      </T>
    </View>
  );
}

/* ---------- Toast ---------- */
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef();

  const show = useCallback(
    (message, tone = 'success') => {
      clearTimeout(timer.current);
      setToast({ message, tone });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setToast(null));
      }, 2200);
    },
    [opacity]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
          <Feather
            name={toast.tone === 'error' ? 'alert-circle' : 'check-circle'}
            size={18}
            color={toast.tone === 'error' ? colors.toastErr : colors.toastOk}
          />
          <T weight="semibold" size={14} color={colors.toastText}>
            {toast.message}
          </T>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const makeStyles = (colors) =>
  StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { alignItems: 'center', justifyContent: 'center' },
  logoDot: { position: 'absolute', top: '16%', right: '16%', backgroundColor: colors.accent },
  btn: {
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnSmall: { minHeight: 38, paddingHorizontal: 14, borderRadius: 10 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontFamily: font.medium,
    fontSize: 15,
    color: colors.text,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  typeBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  favBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cardBody: { padding: 16 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  cardProgress: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  pill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 99 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  empty: {
    alignItems: 'center',
    gap: 6,
    padding: 28,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginBottom: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.dangerBg,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.toastBg,
  },
});
