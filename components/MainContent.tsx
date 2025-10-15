import React from 'react';
import { Room, Message, User, Attachment, Notification } from '../types';
import ChatPanel from './ChatPanel';
import UserListPanel from './UserListPanel';

interface MainContentProps {
  activeRoom: Room;
  messages: Message[];
  onSendMessage: (content: string, attachment?: Attachment) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onSetDeletingMessage: (message: Message) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onToggleSidebar: () => void;
  friends: User[];
  onViewProfile: (user: User) => void;
  replyingTo: Message | null;
  onSetReply: (message: Message | null) => void;
  editingMessageId: string | null;
  onSetEditingMessageId: (messageId: string | null) => void;
  currentUser: User;
  onLeaveLobby: () => void;
  onJoinLobby: (roomId: string) => void;
  users: User[];
  voiceStates: Record<string, string | null>;
  onSetKickingUser: (userId: string, roomId: string) => void;
  onToggleServerMute: (userId: string) => void;
  onSetLobbyNickname: (roomId: string, nickname: string) => void;
  serverMutedUsers: Set<string>;
  lobbyNicknames: Record<string, Record<string, string>>;
  showUserList: boolean;
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

const MainContent: React.FC<MainContentProps> = (props) => {
  const { 
    activeRoom, messages, onSendMessage, onEditMessage, onSetDeletingMessage, onAddReaction, onToggleSidebar, 
    friends, onViewProfile, replyingTo, onSetReply, editingMessageId, onSetEditingMessageId, currentUser, onLeaveLobby, onJoinLobby,
    users, voiceStates, onSetKickingUser, onToggleServerMute, onSetLobbyNickname, 
    serverMutedUsers, lobbyNicknames, showUserList, dmPartner, isBotTyping,
    onSetActionUser, onSetDeletingLobby, onSetEditingLobby, onSetInvitingToLobby, localStream, isMuted, isDeafened, onToggleMute, onToggleDeafen,
    isCameraOn, onToggleCamera, speakingUserId, onEnterGameMode,
    screenShareStream, onToggleStreamGame,
    isNotificationPanelOpen, onToggleNotificationPanel, notifications
  } = props;
  
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
        onEditMessage={onEditMessage}
        onSetDeletingMessage={onSetDeletingMessage}
        onAddReaction={onAddReaction}
        onToggleSidebar={onToggleSidebar}
        replyingTo={replyingTo}
        onSetReply={onSetReply}
        editingMessageId={editingMessageId}
        onSetEditingMessageId={onSetEditingMessageId}
        currentUser={currentUser}
        onLeaveLobby={onLeaveLobby}
        onJoinLobby={onJoinLobby}
        users={users}
        voiceStates={voiceStates}
        onSetKickingUser={onSetKickingUser}
        onToggleServerMute={onToggleServerMute}
        onSetLobbyNickname={onSetLobbyNickname}
        serverMutedUsers={serverMutedUsers}
        lobbyNicknames={lobbyNicknames}
        dmPartner={dmPartner}
        isBotTyping={isBotTyping}
        onSetActionUser={onSetActionUser}
        onSetDeletingLobby={onSetDeletingLobby}
        onSetEditingLobby={onSetEditingLobby}
        onSetInvitingToLobby={onSetInvitingToLobby}
        localStream={localStream}
        screenShareStream={screenShareStream}
        onToggleStreamGame={onToggleStreamGame}
        isMuted={isMuted}
        isDeafened={isDeafened}
        onToggleMute={onToggleMute}
        onToggleDeafen={onToggleDeafen}
        isCameraOn={isCameraOn}
        onToggleCamera={onToggleCamera}
        speakingUserId={speakingUserId}
        onEnterGameMode={onEnterGameMode}
        isNotificationPanelOpen={isNotificationPanelOpen}
        onToggleNotificationPanel={onToggleNotificationPanel}
        notifications={notifications}
      />
      {showUserList && <UserListPanel friends={friends} onViewProfile={onViewProfile} users={users} />}
    </div>
  );
};

export default MainContent;