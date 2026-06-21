export interface VocabItem {
  id: string;
  turkish: string;
  english: string;
  pronunciation: string; // phonetic guide for English speakers
  persian?: string;       // Persian equivalent
  persianScript?: string; // Persian script
  isPersianCognate?: boolean; // Turkish word borrowed from Persian/Arabic shared with Persian
  example?: string;       // Turkish example sentence
  exampleEn?: string;     // English translation of example
  category?: string;
}

export interface Phrase {
  turkish: string;
  english: string;
  pronunciation: string;
  context?: string;
  formal?: boolean;
  persianNote?: string;   // Note on Persian cognates in this phrase
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'listen-choose';
  prompt: string;
  promptTurkish?: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface GrammarNote {
  title: string;
  body: string;
  examples: Array<{ turkish: string; english: string; note?: string }>;
  persianParallel?: string;
}

export interface Lesson {
  id: string;
  week: number;
  day: number;
  title: string;
  subtitle: string;
  emoji: string;
  category: 'basics' | 'food' | 'transport' | 'shopping' | 'accommodation' | 'social' | 'emergency' | 'grammar';
  vocabulary: VocabItem[];
  phrases: Phrase[];
  grammarNote?: GrammarNote;
  culturalNote?: string;
  persianAdvantage?: string; // Tip specifically for Persian speakers
  exercises: Exercise[];
}

export interface Week {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  completed: boolean;
  vocabMastered: string[];   // vocab item ids
  score?: number;
  completedAt?: string;
}

export type LessonTab = 'vocab' | 'phrases' | 'grammar' | 'practice' | 'done';
