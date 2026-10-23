export type DefenseStage = 'envelope' | 'reading' | 'tucking' | 'bouquet';
export type LetterId = 'defense' | 'birthday';

export interface LetterMeta {
  id: LetterId;
  title: string;
  emoji: string;
  hint: string;
}
