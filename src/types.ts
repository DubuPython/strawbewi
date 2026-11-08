export type DefenseStage = 'envelope' | 'reading' | 'tucking' | 'bouquet';
export type LetterId = 'defense' | 'birthday';

export interface LetterMeta {
  id: LetterId;
  title: string;
  emoji: string;
  hint: string;
}

export interface StrawberryLetter {
  id: number;
  title: string;
  content: string;
  date?: string;
}

export interface PolaroidMemory {
  id: number;
  emoji: string;
  caption: string;
  bgGradient: string;
  date?: string;
  image?: string;
}
