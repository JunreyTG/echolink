export enum UserStatus {
  ONLINE = 'Online',
  IDLE = 'Idle',
  OFFLINE = 'Offline',
  DND = 'Do Not Disturb'
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
  status: UserStatus;
  activity?: string;
  isBot?: boolean;
}

export interface Room {
  id: string;
  name: string;
  type: 'voice' | 'text';
}

export interface RoomCategory {
  id:string;
  name: string;
  rooms: Room[];
}

export interface Reaction {
  emoji: string;
  users: User[];
}

export interface Message {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  reactions?: Reaction[];
}