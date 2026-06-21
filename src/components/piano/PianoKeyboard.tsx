import { useEffect, useCallback } from 'react';
import { WHITE_KEYS, BLACK_KEYS, KEY_TO_NOTE } from '../../data/piano/keys';

const TOTAL_WHITE = WHITE_KEYS.length;

interface FlashNote {
  note: string;
  correct: boolean;
}

interface PianoKeyboardProps {
  highlightNotes?: string[];
  activeNotes?: string[];
  flashNote?: FlashNote | null;
  onNotePlay?: (note: string) => void;
  showKbdHints?: boolean;
}

type KeyState = 'idle' | 'active' | 'highlight' | 'correct' | 'wrong';

const WHITE_CLASSES: Record<KeyState, string> = {
  idle:      'bg-white hover:bg-amber-50 border-gray-300 text-gray-400',
  active:    'bg-indigo-400 border-indigo-500 text-white',
  highlight: 'bg-amber-300 border-amber-400 text-amber-900 shadow-lg shadow-amber-300/50',
  correct:   'bg-green-400 border-green-500 text-white',
  wrong:     'bg-red-400 border-red-500 text-white',
};

const BLACK_CLASSES: Record<KeyState, string> = {
  idle:      'bg-gray-900 hover:bg-gray-700',
  active:    'bg-indigo-500',
  highlight: 'bg-amber-400 shadow-lg shadow-amber-400/50',
  correct:   'bg-green-500',
  wrong:     'bg-red-500',
};

export function PianoKeyboard({
  highlightNotes = [],
  activeNotes = [],
  flashNote,
  onNotePlay,
  showKbdHints = false,
}: PianoKeyboardProps) {
  const getState = useCallback((note: string): KeyState => {
    if (flashNote?.note === note) return flashNote.correct ? 'correct' : 'wrong';
    if (activeNotes.includes(note)) return 'active';
    if (highlightNotes.includes(note)) return 'highlight';
    return 'idle';
  }, [flashNote, activeNotes, highlightNotes]);

  const handleKbd = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;
    const note = KEY_TO_NOTE[e.key.toLowerCase()];
    if (note && onNotePlay) onNotePlay(note);
  }, [onNotePlay]);

  useEffect(() => {
    window.addEventListener('keydown', handleKbd);
    return () => window.removeEventListener('keydown', handleKbd);
  }, [handleKbd]);

  const wPct = 100 / TOTAL_WHITE; // % width of each white key
  const bPct = wPct * 0.62;       // black key width

  return (
    <div className="relative select-none" style={{ height: 140 }}>
      {/* White keys */}
      {WHITE_KEYS.map((key, i) => {
        const state = getState(key.note);
        return (
          <button
            key={key.note}
            onMouseDown={() => onNotePlay?.(key.note)}
            onTouchStart={e => { e.preventDefault(); onNotePlay?.(key.note); }}
            className={`absolute bottom-0 border border-b-4 rounded-b-lg transition-colors duration-75 flex flex-col items-center justify-end pb-1.5 ${WHITE_CLASSES[state]}`}
            style={{ left: `${i * wPct}%`, width: `calc(${wPct}% - 2px)`, height: '100%' }}
          >
            {showKbdHints && <span className="text-[8px] font-mono opacity-40 mb-0.5">{key.kbd}</span>}
            <span className="text-[9px] font-semibold leading-none">{key.label}</span>
          </button>
        );
      })}

      {/* Black keys — centered on the boundary between adjacent white keys */}
      {BLACK_KEYS.map(key => {
        const state = getState(key.note);
        const left = key.boundary * wPct - bPct / 2;
        return (
          <button
            key={key.note}
            onMouseDown={() => onNotePlay?.(key.note)}
            onTouchStart={e => { e.preventDefault(); onNotePlay?.(key.note); }}
            className={`absolute top-0 z-10 rounded-b-md transition-colors duration-75 flex flex-col items-center justify-end pb-1 ${BLACK_CLASSES[state]}`}
            style={{ left: `${left}%`, width: `${bPct}%`, height: '63%' }}
          >
            {showKbdHints && <span className="text-[7px] font-mono text-white/40 leading-none">{key.kbd}</span>}
          </button>
        );
      })}
    </div>
  );
}
