// Fix: Populate types.ts with necessary type definitions for the application.
export enum UserStatus {
  ONLINE = 'Online',
  IDLE = 'Idle',
  DND = 'Do Not Disturb',
  OFFLINE = 'Offline',
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
  status: UserStatus;
  activity?: string;
  bio?: string;
  favoriteGames?: string[];
  memberSince?: string;
  isBot?: boolean;
  isPremium?: boolean;
  language?: string;
  badge?: string;
  flairUrl?: string;
  theme?: string;
}

export interface Reaction {
  emoji: string;
  users: User[];
}

export interface Attachment {
  url:string;
  type: 'image' | 'video';
  name: string;
}

export interface Message {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  reactions?: Reaction[];
  replyTo?: Message;
  attachment?: Attachment;
  edited?: boolean;
}

export interface Room {
  id: string;
  name: string;
  type: 'text' | 'voice';
  topic?: string;
  ownerId?: string;
  password?: string;
  isPublic?: boolean;
  memberLimit?: number;
  streamingPermissionRequired?: boolean;
  language?: string;
  game?: string;
}

export interface RoomCategory {
  id:string;
  name: string;
  rooms: Room[];
}

export interface LfgPost {
  id: string;
  authorId: string;
  game: string;
  title: string;
  description: string;
  spotsNeeded: number;
  spotsFilled: number;
  tags: string[];
  createdAt: string;
}

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  LOBBY_INVITE = 'LOBBY_INVITE',
  LFG_JOIN_REQUEST = 'LFG_JOIN_REQUEST',
  MENTION = 'MENTION',
}

export interface Notification {
  id: string;
  type: NotificationType;
  senderId: string;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
  // Contextual data
  data?: {
    roomId?: string;
    roomName?: string;
    postId?: string;
    postTitle?: string;
    messageId?: string;
  };
}