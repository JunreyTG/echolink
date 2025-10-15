import React from 'react';
import { User, Room } from '../types';
import { CloseIcon, UserRemoveIcon, VolumeOffIcon, VolumeUpIcon } from './Icons';

interface VoiceUserActionModalProps {
  user: User;
  room: Room;
  isMuted: boolean;
  onClose: () => void;
  onKick: () => void;
  onToggleMute: () => void;
}

const VoiceUserActionModal: React.FC<VoiceUserActionModalProps> = ({ user, room, isMuted, onClose, onKick, onToggleMute }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-xs mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center">
            <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 rounded-full mr-3"/>
            <div className="min-w-0">
                <p className="font-semibold text-black dark:text-white truncate">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">#{user.discriminator}</p>
            </div>
             <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 ml-auto" aria-label="Close">
                <CloseIcon className="h-5 w-5" />
            </button>
        </div>
        <div className="p-2">
            <button 
              onClick={onToggleMute} 
              className={`w-full text-left flex items-center px-3 py-2 rounded-md transition-colors duration-150 group ${isMuted ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-400/10 dark:hover:bg-yellow-500/10' : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
                {isMuted ? <VolumeUpIcon className="h-5 w-5 mr-3"/> : <VolumeOffIcon className="h-5 w-5 mr-3"/>}
                <span className="font-medium">{isMuted ? 'Unmute User' : 'Mute User'}</span>
            </button>
             <button 
                onClick={onKick} 
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors duration-150 group"
             >
                <UserRemoveIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Kick from Lobby</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceUserActionModal;