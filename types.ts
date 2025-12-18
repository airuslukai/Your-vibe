
export type Page = 'home' | 'gallery' | 'letters' | 'poetry' | 'universe';

export interface Memory {
  id: string;
  url: string;
  caption: string;
  date?: string;
}

export interface LoveLetterConfig {
  name: string;
  relationship: string;
  favoriteTrait: string;
  vibe: 'poetic' | 'playful' | 'deep' | 'short';
}
