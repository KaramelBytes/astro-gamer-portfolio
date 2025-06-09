import PlatformCard from './PlatformCard';

// Platform data with brand colors and appropriate icons
const PLATFORMS = [
  {
    platform: 'Steam',
    username: 'YourUsername',
    icon: '🎮',
    color: '#1b2838',
    bgColor: '#2a475e',
    textColor: '#c7d5e0',
    link: 'https://steamcommunity.com/id/yourusername',
    copyText: 'YourUsername'
  },
  {
    platform: 'Xbox',
    username: 'YourGamertag',
    icon: '🎮',
    color: '#107c10',
    bgColor: '#0e700e',
    textColor: '#ffffff',
    copyText: 'YourGamertag'
  },
  {
    platform: 'Nintendo',
    username: 'SW-0000-0000-0000',
    icon: '🎮',
    color: '#e60012',
    bgColor: '#ff0000',
    textColor: '#ffffff',
    copyText: 'SW-0000-0000-0000'
  },
  {
    platform: 'Battle.net',
    username: 'YourTag#1234',
    icon: '🎮',
    color: '#00aeff',
    bgColor: '#148eff',
    textColor: '#ffffff',
    copyText: 'YourTag#1234'
  },
  {
    platform: 'Twitch',
    username: 'twitch.tv/yourchannel',
    icon: '📺',
    color: '#9146ff',
    bgColor: '#772ce8',
    textColor: '#ffffff',
    link: 'https://www.twitch.tv/yourchannel',
    copyText: 'twitch.tv/yourchannel'
  },
  {
    platform: 'Discord',
    username: 'yourusername',
    icon: '💬',
    color: '#5865f2',
    bgColor: '#7289da',
    textColor: '#ffffff',
    copyText: 'yourusername',
    discordUsername: 'yourusername'
  }
];

const GamingAccounts = () => {
  return (
    <div className="gaming-accounts">
      <div className="platforms-grid">
        {PLATFORMS.map((platform) => (
          <PlatformCard 
            key={platform.platform}
            platform={platform.platform}
            username={platform.username}
            icon={platform.icon}
            color={platform.color}
            bgColor={platform.bgColor}
            textColor={platform.textColor}
            copyText={platform.copyText}
            link={platform.link}
            discordUsername={platform.discordUsername}
          />
        ))}
      </div>
    </div>
  );
};

export default GamingAccounts;
