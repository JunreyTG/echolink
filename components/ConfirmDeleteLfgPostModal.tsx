import React from 'react';
import { LfgPost } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface ConfirmDeleteLfgPostModalProps {
  post: LfgPost;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteLfgPostModal: React.FC<ConfirmDeleteLfgPostModalProps> = ({ post, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Delete Post</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to permanently delete this post?</p>
        
        <div className="bg-gray-100 dark:bg-[#36393f] p-3 rounded-md border border-black/10 dark:border-black/20 mb-6">
            <div className="min-w-0">
                <p className="font-semibold text-green-600 dark:text-green-400">{post.game}</p>
                <p className="text-gray-800 dark:text-gray-200 mt-1 font-medium">{post.title}</p>
                {post.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{post.description}</p>}
            </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-800 dark:text-white hover:underline">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            <TrashIcon className="h-4 w-4 mr-1.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteLfgPostModal;
