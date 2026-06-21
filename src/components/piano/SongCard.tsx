import type { Song } from '../../data/piano/types';

interface SongCardProps {
  song: Song;
  onClick: () => void;
}

const DIFFICULTY_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Beginner', color: 'bg-green-500/20 text-green-400' },
  2: { label: 'Intermediate', color: 'bg-amber-500/20 text-amber-400' },
  3: { label: 'Advanced', color: 'bg-red-500/20 text-red-400' },
};

export function SongCard({ song, onClick }: SongCardProps) {
  const diff = DIFFICULTY_LABEL[song.difficulty] ?? DIFFICULTY_LABEL[1];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl overflow-hidden bg-gradient-to-br ${song.color} group relative transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`}
    >
      <div className="p-5">
        <div className="text-4xl mb-3">{song.emoji}</div>
        <h3 className="text-xl font-bold text-white leading-tight">{song.title}</h3>
        <p className="text-white/60 text-sm mt-0.5">{song.film} · {song.year}</p>

        <p className="text-white/70 text-xs mt-3 leading-relaxed line-clamp-2">
          {song.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}>
            {diff.label}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
            {song.bpm} BPM
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
            ~{song.learnMinutes} min
          </span>
        </div>

        <div className="mt-3 text-xs text-white/40">{song.keySignature}</div>
      </div>

      <div className="bg-white/5 border-t border-white/10 px-5 py-3 flex items-center justify-between">
        <span className="text-white/70 text-sm font-medium">Start lesson</span>
        <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
