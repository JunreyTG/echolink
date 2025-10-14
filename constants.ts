// Fix: Populate constants.ts with constant values used in the app.
import { UserStatus } from './types';

export const statusColors: Record<UserStatus, string> = {
  [UserStatus.ONLINE]: 'bg-green-500',
  [UserStatus.IDLE]: 'bg-yellow-500',
  [UserStatus.DND]: 'bg-red-500',
  [UserStatus.OFFLINE]: 'bg-gray-500',
};

export const GAME_CATEGORIES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Puzzle', 'MMORPG', 'FPS', 'MOBA', 'Battle Royale', 'Fighting', 'Survival', 'Horror', 'Stealth', 'Platformer', 'Racing', 'RTS', 'Sandbox', 'Open World'
];
