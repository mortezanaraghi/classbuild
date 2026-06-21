import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LessonRecord {
  completed: boolean;
  score: number;
  completedAt: string;
  masteredVocab: string[];
}

interface TurkishState {
  progress: Record<string, LessonRecord>;
  streak: number;
  lastStudiedDate: string | null;
  totalXP: number;

  completeLesson: (lessonId: string, score: number, masteredVocab: string[]) => void;
  masterId: (lessonId: string, vocabId: string) => void;
  getLessonProgress: (lessonId: string) => LessonRecord | null;
  isCompleted: (lessonId: string) => boolean;
  getCompletedCount: () => number;
  resetProgress: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useTurkishStore = create<TurkishState>()(
  persist(
    (set, get) => ({
      progress: {},
      streak: 0,
      lastStudiedDate: null,
      totalXP: 0,

      completeLesson: (lessonId, score, masteredVocab) => {
        const now = today();
        const prev = get().progress[lessonId];
        const alreadyDone = prev?.completed;

        set(state => {
          const last = state.lastStudiedDate;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().slice(0, 10);

          let newStreak = state.streak;
          if (!alreadyDone) {
            if (last === now) {
              // same day, streak unchanged
            } else if (last === yStr) {
              newStreak = state.streak + 1;
            } else {
              newStreak = 1;
            }
          }

          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                completed: true,
                score,
                completedAt: now,
                masteredVocab: [...new Set([...(prev?.masteredVocab ?? []), ...masteredVocab])],
              },
            },
            streak: newStreak,
            lastStudiedDate: now,
            totalXP: alreadyDone ? state.totalXP : state.totalXP + Math.round(score * 10),
          };
        });
      },

      masterId: (lessonId, vocabId) => {
        set(state => {
          const existing = state.progress[lessonId];
          if (!existing) return state;
          const set2 = new Set(existing.masteredVocab);
          set2.add(vocabId);
          return {
            progress: {
              ...state.progress,
              [lessonId]: { ...existing, masteredVocab: [...set2] },
            },
          };
        });
      },

      getLessonProgress: (lessonId) => get().progress[lessonId] ?? null,
      isCompleted: (lessonId) => get().progress[lessonId]?.completed ?? false,

      getCompletedCount: () =>
        Object.values(get().progress).filter(p => p.completed).length,

      resetProgress: () =>
        set({ progress: {}, streak: 0, lastStudiedDate: null, totalXP: 0 }),
    }),
    { name: 'turkish-progress-v1' }
  )
);
