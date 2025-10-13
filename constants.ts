import { User, UserStatus, RoomCategory, Message } from './types';

export const CURRENT_USER: User = {
  id: 'user-0',
  username: 'Vortex',
  discriminator: '1337',
  avatarUrl: 'https://picsum.photos/seed/user0/48/48',
  status: UserStatus.ONLINE,
  activity: 'Playing Valorant',
};

export const GEMINI_USER: User = {
  id: 'user-gemini',
  username: 'Gemini',
  discriminator: '2024',
  avatarUrl: 'https://picsum.photos/seed/gemini/48/48',
  status: UserStatus.ONLINE,
  activity: 'Answering questions',
  isBot: true,
};

export const FRIENDS: User[] = [
  { id: 'user-1', username: 'Phoenix', discriminator: '4589', avatarUrl: 'https://picsum.photos/seed/user1/48/48', status: UserStatus.ONLINE, activity: 'Playing Apex Legends' },
  { id: 'user-2', username: 'Luna', discriminator: '8802', avatarUrl: 'https://picsum.photos/seed/user2/48/48', status: UserStatus.ONLINE, activity: 'In Lobby' },
  { id: 'user-3', username: 'Raze', discriminator: '7734', avatarUrl: 'https://picsum.photos/seed/user3/48/48', status: UserStatus.IDLE, activity: 'Away' },
  { id: 'user-4', username: 'Ghost', discriminator: '0001', avatarUrl: 'https://picsum.photos/seed/user4/48/48', status: UserStatus.DND, activity: 'Streaming on Twitch' },
  { id: 'user-5', username: 'Cypher', discriminator: '1010', avatarUrl: 'https://picsum.photos/seed/user5/48/48', status: UserStatus.OFFLINE },
  { id: 'user-6', username: 'Jett', discriminator: '2525', avatarUrl: 'https://picsum.photos/seed/user6/48/48', status: UserStatus.OFFLINE },
];

export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'cat-1',
    name: 'Text Channels',
    rooms: [
      { id: 'room-1', name: 'general', type: 'text' },
      { id: 'room-2', name: 'memes', type: 'text' },
      { id: 'room-3', name: 'looking-for-group', type: 'text' },
      { id: 'room-ai', name: 'gemini-chat', type: 'text' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Voice Channels',
    rooms: [
      { id: 'room-4', name: 'Lobby', type: 'voice' },
      { id: 'room-5', name: 'Competitive Duo', type: 'voice' },
      { id: 'room-6', name: 'AFK', type: 'voice' },
    ],
  },
];

export const MESSAGES: { [roomId: string]: Message[] } = {
  'room-1': [
    { id: 'msg-1', author: FRIENDS[1], content: 'Anyone up for a game?', timestamp: '10:30 PM' },
    { id: 'msg-2', author: CURRENT_USER, content: 'I can join in 5, just finishing up something.', timestamp: '10:31 PM' },
    { 
      id: 'msg-3', 
      author: FRIENDS[0], 
      content: "Let's do it! I'm warming up now.", 
      timestamp: '10:31 PM',
      reactions: [
        { emoji: '👍', users: [FRIENDS[1], FRIENDS[2]] },
        { emoji: '🔥', users: [CURRENT_USER] }
      ]
    },
    { id: 'msg-4', author: FRIENDS[2], content: 'Count me in too!', timestamp: '10:32 PM' },
    { id: 'msg-5', author: FRIENDS[1], content: 'Perfect, we just need one more for a full squad.', timestamp: '10:33 PM' },
  ],
  'room-2': [
    { id: 'msg-6', author: FRIENDS[3], content: 'Check this out 😂', timestamp: '8:15 PM' },
  ],
  'room-3': [
    { id: 'msg-7', author: FRIENDS[0], content: 'LFG for ranked, Plat+, need 2 more.', timestamp: 'Yesterday at 9:00 PM' },
  ],
  'room-ai': [
    { id: 'msg-ai-1', author: GEMINI_USER, content: 'Hello! I am a helpful AI assistant powered by Gemini. Ask me anything!', timestamp: '10:00 AM' },
  ],
};

export const statusColors: { [key in UserStatus]: string } = {
  [UserStatus.ONLINE]: 'bg-green-500',
  [UserStatus.IDLE]: 'bg-yellow-500',
  [UserStatus.DND]: 'bg-red-500',
  [UserStatus.OFFLINE]: 'bg-gray-600',
};