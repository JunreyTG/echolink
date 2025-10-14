import React, { useState, useEffect, useRef } from 'react';
import { Room, Message as MessageType, User, Attachment } from '../types';
import { HashtagIcon, AtSymbolIcon, VolumeUpIcon, SendIcon, SmileyPlusIcon, MenuIcon, ReplyIcon, CloseIcon, PencilIcon, UserRemoveIcon, VolumeOffIcon, PaperclipIcon, TrashIcon } from './Icons';
import CallControls from './CallControls';
import EmojiPicker from './EmojiPicker';
import { statusColors } from '../constants';

interface ChatPanelProps {
  activeRoom: Room;
  messages: MessageType[];
  onSendMessage: (content: string, attachment?: Attachment) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onSetDeletingMessage: (message: MessageType) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onToggleSidebar: () => void;
  replyingTo: MessageType | null;
  onSetReply: (message: MessageType | null) => void;
  editingMessageId: string | null;
  onSetEditingMessageId: (messageId: string | null) => void;
  currentUser: User;
  users: User[];
  voiceStates: Record<string, string | null>;
  onLeaveLobby: () => void;
  onKickUser: (userId: string, roomId: string) => void;
  onToggleServerMute: (userId: string) => void;
  onSetLobbyNickname: (roomId: string, nickname: string) => void;
  serverMutedUsers: Set<string>;
  lobbyNicknames: Record<string, Record<string, string>>;
  dmPartner?: User | null;
}

const ReplyHeader: React.FC<{ message: MessageType; onScrollToMessage: (messageId: string) => void }> = ({ message, onScrollToMessage }) => {
    return (
        <button
            onClick={() => onScrollToMessage(message.id)}
            className="group/reply flex items-center text-xs text-gray-400 mb-1 cursor-pointer w-full text-left"
            aria-label={`Reply to ${message.author.username}: ${message.content}`}
        >
            <img src={message.author.avatarUrl} alt={message.author.username} className="h-4 w-4 rounded-full mr-1.5" />
            <span className="font-semibold text-indigo-300 group-hover/reply:underline">{message.author.username}</span>
            <span className="ml-2 truncate">{message.content}</span>
        </button>
    );
};

const EditMessageForm: React.FC<{
    message: MessageType;
    onSave: (messageId: string, newContent: string) => void;
    onCancel: () => void;
}> = ({ message, onSave, onCancel }) => {
    const [content, setContent] = useState(message.content);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() && content.trim() !== message.content) {
            onSave(message.id, content.trim());
        } else {
            onCancel();
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <input
                ref={inputRef}
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1a1b26] rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div className="text-xs text-gray-400 mt-1">
                escape to <button type="button" onClick={onCancel} className="text-green-400 hover:underline">cancel</button> • enter to <button type="submit" className="text-green-400 hover:underline">save</button>
            </div>
        </form>
    );
};


const Message: React.FC<{ 
    message: MessageType;
    isEditing: boolean;
    onSetEditing: (messageId: string) => void;
    onSaveEdit: (messageId: string, newContent: string) => void;
    onCancelEdit: () => void;
    onSetDeleting: (message: MessageType) => void;
    currentUser: User;
    onAddReaction: (messageId: string, emoji: string) => void; 
    onShowPicker: (messageId: string) => void;
    onSetReply: (message: MessageType) => void;
}> = (props) => {
    const { message, isEditing, onSetEditing, onSaveEdit, onCancelEdit, onSetDeleting, currentUser, onAddReaction, onShowPicker, onSetReply } = props;
    const isAuthor = message.author.id === currentUser.id;
    const isMention = message.content.includes(`@${currentUser.username}`);

    const scrollToMessage = (messageId: string) => {
        const element = document.getElementById(`message-${messageId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (element) {
            element.classList.add('bg-indigo-900/20');
            setTimeout(() => {
                element.classList.remove('bg-indigo-900/20');
            }, 1000);
        }
    };
    
    const messageClasses = `group relative flex items-start py-2 px-4 transition-colors duration-150 ${isMention ? 'bg-yellow-500/10' : 'hover:bg-white/5'}`;
    
  return (
    <div id={`message-${message.id}`} className={messageClasses}>
       {isMention && <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400"></div>}
      <img src={message.author.avatarUrl} alt={message.author.username} className="h-10 w-10 rounded-full mr-4 mt-1" />
      <div className="flex-1 min-w-0">
        {message.replyTo && !isEditing && (
            <ReplyHeader message={message.replyTo} onScrollToMessage={scrollToMessage} />
        )}
        {!isEditing && (
          <div className="flex items-baseline space-x-2">
            <p className="font-semibold text-white">{message.author.username}</p>
            <span className="text-xs text-gray-500">{message.timestamp}</span>
            {message.edited && <span className="text-xs text-gray-500">(edited)</span>}
          </div>
        )}

        {isEditing ? (
            <EditMessageForm message={message} onSave={onSaveEdit} onCancel={onCancelEdit} />
        ) : (
          <>
            {message.content && <p className="text-gray-200 mt-1 whitespace-pre-wrap break-words">{message.content}</p>}
            {message.attachment && (
                <div className="mt-2">
                    {message.attachment.type === 'image' ? (
                        <img src={message.attachment.url} alt={message.attachment.name} className="max-w-sm max-h-80 rounded-lg" />
                    ) : (
                        <video src={message.attachment.url} controls className="max-w-sm max-h-80 rounded-lg" />
                    )}
                </div>
            )}
            {message.reactions && message.reactions.length > 0 && (
              <div className="mt-2 flex items-center flex-wrap gap-1.5">
                {message.reactions.map(reaction => {
                  const hasReacted = reaction.users.some(u => u.id === currentUser.id);
                  return (
                    <button
                      key={reaction.emoji}
                      onClick={() => onAddReaction(message.id, reaction.emoji)}
                      className={`px-2 py-0.5 rounded-full flex items-center gap-1 text-sm transition-colors border ${
                        hasReacted
                          ? 'bg-indigo-500/30 border-indigo-500 text-white'
                          : 'bg-white/10 border-transparent hover:border-gray-500 text-gray-300'
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
          </>
        )}
      </div>
      {!isEditing && (
        <div className="absolute top-2 right-4 bg-[#24273a] rounded-md border border-black/20 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex">
            {isAuthor && (
                <>
                    <button 
                      onClick={() => onSetEditing(message.id)} 
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-l-md"
                      aria-label="Edit message"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => onSetDeleting(message)} 
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10"
                      aria-label="Delete message"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                </>
            )}
            <button 
              onClick={() => onSetReply(message)} 
              className={`p-1.5 text-gray-400 hover:text-white hover:bg-white/10 ${!isAuthor && 'rounded-l-md'}`}
              aria-label="Reply to message"
            >
              <ReplyIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onShowPicker(message.id)} 
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-r-md"
              aria-label="Add reaction"
            >
              <SmileyPlusIcon className="h-5 w-5" />
            </button>
        </div>
      )}
    </div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = (props) => {
  const { 
    activeRoom, messages, onSendMessage, onEditMessage, onSetDeletingMessage, onAddReaction, onToggleSidebar, 
    replyingTo, onSetReply, editingMessageId, onSetEditingMessageId, currentUser, users, voiceStates, onLeaveLobby,
    onKickUser, onToggleServerMute, onSetLobbyNickname, serverMutedUsers, lobbyNicknames, dmPartner
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pickerMessageId, setPickerMessageId] = useState<string | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameValue, setNicknameValue] = useState('');

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roomMessages = messages || [];
  const isVoiceChannel = activeRoom.type === 'voice';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  const handleStartEditingNickname = () => {
    const currentNickname = lobbyNicknames[activeRoom.id]?.[currentUser.id] || currentUser.username;
    setNicknameValue(currentNickname);
    setIsEditingNickname(true);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameValue(e.target.value);
  };
  
  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameValue.trim()) {
      onSetLobbyNickname(activeRoom.id, nicknameValue.trim());
    }
    setIsEditingNickname(false);
  };

  useEffect(() => {
    scrollToBottom()
  }, [roomMessages]);
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);
  
  // Cancel edit mode if the active room changes
  useEffect(() => {
    onSetEditingMessageId(null);
  }, [activeRoom.id, onSetEditingMessageId]);

  const handleReactionSelect = (emoji: string) => {
    if (pickerMessageId) {
      onAddReaction(pickerMessageId, emoji);
    }
    setPickerMessageId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
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

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const url = loadEvent.target?.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      onSendMessage('', { url, type, name: file.name });
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    event.target.value = '';
  };
  
  const connectedUsers = isVoiceChannel ? users.filter(u => voiceStates[u.id] === activeRoom.id) : [];
  const isOwner = currentUser.id === activeRoom.ownerId;

  const renderHeader = () => {
    if (dmPartner) {
      return (
        <div className="flex items-center min-w-0">
          <div className={`relative mr-2 ${statusColors[dmPartner.status]} h-3 w-3 rounded-full flex-shrink-0`}></div>
          <div className="truncate">
            <h2 className="font-semibold text-white truncate text-lg">{dmPartner.username}</h2>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center min-w-0">
         {isVoiceChannel ? (
             <VolumeUpIcon className="h-6 w-6 text-gray-500 mr-2 flex-shrink-0" />
          ) : (
            <HashtagIcon className="h-6 w-6 text-gray-500 mr-2 flex-shrink-0" />
          )}
          <div className="truncate">
            <h2 className="font-semibold text-white truncate text-lg">{activeRoom.name}</h2>
            {isVoiceChannel && activeRoom.topic && (
              <p className="text-sm text-gray-400 truncate" title={activeRoom.topic}>
                {activeRoom.topic}
              </p>
            )}
          </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1b26]">
       {pickerMessageId && <EmojiPicker onSelect={handleReactionSelect} onClose={() => setPickerMessageId(null)} />}
      <header className="flex-shrink-0 flex items-center justify-between h-14 px-4 shadow-lg z-10">
        <div className="flex items-center min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-md text-gray-300 hover:bg-white/10 hover:text-white mr-2 flex-shrink-0 md:hidden"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          {renderHeader()}
        </div>
        {isVoiceChannel && <CallControls onLeave={onLeaveLobby} />}
      </header>
      <div className="flex-1 overflow-y-auto">
        {isVoiceChannel ? (
            <div className="p-4">
                <h4 className="px-2 mb-2 text-sm font-bold uppercase text-gray-400 tracking-wider">Voice Connected — {connectedUsers.length}</h4>
                <div className="space-y-1">
                    {connectedUsers.map(user => {
                      const isMutedByAdmin = serverMutedUsers.has(user.id);
                      const nickname = lobbyNicknames[activeRoom.id]?.[user.id];
                      const displayName = nickname || user.username;
                      const isCurrentUser = user.id === currentUser.id;

                      return (
                        <div key={user.id} className="group flex items-center p-1.5 rounded-md hover:bg-white/5">
                            <div className="relative mr-3">
                                <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 rounded-full ring-2 ring-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                {isCurrentUser && isEditingNickname ? (
                                    <form onSubmit={handleNicknameSubmit}>
                                        <input
                                          type="text"
                                          value={nicknameValue}
                                          onChange={handleNicknameChange}
                                          onBlur={() => setIsEditingNickname(false)}
                                          className="bg-[#1a1b26] text-base font-semibold text-white truncate w-full p-0 border-0 focus:ring-1 focus:ring-green-400 rounded"
                                          autoFocus
                                        />
                                    </form>
                                ) : (
                                  <div className="flex items-center">
                                    <p className="text-base font-semibold text-white truncate">{displayName}</p>
                                     {isCurrentUser && (
                                      <button onClick={handleStartEditingNickname} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white" aria-label="Edit nickname">
                                        <PencilIcon className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                            </div>
                            {isMutedByAdmin && <VolumeOffIcon className="h-5 w-5 text-red-500 mr-2" />}
                            {isOwner && !isCurrentUser && (
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onToggleServerMute(user.id)} className={`p-1 rounded-full ${isMutedByAdmin ? 'text-red-400' : 'text-gray-400'} hover:bg-white/10`} aria-label={isMutedByAdmin ? "Unmute user" : "Mute user"}>
                                  <VolumeOffIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => onKickUser(user.id, activeRoom.id)} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-white/10" aria-label="Kick user">
                                  <UserRemoveIcon className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                        </div>
                      )
                    })}
                </div>
            </div>
        ) : (
             <>
                {roomMessages.map(msg => (
                  <Message 
                    key={msg.id} 
                    message={msg}
                    currentUser={currentUser}
                    isEditing={editingMessageId === msg.id}
                    onSetEditing={onSetEditingMessageId}
                    onSaveEdit={onEditMessage}
                    onCancelEdit={() => onSetEditingMessageId(null)}
                    onSetDeleting={onSetDeletingMessage}
                    onAddReaction={onAddReaction}
                    onShowPicker={setPickerMessageId}
                    onSetReply={onSetReply}
                  />
                ))}
                <div ref={messagesEndRef} />
             </>
        )}
      </div>
       {!isVoiceChannel && (
         <div className="px-4 pt-2 pb-3 bg-[#1a1b26]">
            {replyingTo && (
                <div className="bg-[#24273a] rounded-t-lg px-3 py-2 text-sm text-gray-400 flex justify-between items-center">
                    <span>Replying to <strong className="text-white">{replyingTo.author.username}</strong></span>
                    <button onClick={() => onSetReply(null)} className="p-1 rounded-full hover:bg-white/10" aria-label="Cancel reply">
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className={`w-full bg-[#24273a] flex items-center transition-all duration-200 ${replyingTo ? 'rounded-b-lg' : 'rounded-lg'} focus-within:ring-2 ring-green-400`}>
              <button type="button" onClick={handleAttachmentClick} className="p-3 text-gray-400 hover:text-gray-200 transition-colors" aria-label="Attach file">
                  <PaperclipIcon className="h-6 w-6" />
              </button>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} accept="image/*,video/*" />
              <input
                  type="text"
                  placeholder={`Message ${dmPartner ? `@${dmPartner.username}` : `#${activeRoom.name}`}`}
                  className="flex-1 bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
                  aria-label={`Message ${dmPartner ? dmPartner.username : activeRoom.name}`}
                  value={inputValue}
                  onChange={handleInputChange}
              />
              <button
                  type="submit"
                  className="p-3 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-green-400 hover:text-green-300"
                  aria-label="Send message"
                  disabled={!inputValue.trim()}
                >
                    <SendIcon className="h-6 w-6" />
                </button>
            </form>
            <div className="h-5 pt-1 pl-1">
              {isTyping && (
                 <p className="text-xs text-gray-400">
                  <span className="font-semibold">{currentUser.username}</span> is typing...
                </p>
              )}
            </div>
        </div>
       )}
    </div>
  );
};

export default ChatPanel;