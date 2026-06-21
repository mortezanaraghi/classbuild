import { useNavigate } from 'react-router-dom';
import { curriculum, TOTAL_LESSONS, TOTAL_VOCAB } from '../../data/turkish/index';
import { useTurkishStore } from '../../store/turkish/turkishStore';

const weekColors: Record<string, string> = {
  red: 'from-red-900/50 to-red-800/20 border-red-700/30',
  orange: 'from-orange-900/50 to-orange-800/20 border-orange-700/30',
  blue: 'from-blue-900/50 to-blue-800/20 border-blue-700/30',
  purple: 'from-purple-900/50 to-purple-800/20 border-purple-700/30',
  teal: 'from-teal-900/50 to-teal-800/20 border-teal-700/30',
  green: 'from-green-900/50 to-green-800/20 border-green-700/30',
  amber: 'from-amber-900/50 to-amber-800/20 border-amber-700/30',
};

const weekDotColors: Record<string, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
};

export function TurkishHome() {
  const navigate = useNavigate();
  const { isCompleted, getCompletedCount, streak, totalXP } = useTurkishStore();
  const completed = getCompletedCount();
  const pct = Math.round((completed / TOTAL_LESSONS) * 100);

  const firstIncomplete = (() => {
    for (const week of curriculum) {
      for (const lesson of week.lessons) {
        if (!isCompleted(lesson.id)) return lesson;
      }
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-950 via-[#1a0a0a] to-[#0f0f1a] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🇹🇷</span>
                <div>
                  <h1 className="text-3xl font-bold text-white">Türkçe Öğreniyorum</h1>
                  <p className="text-white/50 text-sm">I'm learning Turkish — 2-month conversational program</p>
                </div>
              </div>
              <p className="text-white/40 text-sm mt-3 max-w-lg">
                Optimized for Persian & English speakers. Highlights shared vocabulary (25-40% of Turkish!), grammar parallels, and traveler-focused conversation.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-center gap-1 bg-white/5 rounded-2xl p-4 min-w-[90px]">
              <span className="text-3xl">🔥</span>
              <span className="text-2xl font-bold text-amber-400">{streak}</span>
              <span className="text-xs text-white/40">day streak</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{completed}</div>
              <div className="text-xs text-white/40">lessons done</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">{totalXP}</div>
              <div className="text-xs text-white/40">XP earned</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{pct}%</div>
              <div className="text-xs text-white/40">complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/30 mb-1">
              <span>Progress</span>
              <span>{completed}/{TOTAL_LESSONS} lessons · {TOTAL_VOCAB}+ vocabulary words</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Continue button */}
          {firstIncomplete && (
            <button
              onClick={() => navigate(`/turkish/lesson/${firstIncomplete.week}/${firstIncomplete.day}`)}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
            >
              <span>▶</span>
              {completed === 0
                ? 'Start Learning'
                : `Continue: Week ${firstIncomplete.week}, Day ${firstIncomplete.day} — ${firstIncomplete.title}`}
            </button>
          )}
          {!firstIncomplete && (
            <div className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-green-700/50 text-green-300 font-semibold rounded-xl">
              🏆 Course Complete! Tebrikler!
            </div>
          )}
        </div>
      </div>

      {/* Persian advantage banner */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl shrink-0">🇮🇷</span>
          <div>
            <div className="text-amber-300 font-semibold text-sm">Your Persian Advantage</div>
            <div className="text-amber-200/70 text-xs mt-0.5">
              As a Persian speaker, you already know 25–40% of Turkish vocabulary! Words like <span className="text-amber-300">tamam, yani, tabii, merhaba, çay, hesap, saat, zaman, kebap, pilav</span> and hundreds more are shared. Lessons highlight these connections throughout.
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum weeks */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-white mb-5">8-Week Curriculum</h2>
        <div className="flex flex-col gap-6">
          {curriculum.map(week => {
            const weekCompleted = week.lessons.filter(l => isCompleted(l.id)).length;
            const weekPct = Math.round((weekCompleted / week.lessons.length) * 100);
            const isUnlocked = week.id === 1 ||
              curriculum[week.id - 2].lessons.every(l => isCompleted(l.id));

            return (
              <div key={week.id} className={`rounded-2xl border bg-gradient-to-br ${weekColors[week.color] || weekColors.red} overflow-hidden`}>
                {/* Week header */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{week.emoji}</span>
                    <div>
                      <div className="font-semibold text-white">
                        Week {week.id}: {week.title}
                      </div>
                      <div className="text-xs text-white/50">{week.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{weekCompleted}/{week.lessons.length}</div>
                    <div className="text-xs text-white/40">lessons</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 pb-3">
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${weekDotColors[week.color]}`}
                      style={{ width: `${weekPct}%` }}
                    />
                  </div>
                </div>

                {/* Day buttons */}
                <div className="px-5 pb-5 grid grid-cols-5 gap-2">
                  {week.lessons.map(lesson => {
                    const done = isCompleted(lesson.id);
                    const isCurrent = firstIncomplete?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/turkish/lesson/${lesson.week}/${lesson.day}`)}
                        disabled={!isUnlocked && !done}
                        className={`relative flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs transition-all
                          ${done ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            isCurrent ? 'bg-white/15 text-white border border-white/30 shadow-lg scale-105' :
                            isUnlocked ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white' :
                            'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                          }`}
                      >
                        <span className="text-base">{lesson.emoji}</span>
                        <span className="font-medium">Day {lesson.day}</span>
                        <span className="text-center leading-tight opacity-80" style={{ fontSize: '10px' }}>
                          {lesson.title.split(' ').slice(0, 2).join(' ')}
                        </span>
                        {done && <span className="absolute -top-1 -right-1 text-green-400 text-xs">✓</span>}
                        {isCurrent && <span className="absolute -top-1 -right-1 text-amber-400 text-xs">▶</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer tips */}
      <div className="max-w-4xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { emoji: '🎯', title: '5 lessons/week', desc: 'One new topic each day, Mon–Fri' },
            { emoji: '🔄', title: 'Spaced practice', desc: 'Revisit vocab across multiple weeks' },
            { emoji: '🇮🇷', title: 'Persian shortcuts', desc: 'Cognate highlights cut learning time in half' },
          ].map(tip => (
            <div key={tip.title} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
              <span className="text-2xl shrink-0">{tip.emoji}</span>
              <div>
                <div className="text-sm font-medium text-white">{tip.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
