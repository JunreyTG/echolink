import React, { useState } from 'react';
import { User, LfgPost } from '../types';
import { CloseIcon, TagIcon } from './Icons';
import { GAME_CATEGORIES } from '../constants';

interface CreateLfgPostModalProps {
  currentUser: User;
  onClose: () => void;
  onCreate: (details: Omit<LfgPost, 'id' | 'authorId' | 'createdAt' | 'spotsFilled'>) => void;
}

const CreateLfgPostModal: React.FC<CreateLfgPostModalProps> = ({ currentUser, onClose, onCreate }) => {
  const [game, setGame] = useState(GAME_CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spotsNeeded, setSpotsNeeded] = useState(2);
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate({
        game,
        title: title.trim(),
        description: description.trim(),
        spotsNeeded,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 border-b border-black/10 dark:border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-black dark:text-white">Create a Group Post</h2>
            <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="lfg-game" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
              Game
            </label>
            <select
              id="lfg-game"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 border-none"
            >
              {GAME_CATEGORIES.sort().map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lfg-title" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
              Title
            </label>
            <input
              id="lfg-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chill ranked grind"
              maxLength={60}
              className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
             <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{title.length}/60</div>
          </div>
          <div>
            <label htmlFor="lfg-description" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="lfg-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Looking for a consistent third to climb. Mic required."
              maxLength={200}
              className="w-full h-24 bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{description.length}/200</div>
          </div>
          <div>
            <label htmlFor="lfg-tags" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
              Tags (Optional)
            </label>
            <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                 <input
                    id="lfg-tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Competitive, Casual, Ranked"
                    className="w-full bg-gray-100 dark:bg-[#202225] p-3 pl-10 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate tags with a comma.</p>
          </div>
           <div>
              <div className="flex items-center justify-between">
                  <label htmlFor="spots-needed" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                      Spots to Fill
                  </label>
                  <span className="text-sm font-semibold text-black dark:text-white">{spotsNeeded} (+ you)</span>
              </div>
              <input
                  id="spots-needed"
                  type="range"
                  min="1"
                  max="9"
                  value={spotsNeeded}
                  onChange={(e) => setSpotsNeeded(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 mt-2"
              />
           </div>
        </div>
        
        <div className="flex-shrink-0 flex justify-end space-x-2 p-4 bg-gray-200 dark:bg-[#292b2f] border-t border-black/10 dark:border-black/20">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-800 dark:text-white hover:underline">
            Cancel
          </button>
          <button type="submit" disabled={!title.trim()} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLfgPostModal;
