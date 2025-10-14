

import React, { useState } from 'react';
import { User } from '../types';
import { MicIcon, MicOffIcon, HeadsetIcon, CogIcon, LogoutIcon } from './Icons';
import { statusColors } from '../constants';

interface UserPanelProps {
  user: User;
  onLogout: () => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ user, onLogout }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  return (
    <div className="flex items-center justify-between p-2 bg-[#1f202e]">
      <div className="flex items-center min-w-0">
        <div className="relative">
          <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 rounded-full" />
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#1f202e] p-0.5 rounded-full">
            <div className={`h-3 w-3 ${statusColors[user.status]} rounded-full border-2 border-[#1f202e]`}></div>
          </div>
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user.username}</p>
          <p className="text-xs text-gray-400 truncate">#{user.discriminator}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 rounded-full text-gray-300 hover:bg-white/10 hover:text-gray-100 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setIsDeafened(!isDeafened)}
          className="p-1.5 rounded-full text-gray-300 hover:bg-white/10 hover:text-gray-100 transition-colors"
          aria-label={isDeafened ? "Undeafen" : "Deafen"}
        >
          <HeadsetIcon className="h-5 w-5" />
        </button>
        <button
          className="p-1.5 rounded-full text-gray-300 hover:bg-white/10 hover:text-gray-100 transition-colors"
          aria-label="User Settings"
        >
          <CogIcon className="h-5 w-5" />
        </button>
         <button
          onClick={onLogout}
          className="p-1.5 rounded-full text-gray-300 hover:bg-red-500/50 hover:text-white transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default UserPanel;