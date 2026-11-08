import { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, font, radius, categoryMeta, typeMeta, formatDuration } from '../theme';

/* ---------- Typography ---------- */
const WEIGHT = {
  regular: font.regular,
  medium: font.medium,
  semibold: font.semibold,
  bold: font.bold,
  extrabold: font.extrabold,
};

export function T({ weight = 'regular', size = 15, color = colors.ink, style, ...props }) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: WEIGHT[weight], fontSize: size, color, lineHeight: Math.round(size * 1.45) }, style]}
    />
  );
}

/* ---------- Logo ---------- */
export function Logo({ light = false, size = 32 }) {
  return (
    <View style={styles.logo}>
      <View
        style={[
          styles.logoMark,
          { width: size, height: size, borderRadius: size * 0.25, backgroundColor: light ? '#fff' : colors.pine800 },
        ]}
      >
        <T weight="extrabold" size={size * 0.62} color={light ? colors.pine800 : '#fff'} style={{ lineHeight: size }}>
          S
        </T>
        <View style={[styles.logoDot, { width: size * 0.16, height: size * 0.16, borderRadius: size }]} />
      </View>
      <T weight="extrabold" size={size * 0.62} color={light ? '#fff' : colors.ink}>
        Skill
        <T weight="extrabold" size={size * 0.62} color={light ? '#fff' : colors.pine800}>
          Learn
        </T>
      </T>
    </View>
  );
}

/* ---------- Button ---------- */
export function Button({ title, onPress, variant = 'primary', icon, disabled, loading, style, small }) {
  const v = BUTTON[variant];
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

const BUTTON = {
  primary: { bg: colors.pine800, fg: '#fff', border: colors.pine800 },
  secondary: { bg: colors.surface, fg: colors.ink, border: colors.lineStrong },
  favorite: { bg: colors.coral100, fg: colors.coral700, border: '#FFC9B8' },
  danger: { bg: 'transparent', fg: colors.red600, border: '#F3C7C5' },
};

/* ---------- Input ---------- */
export function Input({ label, icon, error, hint, secure, ...props }) {
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
          focused && { borderColor: colors.pine800 },
          error && { borderColor: colors.red600 },
        ]}
      >
        {icon && <Feather name={icon} size={18} color={colors.ink3} />}
        <TextInput
          {...props}
          secureTextEntry={secure && hidden}
          placeholderTextColor="#8E9895"
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
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.ink3} />
          </Pressable>
        )}
      </View>
      {(error || hint) && (
        <T size={13} weight={error ? 'semibold' : 'regular'} color={error ? colors.red600 : colors.ink3}>
          {error || hint}
        </T>
      )}
    </View>
  );
}

/* ---------- Progress ---------- */
export function ProgressBar({ value = 0, height = 8, track = colors.line }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View
      style={{ height, borderRadius: 99, backgroundColor: track, overflow: 'hidden' }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: v }}
    >
      <LinearGradient
        colors={[colors.coral500, colors.coral600]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${v}%`, height: '100%', borderRadius: 99 }}
      />
    </View>
  );
}

/* ---------- Cover art ---------- */
export function Cover({ category, type, height = 140, rounded = 0, showType = true, iconSize = 120, style }) {
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
          <Feather name={t.icon} size={13} color={colors.ink} />
          <T weight="bold" size={12}>
            {t.label}
          </T>
        </View>
      )}
    </LinearGradient>
  );
}

export function CategoryTag({ category }) {
  const cat = categoryMeta(category);
  return (
    <View style={[styles.tag, { backgroundColor: cat.soft }]}>
      <T weight="bold" size={12} color={cat.fg}>
        {cat.name}
      </T>
    </View>
  );
}

export function FavoriteButton({ active, onPress, size = 38 }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Hapus dari favorit' : 'Simpan ke favorit'}
      style={[styles.favBtn, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={size * 0.5} color={active ? colors.coral600 : colors.ink2} />
    </Pressable>
  );
}

/* ---------- Material card ---------- */
export function MaterialCard({ material, onPress, onToggleFavorite }) {
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
        <T size={14} color={colors.ink2} numberOfLines={2}>
          {summary}
        </T>
        <View style={styles.cardMeta}>
          <T weight="semibold" size={13} color={colors.ink3}>
            {level} · {formatDuration(durationMinutes)}
          </T>
          {completed && <Pill label="Selesai" />}
        </View>
        {progress > 0 && !completed && (
          <View style={styles.cardProgress}>
            <View style={{ flex: 1 }}>
              <ProgressBar value={progress} height={6} />
            </View>
            <T weight="bold" size={12} color={colors.ink2}>
              {progress}%
            </T>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function Pill({ label, tone = 'done' }) {
  const t = tone === 'done' ? { bg: colors.green100, fg: '#166534' } : { bg: colors.pine50, fg: colors.pine800 };
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
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.pine800} size="large" />
      <T weight="semibold" color={colors.ink3}>
        {label}
      </T>
    </View>
  );
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={28} color={colors.coral700} />
      </View>
      <T weight="extrabold" size={18} style={{ textAlign: 'center' }}>
        {title}
      </T>
      <T color={colors.ink2} style={{ textAlign: 'center', marginBottom: 8 }}>
        {text}
      </T>
      {action}
    </View>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <View style={styles.errorBox} accessibilityRole="alert">
      <Feather name="alert-circle" size={18} color="#8F1D1D" />
      <T weight="semibold" size={14} color="#8F1D1D" style={{ flex: 1 }}>
        {message}
      </T>
    </View>
  );
}

/* ---------- Toast ---------- */
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
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
            color={toast.tone === 'error' ? '#FCA5A5' : '#6EE7B7'}
          />
          <T weight="semibold" size={14} color="#fff">
            {toast.message}
          </T>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { alignItems: 'center', justifyContent: 'center' },
  logoDot: { position: 'absolute', top: '16%', right: '16%', backgroundColor: colors.coral500 },
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
    color: colors.ink,
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
    backgroundColor: 'rgba(255,255,255,0.96)',
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
    backgroundColor: colors.coral100,
    marginBottom: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.red100,
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
    backgroundColor: colors.ink,
  },
});
