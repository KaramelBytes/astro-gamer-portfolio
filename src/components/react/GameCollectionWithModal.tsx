/**
 * GameCollectionWithModal - Displays a collection of games in a categorized grid layout with modal details
 * Handles both video and tabletop games with separate sections
 */
import React, { useState, useCallback, useEffect } from 'react';
import type { FC } from 'react';
import GameCard from './GameCard';
import GameModal from './GameModal';
import type { GameData } from '../../types/content';

declare global {
  interface Window {
    gtag?: (command: 'event', action: string, params: {
      event_category: string;
      event_label?: string;
      value?: number;
      non_interaction?: boolean;
      [key: string]: any;
    }) => void;
  }
}

interface GameCategory {
  title: string;
  games: GameData[];
}

interface GameCategories {
  videoGames: {
    title: string;
    categories: GameCategory[];
  };
  tabletopGames: {
    title: string;
    categories: GameCategory[];
  };
}

interface GameCollectionWithModalProps {
  'gameCategories': {
    videoGames: {
      title: string;
      categories: Array<{
        title: string;
        games: GameData[];
      }>;
    };
    tabletopGames: {
      title: string;
      categories: Array<{
        title: string;
        games: GameData[];
      }>;
    };
  };
  'client:load'?: boolean;
}

const GameCollectionWithModal: FC<GameCollectionWithModalProps> = ({
  gameCategories
}) => {
  // Track the currently selected game and modal state
  // Using null for selectedGame to indicate no game is selected
  console.log('GameCollectionWithModal - Received gameCategories:', gameCategories);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use the provided game categories directly

  const isLoading = !gameCategories || 
                  !gameCategories.videoGames || 
                  !gameCategories.tabletopGames ||
                  (gameCategories.videoGames.categories.every(cat => {
                    console.log(`Video Game Category '${cat.title}' has ${cat.games.length} games`);
                    return cat.games.length === 0;
                  }) &&
                  gameCategories.tabletopGames.categories.every(cat => {
                    console.log(`Tabletop Game Category '${cat.title}' has ${cat.games.length} games`);
                    return cat.games.length === 0;
                  }));
  
  console.log('GameCollectionWithModal - isLoading:', isLoading);

  /**
   * Handles game card click events
   * - Updates selected game state with proper type
   * - Opens modal
   * - Tracks the view event for analytics
   */
  const handleCardClick = useCallback((game: GameData) => {
    // Determine game type based on presence of 'tabletop' property
    // This is used for both UI rendering and analytics categorization
    setSelectedGame({ ...game, type: game.tabletop ? 'tabletop' : 'video' } as GameData);
    setIsModalOpen(true);
    
    // Track the game view event if Google Analytics is available
    // This helps understand user engagement with different games
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_game', {
        event_category: 'engagement',
        event_label: game.title,
        game_type: game.tabletop ? 'tabletop' : 'video',
        non_interaction: false
      });
    }
  }, []);

  /**
   * Handles modal close with smooth transition
   * - First triggers the close animation
   * - Then resets the selected game after animation completes
   * - Prevents content flash by delaying state reset
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Delay matches the CSS transition duration in GameModal
    setTimeout(() => setSelectedGame(null), 300);
  }, []);

  const renderGameGrid = useCallback((games: GameData[]) => (
    <div className="game-grid">
      {games.map((game: GameData) => (
        <GameCard 
          key={game.id}
          game={game}
          onClick={() => handleCardClick(game)}
        />
      ))}
    </div>
  ), [handleCardClick]);

  const renderCategory = useCallback((category: GameCategory) => (
    <div key={category.title} className="mb-8">
      <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
      {renderGameGrid(category.games)}
    </div>
  ), [renderGameGrid]);

  // Explicitly type the section parameter in the map callback
  const renderSection = useCallback((section: { title: string; categories: GameCategory[] }) => (
    <div key={section.title} className="game-section">
      <h2>{section.title}</h2>
      {section.categories.map((category) => renderCategory(category))}
    </div>
  ), [renderCategory]);

  if (isLoading) {
    console.log('GameCollectionWithModal - Rendering loading state');
    return <div className="loading">Loading games... {JSON.stringify({
      hasGameCategories: !!gameCategories,
      hasVideoGames: !!gameCategories?.videoGames,
      hasTabletopGames: !!gameCategories?.tabletopGames,
      videoGameCounts: gameCategories?.videoGames?.categories.map(c => `${c.title}: ${c.games.length}`) || [],
      tabletopGameCounts: gameCategories?.tabletopGames?.categories.map(c => `${c.title}: ${c.games.length}`) || []
    })}</div>;
  }

  // Add keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen) {
      handleCloseModal();
    }
  }, [isModalOpen, handleCloseModal]);

  // Set up keyboard event listener
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [handleKeyDown]);

  return (
    <div className="game-section">
      <h2>MY GAMES</h2>
      <p className="games-intro">
        It's hard to choose favorites, and these lists are not set in stone. Ask me tomorrow, and they may change!
        In general, I enjoy games with strong narratives, excellent character development, 
        hard choices, stylish art direction, and addictive soundtracks.
      </p>

      <div className="games-container">
        {Object.values(gameCategories).map(renderSection)}
      </div>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default React.memo(GameCollectionWithModal);
