import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Button, ProgressBar, T } from './ui';
import VideoPlayer from './VideoPlayer';
import { categoryMeta, colors, font } from '../theme';

function DoneBanner({ text = 'Materi ini sudah kamu selesaikan.' }) {
  return (
    <View style={styles.done}>
      <Feather name="check-circle" size={20} color="#14532D" />
      <T weight="bold" color="#14532D" style={{ flex: 1 }}>
        {text}
      </T>
    </View>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
      {icon && <Feather name={icon} size={18} color={colors.ink} />}
      <T weight="extrabold" size={18}>
        {children}
      </T>
    </View>
  );
}

export function ArticleView({ material, history, onProgress }) {
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
                <T size={13} color="#E6F2EE" style={{ fontFamily: font.medium, lineHeight: 21 }}>
                  {b.text}
                </T>
              </View>
            );
          case 'tip':
            return (
              <View key={i} style={styles.tip}>
                <Feather name="sun" size={20} color="#A16207" style={{ marginTop: 2 }} />
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
                <Feather name="play" size={28} color={colors.pine800} style={{ marginLeft: 4 }} />
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
        <T weight="bold" size={14} color={colors.pine800}>
          Buka di aplikasi YouTube
        </T>
        <Feather name="external-link" size={14} color={colors.pine800} />
      </Pressable>

      <SectionTitle>Panduan menonton</SectionTitle>
      {keyPoints.map((p) => (
        <View key={p} style={{ flexDirection: 'row', gap: 10 }}>
          <Feather name="check-circle" size={18} color={colors.pine700} style={{ marginTop: 3 }} />
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
        <View style={[styles.result, { backgroundColor: result.passed ? colors.green100 : colors.coral100 }]}>
          <View style={styles.score}>
            <Feather name="award" size={24} color="#CA8A04" />
            <T weight="extrabold" size={32} style={{ lineHeight: 38 }}>
              {result.score}
            </T>
            <T weight="bold" color={colors.ink3}>
              /100
            </T>
          </View>
          <T weight="extrabold" size={18}>
            {result.passed ? 'Lulus! Kerja bagus.' : 'Belum lulus, coba lagi ya.'}
          </T>
          <T color={colors.ink2}>
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
          <T weight="bold" size={13} color={colors.pine800}>
            {total} soal · lulus 70
            {typeof history?.bestQuizScore === 'number' ? ` · terbaik ${history.bestQuizScore}` : ''}
          </T>
          <T weight="bold" size={13} color={colors.pine800}>
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
              const t = OPTION_TONE[tone] ?? OPTION_TONE.idle;
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
                  {tone === 'correct' && <Feather name="check" size={18} color={colors.green600} />}
                  {tone === 'wrong' && <Feather name="x" size={18} color={colors.red600} />}
                </Pressable>
              );
            })}
            {r && (
              <View style={[styles.explain, { borderLeftColor: r.correct ? colors.green600 : colors.red600 }]}>
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

const OPTION_TONE = {
  idle: { border: colors.line, bg: colors.surface, keyBg: colors.cream, keyBorder: colors.line, keyFg: colors.ink, fg: colors.ink },
  selected: { border: colors.pine800, bg: colors.pine50, keyBg: colors.pine800, keyBorder: colors.pine800, keyFg: '#fff', fg: colors.ink },
  correct: { border: colors.green600, bg: colors.green100, keyBg: colors.green600, keyBorder: colors.green600, keyFg: '#fff', fg: '#14532D' },
  wrong: { border: colors.red600, bg: colors.red100, keyBg: colors.red600, keyBorder: colors.red600, keyFg: '#fff', fg: '#7F1D1D' },
};

export function PracticeView({ material, history, onProgress }) {
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
        <Feather name="target" size={22} color={colors.butter300} />
        <View style={{ flex: 1 }}>
          <T weight="bold" size={11} color={colors.butter300} style={{ letterSpacing: 1 }}>
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
            <T weight="extrabold" size={13} color={colors.coral700}>
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
          <T weight="extrabold" color={colors.coral700}>
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
              style={[styles.checkRow, on && { borderColor: colors.pine700 }]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
            >
              <View style={[styles.box, on && { backgroundColor: colors.pine800, borderColor: colors.pine800 }]}>
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

const styles = StyleSheet.create({
  bullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.coral600, marginTop: 10 },
  code: { padding: 16, borderRadius: 14, backgroundColor: '#13201D' },
  tip: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.butter100,
    borderWidth: 1,
    borderColor: '#F5E1A4',
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 6 },
  done: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.green100,
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
    backgroundColor: colors.pine50,
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
    backgroundColor: colors.cream,
  },
  qNo: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.pine800,
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
  goal: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 16, backgroundColor: colors.pine800 },
  toolChip: {
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stepNo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.coral100,
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
    backgroundColor: colors.cream,
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
