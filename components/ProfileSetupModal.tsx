import React, { useState } from 'react';
import { User } from '../types';
import { GAME_CATEGORIES } from '../constants';

interface ProfileSetupModalProps {
  user: User;
  onSubmit: (details: { bio: string; favoriteGames: string[] }) => void;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ user, onSubmit }) => {
  const [bio, setBio] = useState('');
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
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
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202225]" aria-modal="true" role="dialog">
      <div className="bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <img src={user.avatarUrl} alt={user.username} className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-gray-800" />
            <h1 className="text-3xl font-bold text-white">Welcome, {user.username}!</h1>
            <p className="text-gray-400">Let's set up your profile so others can get to know you.</p>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`h-2.5 w-1/3 rounded-l-full transition-colors ${step >= 1 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`h-2.5 w-1/3 transition-colors ${step >= 2 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`h-2.5 w-1/3 rounded-r-full transition-colors ${step >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Tell us about yourself</h2>
              <p className="text-center text-sm text-gray-400 mb-4">Write a short bio. You can always change this later.</p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What's your gaming style? Favorite snacks? Anything goes!"
                maxLength={190}
                className="w-full h-28 bg-[#202225] p-3 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{bio.length}/190</div>
            </div>
          )}

          {step === 2 && (
             <div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">What do you play?</h2>
              <p className="text-center text-sm text-gray-400 mb-4">Select a few of your favorite game genres.</p>
              <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2 bg-[#202225] rounded-md">
                {GAME_CATEGORIES.map(game => {
                  const isSelected = favoriteGames.includes(game);
                  return (
                     <button
                      key={game}
                      onClick={() => toggleGame(game)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 border-2 ${
                        isSelected 
                        ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                        : 'bg-gray-700 border-transparent hover:border-gray-500 text-gray-200'
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
             <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">All Set!</h2>
              <p className="text-gray-400">You're ready to connect with other players on EchoLink.</p>
              <p className="text-gray-400 mt-2">Click Finish to jump into the action.</p>
            </div>
          )}
        </div>
        
        <div className="bg-[#292b2f] p-4 flex justify-between items-center">
          {step > 1 ? (
             <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 rounded-md text-white hover:underline">
              Back
            </button>
          ) : <div></div>}
         
          {step < 3 ? (
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
