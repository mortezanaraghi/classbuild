import type { PhraseCategory } from '../../data/speech/types';

interface CategoryCardProps {
  category: PhraseCategory;
  bestScore?: number;
  onClick: () => void;
}

export function CategoryCard({ category, bestScore, onClick }: CategoryCardProps) {
  const scoreColor =
    bestScore === undefined ? ''
    : bestScore >= 80 ? 'bg-green-500/25 text-green-300'
    : bestScore >= 60 ? 'bg-amber-500/25 text-amber-300'
    : 'bg-white/10 text-white/50';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-gradient-to-br ${category.color} rounded-2xl overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 relative`}
    >
      {bestScore !== undefined && (
        <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
          {bestScore}%
        </div>
      )}

      <div className="p-5">
        <div className="text-3xl mb-2">{category.emoji}</div>
        <h3 className="text-lg font-bold text-white">{category.title}</h3>
        <p className="text-white/55 text-xs mt-0.5">{category.subtitle}</p>
        <p className="text-white/45 text-xs mt-2 leading-relaxed">{category.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-white/35 text-xs">{category.phrases.length} phrases</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs group-hover:text-white/65 transition-colors">Start →</span>
        </div>
      </div>
    </button>
  );
}
