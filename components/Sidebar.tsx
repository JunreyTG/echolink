import React from 'react';
import { Room, RoomCategory, User, UserStatus } from '../types';
import { HashtagIcon, VolumeUpIcon, ChevronDownIcon, UserGroupIcon, PlusIcon, DoorEnterIcon, CompassIcon } from './Icons';
import { statusColors } from '../constants';

type View = { type: 'room'; id: string } | { type: 'friends'; id: 'friends' } | { type: 'dm'; id: string } | { type: 'lfg'; id: 'lfg' };

interface SidebarProps {
  currentUser: User;
  friends: User[];
  activeView: View;
  onViewSelect: (view: View) => void;
  roomCategories: RoomCategory[];
  onJoinLobby: (roomId: string) => void;
  onOpenCreateLobby: () => void;
  onOpenFindLobby: () => void;
  users: User[];
  voiceStates: Record<string, string | null>;
  lobbyNicknames: Record<string, Record<string, string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, friends, activeView, onViewSelect, roomCategories, onJoinLobby, onOpenCreateLobby, onOpenFindLobby, users, voiceStates, lobbyNicknames }) => {

  const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ icon, label, isActive, onClick }) => (
     <button
        onClick={onClick}
        className={`relative w-full text-left flex items-center px-3 py-2 rounded-md transition-colors duration-150 group ${
          isActive
            ? 'bg-white/5 text-white'
            : 'text-gray-300 hover:bg-white/5 hover:text-gray-100'
        }`}
      >
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-green-400 transition-transform scale-y-0 group-hover:scale-y-50 ${isActive ? 'scale-y-100' : ''}`}></div>
        {icon}
        <span className="font-semibold">{label}</span>
      </button>
  );

  return (
    <nav className="flex-1 space-y-4 overflow-y-auto p-2">
      <div>
        <NavButton
          icon={<UserGroupIcon className="h-5 w-5 mr-3 text-gray-400" />}
          label="Friends"
          isActive={activeView.type === 'friends'}
          onClick={() => onViewSelect({ type: 'friends', id: 'friends' })}
        />
         <NavButton
          icon={<CompassIcon className="h-5 w-5 mr-3 text-gray-400" />}
          label="Find Group"
          isActive={activeView.type === 'lfg'}
          onClick={() => onViewSelect({ type: 'lfg', id: 'lfg' })}
        />
      </div>
      
      {roomCategories.map(category => (
        <div key={category.id}>
          <div className="flex items-center justify-between px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="flex items-center">
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              {category.name}
            </div>
            {category.name === 'Voice Channels' && (
              <div className="flex items-center space-x-1">
                 <button onClick={onOpenFindLobby} className="p-1 text-gray-400 hover:text-white" aria-label="Join Lobby">
                  <DoorEnterIcon className="h-4 w-4" />
                </button>
                <button onClick={onOpenCreateLobby} className="p-1 text-gray-400 hover:text-white" aria-label="Create Lobby">
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 space-y-1">
            {category.rooms.map(room => {
              const isActive = activeView.type === 'room' && activeView.id === room.id;
              const isVoice = room.type === 'voice';
              const usersInRoom = isVoice ? users.filter(u => voiceStates[u.id] === room.id) : [];

              const handleClick = () => {
                if (isVoice) {
                  onJoinLobby(room.id);
                } else {
                  onViewSelect({ type: 'room', id: room.id });
                }
              };

              return (
                <div key={room.id}>
                  <button
                    onClick={handleClick}
                    className={`relative w-full text-left flex items-center px-3 py-1.5 rounded-md transition-colors duration-150 group ${
                      isActive
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                    }`}
                  >
                     <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-green-400 transition-transform scale-y-0 group-hover:scale-y-50 ${isActive ? 'scale-y-100' : ''}`}></div>
                    {isVoice ? 
                      <VolumeUpIcon className="h-5 w-5 mr-3 text-gray-500" /> : 
                      <HashtagIcon className="h-5 w-5 mr-3 text-gray-500" />
                    }
                    <span className="font-medium">{room.name}</span>
                  </button>
                  {isVoice && usersInRoom.length > 0 && (
                    <div className="pl-8 pr-2 py-1 space-y-2">
                      {usersInRoom.map(user => {
                         const nickname = lobbyNicknames[room.id]?.[user.id];
                         const displayName = nickname || user.username;
                        return (
                          <div key={user.id} className="flex items-center text-sm text-gray-300">
                            <img src={user.avatarUrl} alt={user.username} className="h-5 w-5 rounded-full mr-2" />
                            <span className="truncate">{displayName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div>
        <div className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Messages</div>
        <div className="space-y-1">
          {friends.map(friend => {
            const isActive = activeView.type === 'dm' && activeView.id === friend.id;
            return (
              <button
                key={friend.id}
                onClick={() => onViewSelect({ type: 'dm', id: friend.id })}
                className={`relative w-full text-left flex items-center px-2 py-1 rounded-md transition-colors duration-150 group ${
                  isActive
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                }`}
              >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-green-400 transition-transform scale-y-0 group-hover:scale-y-50 ${isActive ? 'scale-y-100' : ''}`}></div>
                <div className="relative mr-2">
                  <img src={friend.avatarUrl} alt={friend.username} className="h-8 w-8 rounded-full" />
                  <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${friend.status === UserStatus.OFFLINE ? '' : 'bg-[#24273a]'}`}>
                      <div className={`h-2.5 w-2.5 rounded-full border-2 border-[#24273a] ${statusColors[friend.status]}`}></div>
                  </div>
                </div>
                <span className="font-medium flex-1 truncate">{friend.username}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;