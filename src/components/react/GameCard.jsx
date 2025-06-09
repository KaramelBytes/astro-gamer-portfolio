/**
 * GameCard - A clickable card component that displays game information
 * Features:
 * - Hover and focus states for better UX
 * - Lazy loading of images with fallback
 * - Keyboard navigation support
 * - Accessible to screen readers
 * - Responsive design
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a game card with image, title, and platform information
 * @param {Object} props - Component props
 * @param {Object} props.game - Game data including title, platform, and image URL
 * @param {Function} props.onClick - Callback function when card is clicked/activated
 */
const GameCard = ({ game, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = React.useRef(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * Handles keyboard navigation for the card
   * - Space or Enter key triggers the click handler
   * - Prevents default behavior to avoid page scrolling
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(game);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`game-card ${isHovered ? 'hovered' : ''}`}
      onClick={() => onClick(game)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`${game.title}${game.platform ? ` for ${game.platform}` : ''}. Click to view details.`}
      aria-haspopup="dialog"
      data-testid={`game-card-${game.slug || game.title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="game-card-image-container">
        {/* Conditional rendering of game image or fallback */}
        {/* Uses lazy loading for better performance */}
        {!imageError && game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt="" // Decorative image, alt text is provided by parent
            className={`game-card-image ${imageLoaded ? 'loaded' : ''}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            aria-hidden="true"
          />
        ) : (
          <div className="game-card-image-placeholder" aria-hidden="true">
            <span aria-hidden="true">{game.title.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="game-card-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>
      <div className="game-card-info">
        <h3 className="game-card-title">{game.title}</h3>
        {game.platform && (
          <p className="game-card-platform">
            <span className="platform-icon" aria-hidden="true">🎮</span>
            <span className="sr-only">Platform: </span>
            {game.platform}
          </p>
        )}
      </div>
    </div>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    title: PropTypes.string.isRequired,
    platform: PropTypes.string,
    imageUrl: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(GameCard);
