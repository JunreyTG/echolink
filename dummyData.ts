import { User, UserStatus, RoomCategory, Message, Room } from './types';

// USERS
export const DUMMY_USERS: User[] = [
    { id: 'user-1', username: 'Vortex', discriminator: '1234', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', status: UserStatus.ONLINE, bio: "Just a gamer trying to find my way.", favoriteGames: ['Apex Legends', 'Valheim'], memberSince: '2022-01-15T12:00:00Z' },
    { id: 'user-2', username: 'Phoenix', discriminator: '5678', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', status: UserStatus.ONLINE, activity: 'Playing Apex Legends', bio: "Competitive FPS player.", favoriteGames: ['Valorant'], memberSince: '2021-11-20T12:00:00Z' },
    { id: 'user-3', username: 'Luna', discriminator: '9012', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', status: UserStatus.ONLINE, activity: 'Exploring in Valheim', bio: "Loves cozy and survival games.", favoriteGames: ['Stardew Valley', 'Valheim'], memberSince: '2023-03-10T12:00:00Z' },
    { id: 'user-4', username: 'Rogue', discriminator: '3456', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', status: UserStatus.IDLE, bio: "Stealth game enthusiast.", memberSince: '2023-05-01T12:00:00Z' },
];

// ROOMS & CATEGORIES
const textRooms: Room[] = [
    { id: '1', name: 'general', type: 'text' },
    { id: '2', name: 'random', type: 'text' },
];

const voiceRooms: Room[] = [
    { id: '101', name: 'Lobby', type: 'voice', topic: 'General chit-chat', isPublic: true },
    { id: '102', name: 'Apex Legends', type: 'voice', topic: 'Ranked Grind', isPublic: true },
    { id: '103', name: 'Valheim', type: 'voice', topic: 'Building & Exploring', isPublic: false, password: 'password123' },
];

export const DUMMY_ROOM_CATEGORIES: RoomCategory[] = [
    { id: 'cat-1', name: 'Text Channels', rooms: textRooms },
    { id: 'cat-2', name: 'Voice Channels', rooms: voiceRooms },
];

// Pre-define messages for reply functionality to work
const generalMessages: Message[] = [
    { id: 'msg-1', author: DUMMY_USERS[1], content: 'Anyone up for some ranked?', timestamp: '10:30 AM' },
    { id: 'msg-2', author: DUMMY_USERS[2], content: 'Maybe later! Just started a new build in Valheim.', timestamp: '10:31 AM' },
];
generalMessages.push(
    { id: 'msg-3', author: DUMMY_USERS[0], content: "I'm down for either.", timestamp: '10:32 AM', reactions: [{ emoji: '👍', users: [DUMMY_USERS[1]] }] },
    { id: 'msg-4', author: DUMMY_USERS[1], content: 'Cool, let me know when you\'re free, Luna.', timestamp: '10:33 AM', replyTo: generalMessages[1] }
);


// MESSAGES
export const DUMMY_MESSAGES: Record<string, Message[]> = {
    '1': generalMessages,
    '2': [
        { id: 'msg-5', author: DUMMY_USERS[3], content: 'Just saw the new trailer for that stealth game, looks sick!', timestamp: '11:00 AM' }
    ],
    // DM messages
    'user-2': [
         { id: 'dm-1', author: DUMMY_USERS[0], content: 'Hey, when are we playing Apex?', timestamp: '12:00 PM' },
         { id: 'dm-2', author: DUMMY_USERS[1], content: 'Hopping on in 5!', timestamp: '12:01 PM' },
    ],
     'user-3': [
         { id: 'dm-3', author: DUMMY_USERS[0], content: 'The Valheim server is up.', timestamp: '1:00 PM' },
    ],
};