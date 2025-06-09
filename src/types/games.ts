export interface Game {
  title: string;
  platform?: string;
  type: 'video' | 'tabletop';
  description: string;
  imageUrl?: string;
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
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameCategory {
  title: string;
  games: Game[];
}

export interface GameCollection {
  title: string;
  categories: GameCategory[];
}

export interface GameCollections {
  videoGames: GameCollection;
  tabletopGames: GameCollection;
}
