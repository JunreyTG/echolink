import React, { useState, useEffect } from 'react';
import { CloseIcon, BellIcon, SparklesIcon, CheckCircleIcon, PaintBrushIcon, UserIcon } from './Icons';
import { User } from '../types';
import { BASIC_THEMES, PREMIUM_THEMES, AppTheme, GAME_CATEGORIES, LANGUAGES, BASIC_AVATARS, PREMIUM_AVATARS } from '../constants';

interface SettingsModalProps {
  currentUser: User;
  onClose: () => void;
  currentTheme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  onSetUserTheme: (themeId: string) => void;
  onUpdateProfile: (details: Partial<Pick<User, 'bio' | 'favoriteGames' | 'language' | 'avatarUrl'>>) => void;
  areNotificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onInitiatePayment: (plan: string, price: string) => void;
}

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'premium';

const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
}> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      <div>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">{label}</label>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
          checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900`}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
);


const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const { currentUser, onClose, currentTheme, onSetTheme, areNotificationsEnabled, onToggleNotifications, onInitiatePayment, onSetUserTheme, onUpdateProfile } = props;
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile editing state
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [favoriteGames, setFavoriteGames] = useState(currentUser.favoriteGames || []);
  const [language, setLanguage] = useState(currentUser.language || 'en');
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    const isChanged = avatarUrl !== currentUser.avatarUrl ||
                      bio !== (currentUser.bio || '') ||
                      language !== (currentUser.language || 'en') ||
                      JSON.stringify(favoriteGames.sort()) !== JSON.stringify((currentUser.favoriteGames || []).sort());
    setHasChanges(isChanged);
  }, [avatarUrl, bio, favoriteGames, language, currentUser]);

  const handleSaveChanges = () => {
    onUpdateProfile({ avatarUrl, bio, favoriteGames, language });
    setHasChanges(false);
  };

  const handleResetChanges = () => {
    setAvatarUrl(currentUser.avatarUrl);
    setBio(currentUser.bio || '');
    setFavoriteGames(currentUser.favoriteGames || []);
    setLanguage(currentUser.language || 'en');
  };
  
  const toggleGame = (game: string) => {
    setFavoriteGames(prev =>
      prev.includes(game) ? prev.filter(g => g !== game) : [...prev, game]
    );
  };

  const NavItem: React.FC<{
    tabId: SettingsTab;
    icon: React.ReactNode;
    label: string;
    isPremium?: boolean;
  }> = ({ tabId, icon, label, isPremium = false }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`w-full text-left flex items-center px-3 py-2 rounded-md font-medium transition-colors text-sm ${
        activeTab === tabId
          ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white'
          : `hover:bg-black/5 dark:hover:bg-white/5 ${isPremium ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const ThemePreview: React.FC<{
    theme: AppTheme;
    isSelected: boolean;
    isPremium: boolean;
    isLocked: boolean;
    onClick: () => void;
  }> = ({ theme, isSelected, isPremium, isLocked, onClick }) => (
    <div className="text-center">
        <button 
            onClick={onClick}
            disabled={isLocked}
            className={`relative w-full aspect-video rounded-lg border-2 transition-all duration-200 overflow-hidden group ${isSelected ? 'border-green-500 shadow-lg' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'} ${isLocked ? 'cursor-not-allowed' : ''}`}
        >
            {theme.preview.startsWith('#') ? (
                <div className="w-full h-full" style={{ backgroundColor: theme.preview }}></div>
            ) : (
                <img src={theme.preview} alt={`${theme.name} preview`} className="w-full h-full object-cover" />
            )}
            {isLocked && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl">🔒</div>}
        </button>
        <div className="mt-2 flex items-center justify-center">
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{theme.name}</span>
            {isPremium && <SparklesIcon className="h-4 w-4 ml-1.5 text-purple-500 dark:text-purple-400" />}
        </div>
    </div>
  );

  const renderContent = () => {
    const userTheme = currentUser?.theme || (currentTheme === 'dark' ? 'default_dark' : 'default_light');
    switch (activeTab) {
      case 'profile':
        return (
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h3>
                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="p-4 bg-white dark:bg-[#202225] rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Avatar</h4>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Basic Avatars</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {BASIC_AVATARS.map(url => (
                                        <button key={url} onClick={() => setAvatarUrl(url)} className={`rounded-full p-1 border-2 ${avatarUrl === url ? 'border-green-500' : 'border-transparent'}`}>
                                            <img src={url} alt="Basic Avatar" className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-800" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase text-purple-500 dark:text-purple-400 mb-2 flex items-center">
                                    <SparklesIcon className="h-4 w-4 mr-1.5" />
                                    Premium Avatars
                                </h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {PREMIUM_AVATARS.map(url => {
                                        const isPremium = currentUser.isPremium ?? false;
                                        return (
                                        <button key={url} onClick={() => isPremium && setAvatarUrl(url)} disabled={!isPremium} className={`relative rounded-full p-1 border-2 transition-all ${avatarUrl === url ? 'border-green-500' : 'border-transparent'} ${!isPremium ? 'cursor-not-allowed' : ''}`}>
                                            <img src={url} alt="Premium Avatar" className={`w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-800 transition-opacity ${!isPremium ? 'opacity-50' : ''}`} />
                                            {!isPremium && <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-2xl">🔒</div>}
                                        </button>
                                    )})}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bio Section */}
                     <div className="p-4 bg-white dark:bg-[#202225] rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About Me</h4>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="What's your gaming style? Favorite snacks? Anything goes!"
                            maxLength={190}
                            className="w-full h-24 bg-gray-50 dark:bg-[#2f3136] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                         <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{bio.length}/190</div>
                    </div>
                    {/* Favorite Games & Language Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="p-4 bg-white dark:bg-[#202225] rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Favorite Game Genres</h4>
                            <div className="flex flex-wrap gap-2 justify-start max-h-48 overflow-y-auto p-1">
                                {GAME_CATEGORIES.map(game => {
                                const isSelected = favoriteGames.includes(game);
                                return (
                                    <button
                                        key={game}
                                        onClick={() => toggleGame(game)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 border-2 ${
                                            isSelected 
                                            ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                                            : 'bg-gray-200 dark:bg-gray-700 border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-800 dark:text-gray-200'
                                        }`}
                                    >
                                        {game}
                                    </button>
                                )
                                })}
                            </div>
                        </div>
                         <div className="p-4 bg-white dark:bg-[#202225] rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Language</h4>
                             <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#2f3136] p-3 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 border-none"
                            >
                                {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
      case 'appearance':
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="bg-white dark:bg-[#202225] p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Color Mode</h4>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => onSetTheme('light')} className={`text-center p-2 rounded-lg border-2 ${currentTheme === 'light' ? 'border-green-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                        <div className="w-full h-20 bg-gray-100 border border-gray-300 rounded-md mb-2"></div>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">Light</span>
                    </button>
                    <button onClick={() => onSetTheme('dark')} className={`text-center p-2 rounded-lg border-2 ${currentTheme === 'dark' ? 'border-green-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                        <div className="w-full h-20 bg-[#2f3136] border border-[#1a1b26] rounded-md mb-2"></div>
                         <span className="font-medium text-sm text-gray-900 dark:text-white">Dark</span>
                    </button>
                </div>
            </div>
             <div className="bg-white dark:bg-[#202225] p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Background Theme</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {BASIC_THEMES.map(theme => (
                        <ThemePreview 
                            key={theme.id}
                            theme={theme}
                            isSelected={userTheme === theme.id}
                            isPremium={false}
                            isLocked={false}
                            onClick={() => onSetUserTheme(theme.id)}
                        />
                    ))}
                 </div>
                 <h4 className="font-semibold mb-3 text-gray-900 dark:text-white pt-4 border-t border-black/10 dark:border-white/10 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
                    Premium Themes
                </h4>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {PREMIUM_THEMES.map(theme => (
                        <ThemePreview 
                            key={theme.id}
                            theme={theme}
                            isSelected={userTheme === theme.id}
                            isPremium={true}
                            isLocked={!currentUser.isPremium}
                            onClick={() => onSetUserTheme(theme.id)}
                        />
                    ))}
                 </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h3>
                <div className="bg-white dark:bg-[#202225] rounded-lg">
                    <ToggleSwitch
                        checked={areNotificationsEnabled}
                        onChange={onToggleNotifications}
                        label="Enable Notification Sounds"
                        description="Play sounds for new messages and mentions."
                    />
                </div>
            </div>
        );
      case 'premium':
        return (
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">EchoLink Premium</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {currentUser.isPremium ? "You have unlocked all the perks. Thanks for your support!" : "Unlock exclusive perks and support the platform!"}
                </p>
                
                {currentUser.isPremium ? (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 rounded-lg text-center shadow-2xl">
                        <SparklesIcon className="h-12 w-12 text-white mx-auto mb-4" />
                        <h4 className="font-bold text-2xl text-white">You're a Premium Member!</h4>
                        <p className="text-purple-200 mt-2">Enjoy unrestricted access to all lobbies and your exclusive perks.</p>
                    </div>
                ) : (
                <>
                    <div className="bg-white dark:bg-[#202225] p-6 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Subscriber Benefits</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Access all password-protected lobbies</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Unlock premium background themes and avatars</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Custom profile badge and flair</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">Higher quality video & audio streaming</span>
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Weekly Plan */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">Weekly</h4>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white my-2">$5<span className="text-sm font-medium text-gray-500 dark:text-gray-400">/week</span></p>
                            <button onClick={() => onInitiatePayment('Weekly', '$5')} className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                                Subscribe
                            </button>
                        </div>

                        {/* Monthly Plan */}
                        <div className="relative border-2 border-purple-500 rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="absolute -top-3 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Best Value</div>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">Monthly</h4>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white my-2">$20<span className="text-sm font-medium text-gray-500 dark:text-gray-400">/month</span></p>
                            <button onClick={() => onInitiatePayment('Monthly', '$20')} className="w-full mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-gray-100 dark:bg-[#24273a] rounded-lg shadow-2xl w-full max-w-4xl mx-4 flex flex-col md:flex-row max-h-[90vh] h-full md:h-auto" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <nav className="w-full md:w-64 flex-shrink-0 bg-gray-200 dark:bg-[#1f202e] p-4 space-y-2 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col">
            <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 px-3 pt-2 pb-1">User Settings</div>
            <NavItem tabId="profile" icon={<UserIcon className="h-5 w-5 mr-3" />} label="My Profile" />
            <NavItem tabId="appearance" icon={<PaintBrushIcon className="h-5 w-5 mr-3" />} label="Appearance" />
            <NavItem tabId="notifications" icon={<BellIcon className="h-5 w-5 mr-3" />} label="Notifications" />
            <div className="pt-2 mt-auto border-t border-black/10 dark:border-white/10">
                 <NavItem tabId="premium" icon={<SparklesIcon className="h-5 w-5 mr-3" />} label="Premium" isPremium />
            </div>
        </nav>
        {/* Content */}
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 overflow-y-auto p-6 pb-24">
                {renderContent()}
            </div>
            {hasChanges && (
                 <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-[#1a1b26] p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-br-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">You have unsaved changes!</p>
                    <div className="flex space-x-2">
                        <button onClick={handleResetChanges} className="px-4 py-2 rounded-md text-sm text-gray-800 dark:text-white hover:underline">
                            Reset
                        </button>
                        <button onClick={handleSaveChanges} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
                <CloseIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;