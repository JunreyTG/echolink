import React from 'react';
import { CloseIcon } from './Icons';
import SnakeGame from './SnakeGame';

interface GamePlayModalProps {
  gameName: string;
  onClose: () => void;
}

const GamePlayModal: React.FC<GamePlayModalProps> = ({ gameName, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/70"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl mx-4 overflow-hidden border-2 border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-3 border-b border-white/10 bg-gray-900/50">
          <h2 className="text-lg font-bold text-white">Playing: {gameName}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white" aria-label="Close Game">
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <div className="p-4">
          {gameName === 'Snake' && <SnakeGame />}
        </div>
      </div>
    </div>
  );
};

export default GamePlayModal;