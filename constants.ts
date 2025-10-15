// Fix: Populate constants.ts with constant values used in the app.
import { UserStatus } from './types';
import React from 'react';

export const statusColors: Record<UserStatus, string> = {
  [UserStatus.ONLINE]: 'bg-green-500',
  [UserStatus.IDLE]: 'bg-yellow-500',
  [UserStatus.DND]: 'bg-red-500',
  [UserStatus.OFFLINE]: 'bg-gray-500',
};

export const GAME_CATEGORIES = [
  'Snake', 'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Puzzle', 'MMORPG', 'FPS', 'MOBA', 'Battle Royale', 'Fighting', 'Survival', 'Horror', 'Stealth', 'Platformer', 'Racing', 'RTS', 'Sandbox', 'Open World'
];

export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'fil', name: 'Filipino' },
];

const generateAvatars = (style: string, count: number) => 
    Array.from({ length: count }, (_, i) => `https://api.dicebear.com/8.x/${style}/svg?seed=${i + 1}`);

export const BASIC_AVATARS = generateAvatars('adventurer-neutral', 12);

const premiumLorelei = generateAvatars('lorelei', 12);
const premiumNotionists = generateAvatars('notionists', 12);
export const PREMIUM_AVATARS = [...premiumLorelei, ...premiumNotionists];


export interface AppTheme {
  id: string;
  name: string;
  preview: string;
  style: React.CSSProperties;
}

export const BASIC_THEMES: AppTheme[] = [
    { id: 'default_dark', name: 'Default Dark', preview: '#1a1b26', style: { backgroundColor: '#1a1b26' } },
    { id: 'default_light', name: 'Default Light', preview: '#f9fafb', style: { backgroundColor: '#f9fafb' } },
    { id: 'midnight_blue', name: 'Midnight Blue', preview: '#191f2e', style: { backgroundColor: '#191f2e' } },
];

export const PREMIUM_THEMES: AppTheme[] = [
    { 
        id: 'enchanted_forest', 
        name: 'Enchanted Forest', 
        preview: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=60', 
        style: { 
            backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } 
    },
    { 
        id: 'neon_gateway', 
        name: 'Neon Gateway', 
        preview: 'https://images.unsplash.com/photo-1635898099321-2557630c3a4d?w=400&auto=format&fit=crop&q=60', 
        style: { 
            backgroundImage: `url('https://images.unsplash.com/photo-1635898099321-2557630c3a4d?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } 
    },
    { 
        id: 'vaporwave_dream', 
        name: 'Vaporwave Dream', 
        preview: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=60', 
        style: { 
            backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } 
    },
    { 
        id: 'gamers_haven', 
        name: 'Gamer\'s Haven', 
        preview: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400&auto=format&fit=crop&q=60', 
        style: { 
            backgroundImage: `url('https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } 
    },
    { 
        id: 'mountain_night', 
        name: 'Mountain Night', 
        preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=60', 
        style: { 
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } 
    },
];