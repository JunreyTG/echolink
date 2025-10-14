// Fix: Create the CreateLobbyModal component.
import React, { useState } from 'react';
import { CloseIcon, KeyIcon } from './Icons';

interface CreateLobbyModalProps {
  onClose: () => void;
  onCreate: (details: { name: string; topic: string; password?: string }) => void;
}

const CreateLobbyModal: React.FC<CreateLobbyModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ name: name.trim(), topic: topic.trim(), password: password || undefined });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create Lobby</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="lobby-name" className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Lobby Name
            </label>
            <input
              id="lobby-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#202225] p-3 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lobby-topic" className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Topic (Optional)
            </label>
            <input
              id="lobby-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#202225] p-3 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
           <div className="mb-4">
            <label htmlFor="lobby-password" className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Password (Optional)
            </label>
            <div className="relative">
                 <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                 <input
                    id="lobby-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#202225] p-3 pl-10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-white hover:underline">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLobbyModal;
