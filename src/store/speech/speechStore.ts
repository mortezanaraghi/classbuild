import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionRecord } from '../../data/speech/types';

interface SpeechStoreState {
  sessions: SessionRecord[];
  streak: number;
  lastPracticed: string;   // ISO date string
  totalAttempts: number;
  addSession: (record: SessionRecord) => void;
  getCategoryBest: (categoryId: string) => number | undefined;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const useSpeechStore = create<SpeechStoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      streak: 0,
      lastPracticed: '',
      totalAttempts: 0,

      addSession: (record) => {
        const today = todayStr();
        const { lastPracticed, streak } = get();
        let newStreak = streak;
        if (lastPracticed === today) {
          newStreak = streak;
        } else if (lastPracticed === yesterdayStr()) {
          newStreak = streak + 1;
        } else {
          newStreak = 1;
        }
        set(s => ({
          sessions: [...s.sessions, record],
          streak: newStreak,
          lastPracticed: today,
          totalAttempts: s.totalAttempts + record.scores.length,
        }));
      },

      getCategoryBest: (categoryId) => {
        const relevant = get().sessions.filter(s => s.categoryId === categoryId);
        if (relevant.length === 0) return undefined;
        const avgs = relevant.map(s =>
          s.scores.length > 0
            ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length)
            : 0
        );
        return Math.max(...avgs);
      },
    }),
    { name: 'speech-store-v1' }
  )
);
