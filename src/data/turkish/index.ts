import { week1, week2 } from './weeks1-2';
import { week3, week4 } from './weeks3-4';
import { week5, week6, week7, week8 } from './weeks5-8';
import type { Week } from './types';

export const curriculum: Week[] = [week1, week2, week3, week4, week5, week6, week7, week8];

export function getLesson(weekId: number, dayId: number) {
  const week = curriculum.find(w => w.id === weekId);
  return week?.lessons.find(l => l.day === dayId) ?? null;
}

export function getLessonById(id: string) {
  for (const week of curriculum) {
    const lesson = week.lessons.find(l => l.id === id);
    if (lesson) return lesson;
  }
  return null;
}

export const TOTAL_LESSONS = curriculum.reduce((sum, w) => sum + w.lessons.length, 0);
export const TOTAL_VOCAB = curriculum.reduce(
  (sum, w) => sum + w.lessons.reduce((s, l) => s + l.vocabulary.length, 0), 0
);

export type { Week };
export { week1, week2, week3, week4, week5, week6, week7, week8 };
