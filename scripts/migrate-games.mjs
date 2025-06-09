import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to write JSON files
async function writeJsonFile(path, data) {
  const content = JSON.stringify(data, null, 2) + '\n';
  await writeFile(path, content, 'utf8');
  console.log(`Wrote ${path}`);
}

// Migrate a single game collection
async function migrateGameCollection(collectionName, sourcePath, type) {
  try {
    const modulePath = join(process.cwd(), sourcePath);
    const { default: games } = await import(modulePath);
    
    const collectionDir = join(process.cwd(), 'src/content/games', collectionName);
    await mkdir(collectionDir, { recursive: true });
    
    // Create an index file for the collection
    const indexContent = {
      name: collectionName,
      type,
      description: `Collection of ${type} games: ${collectionName}`
    };
    
    await writeJsonFile(join(collectionDir, '_index.json'), indexContent);
    
    // Create a file for each game
    for (const game of games) {
      const slug = game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const gameData = {
        ...game,
        type,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await writeJsonFile(join(collectionDir, `${slug}.json`), gameData);
    }
    
    console.log(`Migrated ${games.length} games to ${collectionDir}`);
    return games.length;
  } catch (error) {
    console.error(`Error migrating ${collectionName}:`, error);
    return 0;
  }
}

// Main migration function
async function migrateAllGames() {
  try {
    console.log('Starting game data migration...');
    
    // Define the collections to migrate
    const collections = [
      { name: 'favorite-games', path: './src/data/FavoriteGamesData.js', type: 'video' },
      { name: 'currently-playing', path: './src/data/CurrentlyPlayingData.js', type: 'video' },
      { name: 'tabletop-games', path: './src/data/TabletopGamesData.js', type: 'tabletop' },
      { name: 'currently-playing-tabletop', path: './src/data/CurrentlyPlayingTabletopData.js', type: 'tabletop' },
    ];
    
    // Migrate each collection
    let totalMigrated = 0;
    for (const collection of collections) {
      const count = await migrateGameCollection(collection.name, collection.path, collection.type);
      totalMigrated += count;
    }
    
    console.log(`\nMigration complete! Migrated ${totalMigrated} games in total.`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateAllGames();
