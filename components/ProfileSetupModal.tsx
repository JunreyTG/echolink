import React, { useState } from 'react';
import { User } from '../types';
import { GAME_CATEGORIES, LANGUAGES, BASIC_AVATARS, PREMIUM_AVATARS } from '../constants';
import { SparklesIcon } from './Icons';

interface ProfileSetupModalProps {
  user: User;
  onSubmit: (details: { bio: string; favoriteGames: string[]; language: string; avatarUrl: string; }) => void;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ user, onSubmit }) => {
  const [bio, setBio] = useState('');
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [language, setLanguage] = useState('en');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [step, setStep] = useState(1);

  const toggleGame = (game: string) => {
    setFavoriteGames(prev =>
      prev.includes(game) ? prev.filter(g => g !== game) : [...prev, game]
    );
  };

  const handleFinish = () => {
    onSubmit({
      bio: bio.trim(),
      favoriteGames: favoriteGames,
      language: language,
      avatarUrl: avatarUrl
    });
  };

  const totalSteps = 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#202225]" aria-modal="true" role="dialog">
      <div className="bg-gray-100 dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <img src={avatarUrl} alt={user.username} className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-gray-300 dark:border-gray-800" />
            <h1 className="text-3xl font-bold text-black dark:text-white">Welcome, {user.username}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Let's set up your profile so others can get to know you.</p>
          </div>
          
          {/* Step Indicator */}
           <div className="flex items-center justify-center mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-2.5 flex-1 transition-colors ${i === 0 ? 'rounded-l-full' : ''} ${i === totalSteps - 1 ? 'rounded-r-full' : ''} ${step > i ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2 text-center">Tell us about yourself</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Write a short bio. You can always change this later.</p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What's your gaming style? Favorite snacks? Anything goes!"
                maxLength={190}
                className="w-full h-28 bg-white dark:bg-[#202225] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{bio.length}/190</div>
            </div>
          )}

          {step === 2 && (
             <div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2 text-center">What do you play?</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Select a few of your favorite game genres.</p>
              <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2 bg-white dark:bg-[#202225] rounded-md">
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
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2 text-center">Select Your Language</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">This helps us connect you with the right players.</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white dark:bg-[#202225] p-3 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 border-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          )}

          {step === 4 && (
            <div>
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2 text-center">Choose Your Avatar</h2>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Pick an avatar that represents you!</p>
                <div className="space-y-4 max-h-60 overflow-y-auto p-2">
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Basic Avatars</h3>
                        <div className="grid grid-cols-6 gap-2">
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
                        <div className="grid grid-cols-6 gap-2">
                            {PREMIUM_AVATARS.map(url => {
                                const isPremium = user.isPremium ?? false;
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
          )}
          
          {step === 5 && (
             <div className="text-center">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">All Set!</h2>
              <p className="text-gray-500 dark:text-gray-400">You're ready to connect with other players on EchoLink.</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Click Finish to jump into the action.</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-200 dark:bg-[#292b2f] p-4 flex justify-between items-center">
          {step > 1 ? (
             <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 rounded-md text-black dark:text-white hover:underline">
              Back
            </button>
          ) : <div></div>}
         
          {step < totalSteps ? (
            <button onClick={() => setStep(s => s + 1)} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
              Continue
            </button>
          ) : (
             <button onClick={handleFinish} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;