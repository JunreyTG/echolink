import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface FindLobbyModalProps {
  onClose: () => void;
  onFind: (id: string) => { success: boolean; message: string };
}

const FindLobbyModal: React.FC<FindLobbyModalProps> = ({ onClose, onFind }) => {
  const [lobbyId, setLobbyId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lobbyId.trim()) {
      const result = onFind(lobbyId.trim());
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Join Lobby by ID</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Enter a Lobby ID to join. You can get this from a friend!</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="lobby-id" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
              Lobby ID
            </label>
            <input
              id="lobby-id"
              type="text"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              placeholder="room-167..."
              className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              autoFocus
            />
          </div>
           {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-800 dark:text-white hover:underline">
              Cancel
            </button>
            <button type="submit" disabled={!lobbyId.trim()} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
              Find & Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindLobbyModal;