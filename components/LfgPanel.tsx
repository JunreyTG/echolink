// Fix: Create the LfgPanel component.
import React from 'react';
import { MenuIcon, SearchIcon, UserGroupIcon } from './Icons';
import { User } from '../types';

interface LfgPanelProps {
    onToggleSidebar: () => void;
    currentUser: User;
}

const LfgPanel: React.FC<LfgPanelProps> = ({ onToggleSidebar, currentUser }) => {
  
  // Mock data for LFG posts
  const lfgPosts = [
    { id: '1', game: 'Valheim', description: 'Need 2 more for boss fight!', spots: '3/5', author: 'VikingGamer' },
    { id: '2', game: 'Apex Legends', description: 'Chill ranked grind, plat+', spots: '1/3', author: 'WraithMain' },
    { id: '3', game: 'Among Us', description: 'Lobby for fun, no toxicity', spots: '8/10', author: 'Imposter' },
    { id: '4', game: 'League of Legends', description: 'ARAM and chill', spots: '2/5', author: 'TeemoFan' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      <header className="flex-shrink-0 flex items-center justify-between h-12 px-4 border-b border-black/20 shadow-md">
        <div className="flex items-center min-w-0">
          <button onClick={onToggleSidebar} className="p-1 rounded-md text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 mr-2 md:hidden" aria-label="Toggle sidebar">
            <MenuIcon className="h-6 w-6" />
          </button>
          <UserGroupIcon className="h-6 w-6 text-gray-500 mr-2" />
          <h2 className="font-semibold text-white truncate">Find Group (LFG)</h2>
        </div>
      </header>

      <div className="flex-shrink-0 p-4 border-b border-black/20">
        <div className="flex items-center space-x-4">
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Search by game..."
                    className="w-full bg-[#202225] rounded-md py-1.5 pl-8 pr-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none"
                />
                 <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button className="px-4 py-1.5 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 transition-colors flex-shrink-0">
                Create Post
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {lfgPosts.map(post => (
          <div key={post.id} className="bg-[#2f3136] p-4 rounded-lg shadow-md border border-black/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-white">{post.game}</h3>
                <p className="text-sm text-gray-400">by {post.author}</p>
              </div>
              <span className="text-sm font-semibold text-gray-300 bg-[#202225] px-2 py-1 rounded-md">{post.spots}</span>
            </div>
            <p className="text-gray-200 mt-2">{post.description}</p>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-1.5 bg-green-600/80 text-white font-semibold rounded-md text-sm hover:bg-green-600 transition-colors">
                Request to Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LfgPanel;