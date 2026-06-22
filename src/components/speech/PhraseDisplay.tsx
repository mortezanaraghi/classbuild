import type { WordResult } from '../../data/speech/types';

interface PhraseDisplayProps {
  text: string;
  highlightWordIndex?: number;
  wordResults?: WordResult[];
  hidden?: boolean;
}

export function PhraseDisplay({
  text,
  highlightWordIndex = -1,
  wordResults,
  hidden = false,
}: PhraseDisplayProps) {
  const words = text.split(/\s+/);

  if (hidden) {
    return (
      <div className="text-center space-y-2">
        <p className="text-white/15 text-xl leading-relaxed font-medium blur-sm select-none">
          {text}
        </p>
        <p className="text-white/30 text-xs">Speak from memory</p>
      </div>
    );
  }

  return (
    <p className="text-xl sm:text-2xl leading-relaxed font-medium text-center">
      {words.map((word, i) => {
        let cls = 'text-white';

        if (wordResults) {
          cls = wordResults[i]?.matched ? 'text-green-400' : 'text-red-400/80';
        } else if (highlightWordIndex >= 0) {
          if (i < highlightWordIndex) cls = 'text-white/35';
          else if (i === highlightWordIndex) cls = 'text-amber-300 underline underline-offset-4 decoration-amber-400';
          else cls = 'text-white/80';
        }

        return (
          <span key={i} className={`${cls} transition-colors duration-75 mx-0.5`}>
            {word}
          </span>
        );
      })}
    </p>
  );
}
