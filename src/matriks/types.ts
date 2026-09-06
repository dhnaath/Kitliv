export type QuadrantId = 'tl' | 'tr' | 'bl' | 'br';

export type ThemeColor = 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';

export interface Item {
  id: string;
  text: string;
}

export interface QuadrantData {
  id: QuadrantId;
  title: string;
  subtitle: string;
  theme: ThemeColor;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  quadrants: Record<QuadrantId, QuadrantData>;
}
