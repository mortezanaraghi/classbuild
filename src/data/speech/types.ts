export interface Phrase {
  id: string;
  text: string;
  difficulty: 1 | 2 | 3;
  tip?: string;
}

export interface PhraseCategory {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;        // tailwind gradient from-* to-*
  description: string;
  phrases: Phrase[];
}

export interface WordResult {
  word: string;         // original word (may include punctuation)
  matched: boolean;
}

export interface SessionRecord {
  categoryId: string;
  scores: number[];     // accuracy % per phrase
  completedAt: string;
}

export type PracticeStage = 'intro' | 'listen' | 'ready' | 'record' | 'result' | 'summary';
