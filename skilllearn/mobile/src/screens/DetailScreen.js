import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { api } from '../api/client';
import { Button, CategoryTag, Cover, EmptyState, FavoriteButton, Loading, ProgressBar, T, useToast } from '../components/ui';
import { ArticleView, PracticeView, QuizView, VideoView } from '../components/MaterialViews';
import { categoryColors, formatDuration, radius, typeMeta } from '../theme';
import { useTheme, useStyles } from '../context/ThemeContext';

const VIEWS = { artikel: ArticleView, video: VideoView, kuis: QuizView, latihan: PracticeView };

export default function DetailScreen({ route, navigation }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const { slug } = route.params;
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const scrollRef = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    api
      .material(slug)
      .then((d) => alive && setData(d))
      .catch((err) => alive && setError(err));
    return () => {
      alive = false;
    };
  }, [slug]);

  const materialId = data?.material.id;

  const onProgress = useCallback(
    async (payload, { silent = false } = {}) => {
      try {
        const res = await api.updateProgress(materialId, payload);
        setData((d) => ({ ...d, history: res.history }));
        if (!silent && res.history.completed) toast('Progress tersimpan. Materi selesai!');
      } catch (err) {
        toast(err.message, 'error');
      }
    },
    [materialId, toast]
  );

  const onSubmitQuiz = useCallback(
    async (answers) => {
      const res = await api.submitQuiz(materialId, answers);
      setData((d) => ({ ...d, history: res.history }));
      return res;
    },
    [materialId]
  );

  const toggleFavorite = async () => {
    const next = !data.material.isFavorite;
    setData((d) => ({ ...d, material: { ...d.material, isFavorite: next } }));
    try {
      if (next) await api.addFavorite(materialId);
      else await api.removeFavorite(materialId);
      toast(next ? 'Disimpan ke favorit' : 'Dihapus dari favorit');
    } catch (err) {
      setData((d) => ({ ...d, material: { ...d.material, isFavorite: !next } }));
      toast(err.message, 'error');
    }
  };

  const back = (
    <Pressable
      onPress={() => navigation.goBack()}
      style={[styles.roundBtn, { top: insets.top + 10, left: 16 }]}
      accessibilityRole="button"
      accessibilityLabel="Kembali"
    >
      <Feather name="arrow-left" size={20} color={colors.text} />
    </Pressable>
  );

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: insets.top + 70 }}>
        {back}
        <EmptyState
          icon="file"
          title={error.status === 404 ? 'Materi tidak ditemukan' : 'Gagal memuat materi'}
          text={error.message}
          action={<Button title="Kembali" variant="secondary" onPress={() => navigation.goBack()} />}
        />
      </View>
    );
  }
  if (!data) return <Loading label="Memuat materi..." />;

  const { material, history, related } = data;
  const View_ = VIEWS[material.type];
  const cat = categoryColors(material.category, dark);
  const progress = history?.progress ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <Cover
          category={material.category}
          type={material.type}
          height={230 + insets.top}
          iconSize={190}
          showType={false}
        />
        <View style={styles.sheet}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <CategoryTag category={material.category} />
            <View style={styles.typeTag}>
              <T weight="bold" size={12} color={colors.primaryText}>
                {typeMeta(material.type).label}
              </T>
            </View>
          </View>
          <T weight="extrabold" size={24} style={{ lineHeight: 31 }}>
            {material.title}
          </T>
          <T color={colors.text2}>{material.summary}</T>
          <View style={styles.meta}>
            {[
              ['activity', material.level],
              ['clock', formatDuration(material.durationMinutes)],
              ['user', material.author],
            ].map(([icon, label]) => (
              <View key={icon} style={styles.metaItem}>
                <Feather name={icon} size={14} color={colors.text3} />
                <T weight="semibold" size={13} color={colors.text2}>
                  {label}
                </T>
              </View>
            ))}
          </View>

          <View style={styles.progressCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <T weight="bold" size={14}>
                Progress kamu
              </T>
              <T weight="extrabold" size={18} color={cat.fg}>
                {progress}%{' '}
                <T weight="semibold" size={12} color={colors.text2}>
                  {history?.completed ? 'Selesai' : progress > 0 ? 'Sedang dipelajari' : 'Belum dimulai'}
                </T>
              </T>
            </View>
            <ProgressBar value={progress} />
          </View>

          <View style={styles.divider} />
          <View_
            key={material.id}
            material={material}
            history={history}
            onProgress={onProgress}
            onSubmitQuiz={onSubmitQuiz}
            scrollToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          />

          {related.length > 0 && (
            <View style={{ gap: 10, marginTop: 24 }}>
              <T weight="extrabold" size={18}>
                Materi terkait
              </T>
              {related.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => navigation.push('Detail', { slug: r.slug })}
                  style={styles.related}
                  accessibilityRole="button"
                >
                  <Cover category={r.category} type={r.type} height={48} rounded={12} showType={false} style={{ width: 48 }} />
                  <View style={{ flex: 1 }}>
                    <T weight="bold" size={12} color={colors.text3}>
                      {typeMeta(r.type).label}
                    </T>
                    <T weight="bold" size={14} numberOfLines={2}>
                      {r.title}
                    </T>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.text3} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {back}
      <View style={{ position: 'absolute', top: insets.top + 10, right: 16 }}>
        <FavoriteButton active={material.isFavorite} onPress={toggleFavorite} size={42} />
      </View>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
  roundBtn: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
  },
  sheet: {
    marginTop: -28,
    padding: 20,
    gap: 12,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
  },
  typeTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, backgroundColor: colors.primarySofter },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  progressCard: {
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  related: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
