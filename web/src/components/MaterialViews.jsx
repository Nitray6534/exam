import { useState } from 'react';
import {
  Lightbulb,
  Play,
  ExternalLink,
  CircleCheck,
  Check,
  X,
  RotateCcw,
  Trophy,
  Target,
  Wrench,
} from 'lucide-react';
import { categoryMeta } from '../lib/meta.js';
import { ProgressBar } from './ui.jsx';

function CompleteButton({ done, onComplete, label }) {
  if (done) {
    return (
      <div className="done-banner">
        <CircleCheck size={20} aria-hidden /> Materi ini sudah kamu selesaikan.
      </div>
    );
  }
  return (
    <button type="button" className="btn btn--primary" onClick={onComplete}>
      <Check size={18} aria-hidden /> {label}
    </button>
  );
}

export function ArticleView({ material, history, onProgress }) {
  return (
    <div className="prose">
      {material.blocks.map((b, i) => {
        switch (b.kind) {
          case 'heading':
            return <h2 key={i}>{b.text}</h2>;
          case 'list':
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case 'code':
            return (
              <pre key={i}>
                <code>{b.text}</code>
              </pre>
            );
          case 'tip':
            return (
              <aside key={i} className="tip">
                <Lightbulb size={20} aria-hidden />
                <p>{b.text}</p>
              </aside>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
      <div className="prose__end">
        <CompleteButton
          done={history?.completed}
          label="Tandai selesai dibaca"
          onComplete={() => onProgress({ progress: 100, completed: true })}
        />
      </div>
    </div>
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
    <div className="video">
      <div className="video__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={sourceTitle}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video__poster"
            style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}
            onClick={play}
            aria-label={`Putar video ${sourceTitle}`}
          >
            <span className="video__play">
              <Play size={30} fill="currentColor" aria-hidden />
            </span>
            <span className="video__caption">
              <strong>{sourceTitle}</strong>
              <small>{channel} · YouTube</small>
            </span>
          </button>
        )}
      </div>
      <a
        className="link-ext"
        href={`https://www.youtube.com/watch?v=${youtubeId}`}
        target="_blank"
        rel="noreferrer"
      >
        Buka di YouTube <ExternalLink size={14} aria-hidden />
      </a>

      <h2>Panduan menonton</h2>
      <ul className="checks">
        {keyPoints.map((p) => (
          <li key={p}>
            <CircleCheck size={18} aria-hidden /> {p}
          </li>
        ))}
      </ul>
      <CompleteButton
        done={history?.completed}
        label="Tandai sudah ditonton"
        onComplete={() => onProgress({ progress: 100, completed: true })}
      />
    </div>
  );
}

export function QuizView({ material, history, onSubmitQuiz }) {
  const total = material.quiz.length;
  const [answers, setAnswers] = useState(() => Array(total).fill(-1));
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const answered = answers.filter((a) => a >= 0).length;

  const choose = (qi, oi) => {
    if (result) return;
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      setResult(await onSubmitQuiz(answers));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setAnswers(Array(total).fill(-1));
    setResult(null);
  };

  return (
    <div className="quiz">
      {result ? (
        <div className={`quiz__result ${result.passed ? 'is-pass' : 'is-fail'}`}>
          <div className="quiz__score">
            <Trophy size={28} aria-hidden />
            <strong>{result.score}</strong>
            <span>/100</span>
          </div>
          <div>
            <h2>{result.passed ? 'Lulus! Kerja bagus.' : 'Belum lulus, coba lagi ya.'}</h2>
            <p>
              Benar {result.correctCount} dari {result.total} soal. Nilai minimal lulus {result.passScore}.
            </p>
          </div>
          <button type="button" className="btn btn--secondary" onClick={reset}>
            <RotateCcw size={16} aria-hidden /> Ulangi kuis
          </button>
        </div>
      ) : (
        <div className="quiz__intro">
          <span>
            {total} soal · nilai lulus 70
            {typeof history?.bestQuizScore === 'number' && ` · skor terbaikmu ${history.bestQuizScore}`}
          </span>
          <span>
            Terjawab {answered}/{total}
          </span>
        </div>
      )}

      <ol className="quiz__list">
        {material.quiz.map((q, qi) => {
          const r = result?.results[qi];
          return (
            <li key={qi} className="question">
              <p className="question__text">
                <span className="question__no">{qi + 1}</span>
                {q.question}
              </p>
              <div className="options" role="radiogroup" aria-label={`Soal ${qi + 1}`}>
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  let state = '';
                  if (r) {
                    if (oi === r.answerIndex) state = 'is-correct';
                    else if (selected) state = 'is-wrong';
                  } else if (selected) state = 'is-selected';
                  return (
                    <button
                      key={oi}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`option ${state}`}
                      onClick={() => choose(qi, oi)}
                      disabled={Boolean(result)}
                    >
                      <span className="option__key">{String.fromCharCode(65 + oi)}</span>
                      <span className="option__text">{opt}</span>
                      {state === 'is-correct' && <Check size={18} aria-hidden />}
                      {state === 'is-wrong' && <X size={18} aria-hidden />}
                    </button>
                  );
                })}
              </div>
              {r && (
                <p className={`explain ${r.correct ? 'is-correct' : 'is-wrong'}`}>
                  <strong>{r.correct ? 'Benar.' : 'Kurang tepat.'}</strong> {r.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!result && (
        <button
          type="button"
          className="btn btn--primary"
          disabled={answered < total || submitting}
          onClick={submit}
        >
          {submitting ? 'Menilai...' : answered < total ? `Jawab semua soal (${answered}/${total})` : 'Kumpulkan jawaban'}
        </button>
      )}
    </div>
  );
}

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
    onProgress(
      { checkedSteps: [...next], progress, completed: progress === 100 },
      { silent: progress !== 100 }
    );
  };

  return (
    <div className="practice">
      <div className="practice__goal">
        <Target size={22} aria-hidden />
        <div>
          <span className="eyebrow">Tujuan latihan</span>
          <p>{goal}</p>
        </div>
      </div>

      <h2>
        <Wrench size={18} aria-hidden /> Yang kamu butuhkan
      </h2>
      <div className="tool-chips">
        {tools.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <h2>Langkah pengerjaan</h2>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="steps__no">{i + 1}</span>
            <p>{s}</p>
          </li>
        ))}
      </ol>

      <div className="checklist">
        <div className="checklist__head">
          <h2>Checklist hasil</h2>
          <span>{percent}%</span>
        </div>
        <ProgressBar value={percent} />
        <ul>
          {checklist.map((c, i) => (
            <li key={i}>
              <label className={checked.has(i) ? 'is-checked' : ''}>
                <input type="checkbox" checked={checked.has(i)} onChange={() => toggle(i)} />
                <span className="box" aria-hidden>
                  <Check size={14} />
                </span>
                {c}
              </label>
            </li>
          ))}
        </ul>
        {percent === 100 && (
          <div className="done-banner">
            <CircleCheck size={20} aria-hidden /> Semua checklist terpenuhi. Latihan selesai!
          </div>
        )}
      </div>
    </div>
  );
}
