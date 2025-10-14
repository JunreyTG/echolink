import React from 'react';
import { Message } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface ConfirmDeleteModalProps {
  message: Message;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Delete Message</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-300 mb-4">Are you sure you want to delete this message?</p>
        
        <div className="bg-[#36393f] p-3 rounded-md border border-black/20 mb-6">
            <div className="flex items-start">
                <img src={message.author.avatarUrl} alt={message.author.username} className="h-10 w-10 rounded-full mr-3"/>
                <div className="min-w-0">
                    <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-green-400">{message.author.username}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-200 mt-1 whitespace-pre-wrap break-words">{message.content}</p>
                </div>
            </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-white hover:underline">
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

export default ConfirmDeleteModal;
