import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSong } from '../../data/piano/songs';
import { NOTE_TO_KBD } from '../../data/piano/keys';
import { usePiano } from '../../hooks/piano/usePiano';
import { PianoKeyboard } from '../../components/piano/PianoKeyboard';
import type { LessonMode } from '../../data/piano/types';

interface FlashNote {
  note: string;
  correct: boolean;
}

const MODE_ICONS: Record<LessonMode, string> = {
  intro: '📖',
  watch: '👁',
  learn: '🎯',
  play: '🎹',
};

const MODE_LABELS: Record<LessonMode, string> = {
  intro: 'Intro',
  watch: 'Watch',
  learn: 'Learn',
  play: 'Play',
};

const MODES: LessonMode[] = ['intro', 'watch', 'learn', 'play'];

export function SongLesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = id ? getSong(id) : undefined;

  const { playNote, stopAll } = usePiano();

  const [mode, setMode] = useState<LessonMode>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.75);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [flashNote, setFlashNote] = useState<FlashNote | null>(null);
  const [learnIndex, setLearnIndex] = useState(0);
  const [learnComplete, setLearnComplete] = useState(false);
  const [watchBeat, setWatchBeat] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopPlayback = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveNotes([]);
    setIsPlaying(false);
    setWatchBeat(0);
    stopAll();
  }, [stopAll]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  if (!song) {
    navigate('/piano');
    return null;
  }

  const effectiveBpm = song.bpm * speed;
  const secPerBeat = 60 / effectiveBpm;

  const startWatch = () => {
    stopPlayback();
    setIsPlaying(true);

    const startDelay = 0.4;

    // Schedule all audio at once (Web Audio API handles timing precisely)
    song.notes.forEach(note => {
      const delay = note.beat * secPerBeat + startDelay;
      playNote(note.note, note.dur, effectiveBpm, note.velocity ?? 0.75, delay);
    });

    // Schedule visual highlights via setTimeout
    song.notes.forEach(note => {
      const startMs = (note.beat * secPerBeat + startDelay) * 1000;
      const durMs = note.dur * secPerBeat * 1000;

      const t1 = setTimeout(() => {
        setWatchBeat(note.beat);
        setActiveNotes(prev => [...prev, note.note]);
        const t2 = setTimeout(() => {
          setActiveNotes(prev => prev.filter(n => n !== note.note));
        }, durMs);
        timeoutsRef.current.push(t2);
      }, startMs);
      timeoutsRef.current.push(t1);
    });

    const last = song.notes[song.notes.length - 1];
    const endMs = (last.beat + last.dur) * secPerBeat * 1000 + startDelay * 1000 + 600;
    const tEnd = setTimeout(() => {
      setIsPlaying(false);
      setWatchBeat(0);
    }, endMs);
    timeoutsRef.current.push(tEnd);
  };

  const handleModeChange = (next: LessonMode) => {
    stopPlayback();
    setLearnIndex(0);
    setLearnComplete(false);
    setMode(next);
  };

  const handleNotePlay = (note: string) => {
    if (mode === 'watch') return;

    // Always play the note sound (short tap)
    playNote(note, 0.6, song.bpm, 0.8, 0);

    if (mode === 'learn' && !learnComplete) {
      const expected = song.notes[learnIndex]?.note;
      if (!expected) return;

      const correct = note === expected;
      setFlashNote({ note, correct });
      setTimeout(() => setFlashNote(null), 450);

      if (correct) {
        const nextIdx = learnIndex + 1;
        if (nextIdx >= song.notes.length) {
          setLearnComplete(true);
        } else {
          setLearnIndex(nextIdx);
        }
      }
    }
  };

  // Progress calculations
  const totalBeats = song.notes.length > 0
    ? song.notes[song.notes.length - 1].beat + song.notes[song.notes.length - 1].dur
    : 1;
  const watchProgress = watchBeat / totalBeats;
  const learnProgress = learnComplete ? 1 : learnIndex / song.notes.length;

  const currentPhrase = song.phrases.find(p => watchBeat >= p.startBeat && watchBeat < p.endBeat)
    ?? song.phrases[0];

  const learnNote = song.notes[learnIndex];
  const learnPhrase = learnNote
    ? song.phrases.find(p => learnNote.beat >= p.startBeat && learnNote.beat < p.endBeat)
    : undefined;

  const highlightNotes = mode === 'learn' && learnNote && !learnComplete ? [learnNote.note] : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 shrink-0">
        <button
          onClick={() => { stopPlayback(); navigate('/piano'); }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl shrink-0">{song.emoji}</span>
            <h1 className="font-bold text-white truncate">{song.title}</h1>
          </div>
          <p className="text-xs text-white/40">{song.film} · {song.year}</p>
        </div>
        <div className="shrink-0 text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
          {song.bpm} BPM
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        {MODES.map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
              mode === m
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {MODE_ICONS[m]} {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── INTRO ── */}
        {mode === 'intro' && (
          <div className="p-5 space-y-5 max-w-lg mx-auto">
            <div className={`bg-gradient-to-br ${song.color} p-6 rounded-2xl text-center`}>
              <div className="text-5xl mb-2">{song.emoji}</div>
              <h2 className="text-2xl font-bold">{song.title}</h2>
              <p className="text-white/60 text-sm">{song.film} · {song.year}</p>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">{song.description}</p>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <p className="text-amber-300 font-semibold text-sm mb-1">Tip</p>
                <p className="text-amber-200/70 text-sm leading-relaxed">{song.tip}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Key', value: song.keySignature },
                { label: 'Learn time', value: `~${song.learnMinutes} min` },
                { label: 'Tempo', value: `${song.bpm} BPM` },
                { label: 'Notes', value: `${song.notes.length} notes` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3">
                  <div className="text-white/40 text-xs mb-1">{label}</div>
                  <div className="text-white font-medium">{value}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">Song phrases</h3>
              <div className="space-y-2">
                {song.phrases.map((phrase, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-white/70 text-sm">{phrase.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleModeChange('watch')}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold rounded-xl text-base transition-colors"
            >
              👁 Watch it play →
            </button>
          </div>
        )}

        {/* ── WATCH ── */}
        {mode === 'watch' && (
          <div className="p-4 space-y-4 max-w-lg mx-auto">
            <div className="text-center py-1">
              {isPlaying ? (
                <>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Now playing</div>
                  <div className="text-white/80 font-semibold text-sm">{currentPhrase?.name}</div>
                </>
              ) : (
                <div className="text-white/40 text-sm">Watch the keys light up as the song plays</div>
              )}
            </div>

            {/* Active note display */}
            <div className="bg-white/5 rounded-2xl min-h-[72px] flex items-center justify-center">
              {activeNotes.length > 0 ? (
                <div className="flex gap-3 flex-wrap justify-center px-4">
                  {activeNotes.map(n => (
                    <span key={n} className="text-3xl font-bold text-indigo-300">{n}</span>
                  ))}
                </div>
              ) : (
                <span className="text-white/20 text-sm">
                  {isPlaying ? '…' : 'Press Play below'}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white/30">
                <span>{currentPhrase?.name ?? ''}</span>
                <span>{Math.round(watchProgress * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${watchProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── LEARN ── */}
        {mode === 'learn' && (
          <div className="p-4 space-y-4 max-w-lg mx-auto">
            {learnComplete ? (
              <div className="text-center py-10 space-y-5">
                <div className="text-7xl">🎉</div>
                <h2 className="text-2xl font-bold">Song complete!</h2>
                <p className="text-white/50 text-sm">
                  You pressed all {song.notes.length} notes of {song.title}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={() => { setLearnIndex(0); setLearnComplete(false); }}
                    className="px-5 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-sm"
                  >
                    Practice again
                  </button>
                  <button
                    onClick={() => handleModeChange('play')}
                    className="px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl text-sm"
                  >
                    Free play 🎹
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/30">
                    <span>Note {learnIndex + 1} of {song.notes.length}</span>
                    <span>{Math.round(learnProgress * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-200"
                      style={{ width: `${learnProgress * 100}%` }}
                    />
                  </div>
                </div>

                {learnPhrase && (
                  <div className="text-center text-white/30 text-xs uppercase tracking-wider">
                    {learnPhrase.name}
                  </div>
                )}

                {/* Current note card */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
                  <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">Press this key</p>
                  <div className="text-5xl font-bold text-amber-300">{learnNote?.note}</div>
                  {learnNote && NOTE_TO_KBD[learnNote.note] && (
                    <div className="mt-3 inline-block bg-white/10 border border-white/20 px-3 py-1 rounded-lg font-mono text-sm text-white/50">
                      {NOTE_TO_KBD[learnNote.note]}
                    </div>
                  )}
                </div>

                {/* Upcoming notes */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-white/25 text-xs shrink-0">Next:</span>
                  {song.notes.slice(learnIndex + 1, learnIndex + 6).map((n, i) => (
                    <span
                      key={i}
                      className="shrink-0 px-2.5 py-1 bg-white/5 rounded-lg text-sm font-medium text-white/30"
                      style={{ opacity: 1 - i * 0.18 }}
                    >
                      {n.note}
                    </span>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      const next = learnIndex + 1;
                      if (next >= song.notes.length) setLearnComplete(true);
                      else setLearnIndex(next);
                    }}
                    className="text-xs text-white/25 hover:text-white/50 transition-colors"
                  >
                    Skip note →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PLAY ── */}
        {mode === 'play' && (
          <div className="p-4 text-center max-w-lg mx-auto space-y-3">
            <p className="text-white/50 text-sm">The keyboard is all yours — play freely!</p>
            <div className="bg-white/5 rounded-xl p-4 text-xs text-white/30 leading-relaxed text-left space-y-1">
              <div>Lower (C3–B3): <span className="font-mono text-white/50">Z X C V B N M</span></div>
              <div>Upper (C4–B4): <span className="font-mono text-white/50">Q W E R T Y U</span></div>
              <div>Black keys: <span className="font-mono text-white/50">S D · G H J · 2 3 · 5 6 7</span></div>
            </div>
          </div>
        )}

        {/* ── PIANO KEYBOARD (shared across all modes) ── */}
        <div className="px-3 pt-2 pb-1">
          <div className="max-w-2xl mx-auto overflow-x-auto">
            <div style={{ minWidth: 480 }}>
              <PianoKeyboard
                highlightNotes={highlightNotes}
                activeNotes={activeNotes}
                flashNote={flashNote}
                onNotePlay={handleNotePlay}
                showKbdHints={mode === 'play' || mode === 'learn'}
              />
            </div>
          </div>
        </div>

        {/* ── SPEED CONTROL ── */}
        <div className="px-4 py-3 flex items-center gap-3 justify-center border-t border-white/5">
          <span className="text-white/30 text-xs">Speed:</span>
          {([0.5, 0.75, 1.0] as const).map(s => (
            <button
              key={s}
              onClick={() => {
                setSpeed(s);
                if (isPlaying && mode === 'watch') stopPlayback();
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                speed === s
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-white/5 text-white/35 hover:text-white/60'
              }`}
            >
              {s === 0.5 ? '½×' : s === 0.75 ? '¾×' : '1×'}
            </button>
          ))}
        </div>

        {/* ── WATCH: Play/Stop button ── */}
        {mode === 'watch' && (
          <div className="px-4 pb-8 flex justify-center">
            <button
              onClick={isPlaying ? stopPlayback : startWatch}
              className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${
                isPlaying
                  ? 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/20'
                  : 'bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
              }`}
            >
              {isPlaying ? '⏹ Stop' : '▶ Play Song'}
            </button>
          </div>
        )}

        {/* Bottom padding */}
        {mode !== 'watch' && <div className="h-8" />}
      </div>
    </div>
  );
}
