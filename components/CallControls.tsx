import React, { useState } from 'react';
import { MicIcon, MicOffIcon, HeadsetIcon, HangUpIcon } from './Icons';

interface CallControlsProps {
  onLeave: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({ onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-2 rounded-full transition-colors ${
          isMuted
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
      </button>
      <button
        onClick={() => setIsDeafened(!isDeafened)}
        className="p-2 rounded-full text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
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