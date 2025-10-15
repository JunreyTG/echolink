


import React from 'react';
import { User } from '../types';
import { MicIcon, MicOffIcon, HeadsetIcon, CogIcon, LogoutIcon, SparklesIcon } from './Icons';
import { statusColors } from '../constants';

interface UserPanelProps {
  user: User;
  onLogout: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onOpenSettings: () => void;
  onViewProfile: (user: User) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ user, onLogout, isMuted, isDeafened, onToggleMute, onToggleDeafen, onOpenSettings, onViewProfile }) => {
  const effectiveMute = isMuted || isDeafened;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-200 dark:bg-[#1f202e]">
      <button
        onClick={() => onViewProfile(user)}
        className="flex items-center min-w-0 rounded-md p-1 -m-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-1 text-left"
        aria-label="View your profile"
      >
        <div className="relative">
          <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 rounded-full" />
          <div className="absolute -bottom-0.5 -right-0.5 bg-gray-200 dark:bg-[#1f202e] p-0.5 rounded-full">
            <div className={`h-3 w-3 ${statusColors[user.status]} rounded-full border-2 border-gray-200 dark:border-[#1f202e]`}></div>
          </div>
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.username}</p>
            {user.isPremium && <SparklesIcon className="h-4 w-4 ml-1 text-purple-500 dark:text-purple-400 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">#{user.discriminator}</p>
        </div>
      </button>
      <div className="flex items-center space-x-1 ml-2">
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label={effectiveMute ? "Unmute" : "Mute"}
        >
          {effectiveMute ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
        </button>
        <button
          onClick={onToggleDeafen}
          className="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label={isDeafened ? "Undeafen" : "Deafen"}
        >
          <HeadsetIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="User Settings"
        >
          <CogIcon className="h-5 w-5" />
        </button>
         <button
          onClick={onLogout}
          className="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-red-500/80 hover:text-white transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default UserPanel;