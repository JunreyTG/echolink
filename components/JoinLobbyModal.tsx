import React, { useState } from 'react';
import { Room } from '../types';
import { CloseIcon, EyeIcon, EyeSlashIcon, KeyIcon } from './Icons';

interface JoinLobbyModalProps {
  lobby: Room;
  error: string | null;
  onClose: () => void;
  onJoin: (password: string) => void;
}

const JoinLobbyModal: React.FC<JoinLobbyModalProps> = ({ lobby, error, onClose, onJoin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      onJoin(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white">Enter Password</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-300 mb-4">The lobby <span className="font-semibold text-white">"{lobby.name}"</span> is password protected.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="lobby-password-join" className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Lobby Password
            </label>
            <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    id="lobby-password-join"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#202225] p-3 pl-10 pr-10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    autoFocus
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-white hover:underline">
              Cancel
            </button>
            <button type="submit" disabled={!password.trim()} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
              Join Lobby
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinLobbyModal;