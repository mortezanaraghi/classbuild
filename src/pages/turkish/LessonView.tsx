import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, curriculum } from '../../data/turkish/index';
import type { LessonTab } from '../../data/turkish/types';
import { useTurkishStore } from '../../store/turkish/turkishStore';
import { Flashcard } from '../../components/turkish/Flashcard';
import { QuizExercise } from '../../components/turkish/QuizExercise';
import { AudioButton } from '../../components/turkish/AudioButton';

export function LessonView() {
  const { weekId, dayId } = useParams<{ weekId: string; dayId: string }>();
  const navigate = useNavigate();
  const lesson = getLesson(Number(weekId), Number(dayId));
  const { completeLesson, isCompleted } = useTurkishStore();

  const [tab, setTab] = useState<LessonTab>('vocab');
  const [vocabIndex, setVocabIndex] = useState(0);
  const [masteredVocab, setMasteredVocab] = useState<string[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-white/50 text-center">
          <div className="text-5xl mb-4">😕</div>
          <div>Lesson not found.</div>
          <button onClick={() => navigate('/turkish')} className="mt-4 text-red-400 underline text-sm">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const week = curriculum.find(w => w.id === lesson.week)!;
  const alreadyDone = isCompleted(lesson.id);

  const nextLesson = (() => {
    for (const w of curriculum) {
      for (const l of w.lessons) {
        if (l.week > lesson.week || (l.week === lesson.week && l.day > lesson.day)) return l;
      }
    }
    return null;
  })();

  const handleAnswer = (correct: boolean) => {
    if (correct) setQuizScore(s => s + 1);
    if (quizIndex + 1 >= lesson.exercises.length) {
      setQuizDone(true);
      const finalScore = (correct ? quizScore + 1 : quizScore) / lesson.exercises.length;
      completeLesson(lesson.id, finalScore, masteredVocab);
    } else {
      setTimeout(() => setQuizIndex(i => i + 1), 900);
    }
  };

  const tabs: { id: LessonTab; label: string; emoji: string }[] = [
    { id: 'vocab', label: 'Vocabulary', emoji: '📚' },
    { id: 'phrases', label: 'Phrases', emoji: '💬' },
    ...(lesson.grammarNote ? [{ id: 'grammar' as LessonTab, label: 'Grammar', emoji: '📖' }] : []),
    { id: 'practice', label: 'Practice', emoji: '✏️' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white pb-16">
      {/* Lesson header */}
      <div className="bg-gradient-to-br from-red-950 via-[#1a0a0a] to-[#0f0f1a] border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/turkish')}
            className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors"
          >
            ← All lessons
          </button>
          <div className="flex items-start gap-3">
            <span className="text-4xl mt-0.5">{lesson.emoji}</span>
            <div className="flex-1">
              <div className="text-xs text-white/40 uppercase tracking-wide mb-1">
                Week {lesson.week} · Day {lesson.day} · {week.title}
              </div>
              <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
              <p className="text-white/50 text-sm mt-0.5">{lesson.subtitle}</p>
            </div>
            {alreadyDone && (
              <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
                ✓ Completed
              </div>
            )}
          </div>

          {lesson.persianAdvantage && (
            <div className="mt-4 bg-amber-900/20 border border-amber-700/30 rounded-xl p-3 flex gap-2">
              <span className="text-lg shrink-0">🇮🇷</span>
              <p className="text-amber-200/80 text-xs">{lesson.persianAdvantage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-[#0f0f1a]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  tab === t.id
                    ? 'bg-red-700/50 text-white border border-red-600/40'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* VOCABULARY TAB */}
        {tab === 'vocab' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm text-white/40">
              <span>{vocabIndex + 1} / {lesson.vocabulary.length}</span>
              <span>{masteredVocab.length} mastered</span>
            </div>

            <Flashcard
              item={lesson.vocabulary[vocabIndex]}
              onMastered={() => setMasteredVocab(m => [...new Set([...m, lesson.vocabulary[vocabIndex].id])])}
              onNext={() => setVocabIndex(i => (i + 1) % lesson.vocabulary.length)}
            />

            {/* Navigation dots */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {lesson.vocabulary.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVocabIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    masteredVocab.includes(v.id)
                      ? 'bg-green-500'
                      : i === vocabIndex
                      ? 'bg-white'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* All vocab list */}
            <div className="mt-4">
              <div className="text-xs text-white/30 uppercase tracking-wide mb-3">All vocabulary</div>
              <div className="flex flex-col gap-2">
                {lesson.vocabulary.map(v => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border ${
                      masteredVocab.includes(v.id) ? 'border-green-500/30' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AudioButton text={v.turkish} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-white">{v.turkish}</div>
                        <div className="text-xs text-white/40 font-mono">{v.pronunciation}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">{v.english}</div>
                      {v.persianScript && (
                        <div className="text-xs text-amber-400/70" dir="rtl">{v.persianScript}</div>
                      )}
                      {v.isPersianCognate && !v.persianScript && (
                        <div className="text-xs text-amber-400/70">🇮🇷 {v.persian}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PHRASES TAB */}
        {tab === 'phrases' && (
          <div className="flex flex-col gap-3">
            <div className="text-sm text-white/40 mb-1">
              {lesson.phrases.length} key phrases for this situation
            </div>
            {lesson.phrases.map((phrase, i) => (
              <div key={i} className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white leading-snug">{phrase.turkish}</div>
                    <div className="text-white/50 text-sm mt-0.5 font-mono">{phrase.pronunciation}</div>
                    <div className="text-white/70 text-sm mt-1.5">{phrase.english}</div>
                    {phrase.context && (
                      <div className="text-white/40 text-xs mt-1 italic">{phrase.context}</div>
                    )}
                    {phrase.persianNote && (
                      <div className="mt-2 text-amber-400/80 text-xs bg-amber-900/20 rounded-lg px-3 py-1.5 border border-amber-700/20">
                        🇮🇷 {phrase.persianNote}
                      </div>
                    )}
                  </div>
                  <AudioButton text={phrase.turkish} size="md" />
                </div>
                {phrase.formal && (
                  <div className="mt-2 text-xs text-blue-400/70 bg-blue-900/20 rounded-lg px-2 py-1 inline-block">
                    Formal register
                  </div>
                )}
              </div>
            ))}

            {lesson.culturalNote && (
              <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-sm font-semibold text-white/70 mb-1.5">🌙 Cultural Note</div>
                <p className="text-white/60 text-sm leading-relaxed">{lesson.culturalNote}</p>
              </div>
            )}
          </div>
        )}

        {/* GRAMMAR TAB */}
        {tab === 'grammar' && lesson.grammarNote && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1a2e] border border-blue-500/20 rounded-2xl p-5">
              <div className="text-blue-400 text-xs uppercase tracking-wide mb-2">Grammar Note</div>
              <h3 className="text-xl font-bold text-white mb-3">{lesson.grammarNote.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{lesson.grammarNote.body}</p>
            </div>

            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-5">
              <div className="text-white/40 text-xs uppercase tracking-wide mb-3">Examples</div>
              <div className="flex flex-col gap-3">
                {lesson.grammarNote.examples.map((ex, i) => (
                  <div key={i} className="border-l-2 border-red-700/50 pl-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{ex.turkish}</span>
                      <AudioButton text={ex.turkish} size="sm" />
                    </div>
                    <div className="text-white/50 text-sm">{ex.english}</div>
                    {ex.note && <div className="text-amber-400/70 text-xs mt-0.5 italic">{ex.note}</div>}
                  </div>
                ))}
              </div>
            </div>

            {lesson.grammarNote.persianParallel && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-2xl p-4">
                <div className="text-amber-400 text-xs uppercase tracking-wide mb-1.5">🇮🇷 Persian Parallel</div>
                <p className="text-amber-200/80 text-sm leading-relaxed">{lesson.grammarNote.persianParallel}</p>
              </div>
            )}
          </div>
        )}

        {/* PRACTICE TAB */}
        {tab === 'practice' && (
          <div className="flex flex-col gap-4">
            {!quizDone ? (
              <>
                <div className="flex items-center justify-between text-sm text-white/40">
                  <span>Exercise {quizIndex + 1} of {lesson.exercises.length}</span>
                  <span className="text-green-400">{quizScore} correct</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all"
                    style={{ width: `${((quizIndex) / lesson.exercises.length) * 100}%` }}
                  />
                </div>
                <QuizExercise
                  key={lesson.exercises[quizIndex].id}
                  exercise={lesson.exercises[quizIndex]}
                  onAnswer={handleAnswer}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">
                  {quizScore === lesson.exercises.length ? '🏆' : quizScore >= lesson.exercises.length * 0.6 ? '🎉' : '📚'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {quizScore}/{lesson.exercises.length} correct
                </h3>
                <p className="text-white/50 text-sm mb-6">
                  {quizScore === lesson.exercises.length
                    ? 'Perfect score! Harika!'
                    : quizScore >= lesson.exercises.length * 0.6
                    ? 'Good job! Keep practicing!'
                    : 'Review the vocabulary and try again.'}
                </p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button
                    onClick={() => { setQuizIndex(0); setQuizScore(0); setQuizDone(false); }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    Retry exercises
                  </button>
                  {nextLesson && (
                    <button
                      onClick={() => navigate(`/turkish/lesson/${nextLesson.week}/${nextLesson.day}`)}
                      className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Next lesson →
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/turkish')}
                    className="px-6 py-3 text-white/40 hover:text-white text-sm transition-colors"
                  >
                    Back to curriculum
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
