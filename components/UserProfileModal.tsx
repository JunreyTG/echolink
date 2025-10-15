import React from 'react';
import { User } from '../types';
import { statusColors } from '../constants';
import { CloseIcon, SparklesIcon } from './Icons';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-[#202225] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-24 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"></div>
           {user.flairUrl && (
            <img src={user.flairUrl} alt="Profile Flair" className="absolute top-0 left-0 w-full h-full object-cover opacity-40 pointer-events-none" />
          )}
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white" aria-label="Close profile">
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="absolute top-14 left-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="h-24 w-24 rounded-full border-4 border-white dark:border-[#202225]"
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#202225] p-0.5 rounded-full">
                <div className={`h-5 w-5 ${statusColors[user.status]} rounded-full border-4 border-white dark:border-[#202225]`}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-16 p-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {user.username}
            <span className="text-lg text-gray-500 dark:text-gray-400">#{user.discriminator}</span>
          </h2>
           <div className="flex items-center flex-wrap gap-2 mt-2">
            {user.isPremium && (
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold rounded-full">
                    <SparklesIcon className="h-4 w-4 mr-1.5" />
                    Premium Member
                </div>
            )}
            {user.badge && (
                <div className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-full">
                    {user.badge}
                </div>
            )}
           </div>
          {user.activity && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{user.activity}</p>}

          <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">About Me</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio || 'This user prefers to be mysterious.'}</p>
          </div>

          {user.favoriteGames && user.favoriteGames.length > 0 && (
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
              <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Favorite Games</h3>
              <div className="flex flex-wrap gap-2">
                {user.favoriteGames.map(game => (
                  <span key={game} className="px-2 py-1 bg-gray-200 dark:bg-gray-700/80 text-sm text-gray-800 dark:text-gray-200 rounded-md">
                    {game}
                  </span>
                ))}
              </div>
            </div>
          )}

           {user.memberSince && (
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">EchoLink Member Since</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{new Date(user.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;