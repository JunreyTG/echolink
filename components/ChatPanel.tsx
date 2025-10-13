import React, { useState, useEffect, useRef } from 'react';
import { Room, Message as MessageType } from '../types';
import { CURRENT_USER } from '../constants';
import { HashtagIcon, AtSymbolIcon, VolumeUpIcon, SendIcon, SmileyPlusIcon } from './Icons';
import CallControls from './CallControls';
import EmojiPicker from './EmojiPicker';

interface ChatPanelProps {
  activeRoom: Room;
  messages: { [roomId: string]: MessageType[] };
  onSendMessage: (roomId: string, content: string) => void;
  onAddReaction: (roomId: string, messageId: string, emoji: string) => void;
  isGeminiTyping: boolean;
}

const Message: React.FC<{ 
    message: MessageType; 
    onAddReaction: (messageId: string, emoji: string) => void; 
    onShowPicker: (messageId: string) => void;
}> = ({ message, onAddReaction, onShowPicker }) => {
  return (
    <div className="group relative flex items-start p-4 pr-12 hover:bg-gray-900/20">
      <img src={message.author.avatarUrl} alt={message.author.username} className="h-10 w-10 rounded-full mr-4" />
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <p className="font-semibold text-green-400">{message.author.username}</p>
          {message.author.isBot && (
            <span className="text-xs bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded">BOT</span>
          )}
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <p className="text-gray-200 mt-1">{message.content}</p>
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex items-center flex-wrap gap-1.5">
            {message.reactions.map(reaction => {
              const hasReacted = reaction.users.some(u => u.id === CURRENT_USER.id);
              return (
                <button
                  key={reaction.emoji}
                  onClick={() => onAddReaction(message.id, reaction.emoji)}
                  className={`px-2 py-0.5 rounded-full flex items-center gap-1 text-sm transition-colors border ${
                    hasReacted
                      ? 'bg-blue-500/30 border-blue-500 text-white'
                      : 'bg-gray-700/80 border-transparent hover:border-gray-500 text-gray-300'
                  }`}
                  aria-label={`${reaction.users.length} users reacted with ${reaction.emoji}`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="font-medium text-xs">{reaction.users.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="absolute top-2 right-4 bg-gray-800 rounded-md border border-gray-900 shadow-lg hidden group-hover:flex">
        <button 
          onClick={() => onShowPicker(message.id)} 
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
          aria-label="Add reaction"
        >
          <SmileyPlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({ activeRoom, messages, onSendMessage, onAddReaction, isGeminiTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pickerMessageId, setPickerMessageId] = useState<string | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roomMessages = messages[activeRoom.id] || [];
  const isVoiceChannel = activeRoom.type === 'voice';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [roomMessages]);
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleReactionSelect = (emoji: string) => {
    if (pickerMessageId) {
      onAddReaction(activeRoom.id, pickerMessageId, emoji);
    }
    setPickerMessageId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isGeminiTyping) {
      onSendMessage(activeRoom.id, inputValue.trim());
      setInputValue('');
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (value.trim()) {
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    } else {
      setIsTyping(false);
    }
  };
  
  const isInputDisabled = isGeminiTyping && activeRoom.id === 'room-ai';

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
       {pickerMessageId && <EmojiPicker onSelect={handleReactionSelect} onClose={() => setPickerMessageId(null)} />}
      <header className="flex-shrink-0 flex items-center justify-between h-12 px-4 border-b border-black/20 shadow-md">
        <div className="flex items-center">
          {isVoiceChannel ? (
             <VolumeUpIcon className="h-6 w-6 text-gray-500 mr-2" />
          ) : (
            <HashtagIcon className="h-6 w-6 text-gray-500 mr-2" />
          )}
          <h2 className="font-semibold text-white">{activeRoom.name}</h2>
        </div>
        {isVoiceChannel && <CallControls />}
      </header>
      <div className="flex-1 overflow-y-auto">
        {isVoiceChannel ? (
            <div className="p-4">
                <h4 className="px-2 mb-2 text-sm font-bold uppercase text-gray-400 tracking-wider">Voice Connected — 1</h4>
                <div className="space-y-2">
                    <div className="flex items-center px-2 py-1.5 rounded-md">
                        <div className="relative mr-3">
                            <img src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.username} className="h-10 w-10 rounded-full ring-2 ring-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-white truncate">{CURRENT_USER.username}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
             <>
                {roomMessages.map(msg => (
                  <Message 
                    key={msg.id} 
                    message={msg} 
                    onAddReaction={(messageId, emoji) => onAddReaction(activeRoom.id, messageId, emoji)}
                    onShowPicker={setPickerMessageId}
                  />
                ))}
                <div ref={messagesEndRef} />
             </>
        )}
      </div>
       {!isVoiceChannel && (
         <div className="px-4 pt-2 pb-3 bg-[#36393f]">
            <form onSubmit={handleSubmit} className={`w-full bg-[#40444b] rounded-lg flex items-center px-4 ${isInputDisabled ? 'opacity-50' : ''}`}>
              <input
                  type="text"
                  placeholder={isInputDisabled ? 'Gemini is thinking...' : `Message #${activeRoom.name}`}
                  className="flex-1 bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
                  aria-label={`Message ${activeRoom.name}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={isInputDisabled}
              />
              <button type="button" className="p-2 text-gray-400 hover:text-gray-200 transition-colors" aria-label="Add mention" disabled={isInputDisabled}>
                  <AtSymbolIcon className="h-6 w-6" />
              </button>
              <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                  disabled={!inputValue.trim() || isInputDisabled}
                >
                    <SendIcon className="h-6 w-6" />
                </button>
            </form>
            <div className="h-5 pt-1 pl-1">
              {isGeminiTyping && activeRoom.id === 'room-ai' ? (
                <p className="text-xs text-gray-400">
                  <span className="font-semibold">Gemini</span> is typing...
                </p>
              ) : isTyping && (
                 <p className="text-xs text-gray-400">
                  <span className="font-semibold">{CURRENT_USER.username}</span> is typing...
                </p>
              )}
            </div>
        </div>
       )}
    </div>
  );
};

export default ChatPanel;