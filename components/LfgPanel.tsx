// Fix: Create the LfgPanel component.
import React, { useState } from 'react';
import { MenuIcon, SearchIcon, UserGroupIcon, TagIcon, TrashIcon, BellIcon } from './Icons';
import { User, LfgPost, Notification } from '../types';
import { GAME_CATEGORIES } from '../constants';

interface LfgPanelProps {
    currentUser: User;
    users: User[];
    lfgPosts: LfgPost[];
    onOpenCreatePost: () => void;
    onRequestToJoin: (post: LfgPost) => void;
    onToggleSidebar: () => void;
    onViewProfile: (user: User) => void;
    onSetDeletingPost: (post: LfgPost) => void;
    isNotificationPanelOpen: boolean;
    onToggleNotificationPanel: () => void;
    notifications: Notification[];
}

const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return "Just now";
};

const LfgPostCard: React.FC<{ post: LfgPost; author: User | undefined; onJoin: () => void; onViewProfile: (user:User) => void; isOwnPost: boolean; onDelete: () => void; }> = ({ post, author, onJoin, onViewProfile, isOwnPost, onDelete }) => {
  if (!author) return null;
  
  const spotsAvailable = post.spotsNeeded - post.spotsFilled + 1; // +1 for author
  const totalSpots = post.spotsNeeded + 1;

  return (
    <div className="bg-white dark:bg-[#2f3136] p-4 rounded-lg shadow-md border border-gray-200 dark:border-black/20 transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start">
            <div className="flex items-center min-w-0">
                <button onClick={() => onViewProfile(author)} className="flex-shrink-0">
                    <img src={author.avatarUrl} alt={author.username} className="h-12 w-12 rounded-full" />
                </button>
                <div className="ml-3 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{post.game}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hosted by <button onClick={() => onViewProfile(author)} className="font-semibold hover:underline">{author.username}</button>
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 ml-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-[#202225] px-2.5 py-1 rounded-full">{spotsAvailable} / {totalSpots} open</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{timeSince(post.createdAt)}</span>
            </div>
        </div>
        <div className="mt-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{post.title}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{post.description}</p>
        </div>
         {post.tags.length > 0 && (
            <div className="mt-3 flex items-center flex-wrap gap-2">
                 <TagIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs font-medium rounded-full">{tag}</span>
                ))}
            </div>
         )}
        <div className="mt-4 flex justify-end items-center space-x-2">
            {isOwnPost && (
                 <button
                    onClick={onDelete}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    aria-label="Delete post"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
            <button
                onClick={onJoin}
                disabled={isOwnPost}
                className="px-4 py-1.5 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 disabled:bg-gray-500 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-300 transition-colors"
            >
                {isOwnPost ? 'Your Post' : 'Request to Join'}
            </button>
        </div>
    </div>
  );
};

const LfgPanel: React.FC<LfgPanelProps> = ({ currentUser, users, lfgPosts, onOpenCreatePost, onRequestToJoin, onToggleSidebar, onViewProfile, onSetDeletingPost, onToggleNotificationPanel, notifications }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('All');
  
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const filteredPosts = lfgPosts.filter(post => {
      const searchMatch = post.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const gameMatch = gameFilter === 'All' || post.game === gameFilter;
      return searchMatch && gameMatch;
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#1a1b26]">
      <header className="flex-shrink-0 flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-white/10 shadow-md bg-white dark:bg-[#2f3136]">
        <div className="flex items-center min-w-0">
          <button onClick={onToggleSidebar} className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 mr-2 md:hidden" aria-label="Toggle sidebar">
            <MenuIcon className="h-6 w-6" />
          </button>
          <UserGroupIcon className="h-6 w-6 text-gray-500 dark:text-gray-500 mr-2" />
          <h2 className="font-semibold text-gray-900 dark:text-white truncate text-lg">Find Group</h2>
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

      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-black/20 bg-white dark:bg-[#2f3136]">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 w-full">
                <input
                    type="text"
                    placeholder="Search posts by game, title, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-[#202225] rounded-md py-2 pl-9 pr-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none border border-gray-200 dark:border-transparent focus:ring-1 focus:ring-green-500"
                />
                 <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="w-full sm:w-48 bg-gray-100 dark:bg-[#202225] rounded-md py-2 px-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none border border-gray-200 dark:border-transparent focus:ring-1 focus:ring-green-500"
            >
                <option value="All">All Games</option>
                {[...new Set(lfgPosts.map(p => p.game))].sort().map(game => (
                    <option key={game} value={game}>{game}</option>
                ))}
            </select>
            <button onClick={onOpenCreatePost} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 transition-colors flex-shrink-0">
                Create Post
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPosts.length > 0 ? filteredPosts.map(post => (
          <LfgPostCard
            key={post.id}
            post={post}
            author={users.find(u => u.id === post.authorId)}
            onJoin={() => onRequestToJoin(post)}
            onViewProfile={onViewProfile}
            isOwnPost={post.authorId === currentUser.id}
            onDelete={() => onSetDeletingPost(post)}
          />
        )) : (
            <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400 font-semibold">No groups found.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try adjusting your search or create a new post!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LfgPanel;