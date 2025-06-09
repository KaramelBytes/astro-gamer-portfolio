import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/**
 * Type definition for supported game types
 * - 'video': Digital games played on electronic devices
 * - 'tabletop': Physical board/card games
 */
type GameType = 'video' | 'tabletop';

/**
 * Interface defining the structure of game data throughout the application
 * All game-related components and functions use this interface
 */
export interface GameData {
  title: string;
  platform?: string;
  type: GameType;
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
  createdAt: string;
  updatedAt: string;
  slug: string;
}

// Define the shape of our game data in content collections
type GameCollectionEntry = CollectionEntry<'games'>;

/**
 * Converts a content collection entry to our standardized GameData format
 * @param entry Raw game entry from content collection
 * @returns Standardized GameData object
 */
function toGameData(entry: GameCollectionEntry): GameData {
  const { data } = entry;
  // Extract slug from entry or fallback to last part of id
  const slug = 'slug' in entry ? String(entry.slug) : entry.id.split('/').pop() || '';
  const type: GameType = data.tabletop ? 'tabletop' : 'video';
  const now = new Date().toISOString();
  
  // Ensure createdAt and updatedAt are strings
  const createdAt = data.createdAt ? new Date(data.createdAt).toISOString() : now;
  const updatedAt = data.updatedAt ? new Date(data.updatedAt).toISOString() : now;
  
  return {
    ...data,
    type,
    slug,
    createdAt,
    updatedAt,
  };
}



/**
 * Fetches all games from a specified collection
 * @param {string} collectionName - Name of the collection to fetch (e.g., 'favorite-games')
 * @returns {Promise<GameData[]>} Array of game objects
 * @throws {Error} Logs error to console if collection cannot be accessed
 */
export async function getGames(collectionName: string): Promise<GameData[]> {
  try {
    const collection = await getCollection('games', (entry) => 
      entry.id.startsWith(`${collectionName}/`)
    );
    return collection.map(toGameData);
  } catch (error) {
    console.error(`Error fetching games from collection ${collectionName}:`, error);
    return [];
  }
}

/**
 * Groups all games by their collection and category
 * @returns {Promise<Object>} Object containing games organized by collection and category
 * @example
 * {
 *   videoGames: { 
 *     title: 'Video Games',
 *     categories: [
 *       { title: 'Favorites', games: [...] },
 *       { title: 'Currently Playing', games: [...] }
 *     ]
 *   },
 *   tabletopGames: { 
 *     title: 'Tabletop Games',
 *     categories: [...]
 *   }
 * }
 */
export async function getAllGamesGrouped() {
  try {
    const [
      favoriteGames,
      currentlyPlaying,
      tabletopGames,
      currentlyPlayingTabletop
    ] = await Promise.all([
      getGames('favorite-games'),
      getGames('currently-playing'),
      getGames('tabletop-games'),
      getGames('currently-playing-tabletop')
    ]);

    return {
      videoGames: {
        title: 'Video Games',
        categories: [
          { title: 'Currently Playing', games: currentlyPlaying },
          { title: 'All-Time Favorites', games: favoriteGames },
        ]
      },
      tabletopGames: {
        title: 'Tabletop Games',
        categories: [
          { title: 'Currently Playing', games: currentlyPlayingTabletop },
          { title: 'All-Time Favorites', games: tabletopGames },
        ]
      }
    };
  } catch (error) {
    console.error('Error grouping games:', error);
    return {
      videoGames: { title: 'Video Games', categories: [] },
      tabletopGames: { title: 'Tabletop Games', categories: [] },
    };
  }
}

/**
 * Retrieves a single game by its slug
 * @param {string} slug - Unique identifier for the game
 * @returns {Promise<GameData | null>} The game data if found, null otherwise
 * @description Searches through all collections to find a game with matching slug
 */
export async function getGameBySlug(slug: string): Promise<GameData | null> {
  try {
    const allCollections = await getCollection('games');
    const entry = allCollections.find(entry => 
      ('slug' in entry && entry.slug === slug) || entry.id.endsWith(`/${slug}`)
    );
    return entry ? toGameData(entry) : null;
  } catch (error) {
    console.error(`Error getting game with slug ${slug}:`, error);
    return null;
  }
}
