import React, { useState, useEffect, useRef } from 'react';
import { Room, Message as MessageType, User, Attachment, Notification } from '../types';
import { HashtagIcon, AtSymbolIcon, VolumeUpIcon, SendIcon, SmileyPlusIcon, MenuIcon, ReplyIcon, CloseIcon, PencilIcon, UserRemoveIcon, VolumeOffIcon, PaperclipIcon, TrashIcon, CopyIcon, CheckIcon, CogIcon, SparklesIcon, UserPlusIcon, GamepadIcon, BellIcon, PhoneIcon } from './Icons';
import CallControls from './CallControls';
import EmojiPicker from './EmojiPicker';
import { statusColors } from '../constants';
import VideoTile from './VideoTile';
import LobbyControlsSidebar from './LobbyControlsSidebar';

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
  onJoinLobby: (roomId: string) => void;
  onSetKickingUser: (userId: string, roomId: string) => void;
  onToggleServerMute: (userId: string) => void;
  onSetLobbyNickname: (roomId: string, nickname: string) => void;
  serverMutedUsers: Set<string>;
  lobbyNicknames: Record<string, Record<string, string>>;
  dmPartner?: User | null;
  isBotTyping?: boolean;
  onSetActionUser: (action: { user: User, room: Room }) => void;
  onSetDeletingLobby: (room: Room) => void;
  onSetEditingLobby: (room: Room) => void;
  onSetInvitingToLobby: (room: Room) => void;
  localStream: MediaStream | null;
  screenShareStream: MediaStream | null;
  onToggleStreamGame: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  speakingUserId: string | null;
  onEnterGameMode: (room: Room) => void;
  isNotificationPanelOpen: boolean;
  onToggleNotificationPanel: () => void;
  notifications: Notification[];
}

const ReplyHeader: React.FC<{ message: MessageType; onScrollToMessage: (messageId: string) => void }> = ({ message, onScrollToMessage }) => {
    return (
        <button
            onClick={() => onScrollToMessage(message.id)}
            className="group/reply flex items-center text-xs text-gray-600 dark:text-gray-400 mb-1 cursor-pointer w-full text-left"
            aria-label={`Reply to ${message.author.username}: ${message.content}`}
        >
            <img src={message.author.avatarUrl} alt={message.author.username} className="h-4 w-4 rounded-full mr-1.5" />
            <span className="font-semibold text-indigo-500 dark:text-indigo-300 group-hover/reply:underline">{message.author.username}</span>
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
                className="w-full bg-gray-200 dark:bg-[#1a1b26] rounded-md p-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                escape to <button type="button" onClick={onCancel} className="text-green-500 dark:text-green-400 hover:underline">cancel</button> • enter to <button type="submit" className="text-green-500 dark:text-green-400 hover:underline">save</button>
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
            element.classList.add('bg-indigo-500/20');
            setTimeout(() => {
                element.classList.remove('bg-indigo-500/20');
            }, 1000);
        }
    };
    
    const messageClasses = `group relative flex items-start py-2 px-4 transition-colors duration-150 ${isMention ? 'bg-yellow-400/10 dark:bg-yellow-500/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`;
    
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
            <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                {message.author.username}
                {message.author.isPremium && <SparklesIcon className="h-4 w-4 ml-1.5 text-purple-500 dark:text-purple-400" />}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-500">{message.timestamp}</span>
            {message.edited && <span className="text-xs text-gray-500 dark:text-gray-500">(edited)</span>}
          </div>
        )}

        {isEditing ? (
            <EditMessageForm message={message} onSave={onSaveEdit} onCancel={onCancelEdit} />
        ) : (
          <>
            {message.content && <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap break-words">{message.content}</p>}
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
                          ? 'bg-indigo-500/30 border-indigo-500 text-gray-900 dark:text-white'
                          : 'bg-black/10 dark:bg-white/10 border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
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
        <div className="absolute top-2 right-4 bg-white dark:bg-[#24273a] rounded-md border border-gray-200 dark:border-black/20 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex">
            {isAuthor && (
                <>
                    <button 
                      onClick={() => onSetEditing(message.id)} 
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-l-md"
                      aria-label="Edit message"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => onSetDeleting(message)} 
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      aria-label="Delete message"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                </>
            )}
            <button 
              onClick={() => onSetReply(message)} 
              className={`p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${!isAuthor && 'rounded-l-md'}`}
              aria-label="Reply to message"
            >
              <ReplyIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onShowPicker(message.id)} 
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-r-md"
              aria-label="Add reaction"
            >
              <SmileyPlusIcon className="h-5 w-5" />
            </button>
        </div>
      )}
    </div>
  );
};

// Helper to convert country code to flag emoji
const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const ChatPanel: React.FC<ChatPanelProps> = (props) => {
  const { 
    activeRoom, messages, onSendMessage, onEditMessage, onSetDeletingMessage, onAddReaction, onToggleSidebar, 
    replyingTo, onSetReply, editingMessageId, onSetEditingMessageId, currentUser, users, voiceStates, onLeaveLobby, onJoinLobby,
    onSetKickingUser, onToggleServerMute, onSetLobbyNickname, serverMutedUsers, lobbyNicknames, dmPartner, isBotTyping,
    onSetActionUser, onSetDeletingLobby, onSetEditingLobby, onSetInvitingToLobby, localStream, screenShareStream, onToggleStreamGame, isMuted, isDeafened, onToggleMute, onToggleDeafen, isCameraOn, onToggleCamera,
    speakingUserId, onEnterGameMode, isNotificationPanelOpen, onToggleNotificationPanel, notifications
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pickerMessageId, setPickerMessageId] = useState<string | null>(null);
  const [copiedLobbyId, setCopiedLobbyId] = useState(false);
  
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roomMessages = messages || [];
  const isVoiceChannel = activeRoom.type === 'voice';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInChannel = isVoiceChannel && voiceStates[currentUser.id] === activeRoom.id;
  const isOwner = currentUser.id === activeRoom.ownerId;
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [roomMessages]);
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
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
  
  const handleCopyLobbyId = () => {
    if (!activeRoom || activeRoom.type !== 'voice') return;
    navigator.clipboard.writeText(activeRoom.id).then(() => {
        setCopiedLobbyId(true);
        if (copyTimeoutRef.current) {
            window.clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = window.setTimeout(() => {
            setCopiedLobbyId(false);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy lobby ID: ', err);
    });
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
  
  const renderHeader = () => {
    if (dmPartner) {
      return (
        <div className="flex items-center min-w-0">
            {dmPartner.isBot ? (
                 <img src={dmPartner.avatarUrl} alt={dmPartner.username} className="h-6 w-6 rounded-full mr-2" />
            ) : (
                <div className={`relative mr-2 ${statusColors[dmPartner.status]} h-3 w-3 rounded-full flex-shrink-0`}></div>
            )}
            <div className="truncate flex items-center">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate text-lg">{dmPartner.username}</h2>
                {dmPartner.isPremium && <SparklesIcon className="h-4 w-4 ml-1.5 text-purple-500 dark:text-purple-400" />}
                {dmPartner.isBot && <span className="ml-2 text-xs font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded">BOT</span>}
            </div>
        </div>
      );
    }
    if (isVoiceChannel) {
        return (
            <div className="flex items-center min-w-0 flex-1">
                <VolumeUpIcon className="h-6 w-6 text-gray-500 dark:text-gray-500 mr-2 flex-shrink-0" />
                <div className="truncate">
                    <h2 className="font-semibold text-gray-900 dark:text-white truncate text-lg">{activeRoom.name}</h2>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        {activeRoom.game && <span className="mr-1.5 font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{activeRoom.game}</span>}
                        {activeRoom.language && <span className="mr-1.5" title={`Language: ${activeRoom.language.toUpperCase()}`}>{getFlagEmoji(activeRoom.language)}</span>}
                        {activeRoom.topic && (
                            <p className="truncate" title={activeRoom.topic}>
                                {activeRoom.topic}
                            </p>
                        )}
                        {activeRoom.topic && <span className="text-gray-400 dark:text-gray-600 mx-2">•</span>}
                        <div className="group flex items-center flex-shrink-0" title="Click icon to copy Lobby ID">
                            <span className="truncate">ID: {activeRoom.id}</span>
                            <button onClick={handleCopyLobbyId} className="ml-1.5 p-1 rounded-md text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white group-hover:bg-black/10 dark:group-hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all" aria-label="Copy Lobby ID">
                                {copiedLobbyId ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ml-auto flex-shrink-0 hidden md:flex items-center space-x-1">
                    {isInChannel && activeRoom.game && (
                        <button onClick={() => onEnterGameMode(activeRoom)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Enter Game Mode">
                            <GamepadIcon className="h-5 w-5" />
                        </button>
                    )}
                    {isInChannel && (
                        <button onClick={() => onSetInvitingToLobby(activeRoom)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Invite Friends">
                            <UserPlusIcon className="h-5 w-5" />
                        </button>
                    )}
                    {isOwner && (
                    <>
                        <button onClick={() => onSetEditingLobby(activeRoom)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Lobby Settings">
                            <CogIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => onSetDeletingLobby(activeRoom)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Delete Lobby">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </>
                    )}
                </div>
            </div>
        );
    }
    return (
      <div className="flex items-center min-w-0">
        <HashtagIcon className="h-6 w-6 text-gray-600 dark:text-gray-500 mr-2 flex-shrink-0" />
        <div className="truncate">
          <h2 className="font-semibold text-gray-900 dark:text-white truncate text-lg">{activeRoom.name}</h2>
        </div>
      </div>
    );
  };
  
  const renderVoiceLobby = () => {
    if (!isInChannel) {
        return (
            <div className="p-4 md:p-8 flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">You're not in the voice channel</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">Join to see and hear everyone.</p>
                <button
                    onClick={() => onJoinLobby(activeRoom.id)}
                    className="w-full max-w-xs bg-green-600 text-white font-semibold p-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-lg shadow-lg"
                >
                    <PhoneIcon className="h-6 w-6 mr-2" />
                    Join Voice
                </button>
            </div>
        );
    }
    
    // Speaker/presentation view logic
    const screenSharer = screenShareStream ? currentUser : null;
    const featuredUser = screenSharer || users.find(u => u.id === speakingUserId) || connectedUsers.find(u => u.id !== currentUser.id) || null;
    const featuredStream = featuredUser?.id === currentUser.id ? screenShareStream : null;

    const thumbnailUsers = connectedUsers.filter(u => u.id !== featuredUser?.id && u.id !== currentUser.id);

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Main featured view */}
            <div className="flex-1 p-2 md:p-4 min-h-0">
                {featuredUser ? (
                    <VideoTile
                        key={featuredUser.id}
                        variant="featured"
                        user={featuredUser}
                        stream={featuredStream}
                        isMuted={serverMutedUsers.has(featuredUser.id)}
                        isSpeaking={featuredUser.id === speakingUserId}
                        isScreenShare={!!screenSharer}
                    />
                ) : connectedUsers.length === 1 && connectedUsers[0].id === currentUser.id ? (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900/50 rounded-lg text-center p-4">
                        <img src={currentUser.avatarUrl} className="w-24 h-24 rounded-full mb-4 ring-4 ring-gray-300 dark:ring-gray-700" />
                        <h3 className="text-xl font-semibold">You're the only one here.</h3>
                        <p className="text-gray-500">Invite some friends to the lobby!</p>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                        <p>Waiting for participants...</p>
                    </div>
                )}
            </div>

            {/* Thumbnails row */}
            {(thumbnailUsers.length > 0 || (featuredUser && featuredUser.id !== currentUser.id)) && (
                <div className="flex-shrink-0 w-full overflow-x-auto p-2">
                    <div className="flex justify-center space-x-2">
                         {featuredUser && featuredUser.id !== currentUser.id && (
                             <div key={featuredUser.id} className="w-32 h-20 flex-shrink-0">
                                <VideoTile
                                    variant="thumbnail"
                                    user={featuredUser}
                                    stream={null} // Remote streams not implemented
                                    isMuted={serverMutedUsers.has(featuredUser.id)}
                                    isSpeaking={featuredUser.id === speakingUserId}
                                />
                            </div>
                         )}
                        {thumbnailUsers.map(user => (
                             <div key={user.id} className="w-32 h-20 flex-shrink-0">
                                <VideoTile
                                    variant="thumbnail"
                                    user={user}
                                    stream={null} // Remote streams not implemented
                                    isMuted={serverMutedUsers.has(user.id)}
                                    isSpeaking={user.id === speakingUserId}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Self-view Picture-in-Picture */}
            {(isCameraOn || screenShareStream) && (
                <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 w-32 md:w-40 h-auto z-20">
                     <VideoTile
                        variant="pip"
                        user={currentUser}
                        stream={localStream}
                        isLocalStream
                        isMuted={isMuted || isDeafened}
                        isSpeaking={currentUser.id === speakingUserId}
                    />
                </div>
            )}
        </div>
    )
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#1a1b26]">
       {pickerMessageId && <EmojiPicker onSelect={handleReactionSelect} onClose={() => setPickerMessageId(null)} />}
      <header className="flex-shrink-0 flex items-center justify-between h-14 px-4 shadow-lg z-10 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#2f3136]">
        <div className="flex items-center min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white mr-2 flex-shrink-0 md:hidden"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          {renderHeader()}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onToggleNotificationPanel} className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
              <BellIcon className="h-5 w-5" />
              {unreadNotificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadNotificationCount}</span>
                  </span>
              )}
          </button>
          {isInChannel && (
            <div className="hidden md:flex">
              <CallControls 
                  onLeave={onLeaveLobby} 
                  isMuted={isMuted}
                  isDeafened={isDeafened}
                  onToggleMute={onToggleMute}
                  onToggleDeafen={onToggleDeafen}
                  isCameraOn={isCameraOn}
                  onToggleCamera={onToggleCamera}
                  isStreamingGame={!!screenShareStream}
                  onToggleStreamGame={onToggleStreamGame}
              />
            </div>
          )}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {isVoiceChannel ? (
            renderVoiceLobby()
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
         <div className="px-4 pt-2 pb-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#2f3136]">
            {replyingTo && (
                <div className="bg-gray-100 dark:bg-[#24273a] rounded-t-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <span>Replying to <strong className="text-gray-900 dark:text-white">{replyingTo.author.username}</strong></span>
                    <button onClick={() => onSetReply(null)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Cancel reply">
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className={`w-full bg-gray-100 dark:bg-[#24273a] flex items-center transition-all duration-200 ${replyingTo ? 'rounded-b-lg' : 'rounded-lg'} focus-within:ring-2 ring-green-400`}>
              <button type="button" onClick={handleAttachmentClick} className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors" aria-label="Attach file">
                  <PaperclipIcon className="h-6 w-6" />
              </button>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} accept="image/*,video/*" />
              <input
                  type="text"
                  placeholder={`Message ${dmPartner ? `@${dmPartner.username}` : `#${activeRoom.name}`}`}
                  className="flex-1 bg-transparent py-3 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-500 focus:outline-none"
                  aria-label={`Message ${dmPartner ? dmPartner.username : activeRoom.name}`}
                  value={inputValue}
                  onChange={handleInputChange}
              />
              <button
                  type="submit"
                  className="p-3 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300"
                  aria-label="Send message"
                  disabled={!inputValue.trim()}
                >
                    <SendIcon className="h-6 w-6" />
                </button>
            </form>
            <div className="h-5 pt-1 pl-1">
              {isBotTyping && dmPartner?.isBot ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                  <span className="font-semibold">{dmPartner.username}</span> is typing...
                </p>
              ) : isTyping ? (
                 <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{currentUser.username}</span> is typing...
                </p>
              ) : null}
            </div>
        </div>
       )}
        {isInChannel && (
          <div className="block md:hidden">
              <LobbyControlsSidebar
                  onLeave={onLeaveLobby}
                  isMuted={isMuted}
                  isDeafened={isDeafened}
                  onToggleMute={onToggleMute}
                  onToggleDeafen={onToggleDeafen}
                  isCameraOn={isCameraOn}
                  onToggleCamera={onToggleCamera}
                  isStreamingGame={!!screenShareStream}
                  onToggleStreamGame={onToggleStreamGame}
                  isGameAvailable={!!activeRoom.game}
                  onEnterGameMode={() => onEnterGameMode(activeRoom)}
                  onInvite={() => onSetInvitingToLobby(activeRoom)}
                  isOwner={isOwner}
                  onSettings={() => onSetEditingLobby(activeRoom)}
                  onDelete={() => onSetDeletingLobby(activeRoom)}
                  onToggleNotificationPanel={onToggleNotificationPanel}
                  unreadNotificationCount={unreadNotificationCount}
              />
          </div>
        )}
    </div>
  );
};

export default ChatPanel;