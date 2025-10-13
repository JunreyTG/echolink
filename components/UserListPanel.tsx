import React, { useState } from 'react';
import { User, UserStatus } from '../types';
import { FRIENDS, statusColors } from '../constants';
import { SearchIcon } from './Icons';

const UserListItem: React.FC<{ user: User }> = ({ user }) => {
  const isOffline = user.status === UserStatus.OFFLINE;

  // Display user's activity if available, otherwise fall back to their general status.
  const statusText = user.activity || user.status;

  return (
    <div className="flex items-center px-2 py-2 rounded-md hover:bg-gray-700/50 cursor-pointer">
      <div className="relative">
        <img src={user.avatarUrl} alt={user.username} className="h-8 w-8 rounded-full" />
        <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${isOffline ? '' : 'bg-[#2f3136]'}`}>
            <div className={`h-2.5 w-2.5 rounded-full border-2 border-[#2f3136] ${statusColors[user.status]}`}></div>
        </div>
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className={`text-sm font-medium ${isOffline ? 'text-gray-500' : 'text-gray-200'}`}>{user.username}</p>
        {!isOffline && (
          <p className="text-xs text-gray-400" title={statusText}>
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
};

const UserListPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = FRIENDS.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(f => f.status !== UserStatus.OFFLINE);
  const offlineFriends = filteredFriends.filter(f => f.status === UserStatus.OFFLINE);

  return (
    <aside className="w-64 bg-[#2f3136] p-2 flex flex-col flex-shrink-0">
      <div className="px-2 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#202225] rounded-md py-1.5 pl-8 pr-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none"
            aria-label="Search friends"
          />
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h3 className="px-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Online — {onlineFriends.length}</h3>
        <div className="mt-2 space-y-1">
          {onlineFriends.map(friend => <UserListItem key={friend.id} user={friend} />)}
        </div>

        <h3 className="mt-4 px-2 text-xs font-bold uppercase text-gray-400 tracking-wider">Offline — {offlineFriends.length}</h3>
        <div className="mt-2 space-y-1">
          {offlineFriends.map(friend => <UserListItem key={friend.id} user={friend} />)}
        </div>
      </div>
    </aside>
  );
};

export default UserListPanel;