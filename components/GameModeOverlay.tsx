import React, { useState, useRef, useEffect } from 'react';
import { User, Room } from '../types';
import { MicIcon, MicOffIcon, HeadsetIcon, HangUpIcon, CloseIcon, GamepadIcon, PlayIcon } from './Icons';

interface GameModeOverlayProps {
  room: Room;
  game: string;
  currentUser: User;
  usersInCall: User[];
  speakingUserId: string | null;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onLeaveLobby: () => void;
  onExitGameMode: () => void;
  onPlayGame: (game: string) => void;
}

const GameModeOverlay: React.FC<GameModeOverlayProps> = (props) => {
  const { room, game, currentUser, usersInCall, speakingUserId, isMuted, isDeafened, onToggleMute, onToggleDeafen, onLeaveLobby, onExitGameMode, onPlayGame } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const effectiveMute = isMuted || isDeafened;
  const isPlayable = game === 'Snake';

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      setIsDragging(true);
      const rect = overlayRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && overlayRef.current) {
        const rect = overlayRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;
        
        // Constrain to viewport
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isExpanded]);

  if (!isExpanded) {
    const isSomeoneSpeaking = !!speakingUserId && usersInCall.some(u => u.id === speakingUserId);
    return (
        <div
            ref={overlayRef}
            className="fixed z-[1000] select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
        >
            <button
                onClick={() => setIsExpanded(true)}
                onMouseDown={(e) => e.stopPropagation()} // Prevents drag from starting on click
                className={`w-16 h-16 rounded-full bg-gray-900/80 backdrop-blur-md flex items-center justify-center border-2 transition-all duration-200 ${isSomeoneSpeaking ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.7)]' : 'border-white/10'} hover:border-green-400`}
                aria-label="Expand Game Overlay"
            >
                <GamepadIcon className="h-8 w-8 text-white" />
            </button>
        </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed z-[1000] w-72 sm:w-80 bg-gray-900/80 backdrop-blur-md text-white rounded-lg shadow-2xl border border-white/10 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <button
          onClick={() => setIsExpanded(false)}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center min-w-0 p-1 -m-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
          aria-label="Collapse Overlay"
          title="Collapse Overlay"
        >
          <GamepadIcon className="h-5 w-5 mr-2 text-green-400" />
          <div className="truncate text-left">
            <h3 className="text-sm font-semibold truncate">{game}</h3>
            <p className="text-xs text-gray-400 truncate">{room.name}</p>
          </div>
        </button>
        <button
          onClick={onExitGameMode}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          aria-label="Exit Game Mode"
          title="Exit Game Mode"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* User List */}
      <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
        {usersInCall.map(user => (
          <div key={user.id} className="flex items-center">
            <div className={`relative p-0.5 rounded-full transition-all duration-200 ${user.id === speakingUserId ? 'bg-green-400' : 'bg-transparent'}`}>
              <img src={user.avatarUrl} alt={user.username} className="h-6 w-6 rounded-full" />
            </div>
            <span className="ml-2 text-sm truncate">{user.username}</span>
          </div>
        ))}
      </div>

      {/* Play Game Button */}
      {isPlayable && (
          <div className="p-2">
              <button 
                onClick={() => onPlayGame(game)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 transition-colors"
              >
                  <PlayIcon className="h-5 w-5 mr-2"/>
                  Play {game}
              </button>
          </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between p-2 bg-black/30 rounded-b-lg">
        <div className="flex items-center min-w-0">
          <img src={currentUser.avatarUrl} alt="You" className="h-8 w-8 rounded-full" />
          <p className="ml-2 font-semibold truncate">{currentUser.username}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleMute}
            onMouseDown={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-full cursor-pointer transition-colors ${effectiveMute ? 'bg-red-600' : 'hover:bg-white/10'}`}
            aria-label={effectiveMute ? "Unmute" : "Mute"}
          >
            {effectiveMute ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={onToggleDeafen}
            onMouseDown={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-full cursor-pointer transition-colors ${isDeafened ? 'bg-red-600' : 'hover:bg-white/10'}`}
            aria-label={isDeafened ? "Undeafen" : "Deafen"}
          >
            <HeadsetIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onLeaveLobby}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors"
            aria-label="Disconnect"
          >
            <HangUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeOverlay;