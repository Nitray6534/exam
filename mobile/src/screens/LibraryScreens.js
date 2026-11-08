import { useCallback, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useFavoriteToggle } from '../lib/useFavoriteToggle';
import { Button, Cover, EmptyState, ErrorBox, Loading, MaterialCard, Pill, ProgressBar, T, useToast } from '../components/ui';
import { categoryMeta, colors, initials, radius, timeAgo, typeMeta } from '../theme';

function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
      <View style={{ flex: 1 }}>
        <T weight="bold" size={11} color={colors.coral700} style={{ letterSpacing: 1 }}>
          {eyebrow}
        </T>
        <T weight="extrabold" size={26} style={{ lineHeight: 33 }}>
          {title}
        </T>
        {subtitle && <T color={colors.ink2}>{subtitle}</T>}
      </View>
      {right}
    </View>
  );
}

/* ================= Favorit ================= */
export function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const toggleFavorite = useFavoriteToggle(setItems, { removeOnUnfavorite: true });

  const load = useCallback(async () => {
    try {
      setError('');
      const d = await api.favorites();
      setItems(d.items);
    } catch (err) {
      setError(err.message);
      setItems((x) => x ?? []);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: 32 }}
      data={items ?? []}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={
        <View>
          <PageHeader
            eyebrow="KOLEKSI KAMU"
            title="Materi Favorit"
            subtitle={items ? `${items.length} materi tersimpan` : 'Memuat...'}
          />
          <ErrorBox message={error} />
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      renderItem={({ item }) => (
        <MaterialCard
          material={item}
          onPress={() => navigation.navigate('Detail', { slug: item.slug })}
          onToggleFavorite={toggleFavorite}
        />
      )}
      ListEmptyComponent={
        items === null ? (
          <Loading label="Memuat favorit..." />
        ) : (
          <EmptyState
            icon="heart"
            title="Belum ada materi favorit"
            text="Tekan ikon hati pada materi untuk menyimpannya di sini."
            action={<Button title="Jelajahi materi" onPress={() => navigation.navigate('Beranda')} />}
          />
        )
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => (setRefreshing(true), await load(), setRefreshing(false))}
        />
      }
    />
  );
}

/* ================= Riwayat ================= */
function Stat({ icon, label, value, bg, fg }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Feather name={icon} size={18} color={fg} />
      </View>
      <View>
        <T weight="extrabold" size={22} style={{ lineHeight: 26 }}>
          {value}
        </T>
        <T weight="semibold" size={12} color={colors.ink2}>
          {label}
        </T>
      </View>
    </View>
  );
}

function confirm(message, onYes) {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) onYes();
    return;
  }
  Alert.alert('Konfirmasi', message, [
    { text: 'Batal', style: 'cancel' },
    { text: 'Hapus', style: 'destructive', onPress: onYes },
  ]);
}

export function HistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setData(await api.history());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const remove = (h) =>
    confirm(`Hapus "${h.material.title}" dari riwayat?`, async () => {
      await api.removeHistory(h.material.id);
      toast('Riwayat dihapus');
      load();
    });

  const clearAll = () =>
    confirm('Hapus seluruh riwayat belajar? Progress akan direset.', async () => {
      await api.clearHistory();
      toast('Seluruh riwayat dihapus');
      load();
    });

  if (!data && !error) return <Loading label="Memuat riwayat..." />;
  const stats = data?.stats;
  const items = data?.items ?? [];

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: 32 }}
      data={items}
      keyExtractor={(h) => h.id}
      ListHeaderComponent={
        <View>
          <PageHeader
            eyebrow="PERJALANAN BELAJAR"
            title="Riwayat Belajar"
            right={
              items.length > 0 && (
                <Pressable onPress={clearAll} style={styles.clearBtn} accessibilityRole="button">
                  <Feather name="trash-2" size={15} color={colors.red600} />
                  <T weight="bold" size={13} color={colors.red600}>
                    Hapus semua
                  </T>
                </Pressable>
              )
            }
          />
          <ErrorBox message={error} />
          {stats && (
            <View style={styles.stats}>
              <Stat icon="book-open" label="Materi dibuka" value={stats.opened} bg={colors.pine100} fg={colors.pine800} />
              <Stat icon="check-circle" label="Selesai" value={stats.completed} bg={colors.green100} fg={colors.green600} />
              <Stat icon="zap" label="Sedang dipelajari" value={stats.inProgress} bg={colors.coral100} fg={colors.coral700} />
              <Stat icon="award" label="Rata-rata kuis" value={stats.averageQuizScore ?? '-'} bg={colors.butter100} fg="#A16207" />
            </View>
          )}
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item: h }) => {
        const m = h.material;
        const cat = categoryMeta(m.category);
        return (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('Detail', { slug: m.slug })}
            accessibilityRole="button"
          >
            <Cover category={m.category} type={m.type} height={52} rounded={14} showType={false} style={{ width: 52 }} />
            <View style={{ flex: 1, gap: 2 }}>
              <T weight="bold" size={12} color={cat.fg}>
                {cat.name} · {typeMeta(m.type).label}
              </T>
              <T weight="extrabold" size={15} numberOfLines={1}>
                {m.title}
              </T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={h.progress} height={6} />
                </View>
                {h.completed ? <Pill label="Selesai" /> : <T weight="bold" size={12}>{h.progress}%</T>}
              </View>
              <T size={12} color={colors.ink3}>
                Dibuka {timeAgo(h.lastAccessedAt)}
                {typeof h.bestQuizScore === 'number' ? ` · skor terbaik ${h.bestQuizScore}` : ''}
              </T>
            </View>
            <Pressable onPress={() => remove(h)} hitSlop={10} style={styles.trash} accessibilityLabel="Hapus dari riwayat">
              <Feather name="trash-2" size={18} color={colors.ink3} />
            </Pressable>
          </Pressable>
        );
      }}
      ListEmptyComponent={
        <EmptyState
          icon="clock"
          title="Riwayat masih kosong"
          text="Materi yang kamu buka akan tercatat otomatis di sini."
          action={<Button title="Mulai belajar" onPress={() => navigation.navigate('Beranda')} />}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => (setRefreshing(true), await load(), setRefreshing(false))}
        />
      }
    />
  );
}

/* ================= Profil ================= */
export function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, stats, refresh, logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: 32 }}
    >
      <PageHeader eyebrow="AKUN" title="Profil Saya" />
      <View style={styles.profileCard}>
        <View style={styles.avatarXl}>
          <T weight="extrabold" size={28}>
            {initials(user?.name)}
          </T>
        </View>
        <T weight="extrabold" size={22} style={{ marginTop: 8 }}>
          {user?.name}
        </T>
        <View style={styles.infoRow}>
          <Feather name="mail" size={15} color={colors.ink3} />
          <T color={colors.ink2}>{user?.email}</T>
        </View>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={15} color={colors.ink3} />
          <T color={colors.ink2}>Bergabung {joined}</T>
        </View>

        <View style={styles.profileStats}>
          {[
            ['heart', stats?.favorites ?? 0, 'Favorit', 'Favorit'],
            ['book-open', stats?.opened ?? 0, 'Dibuka', 'Riwayat'],
            ['check-circle', stats?.completed ?? 0, 'Selesai', 'Riwayat'],
          ].map(([icon, value, label, target]) => (
            <Pressable key={label} style={styles.profileStat} onPress={() => navigation.navigate(target)}>
              <Feather name={icon} size={18} color={colors.coral600} />
              <T weight="extrabold" size={22}>
                {value}
              </T>
              <T weight="semibold" size={12} color={colors.ink2}>
                {label}
              </T>
            </Pressable>
          ))}
        </View>
        <Button title="Keluar dari akun" icon="log-out" variant="danger" onPress={logout} style={{ alignSelf: 'stretch' }} />
      </View>
      <T size={12} color={colors.ink3} style={{ textAlign: 'center', marginTop: 18 }}>
        SkillLearn versi 1.0.0
      </T>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3C7C5',
  },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  stat: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  statIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  trash: { padding: 6 },
  profileCard: {
    alignItems: 'center',
    gap: 4,
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  avatarXl: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.coral500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileStats: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginVertical: 18 },
  profileStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cream,
  },
});
