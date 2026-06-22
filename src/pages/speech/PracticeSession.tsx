import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategory } from '../../data/speech/phrases';
import { useSpeechStore } from '../../store/speech/speechStore';
import { useSpeechRecognition } from '../../hooks/speech/useSpeechRecognition';
import { useTTS } from '../../hooks/speech/useTTS';
import { PhraseDisplay } from '../../components/speech/PhraseDisplay';
import { Waveform } from '../../components/speech/Waveform';
import type { PracticeStage, WordResult } from '../../data/speech/types';

// ─── Word matching ────────────────────────────────────────────────────────────
function cleanText(s: string): string {
  return s.toLowerCase().replace(/[^a-z'\s]/g, '').replace(/\s+/g, ' ').trim();
}

function compareWords(target: string, spoken: string): WordResult[] {
  const targetWords = target.split(/\s+/);
  const cleanedTarget = cleanText(target).split(' ');
  const cleanedSpoken = cleanText(spoken).split(' ');

  const freq = new Map<string, number>();
  cleanedSpoken.forEach(w => freq.set(w, (freq.get(w) ?? 0) + 1));

  return targetWords.map((word, i) => {
    const cleaned = cleanedTarget[i] ?? '';
    const count = freq.get(cleaned) ?? 0;
    if (count > 0) { freq.set(cleaned, count - 1); return { word, matched: true }; }
    return { word, matched: false };
  });
}

// ─── Feedback copy ────────────────────────────────────────────────────────────
function getFeedback(accuracy: number): { headline: string; sub: string } {
  if (accuracy >= 90) return { headline: 'Outstanding! 🌟', sub: 'Nearly perfect. You\'re getting this phrase down.' };
  if (accuracy >= 75) return { headline: 'Great job! 🎉', sub: 'A few words to iron out — try once more.' };
  if (accuracy >= 60) return { headline: 'Good effort! 👍', sub: 'Listen again to lock in the rhythm.' };
  if (accuracy >= 40) return { headline: 'Keep going! 💪', sub: 'Try listening one more time before recording.' };
  return { headline: 'Nice try! 🔄', sub: 'Listen to the phrase and focus on key words first.' };
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
const DIFF: Record<number, { label: string; color: string }> = {
  1: { label: 'Beginner', color: 'bg-green-500/20 text-green-400' },
  2: { label: 'Intermediate', color: 'bg-amber-500/20 text-amber-400' },
  3: { label: 'Advanced', color: 'bg-red-500/20 text-red-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function PracticeSession() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categoryId ? getCategory(categoryId) : undefined;

  const { addSession } = useSpeechStore();
  const tts = useTTS();
  const speech = useSpeechRecognition();

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [stage, setStage] = useState<PracticeStage>('intro');
  const [showPhrase, setShowPhrase] = useState(false);
  const [wordResults, setWordResults] = useState<WordResult[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [sessionSaved, setSessionSaved] = useState(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      tts.stop();
      speech.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    tts.stop();
    speech.stop();
    navigate('/speech');
  }, [tts, speech, navigate]);

  if (!category) {
    navigate('/speech');
    return null;
  }

  const phrase = category.phrases[phraseIndex];
  const isLastPhrase = phraseIndex === category.phrases.length - 1;

  // ── Transitions ──────────────────────────────────────────────────────────────

  const goListen = () => {
    speech.reset();
    setStage('listen');
    tts.speak(phrase.text, 0.88, () => setStage('ready'));
  };

  const goReady = () => {
    tts.stop();
    setStage('ready');
  };

  const goRecord = () => {
    tts.stop();
    speech.reset();
    setShowPhrase(false);
    setStage('record');
    speech.start();
  };

  const goResult = () => {
    speech.stop();
    const results = compareWords(phrase.text, speech.transcript);
    const acc = results.length > 0
      ? Math.round(results.filter(r => r.matched).length / results.length * 100)
      : 0;
    setWordResults(results);
    setAccuracy(acc);
    setStage('result');
  };

  const goNextPhrase = () => {
    const newScores = [...scores, accuracy];
    setScores(newScores);
    speech.reset();
    setWordResults([]);
    setAccuracy(0);
    setShowPhrase(false);

    if (isLastPhrase) {
      // Save session and show summary
      if (!sessionSaved) {
        addSession({ categoryId: category.id, scores: newScores, completedAt: new Date().toISOString() });
        setSessionSaved(true);
      }
      setStage('summary');
    } else {
      setPhraseIndex(i => i + 1);
      setStage('intro');
    }
  };

  const goRetry = () => {
    speech.reset();
    setWordResults([]);
    setAccuracy(0);
    setShowPhrase(false);
    setStage('intro');
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const diff = DIFF[phrase.difficulty] ?? DIFF[1];
  const feedback = getFeedback(accuracy);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 shrink-0">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white truncate">{category.emoji} {category.title}</h1>
          <p className="text-xs text-white/40">{category.subtitle}</p>
        </div>
        {stage !== 'summary' && (
          <div className="shrink-0 text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
            {phraseIndex + 1} / {category.phrases.length}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {stage !== 'summary' && (
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-violet-500 transition-all duration-500"
            style={{ width: `${((phraseIndex + (stage === 'result' ? 1 : 0)) / category.phrases.length) * 100}%` }}
          />
        </div>
      )}

      {/* ── SUMMARY ── */}
      {stage === 'summary' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 text-center">
          <div className="text-6xl">{avgScore >= 75 ? '🏆' : avgScore >= 50 ? '🎉' : '💪'}</div>
          <div>
            <h2 className="text-2xl font-bold">Session complete!</h2>
            <p className="text-white/50 text-sm mt-1">{category.title} · {category.phrases.length} phrases</p>
          </div>

          <div className="bg-white/5 rounded-2xl px-8 py-5 space-y-1">
            <div className="text-4xl font-bold text-violet-300">{avgScore}%</div>
            <div className="text-white/40 text-sm">average accuracy</div>
          </div>

          <div className="w-full max-w-sm space-y-2">
            {scores.map((score, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                <span className="text-white/30 text-xs w-4 shrink-0">{i + 1}</span>
                <p className="text-white/60 text-xs flex-1 text-left truncate">
                  {category.phrases[i].text.slice(0, 45)}…
                </p>
                <span className={`text-xs font-bold shrink-0 ${
                  score >= 80 ? 'text-green-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>{score}%</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => { setSessionSaved(false); setPhraseIndex(0); setScores([]); setWordResults([]); setStage('intro'); }}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Practice again
            </button>
            <button
              onClick={handleBack}
              className="px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl text-sm"
            >
              Back to home
            </button>
          </div>
        </div>
      )}

      {/* ── PRACTICE STAGES ── */}
      {stage !== 'summary' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-5 py-6 max-w-xl mx-auto w-full space-y-6">

            {/* Stage label */}
            <div className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-wider">
              {stage === 'intro' && <><span>📄</span><span>Read the phrase</span></>}
              {stage === 'listen' && <><span className="animate-pulse">🔊</span><span>Listening…</span></>}
              {stage === 'ready' && <><span>🎙️</span><span>Ready to record</span></>}
              {stage === 'record' && <><span className="animate-pulse text-red-400">⏺</span><span className="text-red-400">Recording</span></>}
              {stage === 'result' && <><span>✅</span><span>Results</span></>}
            </div>

            {/* Phrase display */}
            <div className="bg-white/5 rounded-2xl p-6 min-h-[120px] flex items-center justify-center">
              {stage === 'result' ? (
                <PhraseDisplay text={phrase.text} wordResults={wordResults} />
              ) : stage === 'record' ? (
                <PhraseDisplay text={phrase.text} hidden={!showPhrase} />
              ) : (
                <PhraseDisplay text={phrase.text} highlightWordIndex={tts.wordIndex} />
              )}
            </div>

            {/* Difficulty + tip */}
            {(stage === 'intro' || stage === 'ready') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}>
                    {diff.label}
                  </span>
                  <span className="text-white/25 text-xs">{phrase.text.split(/\s+/).length} words</span>
                </div>
                {phrase.tip && (
                  <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3 flex gap-2">
                    <span className="text-amber-400 shrink-0">💡</span>
                    <p className="text-amber-200/70 text-xs leading-relaxed">{phrase.tip}</p>
                  </div>
                )}
              </div>
            )}

            {/* Record stage: waveform + live transcript */}
            {stage === 'record' && (
              <div className="space-y-4">
                <Waveform isActive={speech.isRecording} />

                <div className="min-h-[48px] bg-white/5 rounded-xl px-4 py-3 text-sm text-white/60 italic">
                  {speech.transcript || (
                    <span className="text-white/20">Speak now…</span>
                  )}
                </div>

                {speech.error && (
                  <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-xs">
                    {speech.error}
                  </div>
                )}

                <button
                  onClick={() => setShowPhrase(v => !v)}
                  className="flex items-center gap-2 text-xs text-white/35 hover:text-white/60 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPhrase
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    }
                  </svg>
                  {showPhrase ? 'Hide phrase' : 'Show phrase'}
                </button>
              </div>
            )}

            {/* Result stage: accuracy + transcript */}
            {stage === 'result' && (
              <div className="space-y-4">
                {/* Score */}
                <div className={`rounded-2xl p-5 text-center ${
                  accuracy >= 80 ? 'bg-green-500/10 border border-green-500/25'
                  : accuracy >= 60 ? 'bg-amber-500/10 border border-amber-500/25'
                  : 'bg-red-500/10 border border-red-500/25'
                }`}>
                  <div className={`text-5xl font-bold ${
                    accuracy >= 80 ? 'text-green-400' : accuracy >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {accuracy}%
                  </div>
                  <div className="mt-2">
                    <div className="font-semibold text-white text-sm">{feedback.headline}</div>
                    <div className="text-white/50 text-xs mt-0.5">{feedback.sub}</div>
                  </div>
                </div>

                {/* What you said */}
                {speech.transcript && (
                  <div className="bg-white/5 rounded-xl px-4 py-3 space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">You said</p>
                    <p className="text-white/60 text-sm italic">"{speech.transcript}"</p>
                  </div>
                )}

                {/* Word legend */}
                <div className="flex gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Matched
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Missed
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Action buttons (sticky bottom) ── */}
          <div className="px-5 pb-8 space-y-3 max-w-xl mx-auto w-full">
            {!speech.supported && stage === 'ready' && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3 text-amber-300 text-xs text-center">
                Speech recognition not supported. Use Chrome or Edge for best results.
              </div>
            )}

            {stage === 'intro' && (
              <div className="flex gap-3">
                <button
                  onClick={goListen}
                  className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔊</span> Listen first
                </button>
                <button
                  onClick={goRecord}
                  className="px-5 py-4 bg-white/8 text-white/60 font-medium rounded-xl text-sm hover:bg-white/12 transition-colors"
                >
                  Skip
                </button>
              </div>
            )}

            {stage === 'listen' && (
              <button
                onClick={goReady}
                className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/15 transition-colors"
              >
                ⏹ Stop listening
              </button>
            )}

            {stage === 'ready' && (
              <div className="space-y-2">
                <button
                  onClick={goRecord}
                  disabled={!speech.supported}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-white inline-block" />
                  Start recording
                </button>
                <button
                  onClick={goListen}
                  className="w-full py-2 text-white/35 text-sm hover:text-white/60 transition-colors"
                >
                  🔊 Listen again
                </button>
              </div>
            )}

            {stage === 'record' && (
              <button
                onClick={goResult}
                disabled={!speech.transcript}
                className="w-full py-4 bg-white font-bold text-gray-900 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ✓ Submit
              </button>
            )}

            {stage === 'result' && (
              <div className="flex gap-3">
                <button
                  onClick={goRetry}
                  className="flex-1 py-4 bg-white/8 text-white/70 font-medium rounded-xl hover:bg-white/12 transition-colors"
                >
                  🔄 Try again
                </button>
                <button
                  onClick={goNextPhrase}
                  className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors"
                >
                  {isLastPhrase ? 'Finish 🏁' : 'Next →'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
