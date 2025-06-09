/**
 * GameModal - A reusable, accessible modal dialog component for displaying game details
 * Features:
 * - Keyboard navigation (Escape to close, Tab to navigate, focus trapping)
 * - Click outside to close
 * - Smooth animations
 * - Proper ARIA attributes for screen readers
 * - Focus management (returns focus to triggering element on close)
 */
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const GameModal = ({ 
  game, 
  isOpen, 
  onClose 
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closeTimeout = useRef(null);
  const lastFocusedElement = useRef(null);
  const modalRoot = document.getElementById('modal-root');
  const modalTitleId = 'modal-title';

  // Create a portal target for the modal to ensure proper stacking context
  // and avoid z-index issues with parent elements
  const el = document.createElement('div');
  
  /**
   * Sets up and cleans up the modal's DOM element
   * - Saves the currently focused element before opening
   * - Appends modal to the portal
   * - Returns focus to the original element on unmount
   */
  useEffect(() => {
    if (!modalRoot) return;
    
    // Save the currently focused element before opening modal
    lastFocusedElement.current = document.activeElement;
    
    modalRoot.appendChild(el);
    
    return () => {
      // Return focus to the element that had focus before the modal opened
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  /**
   * Manages modal open/close animations and related DOM changes
   * - Handles animation timing
   * - Manages body scroll lock
   * - Sets initial focus to close button
   * - Ensures smooth transitions
   */
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Force reflow to ensure the element is in the DOM before starting animation
      void el.offsetHeight;
      
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Focus the close button when modal opens
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 10);
      
      // Prevent scrolling when modal is open
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      
      return () => clearTimeout(timer);
    } else {
      // Start closing animation
      setIsVisible(false);
      
      // Clean up after animation completes
      const timer = setTimeout(() => {
        if (!isOpen) {
          setIsMounted(false);
          document.body.classList.remove('modal-open');
          document.documentElement.classList.remove('modal-open');
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, el]);

  /**
   * Sets up keyboard and click-outside event listeners
   * - Escape key closes modal
   * - Tab key traps focus within modal
   * - Click outside modal triggers close
   * Cleanup removes all event listeners
   */
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event) => {
      // Close modal on Escape key
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
      // Trap focus inside the modal
      else if (event.key === 'Tab') {
        if (!modalRef.current) return;
        
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    // Start close animation
    setIsVisible(false);
    
    // Clear any existing timeout
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    
    // Wait for animation to complete before calling onClose
    closeTimeout.current = setTimeout(() => {
      onClose();
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }, 300);
  };

  // Don't render anything if not mounted and not open
  if (!isMounted && !isOpen) return null;

  // Use React Portal to render the modal outside the normal DOM hierarchy
  // This ensures proper stacking context and avoids z-index issues with parent elements
  return ReactDOM.createPortal(
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
        transition: 'background-color 0.3s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className={`modal-content ${isVisible ? 'visible' : ''}`}
        style={{
          position: 'relative',
          backgroundColor: '#0a0a0a',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '3px solid var(--primary-color)',
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform, opacity',
        }}
        onClick={(e) => e.stopPropagation()}
        role="document"
        aria-label="Game details"
      >
        {/* Hidden description for screen readers */}
        <div id="modal-description" style={{ display: 'none' }}>
          {game.description || `Details about ${game.title}`}
        </div>
        <button 
          ref={closeButtonRef}
          className="close-button" 
          onClick={handleClose}
          aria-label={`Close ${game.title} details`}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 10,
            padding: '5px 10px',
            borderRadius: '4px',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
            }
          }}
        >
          <span aria-hidden="true">&times;</span>
          <span className="sr-only">Close</span>
        </button>
        
        <header className="modal-header" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '20px',
          position: 'relative',
        }}>
          {game.imageUrl && (
            <div className="modal-image-container" style={{
              width: '100%',
              maxHeight: '300px',
              overflow: 'hidden',
              borderRadius: '8px',
            }}>
              <img 
                src={game.imageUrl} 
                alt={`${game.title} cover`} 
                className="modal-image"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
          <div className="modal-header-content">
            <h2 id="modal-title" style={{
              margin: '0 0 10px 0',
              color: 'var(--primary-color)',
            }}>
              {game.title}
            </h2>
            {game.platform && (
              <p className="game-platform" style={{
                margin: '0',
                color: '#aaa',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span className="platform-icon">🎮</span> {game.platform}
              </p>
            )}
          </div>
        </header>
        
        <div className="modal-body" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {game.description && (
            <div className="game-description">
              <h3 style={{
                margin: '0 0 10px 0',
                color: 'var(--primary-color)',
                fontSize: '1.2em',
              }}>About</h3>
              <p style={{
                margin: '0',
                lineHeight: '1.6',
              }}>{game.description}</p>
            </div>
          )}
          
          {game.review && (
            <div className="game-review">
              <h3 style={{
                margin: '0 0 10px 0',
                color: 'var(--primary-color)',
                fontSize: '1.2em',
              }}>My Thoughts</h3>
              <p style={{
                margin: '0',
                lineHeight: '1.6',
              }}>{game.review}</p>
            </div>
          )}
          
          <div className="game-meta" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #333',
          }}>
            {game.rating !== undefined && (
              <div className="meta-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span className="meta-label" style={{
                  color: '#aaa',
                  minWidth: '80px',
                }}>Rating:</span>
                <span className="meta-value" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  {Array(5).fill(0).map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < Math.floor(game.rating / 2) ? 'filled' : ''}`}
                      style={{
                        color: i < Math.floor(game.rating / 2) ? 'gold' : '#444',
                        fontSize: '1.2em',
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-text" style={{
                    marginLeft: '8px',
                    color: '#aaa',
                  }}>
                    {game.rating}/10
                  </span>
                </span>
              </div>
            )}
            
            {game.playtime && (
              <div className="meta-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span className="meta-label" style={{
                  color: '#aaa',
                  minWidth: '80px',
                }}>Playtime:</span>
                <span className="meta-value" style={{
                  color: '#fff',
                }}>
                  {game.playtime} hours
                </span>
              </div>
            )}
            
            {game.completed && game.completedDate && (
              <div className="meta-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span className="meta-label" style={{
                  color: '#aaa',
                  minWidth: '80px',
                }}>Completed:</span>
                <span className="meta-value" style={{
                  color: '#fff',
                }}>
                  {new Date(game.completedDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    el
  );
};


GameModal.propTypes = {
  game: PropTypes.shape({
    title: PropTypes.string.isRequired,
    platform: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    review: PropTypes.string,
    rating: PropTypes.number,
    playtime: PropTypes.number,
    completed: PropTypes.bool,
    completedDate: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default React.memo(GameModal);
