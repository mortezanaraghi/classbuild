import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/speech/phrases';
import { CategoryCard } from '../../components/speech/CategoryCard';
import { useSpeechStore } from '../../store/speech/speechStore';

export function SpeechHome() {
  const navigate = useNavigate();
  const { getCategoryBest, streak, totalAttempts } = useSpeechStore();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="px-6 pt-10 pb-6 text-center">
        <div className="text-5xl mb-4">🎙️</div>
        <h1 className="text-3xl font-bold">Fluency Practice</h1>
        <p className="text-white/50 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
          Shadow and memorize phrases to speak more naturally — fewer pauses, more flow.
        </p>
      </div>

      {/* Stats strip */}
      {totalAttempts > 0 && (
        <div className="mx-auto mb-6 max-w-xs bg-white/5 rounded-2xl px-5 py-3 flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">🔥 {streak}</div>
            <div className="text-xs text-white/40">day streak</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-white">{totalAttempts}</div>
            <div className="text-xs text-white/40">phrases done</div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {[
            { icon: '👂', label: '1. Listen', desc: 'Hear it spoken' },
            { icon: '🎙️', label: '2. Speak', desc: 'Say it aloud' },
            { icon: '✅', label: '3. Score', desc: 'See accuracy' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs font-semibold text-white/80">{item.label}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="px-4 pb-12">
        <h2 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4 px-2">
          Choose a category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              bestScore={getCategoryBest(cat.id)}
              onClick={() => navigate(`/speech/practice/${cat.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
