import React, { useState } from 'react';
import { MicIcon, MicOffIcon, HeadsetIcon, HangUpIcon, CameraIcon, CameraOffIcon, ScreenShareIcon, ChevronLeftIcon, GamepadIcon, UserPlusIcon, CogIcon, TrashIcon, BellIcon } from './Icons';

interface LobbyControlsSidebarProps {
  onLeave: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  isStreamingGame: boolean;
  onToggleStreamGame: () => void;
  isGameAvailable: boolean;
  onEnterGameMode: () => void;
  onInvite: () => void;
  isOwner: boolean;
  onSettings: () => void;
  onDelete: () => void;
  onToggleNotificationPanel: () => void;
  unreadNotificationCount: number;
}

const LobbyControlsSidebar: React.FC<LobbyControlsSidebarProps> = (props) => {
    const { 
        onLeave, isMuted, isDeafened, onToggleMute, onToggleDeafen, 
        isCameraOn, onToggleCamera, isStreamingGame, onToggleStreamGame,
        isGameAvailable, onEnterGameMode, onInvite, isOwner, onSettings, onDelete,
        onToggleNotificationPanel, unreadNotificationCount
    } = props;
    const [isOpen, setIsOpen] = useState(false);

    const effectiveMute = isMuted || isDeafened;

    const ControlButton: React.FC<{
        onClick: () => void;
        isActive?: boolean;
        isDestructive?: boolean;
        ariaLabel: string;
        children: React.ReactNode;
    }> = ({ onClick, isActive, isDestructive, ariaLabel, children }) => {
        let bgClass = 'bg-gray-700/50 hover:bg-gray-600/70';
        if (isActive) bgClass = 'bg-green-600 hover:bg-green-700 text-white';
        if (isDestructive && isActive === false) bgClass = 'bg-gray-700/50 hover:bg-gray-600/70'; // Special case for mute/deafen destructive but inactive
        if (isDestructive && isActive !== false) bgClass = 'bg-red-600 hover:bg-red-700 text-white';

        return (
            <button
                onClick={onClick}
                className={`relative p-3 rounded-full transition-colors text-white ${bgClass}`}
                aria-label={ariaLabel}
            >
                {children}
            </button>
        );
    };

    return (
        <div className={`fixed top-1/2 -translate-y-1/2 right-0 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-2.5rem)]'}`}>
            <div className="flex items-center h-full">
                {/* Handle */}
                <div 
                    className="w-10 h-24 bg-gray-800/90 rounded-l-lg flex items-center justify-center cursor-pointer border-y-2 border-l-2 border-white/10"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronLeftIcon className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
                </div>
                {/* Controls */}
                <div className="bg-gray-800/90 p-3 flex flex-col items-center space-y-3 rounded-r-lg border-y-2 border-r-2 border-white/10">
                    <ControlButton onClick={onToggleNotificationPanel} ariaLabel="Notifications">
                        <BellIcon className="h-6 w-6" />
                        {unreadNotificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadNotificationCount}
                            </span>
                        )}
                    </ControlButton>
                    {isGameAvailable && (
                        <ControlButton onClick={onEnterGameMode} ariaLabel="Enter Game Mode">
                            <GamepadIcon className="h-6 w-6" />
                        </ControlButton>
                    )}
                     <ControlButton onClick={onInvite} ariaLabel="Invite Friends">
                        <UserPlusIcon className="h-6 w-6" />
                    </ControlButton>
                    {isOwner && (
                        <>
                            <ControlButton onClick={onSettings} ariaLabel="Lobby Settings">
                                <CogIcon className="h-6 w-6" />
                            </ControlButton>
                            <ControlButton onClick={onDelete} isDestructive ariaLabel="Delete Lobby">
                                <TrashIcon className="h-6 w-6" />
                            </ControlButton>
                        </>
                    )}

                    {(isGameAvailable || isOwner) && <hr className="w-full border-t border-white/20" />}
                    
                    <ControlButton onClick={onToggleCamera} isActive={isCameraOn} ariaLabel={isCameraOn ? "Turn camera off" : "Turn camera on"}>
                        {isCameraOn ? <CameraIcon className="h-6 w-6" /> : <CameraOffIcon className="h-6 w-6" />}
                    </ControlButton>
                    <ControlButton onClick={onToggleStreamGame} isActive={isStreamingGame} ariaLabel={isStreamingGame ? "Stop streaming" : "Stream game"}>
                        <ScreenShareIcon className="h-6 w-6" />
                    </ControlButton>
                    <ControlButton onClick={onToggleMute} isActive={!effectiveMute} isDestructive={effectiveMute} ariaLabel={effectiveMute ? "Unmute" : "Mute"}>
                        {effectiveMute ? <MicOffIcon className="h-6 w-6" /> : <MicIcon className="h-6 w-6" />}
                    </ControlButton>
                    <ControlButton onClick={onToggleDeafen} isActive={!isDeafened} isDestructive={isDeafened} ariaLabel={isDeafened ? "Undeafen" : "Deafen"}>
                        <HeadsetIcon className="h-6 w-6" />
                    </ControlButton>
                    <hr className="w-full border-t border-white/20" />
                    <ControlButton onClick={onLeave} isDestructive ariaLabel="Disconnect">
                        <HangUpIcon className="h-6 w-6" />
                    </ControlButton>
                </div>
            </div>
        </div>
    );
};

export default LobbyControlsSidebar;