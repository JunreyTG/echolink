import React from 'react';
import { Room, Message, User, Attachment } from '../types';
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
  users: User[];
  voiceStates: Record<string, string | null>;
  onKickUser: (userId: string, roomId: string) => void;
  onToggleServerMute: (userId: string) => void;
  onSetLobbyNickname: (roomId: string, nickname: string) => void;
  serverMutedUsers: Set<string>;
  lobbyNicknames: Record<string, Record<string, string>>;
  showUserList: boolean;
  dmPartner?: User | null;
}

const MainContent: React.FC<MainContentProps> = (props) => {
  const { 
    activeRoom, messages, onSendMessage, onEditMessage, onSetDeletingMessage, onAddReaction, onToggleSidebar, 
    friends, onViewProfile, replyingTo, onSetReply, editingMessageId, onSetEditingMessageId, currentUser, onLeaveLobby, 
    users, voiceStates, onKickUser, onToggleServerMute, onSetLobbyNickname, 
    serverMutedUsers, lobbyNicknames, showUserList, dmPartner
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
        users={users}
        voiceStates={voiceStates}
        onKickUser={onKickUser}
        onToggleServerMute={onToggleServerMute}
        onSetLobbyNickname={onSetLobbyNickname}
        serverMutedUsers={serverMutedUsers}
        lobbyNicknames={lobbyNicknames}
        dmPartner={dmPartner}
      />
      {showUserList && <UserListPanel friends={friends} onViewProfile={onViewProfile} />}
    </div>
  );
};

export default MainContent;