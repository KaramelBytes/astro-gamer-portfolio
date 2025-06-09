import { useState } from 'react';

const PlatformCard = ({ 
  platform, 
  username, 
  icon, 
  color, 
  bgColor,
  textColor,
  copyText, 
  link,
  discordUsername
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText || username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Special handling for Discord username with discriminator
  const displayUsername = discordUsername || username;

  return (
    <div 
      className="platform-card" 
      style={{
        '--platform-color': color,
        '--platform-bg': bgColor || `${color}20`,
        '--platform-text': textColor || 'white',
      }}
      data-platform={platform.toLowerCase()}
    >
      <div className="platform-header">
        <div className="platform-icon" aria-hidden="true">
          {icon}
        </div>
        <h3 className="platform-name">{platform}</h3>
      </div>
      
      <div className="platform-username">
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="platform-link"
            style={{ '--link-color': color }}
          >
            {displayUsername}
          </a>
        ) : (
          <span>{displayUsername}</span>
        )}
      </div>
      
      <button 
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        aria-label={`Copy ${platform} username`}
        style={{
          '--button-bg': color,
          '--button-hover': bgColor,
          '--button-text': textColor
        }}
      >
        <span className="button-text">
          {copied ? 'Copied!' : 'Copy'}
        </span>
        <span className="button-icon" aria-hidden="true">
          {copied ? '✓' : '⎘'}
        </span>
      </button>
    </div>
  );
};

export default PlatformCard;
