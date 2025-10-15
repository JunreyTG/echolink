import { User, UserStatus, RoomCategory, Message, Room, LfgPost, Notification, NotificationType } from './types';

// USERS
export const ECHO_BOT_USER: User = { 
    id: 'echo-bot', 
    username: 'EchoBot', 
    discriminator: 'AI', 
    avatarUrl: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=EchoBot', 
    status: UserStatus.ONLINE, 
    bio: "Your friendly neighborhood gaming AI. Ask me for tips, lore, or just chat!", 
    isBot: true,
    memberSince: new Date().toISOString(),
    isPremium: false,
};

export const DUMMY_USERS: User[] = [
    ECHO_BOT_USER,
    { id: 'user-1', username: 'Vortex', discriminator: '1234', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Vortex', status: UserStatus.ONLINE, bio: "Just a gamer trying to find my way.", favoriteGames: ['Apex Legends', 'Valheim'], memberSince: '2022-01-15T12:00:00Z', isPremium: false, language: 'en' },
    { id: 'user-2', username: 'Phoenix', discriminator: '5678', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Phoenix', status: UserStatus.ONLINE, activity: 'Playing Apex Legends', bio: "Competitive FPS player.", favoriteGames: ['Valorant'], memberSince: '2021-11-20T12:00:00Z', isPremium: true, language: 'en', badge: 'Season 1 Champion', flairUrl: 'https://i.imgur.com/gO0b2Yv.png' },
    { id: 'user-3', username: 'Luna', discriminator: '9012', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Luna', status: UserStatus.ONLINE, activity: 'Exploring in Valheim', bio: "Loves cozy and survival games.", favoriteGames: ['Stardew Valley', 'Valheim'], memberSince: '2023-03-10T12:00:00Z', isPremium: false, language: 'es', badge: 'Valheim Veteran' },
    { id: 'user-4', username: 'Rogue', discriminator: '3456', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Rogue', status: UserStatus.IDLE, bio: "Stealth game enthusiast.", memberSince: '2023-05-01T12:00:00Z', isPremium: false, language: 'fr' },
];

// ROOMS & CATEGORIES
const textRooms: Room[] = [
    { id: '1', name: 'general', type: 'text' },
    { id: '2', name: 'random', type: 'text' },
];

const voiceRooms: Room[] = [
    { 
      id: '102', 
      name: 'Vortex\'s Ranked Grind', 
      type: 'voice', 
      topic: 'For finding serious teammates', 
      ownerId: 'user-1',
      isPublic: true,
      memberLimit: 10,
      streamingPermissionRequired: false,
      language: 'en'
    },
    { 
      id: '103', 
      name: 'Luna\'s Valheim Build', 
      type: 'voice', 
      topic: 'Building & Exploring', 
      password: 'password123', 
      ownerId: 'user-3',
      isPublic: false,
      memberLimit: 5,
      streamingPermissionRequired: true,
      language: 'es'
    },
];

export const DUMMY_ROOM_CATEGORIES: RoomCategory[] = [
    { id: 'cat-1', name: 'Text Channels', rooms: textRooms },
    { id: 'cat-2', name: 'Voice Channels', rooms: voiceRooms },
];

// Pre-define messages for reply functionality to work
const generalMessages: Message[] = [
    { id: 'msg-1', author: DUMMY_USERS[2], content: 'Anyone up for some ranked?', timestamp: '10:30 AM' },
    { id: 'msg-2', author: DUMMY_USERS[3], content: 'Maybe later! Just started a new build in Valheim.', timestamp: '10:31 AM' },
];
generalMessages.push(
    { id: 'msg-3', author: DUMMY_USERS[1], content: "I'm down for either.", timestamp: '10:32 AM', reactions: [{ emoji: '👍', users: [DUMMY_USERS[2]] }] },
    { id: 'msg-4', author: DUMMY_USERS[2], content: 'Cool, let me know when you\'re free, Luna.', timestamp: '10:33 AM', replyTo: generalMessages[1] }
);


// MESSAGES
export const DUMMY_MESSAGES: Record<string, Message[]> = {
    '1': generalMessages,
    '2': [
        { id: 'msg-5', author: DUMMY_USERS[4], content: 'Just saw the new trailer for that stealth game, looks sick!', timestamp: '11:00 AM' }
    ],
    // DM messages
    'user-2': [
         { id: 'dm-1', author: DUMMY_USERS[1], content: 'Hey, when are we playing Apex?', timestamp: '12:00 PM' },
         { id: 'dm-2', author: DUMMY_USERS[2], content: 'Hopping on in 5!', timestamp: '12:01 PM' },
    ],
     'user-3': [
         { id: 'dm-3', author: DUMMY_USERS[1], content: 'The Valheim server is up.', timestamp: '1:00 PM' },
    ],
    [ECHO_BOT_USER.id]: [
        { id: 'bot-msg-1', author: ECHO_BOT_USER, content: "Hello! I'm EchoBot, your friendly gaming AI assistant. You can ask me for game recommendations, tips, or just chat. What's on your mind?", timestamp: 'Now' }
    ]
};

// LFG POSTS
export const DUMMY_LFG_POSTS: LfgPost[] = [
    { 
      id: 'lfg-1', 
      authorId: 'user-2', 
      game: 'Apex Legends', 
      title: 'Chill ranked grind, plat+', 
      description: 'Looking for a consistent third to climb to Diamond. Mic required. No toxicity.',
      spotsNeeded: 2, 
      spotsFilled: 1, 
      tags: ['Competitive', 'Ranked', 'FPS'],
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    },
    { 
      id: 'lfg-2', 
      authorId: 'user-3', 
      game: 'Valheim', 
      title: 'Need 2 more for Bonemass boss fight!', 
      description: 'We have the gear and the location, just need more muscle. Come join!',
      spotsNeeded: 3, 
      spotsFilled: 1, 
      tags: ['Co-op', 'Boss Fight', 'Survival'],
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    { 
      id: 'lfg-3', 
      authorId: 'user-4', 
      game: 'Among Us', 
      title: 'Lobby for fun, no toxicity', 
      description: 'Just a casual game night. All welcome!',
      spotsNeeded: 9, 
      spotsFilled: 7, 
      tags: ['Casual', 'Social Deduction'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    { 
      id: 'lfg-4', 
      authorId: 'user-1', 
      game: 'League of Legends', 
      title: 'ARAM and chill', 
      description: 'No tilt, just vibes. Playing a few ARAM games tonight.',
      spotsNeeded: 4, 
      spotsFilled: 2, 
      tags: ['Casual', 'MOBA'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
];

// NOTIFICATIONS
export const DUMMY_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: NotificationType.FRIEND_REQUEST,
        senderId: 'user-4',
        recipientId: 'user-1',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    },
    {
        id: 'notif-2',
        type: NotificationType.LOBBY_INVITE,
        senderId: 'user-3',
        recipientId: 'user-1',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
        data: {
            roomId: '103',
            roomName: 'Luna\'s Valheim Build',
        }
    },
    {
        id: 'notif-3',
        type: NotificationType.MENTION,
        senderId: 'user-2',
        recipientId: 'user-1',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        data: {
            roomId: '1',
            roomName: 'general',
            messageId: 'msg-1'
        }
    },
    {
        id: 'notif-4',
        type: NotificationType.LFG_JOIN_REQUEST,
        senderId: 'user-3',
        recipientId: 'user-1',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        data: {
            postId: 'lfg-4',
            postTitle: 'ARAM and chill',
        }
    }
];