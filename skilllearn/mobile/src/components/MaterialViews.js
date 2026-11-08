import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Button, ProgressBar, T } from './ui';
import VideoPlayer from './VideoPlayer';
import { categoryMeta, font } from '../theme';
import { useTheme, useStyles } from '../context/ThemeContext';

function DoneBanner({ text = 'Materi ini sudah kamu selesaikan.' }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.done}>
      <Feather name="check-circle" size={20} color={colors.successText} />
      <T weight="bold" color={colors.successText} style={{ flex: 1 }}>
        {text}
      </T>
    </View>
  );
}

function SectionTitle({ icon, children }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
      {icon && <Feather name={icon} size={18} color={colors.text} />}
      <T weight="extrabold" size={18}>
        {children}
      </T>
    </View>
  );
}

export function ArticleView({ material, history, onProgress }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={{ gap: 14 }}>
      {material.blocks.map((b, i) => {
        switch (b.kind) {
          case 'heading':
            return (
              <T key={i} weight="extrabold" size={20} style={{ marginTop: 10 }}>
                {b.text}
              </T>
            );
          case 'list':
            return (
              <View key={i} style={{ gap: 8 }}>
                {b.items.map((it) => (
                  <View key={it} style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={styles.bullet} />
                    <T size={16} style={{ flex: 1, lineHeight: 26 }}>
                      {it}
                    </T>
                  </View>
                ))}
              </View>
            );
          case 'code':
            return (
              <View key={i} style={styles.code}>
                <T size={13} color={colors.codeText} style={{ fontFamily: font.medium, lineHeight: 21 }}>
                  {b.text}
                </T>
              </View>
            );
          case 'tip':
            return (
              <View key={i} style={styles.tip}>
                <Feather name="sun" size={20} color={colors.warnIcon} style={{ marginTop: 2 }} />
                <T size={15} style={{ flex: 1, lineHeight: 24 }}>
                  {b.text}
                </T>
              </View>
            );
          default:
            return (
              <T key={i} size={16} style={{ lineHeight: 27 }}>
                {b.text}
              </T>
            );
        }
      })}
      <View style={styles.divider} />
      {history?.completed ? (
        <DoneBanner />
      ) : (
        <Button title="Tandai selesai dibaca" icon="check" onPress={() => onProgress({ progress: 100, completed: true })} />
      )}
    </View>
  );
}

export function VideoView({ material, history, onProgress }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const [playing, setPlaying] = useState(false);
  const { youtubeId, channel, sourceTitle, keyPoints } = material.video;
  const cat = categoryMeta(material.category);

  const play = () => {
    setPlaying(true);
    if (!history?.progress) onProgress({ progress: 50 }, { silent: true });
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={styles.videoFrame}>
        {playing ? (
          <VideoPlayer youtubeId={youtubeId} title={sourceTitle} />
        ) : (
          <Pressable onPress={play} style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel={`Putar ${sourceTitle}`}>
            <LinearGradient colors={[cat.from, cat.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.poster}>
              <View style={styles.playBtn}>
                <Feather name="play" size={28} color="#5B21B6" style={{ marginLeft: 4 }} />
              </View>
              <View style={styles.posterCaption}>
                <T weight="bold" color="#fff" numberOfLines={1}>
                  {sourceTitle}
                </T>
                <T weight="semibold" size={12} color="rgba(255,255,255,0.85)">
                  {channel} · YouTube
                </T>
              </View>
            </LinearGradient>
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${youtubeId}`)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        accessibilityRole="link"
      >
        <T weight="bold" size={14} color={colors.primaryText}>
          Buka di aplikasi YouTube
        </T>
        <Feather name="external-link" size={14} color={colors.primaryText} />
      </Pressable>

      <SectionTitle>Panduan menonton</SectionTitle>
      {keyPoints.map((p) => (
        <View key={p} style={{ flexDirection: 'row', gap: 10 }}>
          <Feather name="check-circle" size={18} color={colors.primaryText} style={{ marginTop: 3 }} />
          <T style={{ flex: 1 }}>{p}</T>
        </View>
      ))}
      <View style={styles.divider} />
      {history?.completed ? (
        <DoneBanner />
      ) : (
        <Button title="Tandai sudah ditonton" icon="check" onPress={() => onProgress({ progress: 100, completed: true })} />
      )}
    </View>
  );
}

export function QuizView({ material, history, onSubmitQuiz, scrollToTop }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const total = material.quiz.length;
  const [answers, setAnswers] = useState(() => Array(total).fill(-1));
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const answered = answers.filter((a) => a >= 0).length;

  const submit = async () => {
    setSubmitting(true);
    try {
      setResult(await onSubmitQuiz(answers));
      scrollToTop?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ gap: 16 }}>
      {result ? (
        <View style={[styles.result, { backgroundColor: result.passed ? colors.successBg : colors.warnBg }]}>
          <View style={styles.score}>
            <Feather name="award" size={24} color="#CA8A04" />
            <T weight="extrabold" size={32} style={{ lineHeight: 38 }}>
              {result.score}
            </T>
            <T weight="bold" color={colors.text3}>
              /100
            </T>
          </View>
          <T weight="extrabold" size={18}>
            {result.passed ? 'Lulus! Kerja bagus.' : 'Belum lulus, coba lagi ya.'}
          </T>
          <T color={colors.text2}>
            Benar {result.correctCount} dari {result.total} soal. Nilai minimal lulus {result.passScore}.
          </T>
          <Button
            title="Ulangi kuis"
            icon="rotate-ccw"
            variant="secondary"
            small
            onPress={() => (setAnswers(Array(total).fill(-1)), setResult(null))}
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
          />
        </View>
      ) : (
        <View style={styles.quizIntro}>
          <T weight="bold" size={13} color={colors.primaryText}>
            {total} soal · lulus 70
            {typeof history?.bestQuizScore === 'number' ? ` · terbaik ${history.bestQuizScore}` : ''}
          </T>
          <T weight="bold" size={13} color={colors.primaryText}>
            {answered}/{total}
          </T>
        </View>
      )}

      {material.quiz.map((q, qi) => {
        const r = result?.results[qi];
        return (
          <View key={qi} style={styles.question}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={styles.qNo}>
                <T weight="bold" size={13} color="#fff">
                  {qi + 1}
                </T>
              </View>
              <T weight="bold" size={15} style={{ flex: 1 }}>
                {q.question}
              </T>
            </View>
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              let tone = null;
              if (r) {
                if (oi === r.answerIndex) tone = 'correct';
                else if (selected) tone = 'wrong';
              } else if (selected) tone = 'selected';
              const t = optionTones(colors)[tone] ?? optionTones(colors).idle;
              return (
                <Pressable
                  key={oi}
                  disabled={Boolean(result)}
                  onPress={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                  style={[styles.option, { borderColor: t.border, backgroundColor: t.bg }]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                >
                  <View style={[styles.optKey, { backgroundColor: t.keyBg, borderColor: t.keyBorder }]}>
                    <T weight="extrabold" size={13} color={t.keyFg}>
                      {String.fromCharCode(65 + oi)}
                    </T>
                  </View>
                  <T weight="semibold" style={{ flex: 1 }} color={t.fg}>
                    {opt}
                  </T>
                  {tone === 'correct' && <Feather name="check" size={18} color={colors.success} />}
                  {tone === 'wrong' && <Feather name="x" size={18} color={colors.danger} />}
                </Pressable>
              );
            })}
            {r && (
              <View style={[styles.explain, { borderLeftColor: r.correct ? colors.success : colors.danger }]}>
                <T size={14}>
                  <T weight="bold" size={14}>
                    {r.correct ? 'Benar. ' : 'Kurang tepat. '}
                  </T>
                  {r.explanation}
                </T>
              </View>
            )}
          </View>
        );
      })}

      {!result && (
        <Button
          title={answered < total ? `Jawab semua soal (${answered}/${total})` : 'Kumpulkan jawaban'}
          disabled={answered < total}
          loading={submitting}
          onPress={submit}
        />
      )}
    </View>
  );
}

const optionTones = (colors) => ({
  idle: { border: colors.line, bg: colors.surface, keyBg: colors.surface2, keyBorder: colors.line, keyFg: colors.text, fg: colors.text },
  selected: { border: colors.primary, bg: colors.primarySofter, keyBg: colors.primary, keyBorder: colors.primary, keyFg: '#fff', fg: colors.text },
  correct: { border: colors.success, bg: colors.successBg, keyBg: colors.success, keyBorder: colors.success, keyFg: colors.surface, fg: colors.successText },
  wrong: { border: colors.danger, bg: colors.dangerBg, keyBg: colors.danger, keyBorder: colors.danger, keyFg: colors.surface, fg: colors.dangerText },
});

export function PracticeView({ material, history, onProgress }) {
  const { colors, dark } = useTheme();
  const styles = useStyles(makeStyles);
  const { goal, tools, steps, checklist } = material.practice;
  const [checked, setChecked] = useState(() => new Set(history?.checkedSteps ?? []));
  const percent = Math.round((checked.size / checklist.length) * 100);

  const toggle = (i) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
    const progress = Math.round((next.size / checklist.length) * 100);
    onProgress({ checkedSteps: [...next], progress, completed: progress === 100 }, { silent: progress !== 100 });
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={styles.goal}>
        <Feather name="target" size={22} color={colors.highlight} />
        <View style={{ flex: 1 }}>
          <T weight="bold" size={11} color={colors.highlight} style={{ letterSpacing: 1 }}>
            TUJUAN LATIHAN
          </T>
          <T weight="semibold" color="#fff">
            {goal}
          </T>
        </View>
      </View>

      <SectionTitle icon="tool">Yang kamu butuhkan</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tools.map((t) => (
          <View key={t} style={styles.toolChip}>
            <T weight="semibold" size={13}>
              {t}
            </T>
          </View>
        ))}
      </View>

      <SectionTitle>Langkah pengerjaan</SectionTitle>
      {steps.map((s, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
          <View style={styles.stepNo}>
            <T weight="extrabold" size={13} color={colors.accentText}>
              {i + 1}
            </T>
          </View>
          <T style={{ flex: 1, marginTop: 3 }}>{s}</T>
        </View>
      ))}

      <View style={styles.checklist}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T weight="extrabold" size={18}>
            Checklist hasil
          </T>
          <T weight="extrabold" color={colors.accentText}>
            {percent}%
          </T>
        </View>
        <ProgressBar value={percent} />
        {checklist.map((c, i) => {
          const on = checked.has(i);
          return (
            <Pressable
              key={i}
              onPress={() => toggle(i)}
              style={[styles.checkRow, on && { borderColor: colors.primary700 }]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
            >
              <View style={[styles.box, on && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                {on && <Feather name="check" size={14} color="#fff" />}
              </View>
              <T weight="semibold" style={{ flex: 1 }}>
                {c}
              </T>
            </Pressable>
          );
        })}
        {percent === 100 && <DoneBanner text="Semua checklist terpenuhi. Latihan selesai!" />}
      </View>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
  bullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accentStrong, marginTop: 10 },
  code: { padding: 16, borderRadius: 14, backgroundColor: colors.codeBg },
  tip: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: colors.warnBorder,
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 6 },
  done: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.successBg,
  },
  videoFrame: { aspectRatio: 16 / 9, borderRadius: 18, overflow: 'hidden', backgroundColor: '#000' },
  poster: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterCaption: { position: 'absolute', left: 14, right: 14, bottom: 12 },
  quizIntro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primarySofter,
  },
  result: { padding: 18, borderRadius: 18, gap: 6 },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: 6,
  },
  question: {
    gap: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
  },
  qNo: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optKey: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explain: { padding: 10, borderRadius: 10, backgroundColor: colors.surface, borderLeftWidth: 4 },
  goal: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 16, backgroundColor: colors.panel },
  toolChip: {
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stepNo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklist: {
    gap: 10,
    marginTop: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
