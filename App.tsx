// Fix: Create the main App component to manage state and render the application.
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import UserPanel from './components/UserPanel';
import AuthPage from './components/AuthPage';
import UserProfileModal from './components/UserProfileModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import CreateLobbyModal from './components/CreateLobbyModal';
import FindLobbyModal from './components/FindLobbyModal';
import JoinLobbyModal from './components/JoinLobbyModal';
import FriendsPanel from './components/FriendsPanel';
import LfgPanel from './components/LfgPanel';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { User, UserStatus, Room, Message, RoomCategory, Attachment } from './types';
import { DUMMY_USERS, DUMMY_ROOM_CATEGORIES, DUMMY_MESSAGES } from './dummyData';

type View = { type: 'room'; id: string } | { type: 'friends'; id: 'friends' } | { type: 'dm'; id: string } | { type: 'lfg'; id: 'lfg' };

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(DUMMY_ROOM_CATEGORIES);
  const [messages, setMessages] = useState<Record<string, Message[]>>(DUMMY_MESSAGES);
  const [activeView, setActiveView] = useState<View>({ type: 'room', id: '1' });
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  
  const [showCreateLobby, setShowCreateLobby] = useState(false);
  const [showFindLobby, setShowFindLobby] = useState(false);
  const [joiningLobby, setJoiningLobby] = useState<Room | null>(null);
  const [joinLobbyError, setJoinLobbyError] = useState<string | null>(null);

  const [voiceStates, setVoiceStates] = useState<Record<string, string | null>>({ 'user-2': '101', 'user-3': '101' });
  const [lobbyNicknames, setLobbyNicknames] = useState<Record<string, Record<string, string>>>({});
  const [serverMutedUsers, setServerMutedUsers] = useState<Set<string>>(new Set());
  
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [showSidebar, setShowSidebar] = useState(false); // For mobile

  // Mock authentication logic
  const handleAuthSuccess = (user: User, remember: boolean) => {
    const foundUser = DUMMY_USERS.find(u => u.id === user.id) || user;
    setCurrentUser(foundUser);
    if (!foundUser.bio && (!foundUser.favoriteGames || foundUser.favoriteGames.length === 0)) {
        setNeedsProfileSetup(true);
    }
  };

  const handleLogin = (username: string, password: string) => {
    const user = DUMMY_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) return { success: true, message: 'Logged in!', user };
    return { success: false, message: 'User not found.' };
  };

  const handleSignup = (username: string, password: string) => {
     const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        discriminator: `${Math.floor(1000 + Math.random() * 9000)}`,
        avatarUrl: `https://i.pravatar.cc/150?u=user-${Date.now()}`,
        status: UserStatus.ONLINE,
        memberSince: new Date().toISOString()
     };
     setUsers(prev => [...prev, newUser]);
     return { success: true, message: 'Account created!', user: newUser };
  };
  
  const handleLogout = () => setCurrentUser(null);
  
  const handleProfileSetup = (details: { bio: string; favoriteGames: string[] }) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...details };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    }
    setNeedsProfileSetup(false);
  };

  const handleSendMessage = (content: string, attachment?: Attachment) => {
    if (!currentUser || activeView.type === 'lfg') return;
    const roomId = activeView.id;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo || undefined,
      attachment: attachment
    };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), newMsg] }));
    setReplyingTo(null);
  };
  
  const handleEditMessage = (messageId: string, newContent: string) => {
    if(!currentUser || activeView.type === 'lfg') return;
    const roomId = activeView.id;
    setMessages(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).map(msg => 
            msg.id === messageId && msg.author.id === currentUser.id
            ? { ...msg, content: newContent, edited: true }
            : msg
        )
    }));
    setEditingMessageId(null);
  };

  const handleDeleteMessage = () => {
    if(!deletingMessage || !currentUser || activeView.type === 'lfg') return;
    const roomId = activeView.id;
    setMessages(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).filter(msg => msg.id !== deletingMessage.id)
    }));
    setDeletingMessage(null);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
      if(!currentUser || activeView.type === 'lfg') return;
      const roomId = activeView.id;
      const roomMessages = messages[roomId] || [];
      
      const newMessages = roomMessages.map(msg => {
          if (msg.id === messageId) {
              const reactions = msg.reactions ? [...msg.reactions] : [];
              const reactionIndex = reactions.findIndex(r => r.emoji === emoji);

              if (reactionIndex > -1) {
                  const userIndex = reactions[reactionIndex].users.findIndex(u => u.id === currentUser.id);
                  if (userIndex > -1) {
                      reactions[reactionIndex].users.splice(userIndex, 1);
                      if(reactions[reactionIndex].users.length === 0) {
                          reactions.splice(reactionIndex, 1);
                      }
                  } else {
                      reactions[reactionIndex].users.push(currentUser);
                  }
              } else {
                  reactions.push({ emoji, users: [currentUser] });
              }
              return { ...msg, reactions };
          }
          return msg;
      });
      setMessages(prev => ({ ...prev, [roomId]: newMessages }));
  };

  const handleJoinLobby = (roomId: string) => {
    const room = getAllRooms().find(r => r.id === roomId);
    if (room?.password) {
      setJoiningLobby(room);
    } else if (room) {
      setVoiceStates(prev => ({ ...prev, [currentUser!.id]: roomId }));
      setActiveView({ type: 'room', id: roomId });
    }
  };
  
  const handleAttemptJoinProtectedLobby = (password: string) => {
    if (joiningLobby?.password === password) {
      setVoiceStates(prev => ({ ...prev, [currentUser!.id]: joiningLobby.id }));
      setActiveView({ type: 'room', id: joiningLobby.id });
      setJoiningLobby(null);
      setJoinLobbyError(null);
    } else {
      setJoinLobbyError('Incorrect password.');
    }
  };

  const handleLeaveLobby = () => {
    if(currentUser) setVoiceStates(prev => ({ ...prev, [currentUser.id]: null }));
  };

  const handleCreateLobby = (details: { name: string; topic: string; password?: string }) => {
    const newLobby: Room = {
      id: `room-${Date.now()}`,
      name: details.name,
      type: 'voice',
      topic: details.topic,
      password: details.password,
      ownerId: currentUser!.id
    };
    const newCategories = roomCategories.map(cat => {
      if (cat.name === 'Voice Channels') {
        return { ...cat, rooms: [...cat.rooms, newLobby] };
      }
      return cat;
    });
    setRoomCategories(newCategories);
    setShowCreateLobby(false);
    handleJoinLobby(newLobby.id);
  };
  
  const handleFindLobby = (id: string) => {
    const room = getAllRooms().find(r => r.id === id && r.type === 'voice');
    if (room) {
      handleJoinLobby(id);
      setShowFindLobby(false);
      return { success: true, message: 'Joining lobby...' };
    }
    return { success: false, message: 'Lobby not found.' };
  };

  const getAllRooms = () => roomCategories.flatMap(c => c.rooms);
  
  const activeRoom = activeView.type === 'room' ? getAllRooms().find(r => r.id === activeView.id) : undefined;
  const friends = users.filter(u => u.id !== currentUser?.id);
  const dmPartner = activeView.type === 'dm' ? users.find(u => u.id === activeView.id) : null;

  if (!currentUser) return <AuthPage onLogin={handleLogin} onSignup={handleSignup} onAuthSuccess={handleAuthSuccess} />;
  if (needsProfileSetup) return <ProfileSetupModal user={currentUser} onSubmit={handleProfileSetup} />;

  const renderMainPanel = () => {
    if (activeView.type === 'friends') {
      return <FriendsPanel friends={friends} onAddFriend={() => ({success: true, message: "Friend request sent!"})} onViewProfile={setViewingProfile} onToggleSidebar={() => setShowSidebar(!showSidebar)} />
    }
    if (activeView.type === 'lfg') {
      return <LfgPanel currentUser={currentUser} onToggleSidebar={() => setShowSidebar(!showSidebar)} />;
    }
    if (activeRoom || dmPartner) {
        return <MainContent
          activeRoom={activeRoom || { id: dmPartner!.id, name: dmPartner!.username, type: 'text' }}
          messages={messages[activeView.id] || []}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEditMessage}
          onSetDeletingMessage={setDeletingMessage}
          onAddReaction={handleAddReaction}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          friends={friends}
          onViewProfile={setViewingProfile}
          replyingTo={replyingTo}
          onSetReply={setReplyingTo}
          editingMessageId={editingMessageId}
          onSetEditingMessageId={setEditingMessageId}
          currentUser={currentUser}
          onLeaveLobby={handleLeaveLobby}
          users={users}
          voiceStates={voiceStates}
          onKickUser={(userId, roomId) => setVoiceStates(prev => ({ ...prev, [userId]: null }))}
          onToggleServerMute={(userId) => setServerMutedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) newSet.delete(userId);
            else newSet.add(userId);
            return newSet;
          })}
          onSetLobbyNickname={(roomId, nickname) => setLobbyNicknames(prev => ({ ...prev, [roomId]: { ...(prev[roomId] || {}), [currentUser.id]: nickname } }))}
          serverMutedUsers={serverMutedUsers}
          lobbyNicknames={lobbyNicknames}
          showUserList={!dmPartner && activeRoom?.type !== 'voice'}
          dmPartner={dmPartner}
        />
    }
    return <div className="flex-1 flex items-center justify-center bg-[#1a1b26] text-gray-400">Select a channel or conversation.</div>
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#1a1b26] text-gray-200">
       {/* Backdrop for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setShowSidebar(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar container */}
      <div className={`fixed inset-y-0 left-0 z-30 flex w-64 transform flex-col bg-[#24273a] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          currentUser={currentUser}
          friends={friends}
          activeView={activeView}
          onViewSelect={(view) => {
            setActiveView(view);
            setShowSidebar(false);
          }}
          roomCategories={roomCategories}
          onJoinLobby={(roomId) => {
            handleJoinLobby(roomId);
            setShowSidebar(false);
          }}
          onOpenCreateLobby={() => {
            setShowCreateLobby(true);
            setShowSidebar(false);
          }}
          onOpenFindLobby={() => {
            setShowFindLobby(true);
            setShowSidebar(false);
          }}
          users={users}
          voiceStates={voiceStates}
          lobbyNicknames={lobbyNicknames}
        />
        <UserPanel user={currentUser} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
          {renderMainPanel()}
      </div>
      
      {viewingProfile && <UserProfileModal user={viewingProfile} onClose={() => setViewingProfile(null)} />}
      {showCreateLobby && <CreateLobbyModal onClose={() => setShowCreateLobby(false)} onCreate={handleCreateLobby} />}
      {showFindLobby && <FindLobbyModal onClose={() => setShowFindLobby(false)} onFind={handleFindLobby} />}
      {joiningLobby && <JoinLobbyModal lobby={joiningLobby} error={joinLobbyError} onClose={() => setJoiningLobby(null)} onJoin={handleAttemptJoinProtectedLobby} />}
      {deletingMessage && <ConfirmDeleteModal message={deletingMessage} onClose={() => setDeletingMessage(null)} onConfirm={handleDeleteMessage} />}
    </div>
  );
};

// Simple debounce for resize
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export default App;