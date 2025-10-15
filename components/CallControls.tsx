
import React from 'react';
import { MicIcon, MicOffIcon, HeadsetIcon, HangUpIcon, CameraIcon, CameraOffIcon, ScreenShareIcon } from './Icons';

interface CallControlsProps {
  onLeave: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  isStreamingGame: boolean;
  onToggleStreamGame: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({ 
    onLeave, 
    isMuted, 
    isDeafened, 
    onToggleMute, 
    onToggleDeafen, 
    isCameraOn, 
    onToggleCamera,
    isStreamingGame,
    onToggleStreamGame
}) => {
  const effectiveMute = isMuted || isDeafened;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggleCamera}
        className={`p-2 rounded-full transition-colors ${
          !isCameraOn
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white'
        }`}
        aria-label={!isCameraOn ? "Turn camera on" : "Turn camera off"}
      >
        {!isCameraOn ? <CameraOffIcon className="h-5 w-5" /> : <CameraIcon className="h-5 w-5" />}
      </button>
       <button
        onClick={onToggleStreamGame}
        className={`p-2 rounded-full transition-colors ${
          isStreamingGame
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white'
        }`}
        aria-label={isStreamingGame ? "Stop streaming" : "Stream game"}
      >
        <ScreenShareIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onToggleMute}
        className={`p-2 rounded-full transition-colors ${
          effectiveMute
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white'
        }`}
        aria-label={effectiveMute ? "Unmute" : "Mute"}
      >
        {effectiveMute ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
      </button>
      <button
        onClick={onToggleDeafen}
        className={`p-2 rounded-full transition-colors ${
            isDeafened 
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white'
        }`}
        aria-label={isDeafened ? "Undeafen" : "Deafen"}
      >
        <HeadsetIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onLeave}
        className="p-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors"
        aria-label="Disconnect"
      >
        <HangUpIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CallControls;