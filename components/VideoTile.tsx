import React, { useEffect, useRef } from 'react';
import { User } from '../types';
import { MicOffIcon } from './Icons';

interface VideoTileProps {
  user: User;
  stream?: MediaStream | null;
  isMuted: boolean;
  isLocalStream?: boolean;
  isSpeaking?: boolean;
  isScreenShare?: boolean;
  variant?: 'grid' | 'featured' | 'thumbnail' | 'pip';
}

const VideoTile: React.FC<VideoTileProps> = ({ 
    user, 
    stream, 
    isMuted, 
    isLocalStream = false, 
    isSpeaking = false,
    isScreenShare = false,
    variant = 'grid'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const borderClasses = isSpeaking && !isScreenShare
    ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.7)]'
    : 'border-transparent';
    
  // Container classes based on variant
  const containerClasses = {
    grid: 'aspect-video w-full h-full shadow-lg',
    featured: 'w-full h-full shadow-xl',
    thumbnail: 'w-full h-full shadow-md',
    pip: 'aspect-video w-full h-full shadow-2xl ring-2 ring-white/20'
  }[variant];

  // Inner content classes (like avatar size)
  const avatarSize = {
    grid: 'w-16 h-16 sm:w-24 sm:h-24',
    featured: 'w-24 h-24 sm:w-32 sm:h-32',
    thumbnail: 'w-12 h-12',
    pip: 'w-10 h-10'
  }[variant];

  // Username text size
  const textSize = {
    grid: 'text-sm',
    featured: 'text-base',
    thumbnail: 'text-xs',
    pip: 'text-xs'
  }[variant]

  return (
    <div className={`group transition-all duration-200 relative bg-gray-200 dark:bg-[#202225] rounded-lg overflow-hidden border-2 ${borderClasses} ${containerClasses}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocalStream}
          className={`w-full h-full ${isScreenShare ? 'object-contain bg-black' : 'object-cover'}`}
        />
      ) : (
        !isScreenShare && (
          <div className="w-full h-full flex items-center justify-center">
            <img src={user.avatarUrl} alt={user.username} className={`rounded-full ${avatarSize}`} />
          </div>
        )
      )}

      {isMuted && !isScreenShare && (
        <div className="absolute top-2 right-2 bg-red-600/80 p-1.5 rounded-full flex items-center justify-center shadow-lg" title="Muted">
          <MicOffIcon className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="flex items-center">
          <span className={`text-white font-semibold truncate ${textSize}`}>{user.username}{isScreenShare && "'s Stream"}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoTile;