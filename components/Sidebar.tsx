import React from 'react';
import { Room } from '../types';
import { ROOM_CATEGORIES } from '../constants';
import { HashtagIcon, VolumeUpIcon, ChevronDownIcon } from './Icons';

interface SidebarProps {
  activeRoom: Room | null;
  onRoomSelect: (room: Room) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRoom, onRoomSelect }) => {
  return (
    <nav className="p-2 space-y-2">
      {ROOM_CATEGORIES.map(category => (
        <div key={category.id}>
          <div className="flex items-center px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <ChevronDownIcon className="h-4 w-4 mr-1" />
            {category.name}
          </div>
          <div className="mt-2 space-y-1">
            {category.rooms.map(room => {
              const isActive = activeRoom?.id === room.id;
              // Per the prompt, all inactive text channels are considered "unread"
              const isUnread = room.type === 'text' && !isActive;

              return (
                <button
                  key={room.id}
                  onClick={() => onRoomSelect(room)}
                  className={`w-full text-left flex items-center px-2 py-1.5 rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-700/50 text-white'
                      : isUnread
                      ? 'text-white hover:bg-gray-700/30 hover:text-gray-200'
                      : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                  }`}
                >
                  {room.type === 'text' ? (
                    <HashtagIcon className="h-5 w-5 mr-2 text-gray-500" />
                  ) : (
                    <VolumeUpIcon className="h-5 w-5 mr-2 text-gray-500" />
                  )}
                  <span className="font-medium">{room.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
