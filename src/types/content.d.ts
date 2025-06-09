import type { CollectionEntry } from 'astro:content';

export interface GameData {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'video' | 'tabletop';
  platform?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  genres?: string[];
  rating?: number;
  playtime?: number;
  completed?: boolean;
  completedDate?: string;
  review?: string;
  currentlyPlaying?: boolean;
  favorite?: boolean;
  tabletop?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

declare global {
  type GameEntry = CollectionEntry<'games'>;
}
