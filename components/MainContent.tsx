import React from 'react';
import { Room, Message } from '../types';
import ChatPanel from './ChatPanel';
import UserListPanel from './UserListPanel';

interface MainContentProps {
  activeRoom: Room | null;
  messages: { [roomId: string]: Message[] };
  onSendMessage: (roomId: string, content: string) => void;
  onAddReaction: (roomId: string, messageId: string, emoji: string) => void;
  isGeminiTyping: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ activeRoom, messages, onSendMessage, onAddReaction, isGeminiTyping }) => {
  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#36393f]">
        <p className="text-gray-500">Select a room to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-0">
      <ChatPanel 
        activeRoom={activeRoom} 
        messages={messages} 
        onSendMessage={onSendMessage}
        onAddReaction={onAddReaction}
        isGeminiTyping={isGeminiTyping}
      />
      <UserListPanel />
    </div>
  );
};

export default MainContent;