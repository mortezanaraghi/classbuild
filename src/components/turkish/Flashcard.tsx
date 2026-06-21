import { useState } from 'react';
import type { VocabItem } from '../../data/turkish/types';
import { AudioButton } from './AudioButton';

interface FlashcardProps {
  item: VocabItem;
  onMastered?: () => void;
  onNext?: () => void;
}

export function Flashcard({ item, onMastered, onNext }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState(false);

  const handleMastered = () => {
    setMastered(true);
    onMastered?.();
    setTimeout(() => {
      setFlipped(false);
      setMastered(false);
      onNext?.();
    }, 600);
  };

  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full h-52 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        } ${mastered ? 'scale-95 opacity-70' : ''}`}
        onClick={() => setFlipped(f => !f)}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#252540] border border-white/10 flex flex-col items-center justify-center p-6 gap-3">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Turkish</div>
          <div className="text-4xl font-bold text-white text-center">{item.turkish}</div>
          <div className="text-sm text-white/50 font-mono">{item.pronunciation}</div>
          <div className="flex items-center gap-2 mt-2">
            <AudioButton text={item.turkish} size="md" />
            <span className="text-xs text-white/30">tap to flip</span>
          </div>
          {item.isPersianCognate && (
            <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">
              🇮🇷 Persian cognate
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-red-900/30 to-[#252540] border border-red-500/20 flex flex-col items-center justify-center p-6 gap-2">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-1">English</div>
          <div className="text-3xl font-bold text-white text-center">{item.english}</div>
          {item.persianScript && (
            <div className="mt-1 text-center">
              <div className="text-xs text-amber-400/60 uppercase tracking-wide">Persian</div>
              <div className="text-xl text-amber-300 font-medium" dir="rtl">{item.persianScript}</div>
              {item.persian && item.persian !== item.persianScript && (
                <div className="text-xs text-amber-400/50">{item.persian}</div>
              )}
            </div>
          )}
          {item.example && (
            <div className="mt-2 text-center">
              <div className="text-xs text-white/50 italic">"{item.example}"</div>
              {item.exampleEn && <div className="text-xs text-white/30">{item.exampleEn}</div>}
            </div>
          )}
          {!mastered && (
            <button
              onClick={e => { e.stopPropagation(); handleMastered(); }}
              className="mt-3 px-4 py-1.5 bg-green-500/20 hover:bg-green-500/40 text-green-400 text-sm rounded-full transition-colors"
            >
              ✓ Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
