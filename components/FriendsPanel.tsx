import React, { useState } from 'react';
import { User, UserStatus, Notification } from '../types';
import { statusColors } from '../constants';
import { MenuIcon, UserGroupIcon, SearchIcon, BellIcon } from './Icons';

interface UserListItemProps {
  user: User;
  onViewProfile: (user: User) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onViewProfile }) => {
    const isOffline = user.status === UserStatus.OFFLINE;
    const statusText = user.activity || user.status;

    return (
        <button onClick={() => onViewProfile(user)} className="w-full flex items-center p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-left border-t border-gray-200 dark:border-white/5">
            <div className="relative">
                <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 rounded-full" />
                <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${isOffline ? '' : 'bg-white dark:bg-[#1a1b26]'}`}>
                    <div className={`h-3 w-3 rounded-full border-2 border-white dark:border-[#1a1b26] ${statusColors[user.status]}`}></div>
                </div>
            </div>
            <div className="ml-4 flex-1 min-w-0">
                <div>
                    <span className={`font-semibold ${isOffline ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>{user.username}</span>
                    <span className="text-gray-500 dark:text-gray-400">#{user.discriminator}</span>
                </div>
                <p className={`text-sm truncate ${isOffline ? 'text-gray-500' : 'text-gray-500 dark:text-gray-400'}`} title={statusText}>
                    {statusText}
                </p>
            </div>
        </button>
    );
};


interface FriendsPanelProps {
    friends: User[];
    onAddFriend: (tag: string) => { success: boolean; message: string };
    onViewProfile: (user: User) => void;
    onToggleSidebar: () => void;
    isNotificationPanelOpen: boolean;
    onToggleNotificationPanel: () => void;
    notifications: Notification[];
}

const FriendsPanel: React.FC<FriendsPanelProps> = (props) => {
  const { friends, onAddFriend, onViewProfile, onToggleSidebar, onToggleNotificationPanel, notifications } = props;
  const [tag, setTag] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim()) return;
    const result = onAddFriend(tag);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setTag('');
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.discriminator.includes(searchQuery)
  );

  const onlineFriends = filteredFriends.filter(f => f.status !== UserStatus.OFFLINE);
  const offlineFriends = filteredFriends.filter(f => f.status === UserStatus.OFFLINE);

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex-shrink-0 flex items-center justify-between h-14 px-4 shadow-md border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center">
            <button onClick={onToggleSidebar} className="p-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white mr-2 md:hidden" aria-label="Toggle sidebar">
                <MenuIcon className="h-6 w-6" />
            </button>
            <UserGroupIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Friends</h2>
        </div>
        <button onClick={onToggleNotificationPanel} className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
            <BellIcon className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadNotificationCount}</span>
                </span>
            )}
        </button>
      </header>

      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold uppercase text-gray-900 dark:text-white mb-2">Add Friend</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">You can add a friend with their EchoLink Tag. It's cAsE sEnSiTiVe!</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center bg-gray-100 dark:bg-[#24273a] rounded-md shadow-sm sm:relative">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter a Username#0000"
            className="w-full bg-transparent p-3 sm:pr-48 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none"
          />
          <button type="submit" disabled={!tag.includes('#')} className="w-full sm:w-auto mt-2 sm:mt-0 sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-4 py-1.5 bg-green-500 text-white font-semibold rounded-md text-sm hover:bg-green-600 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            Send Friend Request
          </button>
        </form>
        {message && (
          <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
         <div className="px-4 pt-4 pb-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search Friends"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#24273a] rounded-md py-1.5 pl-8 pr-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 border border-gray-200 dark:border-transparent"
                    aria-label="Search friends"
                />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto px-4">
            <h4 className="px-2 mt-2 mb-1 text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Online — {onlineFriends.length}</h4>
            {onlineFriends.map(user => <UserListItem key={user.id} user={user} onViewProfile={onViewProfile} />)}

            <h4 className="px-2 mt-4 mb-1 text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Offline — {offlineFriends.length}</h4>
            {offlineFriends.map(user => <UserListItem key={user.id} user={user} onViewProfile={onViewProfile} />)}
         </div>
      </div>
    </div>
  );
};

export default FriendsPanel;
