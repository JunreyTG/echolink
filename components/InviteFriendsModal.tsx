import React, { useState } from 'react';
import { Room, User, UserStatus } from '../types';
import { CloseIcon, SearchIcon, UserPlusIcon, CheckIcon } from './Icons';
import { statusColors } from '../constants';

interface InviteFriendsModalProps {
  lobby: Room;
  friends: User[];
  users: User[];
  voiceStates: Record<string, string | null>;
  onClose: () => void;
  onInvite: (userId: string, roomId: string) => { success: boolean; message: string };
}

const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({ lobby, friends, users, voiceStates, onClose, onInvite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [sentInvites, setSentInvites] = useState<Set<string>>(new Set());
  const [idInviteError, setIdInviteError] = useState<string | null>(null);

  const usersInLobbyIds = new Set(Object.keys(voiceStates).filter(userId => voiceStates[userId] === lobby.id));

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleInvite = (userId: string) => {
    const result = onInvite(userId, lobby.id);
    if (result.success) {
        setSentInvites(prev => new Set(prev).add(userId));
        setTimeout(() => {
            setSentInvites(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }, 2000);
    }
  };
  
  const handleInviteByIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIdInviteError(null);
    const tag = userIdInput.trim();
    if (!tag.includes('#')) {
        setIdInviteError("Invalid format. Please use Username#1234.");
        return;
    }

    const [username, discriminator] = tag.split('#');
    const userToInvite = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.discriminator === discriminator
    );

    if (userToInvite) {
        if (usersInLobbyIds.has(userToInvite.id)) {
            setIdInviteError("This user is already in the lobby.");
        } else {
            handleInvite(userToInvite.id);
            setUserIdInput('');
        }
    } else {
        setIdInviteError("User not found.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 border-b border-black/10 dark:border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">Invite Friends to Lobby</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lobby.name}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search friends"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#202225] rounded-md py-1.5 pl-8 pr-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 border border-transparent"
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredFriends.length > 0 ? filteredFriends.map(friend => {
                const isInLobby = usersInLobbyIds.has(friend.id);
                const hasBeenInvited = sentInvites.has(friend.id);
                const isDisabled = isInLobby || hasBeenInvited;

                return (
                    <div key={friend.id} className="flex items-center justify-between p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                        <div className="flex items-center min-w-0">
                            <div className="relative">
                                <img src={friend.avatarUrl} alt={friend.username} className="h-8 w-8 rounded-full" />
                                <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${friend.status === UserStatus.OFFLINE ? '' : 'bg-white dark:bg-[#2f3136]'}`}>
                                    <div className={`h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#2f3136] ${statusColors[friend.status]}`}></div>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{friend.username}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{friend.status}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleInvite(friend.id)}
                            disabled={isDisabled}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center w-24 ${
                                isInLobby ? 'bg-transparent text-gray-500 dark:text-gray-400' :
                                hasBeenInvited ? 'bg-green-600 text-white' :
                                'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {isInLobby ? 'In Lobby' : hasBeenInvited ? <CheckIcon className="h-4 w-4" /> : 'Invite'}
                        </button>
                    </div>
                );
            }) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No friends found.</p>
            )}
        </div>
        
        <div className="flex-shrink-0 p-4 border-t border-black/10 dark:border-white/10">
             <form onSubmit={handleInviteByIdSubmit}>
                <label htmlFor="user-id-invite" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Invite with EchoLink Tag™</label>
                <div className="relative flex items-center">
                    <input
                        id="user-id-invite"
                        type="text"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        placeholder="Vortex#1234"
                        className="w-full bg-gray-100 dark:bg-[#202225] p-2 pr-24 rounded-md text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 border border-transparent"
                    />
                    <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-600 text-white font-semibold rounded-md text-xs hover:bg-green-700 disabled:bg-gray-500 transition-colors">
                        Invite
                    </button>
                </div>
                 {idInviteError && <p className="text-red-500 text-xs mt-1">{idInviteError}</p>}
             </form>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsModal;
