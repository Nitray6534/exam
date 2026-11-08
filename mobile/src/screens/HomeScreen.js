import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useFavoriteToggle } from '../lib/useFavoriteToggle';
import { Cover, EmptyState, ErrorBox, Loading, MaterialCard, ProgressBar, T } from '../components/ui';
import { CATEGORY_META, TYPE_META, font, initials, radius } from '../theme';
import { useTheme, useStyles } from '../context/ThemeContext';

function ContinueCard({ entry, onPress }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  if (!entry) {
    return (
      <View style={[styles.continue, styles.continueEmpty]}>
        <Feather name="zap" size={20} color={colors.accentStrong} />
        <View style={{ flex: 1 }}>
          <T weight="bold">Belum ada materi yang dibuka</T>
          <T size={13} color={colors.text2}>
            Pilih satu materi di bawah. Progress kamu tersimpan otomatis.
          </T>
        </View>
      </View>
    );
  }
  const m = entry.material;
  return (
    <Pressable style={styles.continue} onPress={onPress} accessibilityRole="button">
      <Cover category={m.category} type={m.type} height={56} rounded={14} showType={false} style={{ width: 56 }} />
      <View style={{ flex: 1, gap: 2 }}>
        <T weight="bold" size={11} color={colors.highlight} style={{ letterSpacing: 1 }}>
          LANJUTKAN BELAJAR
        </T>
        <T weight="bold" color="#fff" numberOfLines={1}>
          {m.title}
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <View style={{ flex: 1 }}>
            <ProgressBar value={entry.progress} height={6} track="rgba(255,255,255,0.2)" />
          </View>
          <T weight="bold" size={12} color="#fff">
            {entry.progress}%
          </T>
        </View>
      </View>
      <Feather name="arrow-right" size={20} color={colors.highlight} />
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors, dark, toggle } = useTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastEntry, setLastEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const toggleFavorite = useFavoriteToggle(setItems);
  const first = useRef(true);

  const loadMaterials = useCallback(async () => {
    try {
      setError('');
      const data = await api.materials({ category, type, q: query });
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    }
  }, [category, type, query]);

  const loadSide = useCallback(async () => {
    try {
      const [cats, hist] = await Promise.all([api.categories(), api.history()]);
      setCategories(cats.items);
      const open = hist.items.filter((h) => !h.completed);
      setLastEntry(open.find((h) => h.progress > 0) ?? open[0] ?? null);
    } catch {
      /* tidak kritis */
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadMaterials().finally(() => setLoading(false));
  }, [loadMaterials]);

  // Muat ulang saat kembali dari halaman detail agar favorit & progress terbaru
  useFocusEffect(
    useCallback(() => {
      loadSide();
      if (!first.current) loadMaterials();
      first.current = false;
    }, [loadSide, loadMaterials])
  );

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMaterials(), loadSide()]);
    setRefreshing(false);
  };

  const total = categories.reduce((s, c) => s + c.count, 0);
  const openDetail = (slug) => navigation.navigate('Detail', { slug });

  const header = (
    <View style={{ gap: 18, marginBottom: 18 }}>
      <View style={styles.greetRow}>
        <View style={{ flex: 1 }}>
          <T weight="semibold" size={14} color={colors.text2}>
            Halo, {user?.name?.split(' ')[0]}
          </T>
          <T weight="extrabold" size={24} style={{ lineHeight: 31 }}>
            Mau belajar apa hari ini?
          </T>
        </View>
        <Pressable
          onPress={toggle}
          style={styles.themeBtn}
          accessibilityRole="button"
          accessibilityLabel={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
        >
          <Feather name={dark ? 'sun' : 'moon'} size={19} color={colors.text2} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Profil')} style={styles.avatar} accessibilityLabel="Profil">
          <T weight="extrabold" size={14} color={colors.avatarText}>
            {initials(user?.name)}
          </T>
        </Pressable>
      </View>

      <View style={styles.search}>
        <Feather name="search" size={20} color={colors.text3} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cari figma, javascript, funnel..."
          placeholderTextColor={colors.placeholder}
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel="Cari materi"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Hapus pencarian">
            <Feather name="x" size={18} color={colors.text2} />
          </Pressable>
        )}
      </View>

      <ContinueCard entry={lastEntry} onPress={() => openDetail(lastEntry.material.slug)} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {[{ slug: '', name: 'Semua', count: total }, ...categories].map((c) => {
          const active = category === c.slug;
          const meta = CATEGORY_META[c.slug];
          return (
            <Pressable
              key={c.slug || 'all'}
              onPress={() => setCategory(c.slug)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Feather
                name={meta ? meta.icon : 'layers'}
                size={15}
                color={active ? colors.highlight : meta ? (dark ? meta.fgDark : meta.fg) : colors.text2}
              />
              <T weight="bold" size={14} color={active ? '#fff' : colors.text}>
                {c.name}
              </T>
              <View style={[styles.chipCount, active && { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <T weight="semibold" size={12} color={active ? '#fff' : colors.text2}>
                  {c.count || ''}
                </T>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.segmented}>
          {[['', 'Semua tipe'], ...Object.entries(TYPE_META).map(([k, v]) => [k, v.label])].map(([value, label]) => {
            const active = type === value;
            return (
              <Pressable
                key={value || 'all'}
                onPress={() => setType(value)}
                style={[styles.segment, active && styles.segmentActive]}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
              >
                <T weight={active ? 'bold' : 'semibold'} size={14} color={active ? colors.text : colors.text2}>
                  {label}
                </T>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <T weight="extrabold" size={18}>
        {category ? CATEGORY_META[category].name : 'Semua bidang'}
        <T weight="semibold" size={18} color={colors.text3}>
          {'  '}
          {loading ? '...' : `${items.length} materi`}
        </T>
      </T>
      <ErrorBox message={error} />
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 16, paddingBottom: 32 }}
      data={loading ? [] : items}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      renderItem={({ item }) => (
        <MaterialCard material={item} onPress={() => openDetail(item.slug)} onToggleFavorite={toggleFavorite} />
      )}
      ListEmptyComponent={
        loading ? (
          <Loading label="Memuat materi..." />
        ) : error ? null : (
          <EmptyState icon="search" title="Materi tidak ditemukan" text="Coba kata kunci lain atau ganti filter." />
        )
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryText} />}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.avatarBg,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: font.medium,
    fontSize: 15,
    color: colors.text,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
  },
  continueEmpty: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    alignItems: 'flex-start',
    padding: 14,
  },
  chips: { gap: 8, paddingRight: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipCount: { minWidth: 22, paddingHorizontal: 6, borderRadius: 99, backgroundColor: colors.surface2, alignItems: 'center' },
  segmented: { flexDirection: 'row', padding: 4, gap: 2, borderRadius: 12, backgroundColor: colors.segmentBg },
  segment: { height: 36, paddingHorizontal: 14, borderRadius: 9, justifyContent: 'center' },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
});
