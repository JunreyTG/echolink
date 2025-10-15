import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import FriendsPanel from './components/FriendsPanel';
import LfgPanel from './components/LfgPanel';
import AuthPage from './components/AuthPage';
import UserProfileModal from './components/UserProfileModal';
import CreateLobbyModal from './components/CreateLobbyModal';
import JoinLobbyModal from './components/JoinLobbyModal';
import FindLobbyModal from './components/FindLobbyModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import ConfirmKickModal from './components/ConfirmKickModal';
import VoiceUserActionModal from './components/VoiceUserActionModal';
import ConfirmDeleteLobbyModal from './components/ConfirmDeleteLobbyModal';
import LobbySettingsModal from './components/LobbySettingsModal';
import SettingsModal from './components/SettingsModal';
import InviteFriendsModal from './components/InviteFriendsModal';
import CreateLfgPostModal from './components/CreateLfgPostModal';
import ConfirmDeleteLfgPostModal from './components/ConfirmDeleteLfgPostModal';
import ToastNotification from './components/ToastNotification';
import GameModeOverlay from './components/GameModeOverlay';
import NotificationPanel from './components/NotificationPanel';
import GamePlayModal from './components/GamePlayModal';
import PaymentModal from './components/PaymentModal';
import { User, Room, Message, RoomCategory, UserStatus, Attachment, LfgPost, Notification, NotificationType } from './types';
import { DUMMY_USERS, DUMMY_ROOM_CATEGORIES, DUMMY_MESSAGES, ECHO_BOT_USER, DUMMY_LFG_POSTS, DUMMY_NOTIFICATIONS } from './dummyData';
import { getEchoBotResponse } from './api/gemini';
import { BASIC_THEMES, PREMIUM_THEMES, AppTheme } from './constants';

type View = { type: 'room'; id: string } | { type: 'friends'; id: 'friends' } | { type: 'dm'; id: string } | { type: 'lfg'; id: 'lfg' };

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  // FIX: Corrected the onClick function type from `to void` to `=> void`.
  actions?: { label: string; onClick: () => void; style?: 'primary' | 'secondary' }[];
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(DUMMY_ROOM_CATEGORIES);
  const [messages, setMessages] = useState<Record<string, Message[]>>(DUMMY_MESSAGES);
  const [lfgPosts, setLfgPosts] = useState<LfgPost[]>(DUMMY_LFG_POSTS);
  const [activeView, setActiveView] = useState<View>({ type: 'room', id: '1' });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [appStyle, setAppStyle] = useState<React.CSSProperties>({});

  // Modal States
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [isCreatingLobby, setCreatingLobby] = useState(false);
  const [isFindingLobby, setFindingLobby] = useState(false);
  const [joiningLobby, setJoiningLobby] = useState<Room | null>(null);
  const [joinLobbyError, setJoinLobbyError] = useState<string | null>(null);
  const [isProfileSetup, setProfileSetup] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [kickingUser, setKickingUser] = useState<{ userId: string; roomId: string } | null>(null);
  const [actionUser, setActionUser] = useState<{ user: User; room: Room } | null>(null);
  const [deletingLobby, setDeletingLobby] = useState<Room | null>(null);
  const [editingLobby, setEditingLobby] = useState<Room | null>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [invitingToLobby, setInvitingToLobby] = useState<Room | null>(null);
  const [isCreatingLfgPost, setCreatingLfgPost] = useState(false);
  const [deletingLfgPost, setDeletingLfgPost] = useState<LfgPost | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{plan: string, price: string} | null>(null);


  // Chat/Reply/Edit States
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isBotTyping, setBotTyping] = useState(false);

  // Voice/Video States
  const [voiceStates, setVoiceStates] = useState<Record<string, string | null>>({});
  const [isMuted, setMuted] = useState(false);
  const [isDeafened, setDeafened] = useState(false);
  const [isCameraOn, setCameraOn] = useState(false);
  const [serverMutedUsers, setServerMutedUsers] = useState<Set<string>>(new Set());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [speakingUserId, setSpeakingUserId] = useState<string | null>(null);
  const speakingIntervalRef = useRef<number | null>(null);
  const [lobbyNicknames, setLobbyNicknames] = useState<Record<string, Record<string, string>>>({});

  // Game Mode State
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameModeDetails, setGameModeDetails] = useState<{ room: Room, game: string } | null>(null);
  const [playingGame, setPlayingGame] = useState<string | null>(null);

  // Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);


  // Refs for voice activity indicator to access latest state in interval
  const voiceStatesRef = useRef(voiceStates);
  useEffect(() => {
    voiceStatesRef.current = voiceStates;
  }, [voiceStates]);

  const usersRef = useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);
  
  // Apply base theme class
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Auth check
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsAuthLoading(false);
  }, []);

  // Apply custom background theme
  useEffect(() => {
    const allThemes: AppTheme[] = [...BASIC_THEMES, ...PREMIUM_THEMES];
    const defaultThemeId = theme === 'dark' ? 'default_dark' : 'default_light';
    const themeId = currentUser?.theme || defaultThemeId;
    const selectedTheme = allThemes.find(t => t.id === themeId);
    
    if (selectedTheme) {
        setAppStyle(selectedTheme.style);
    }
  }, [currentUser?.theme, theme]);
  
  // Effect to manage the speaking simulation interval
  const currentLobbyId = currentUser ? voiceStates[currentUser.id] : null;

  useEffect(() => {
    if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
        speakingIntervalRef.current = null;
    }
    setSpeakingUserId(null);

    if (currentLobbyId) {
        speakingIntervalRef.current = window.setInterval(() => {
            setSpeakingUserId(prevId => {
                const currentVoiceStates = voiceStatesRef.current;
                const currentUsers = usersRef.current;
                const usersInCall = currentUsers.filter(u => currentVoiceStates[u.id] === currentLobbyId);
                
                if (usersInCall.length === 0) return null;
                if (prevId && Math.random() > 0.3) return prevId;
                const randomUser = usersInCall[Math.floor(Math.random() * usersInCall.length)];
                return randomUser.id;
            });
        }, 2000);
    }

    return () => {
        if (speakingIntervalRef.current) {
            clearInterval(speakingIntervalRef.current);
            speakingIntervalRef.current = null;
        }
    };
  }, [currentLobbyId]);

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const addToast = (
    message: string,
    type: Toast['type'] = 'info',
    actions?: Toast['actions'],
    id?: string,
  ) => {
    const toastId = id || `toast-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id: toastId, message, type, actions }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const friends = currentUser ? users.filter(u => u.id !== currentUser.id && !u.isBot) : [];

  const handleAuthSuccess = (user: User, remember: boolean) => {
    setCurrentUser(user);
    if (remember) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    if (!user.bio) { // Trigger profile setup for new users
        setProfileSetup(true);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }

  const handleSendMessage = async (content: string, attachment?: Attachment) => {
    if (!currentUser || (activeView.type !== 'room' && activeView.type !== 'dm')) return;
  
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo || undefined,
      attachment,
    };
  
    setMessages(prev => ({
      ...prev,
      [activeView.id]: [...(prev[activeView.id] || []), newMessage],
    }));
    setReplyingTo(null);

    // EchoBot logic
    if (activeView.type === 'dm' && activeView.id === ECHO_BOT_USER.id) {
        setBotTyping(true);
        const history = messages[ECHO_BOT_USER.id] || [];
        const botResponseContent = await getEchoBotResponse(content, [...history, newMessage]);
        setBotTyping(false);
        const botMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            author: ECHO_BOT_USER,
            content: botResponseContent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => ({
            ...prev,
            [activeView.id]: [...(prev[activeView.id] || []), botMessage],
        }));
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!currentUser || (activeView.type !== 'room' && activeView.type !== 'dm')) return;

    setMessages(prev => ({
      ...prev,
      [activeView.id]: (prev[activeView.id] || []).map(msg =>
        msg.id === messageId ? { ...msg, content: newContent, edited: true } : msg
      ),
    }));
    setEditingMessageId(null);
  };
  
  const handleConfirmDeleteMessage = () => {
    if (!deletingMessage || !currentUser || (activeView.type !== 'room' && activeView.type !== 'dm')) return;
    setMessages(prev => ({
        ...prev,
        [activeView.id]: (prev[activeView.id] || []).filter(msg => msg.id !== deletingMessage.id)
    }));
    setDeletingMessage(null);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!currentUser || (activeView.type !== 'room' && activeView.type !== 'dm')) return;
    
    setMessages(prev => {
        const roomMessages = prev[activeView.id] || [];
        const newMessages = roomMessages.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions ? [...msg.reactions] : [];
                const reactionIndex = reactions.findIndex(r => r.emoji === emoji);
                
                if (reactionIndex > -1) { // Reaction exists
                    const userIndex = reactions[reactionIndex].users.findIndex(u => u.id === currentUser.id);
                    if (userIndex > -1) { // User has reacted, so remove reaction
                        reactions[reactionIndex].users.splice(userIndex, 1);
                        if (reactions[reactionIndex].users.length === 0) {
                            reactions.splice(reactionIndex, 1);
                        }
                    } else { // User has not reacted, so add reaction
                        reactions[reactionIndex].users.push(currentUser);
                    }
                } else { // Reaction does not exist, so create it
                    reactions.push({ emoji, users: [currentUser] });
                }
                return { ...msg, reactions };
            }
            return msg;
        });
        return { ...prev, [activeView.id]: newMessages };
    });
  };
  
  const handleJoinLobby = (roomId: string, password?: string) => {
    const room = roomCategories.flatMap(c => c.rooms).find(r => r.id === roomId);
    if (!room || !currentUser) return;

    if (room.password && !currentUser.isPremium) {
      if (password === undefined) {
        setJoiningLobby(room);
        setJoinLobbyError(null);
        return;
      }
      if (room.password !== password) {
        setJoiningLobby(room);
        setJoinLobbyError('Incorrect password.');
        return;
      }
    }

    setVoiceStates(prev => ({ ...prev, [currentUser.id]: roomId }));
    setActiveView({ type: 'room', id: roomId });
    setJoiningLobby(null);
    setJoinLobbyError(null);
    addToast(`Joined lobby: ${room.name}`, 'success');
  };

  const handleLeaveLobby = () => {
    if (!currentUser) return;
    setVoiceStates(prev => ({ ...prev, [currentUser.id]: null }));
    if(localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
    }
    if(screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
    }
    addToast('You left the lobby.', 'info');
  };
  
  const handleToggleCamera = async () => {
    if (!currentUser || voiceStates[currentUser.id] === null) return;
    
    if (isCameraOn && localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setCameraOn(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            setCameraOn(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            addToast("Could not access camera.", "error");
        }
    }
  };

  const handleToggleStreamGame = async () => {
    if(screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            setScreenShareStream(stream);
        } catch (err) {
            console.error("Error accessing screen share:", err);
            addToast("Could not start screen share.", "error");
        }
    }
  };

  const handleSetUserTheme = (themeId: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, theme: themeId };
    
    setCurrentUser(updatedUser);
    
    if (localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    addToast('Theme updated!', 'success');
  };

  const handleUpdateProfile = (details: Partial<Pick<User, 'bio' | 'favoriteGames' | 'language' | 'avatarUrl'>>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...details };

    setCurrentUser(updatedUser);

    if (localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

    addToast('Profile updated!', 'success');
  };

  const handleInviteUser = (targetUserId: string, roomId: string) => {
    const room = findRoomById(roomId);
    if (!room || !currentUser) {
      addToast("Could not send invite. User or lobby not found.", "error");
      return { success: false, message: 'User or lobby not found.' };
    }
    
    const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: NotificationType.LOBBY_INVITE,
        senderId: currentUser.id,
        recipientId: targetUserId,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: {
            roomId: room.id,
            roomName: room.name,
        }
    };
    
    // For demo, add notification to current user's list
    setNotifications(prev => [newNotification, ...prev]);
    
    addToast('Invite sent!', 'success');
    return { success: true, message: 'Invite sent!' };
  };

  const findRoomById = (id: string): Room | undefined => {
      for (const category of roomCategories) {
          const room = category.rooms.find(r => r.id === id);
          if (room) return room;
      }
      return undefined;
  };
  
  const handleCreateLfgPost = (details: Omit<LfgPost, 'id' | 'authorId' | 'createdAt' | 'spotsFilled'>) => {
    if (!currentUser) return;
    const newPost: LfgPost = {
        id: `lfg-${Date.now()}`,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
        spotsFilled: 1, // Author fills the first spot
        ...details,
    };
    setLfgPosts(prev => [newPost, ...prev]);
    setCreatingLfgPost(false);
    addToast('LFG post created!', 'success');
  };

  const handleConfirmDeleteLfgPost = () => {
    if (!deletingLfgPost) return;
    setLfgPosts(prev => prev.filter(p => p.id !== deletingLfgPost.id));
    setDeletingLfgPost(null);
    addToast('LFG post deleted.', 'success');
  };

  const handleRequestToJoin = (post: LfgPost) => {
    if (!currentUser || post.authorId === currentUser.id) return;

    // For demo, add notification to current user's list as if they were the author
    const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: NotificationType.LFG_JOIN_REQUEST,
        senderId: currentUser.id,
        recipientId: post.authorId,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: {
            postId: post.id,
            postTitle: post.title,
        }
    };
    setNotifications(prev => [newNotification, ...prev]);

    addToast(`Join request sent for "${post.game}"!`, 'success');
  };

  const handleEnterGameMode = (room: Room) => {
    if (room.game) {
        setGameModeDetails({ room, game: room.game });
        setIsGameMode(true);
        addToast(`Entering Game Mode for ${room.game}...`, 'info');
    } else {
        addToast('This lobby has no game selected.', 'error');
    }
  };

  const handleExitGameMode = () => {
      setIsGameMode(false);
      setGameModeDetails(null);
  };
  
  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationAction = (id: string, action: 'accept' | 'decline') => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    if (notification.type === NotificationType.FRIEND_REQUEST) {
        if (action === 'accept') {
            addToast('Friend request accepted!', 'success');
        } else {
            addToast('Friend request declined.', 'info');
        }
    }
    
    if (notification.type === NotificationType.LFG_JOIN_REQUEST) {
       if (action === 'accept') {
            addToast('LFG join request accepted!', 'success');
        } else {
            addToast('LFG join request declined.', 'info');
        }
    }

    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handlePaymentSuccess = () => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, isPremium: true };
    setCurrentUser(updatedUser);
    
    if (localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    addToast('Subscribed to Premium! All perks unlocked.', 'success');
    setPaymentDetails(null);
  };

  if (isAuthLoading) {
      return <div className="min-h-screen w-full bg-gray-900" />;
  }

  if (!currentUser) {
    const handleLogin = (username: string, password: string) => {
        const user = DUMMY_USERS.find(u => u.username.toLowerCase() === username.toLowerCase() && !u.isBot);
        if (user) {
            return { success: true, message: 'Logged in!', user };
        }
        return { success: false, message: 'Invalid username or password' };
    };

    const handleSignup = (username: string, password: string) => {
        if (DUMMY_USERS.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username is already taken.' };
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            username,
            discriminator: String(Math.floor(1000 + Math.random() * 9000)),
            avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=${username.replace(/\s/g, '')}`,
            status: UserStatus.ONLINE,
            memberSince: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
        return { success: true, message: 'Account created!', user: newUser };
    };
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} onAuthSuccess={handleAuthSuccess} />;
  }

  const getActiveRoomAndPartner = (): { room: Room | null, partner: User | null } => {
    if (activeView.type === 'room') {
      const room = findRoomById(activeView.id);
      return { room: room || null, partner: null };
    }
    if (activeView.type === 'dm') {
      const partner = users.find(u => u.id === activeView.id);
      if (!partner) return { room: null, partner: null };
      const room: Room = { id: partner.id, name: partner.username, type: 'text' };
      return { room, partner };
    }
    return { room: null, partner: null };
  };

  const { room: activeRoom, partner: dmPartner } = getActiveRoomAndPartner();

  const renderMainPanel = () => {
    if (activeView.type === 'friends') {
        return <FriendsPanel friends={friends} onAddFriend={(tag) => {
            // For demo, create a friend request for the current user
             const [username, discriminator] = tag.split('#');
             if (!username || !discriminator) return { success: false, message: "Invalid tag format." };
             const sender = users.find(u => u.id === 'user-4'); // Simulate Rogue sending a request
             if(sender) {
                 const newNotif: Notification = {
                     id: `notif-${Date.now()}`,
                     type: NotificationType.FRIEND_REQUEST,
                     senderId: sender.id,
                     recipientId: currentUser.id,
                     isRead: false,
                     createdAt: new Date().toISOString()
                 };
                 setNotifications(p => [newNotif, ...p]);
                 return { success: true, message: "Friend request sent!" };
             }
            return { success: false, message: "Could not find user." };
        }} onViewProfile={setViewingProfile} onToggleSidebar={() => setSidebarOpen(p => !p)} isNotificationPanelOpen={isNotificationPanelOpen} onToggleNotificationPanel={() => setNotificationPanelOpen(p => !p)} notifications={notifications} />;
    }
    if (activeView.type === 'lfg') {
        return <LfgPanel 
            currentUser={currentUser}
            users={users}
            lfgPosts={lfgPosts}
            onOpenCreatePost={() => setCreatingLfgPost(true)}
            onRequestToJoin={handleRequestToJoin}
            onToggleSidebar={() => setSidebarOpen(p => !p)} 
            onViewProfile={setViewingProfile}
            onSetDeletingPost={setDeletingLfgPost}
            isNotificationPanelOpen={isNotificationPanelOpen} 
            onToggleNotificationPanel={() => setNotificationPanelOpen(p => !p)} 
            notifications={notifications}
        />;
    }
    if (activeRoom) {
      return (
        <MainContent
          activeRoom={activeRoom}
          messages={messages[activeView.id] || []}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEditMessage}
          onSetDeletingMessage={setDeletingMessage}
          onAddReaction={handleAddReaction}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          friends={friends}
          onViewProfile={setViewingProfile}
          replyingTo={replyingTo}
          onSetReply={setReplyingTo}
          editingMessageId={editingMessageId}
          onSetEditingMessageId={setEditingMessageId}
          currentUser={currentUser}
          onLeaveLobby={handleLeaveLobby}
          onJoinLobby={(roomId) => handleJoinLobby(roomId)}
          users={users}
          voiceStates={voiceStates}
          onSetKickingUser={(userId, roomId) => setKickingUser({ userId, roomId })}
          onToggleServerMute={(userId) => setServerMutedUsers(prev => new Set(prev).has(userId) ? (new Set(prev).delete(userId), new Set(prev)) : new Set(prev).add(userId))}
          onSetLobbyNickname={(roomId, nickname) => setLobbyNicknames(p => ({ ...p, [roomId]: { ...p[roomId], [currentUser.id]: nickname } }))}
          serverMutedUsers={serverMutedUsers}
          lobbyNicknames={lobbyNicknames}
          showUserList={showUserList}
          dmPartner={dmPartner}
          isBotTyping={isBotTyping}
          onSetActionUser={setActionUser}
          onSetDeletingLobby={setDeletingLobby}
          onSetEditingLobby={setEditingLobby}
          onSetInvitingToLobby={setInvitingToLobby}
          localStream={localStream}
          screenShareStream={screenShareStream}
          onToggleStreamGame={handleToggleStreamGame}
          isMuted={isMuted}
          isDeafened={isDeafened}
          onToggleMute={() => setMuted(!isMuted)}
          onToggleDeafen={() => setDeafened(!isDeafened)}
          isCameraOn={isCameraOn}
          onToggleCamera={handleToggleCamera}
          speakingUserId={speakingUserId}
          onEnterGameMode={handleEnterGameMode}
          isNotificationPanelOpen={isNotificationPanelOpen} 
          onToggleNotificationPanel={() => setNotificationPanelOpen(p => !p)} 
          notifications={notifications}
        />
      );
    }
    return <div className="flex-1 flex items-center justify-center bg-[#36393f]"><p className="text-gray-400">Select a channel or conversation.</p></div>;
  };
  
  return (
    <div style={appStyle} className="flex h-screen text-gray-900 dark:text-gray-100 transition-all duration-500">
        <div className={`w-64 flex-shrink-0 flex flex-col ${isSidebarOpen ? 'flex' : 'hidden'} md:flex`}>
            <Sidebar
                currentUser={currentUser}
                friends={friends}
                activeView={activeView}
                onViewSelect={(view) => { setActiveView(view); setSidebarOpen(false); }}
                roomCategories={roomCategories}
                onJoinLobby={(roomId) => handleJoinLobby(roomId)}
                onOpenCreateLobby={() => setCreatingLobby(true)}
                onOpenFindLobby={() => setFindingLobby(true)}
                users={users}
                voiceStates={voiceStates}
                lobbyNicknames={lobbyNicknames}
                onLogout={handleLogout}
                isMuted={isMuted}
                isDeafened={isDeafened}
                onToggleMute={() => setMuted(!isMuted)}
                onToggleDeafen={() => setDeafened(!isDeafened)}
                onOpenSettings={() => setSettingsOpen(true)}
                onViewProfile={setViewingProfile}
            />
        </div>
        
        <main className="flex-1 flex flex-col min-w-0 bg-transparent">
            {renderMainPanel()}
        </main>
        
        {/* Modals & Overlays */}
        {viewingProfile && <UserProfileModal user={viewingProfile} onClose={() => setViewingProfile(null)} />}
        {isCreatingLobby && <CreateLobbyModal onClose={() => setCreatingLobby(false)} onCreate={(details) => {
            const newLobby: Room = { id: `room-${Date.now()}`, type: 'voice', ownerId: currentUser.id, ...details };
            setRoomCategories(prev => prev.map(c => c.name === 'Voice Channels' ? { ...c, rooms: [...c.rooms, newLobby] } : c));
            setCreatingLobby(false);
            addToast('Lobby created!', 'success');
            handleJoinLobby(newLobby.id);
        }} />}
        {isFindingLobby && <FindLobbyModal onClose={() => setFindingLobby(false)} onFind={(id) => {
            const room = findRoomById(id);
            if (room) {
                setFindingLobby(false);
                handleJoinLobby(id);
                return { success: true, message: 'Found!' };
            }
            return { success: false, message: 'Lobby not found.' };
        }} />}
        {joiningLobby && <JoinLobbyModal lobby={joiningLobby} error={joinLobbyError} onClose={() => setJoiningLobby(null)} onJoin={(password) => handleJoinLobby(joiningLobby.id, password)} />}
        {isProfileSetup && <ProfileSetupModal user={currentUser} onSubmit={(details) => {
            handleUpdateProfile(details);
            setProfileSetup(false);
        }} />}
        {deletingMessage && <ConfirmDeleteModal message={deletingMessage} onClose={() => setDeletingMessage(null)} onConfirm={handleConfirmDeleteMessage} />}
        {kickingUser && (() => {
          const user = users.find(u => u.id === kickingUser.userId);
          const room = findRoomById(kickingUser.roomId);
          if(!user || !room) return null;
          return <ConfirmKickModal user={user} room={room} onClose={() => setKickingUser(null)} onConfirm={() => {
              setVoiceStates(p => ({...p, [kickingUser.userId]: null}));
              setKickingUser(null);
              addToast(`${user.username} was kicked.`, 'info');
          }} />
        })()}
        {actionUser && <VoiceUserActionModal user={actionUser.user} room={actionUser.room} isMuted={serverMutedUsers.has(actionUser.user.id)} onClose={() => setActionUser(null)} onKick={() => {setActionUser(null); setKickingUser({userId: actionUser.user.id, roomId: actionUser.room.id})}} onToggleMute={() => {
            setServerMutedUsers(prev => new Set(prev).has(actionUser.user.id) ? (new Set(prev).delete(actionUser.user.id), new Set(prev)) : new Set(prev).add(actionUser.user.id));
            setActionUser(null);
        }} />}
        {deletingLobby && <ConfirmDeleteLobbyModal room={deletingLobby} onClose={() => setDeletingLobby(null)} onConfirm={() => {
            setRoomCategories(p => p.map(c => ({...c, rooms: c.rooms.filter(r => r.id !== deletingLobby.id)})));
            if (activeView.type === 'room' && activeView.id === deletingLobby.id) {
                setActiveView({ type: 'room', id: '1' });
            }
            setDeletingLobby(null);
            addToast('Lobby deleted.', 'success');
        }} />}
        {editingLobby && <LobbySettingsModal room={editingLobby} onClose={() => setEditingLobby(null)} onSave={(updatedRoom) => {
            setRoomCategories(p => p.map(c => ({...c, rooms: c.rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r)})));
            if (gameModeDetails && gameModeDetails.room.id === updatedRoom.id) {
              setGameModeDetails({ room: updatedRoom, game: updatedRoom.game! });
            }
            setEditingLobby(null);
            addToast('Lobby settings saved!', 'success');
        }} />}
        {isSettingsOpen && <SettingsModal currentUser={currentUser} onClose={() => setSettingsOpen(false)} currentTheme={theme} onSetTheme={handleSetTheme} areNotificationsEnabled={areNotificationsEnabled} onToggleNotifications={() => setAreNotificationsEnabled(p => !p)} onSetUserTheme={handleSetUserTheme} onUpdateProfile={handleUpdateProfile} onInitiatePayment={(plan, price) => setPaymentDetails({ plan, price })}/>}
        {invitingToLobby && (
          <InviteFriendsModal
            lobby={invitingToLobby}
            friends={friends}
            users={users}
            voiceStates={voiceStates}
            onClose={() => setInvitingToLobby(null)}
            onInvite={handleInviteUser}
          />
        )}
        {isCreatingLfgPost && (
            <CreateLfgPostModal
                currentUser={currentUser}
                onClose={() => setCreatingLfgPost(false)}
                onCreate={handleCreateLfgPost}
            />
        )}
        {deletingLfgPost && (
            <ConfirmDeleteLfgPostModal
                post={deletingLfgPost}
                onClose={() => setDeletingLfgPost(null)}
                onConfirm={handleConfirmDeleteLfgPost}
            />
        )}

        {paymentDetails && (
            <PaymentModal
                planName={paymentDetails.plan}
                price={paymentDetails.price}
                onClose={() => setPaymentDetails(null)}
                onSuccess={handlePaymentSuccess}
            />
        )}

        {isGameMode && gameModeDetails && (
            <GameModeOverlay
                room={gameModeDetails.room}
                game={gameModeDetails.game}
                currentUser={currentUser}
                usersInCall={users.filter(u => voiceStates[u.id] === gameModeDetails.room.id)}
                speakingUserId={speakingUserId}
                isMuted={isMuted}
                isDeafened={isDeafened}
                onToggleMute={() => setMuted(!isMuted)}
                onToggleDeafen={() => setDeafened(!isDeafened)}
                onLeaveLobby={() => {
                    handleLeaveLobby();
                    handleExitGameMode();
                }}
                onExitGameMode={handleExitGameMode}
                onPlayGame={setPlayingGame}
            />
        )}

        {playingGame && (
          <GamePlayModal gameName={playingGame} onClose={() => setPlayingGame(null)} />
        )}

        {isNotificationPanelOpen && (
            <NotificationPanel
                notifications={notifications}
                users={users}
                onClose={() => setNotificationPanelOpen(false)}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onNotificationAction={handleNotificationAction}
                onJoinLobby={(roomId) => {
                    handleJoinLobby(roomId);
                    setNotificationPanelOpen(false);
                }}
            />
        )}

        {/* Toast Container */}
        <div className="absolute top-4 right-4 z-[100] w-full max-w-sm space-y-2">
            {toasts.map((toast) => (
                <ToastNotification key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    </div>
  );
};

export default App;