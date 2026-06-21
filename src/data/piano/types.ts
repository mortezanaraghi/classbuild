export interface NoteEvent {
  note: string;       // e.g. 'C4', 'F#3', 'Bb4'
  beat: number;       // start beat (0-indexed from song start)
  dur: number;        // duration in beats
  velocity?: number;  // 0-1, default 0.75
}

export interface SongPhrase {
  name: string;
  startBeat: number;
  endBeat: number;
}

export interface Song {
  id: string;
  title: string;
  film: string;
  year: number;
  difficulty: 1 | 2 | 3;       // 1 = total beginner
  bpm: number;
  emoji: string;
  color: string;                 // tailwind gradient from-*
  description: string;
  tip: string;                   // quick learning tip
  learnMinutes: number;
  notes: NoteEvent[];
  phrases: SongPhrase[];
  keySignature: string;          // e.g. 'C major', 'D minor'
}

export type LessonMode = 'intro' | 'watch' | 'learn' | 'play';

export interface KeyState {
  note: string;
  state: 'idle' | 'active' | 'highlight' | 'correct' | 'wrong';
}
