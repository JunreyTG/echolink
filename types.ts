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
}

export interface Reaction {
  emoji: string;
  users: User[];
}

export interface Attachment {
  url: string;
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
}

export interface RoomCategory {
  id: string;
  name: string;
  rooms: Room[];
}