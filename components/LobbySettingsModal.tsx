import React, { useState, useEffect } from 'react';
import { Room } from '../types';
import { CloseIcon, KeyIcon, EyeIcon, EyeSlashIcon } from './Icons';
import { GAME_CATEGORIES } from '../constants';

interface LobbySettingsModalProps {
  room: Room;
  onClose: () => void;
  onSave: (updatedRoom: Room) => void;
}

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'pt', name: 'Português' },
    { code: 'fil', name: 'Filipino' },
];

const LobbySettingsModal: React.FC<LobbySettingsModalProps> = ({ room, onClose, onSave }) => {
  const [name, setName] = useState(room.name);
  const [topic, setTopic] = useState(room.topic || '');
  const [game, setGame] = useState(room.game || GAME_CATEGORIES[0]);
  const [password, setPassword] = useState(room.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isPublic, setIsPublic] = useState(room.isPublic ?? true);
  const [memberLimit, setMemberLimit] = useState(room.memberLimit || 25);
  const [streamingPermission, setStreamingPermission] = useState(room.streamingPermissionRequired || false);
  const [language, setLanguage] = useState(room.language || 'en');
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isChanged = name !== room.name ||
                      topic !== (room.topic || '') ||
                      game !== (room.game || GAME_CATEGORIES[0]) ||
                      password !== (room.password || '') ||
                      isPublic !== (room.isPublic ?? true) ||
                      memberLimit !== (room.memberLimit || 25) ||
                      streamingPermission !== (room.streamingPermissionRequired || false) ||
                      language !== (room.language || 'en');
    setHasChanges(isChanged);
  }, [name, topic, game, password, isPublic, memberLimit, streamingPermission, language, room]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        ...room,
        name: name.trim(),
        topic: topic.trim(),
        game,
        password: password || undefined,
        isPublic,
        memberLimit,
        streamingPermissionRequired: streamingPermission,
        language
      });
    }
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">{label}</label>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
          checked ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800`}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 border-b border-black/10 dark:border-white/10">
          <div className="flex justify-between items-center">
            <div>
                 <h2 className="text-xl font-bold text-black dark:text-white">Lobby Settings</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{room.name}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400" aria-label="Close">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="lobby-name" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Lobby Name
              </label>
              <input
                id="lobby-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
             <div>
              <label htmlFor="lobby-game" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Game
              </label>
              <select
                id="lobby-game"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 border-none"
              >
                {GAME_CATEGORIES.sort().map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lobby-topic" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Topic
              </label>
              <input
                id="lobby-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
             <div>
              <label htmlFor="lobby-password" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                 <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                 <input
                    id="lobby-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="No password set"
                    className="w-full bg-gray-100 dark:bg-[#202225] p-3 pl-10 pr-20 rounded-md text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {password && (
                      <button type="button" onClick={() => setPassword('')} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xs mr-2">Remove</button>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 dark:border-white/10 pt-6 space-y-4">
                 <h3 className="text-base font-bold text-black dark:text-white mb-2">Rules & Privacy</h3>
                 <ToggleSwitch
                    checked={isPublic}
                    onChange={setIsPublic}
                    label="Public Lobby"
                    description="Allows your lobby to be discovered by others."
                 />
                 <ToggleSwitch
                    checked={streamingPermission}
                    onChange={setStreamingPermission}
                    label="Streaming Permission"
                    description="Members must ask for permission to stream."
                 />
                 <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="member-limit" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                            Member Limit
                        </label>
                        <span className="text-sm font-semibold text-black dark:text-white">{memberLimit}</span>
                    </div>
                    <input
                        id="member-limit"
                        type="range"
                        min="2"
                        max="100"
                        value={memberLimit}
                        onChange={(e) => setMemberLimit(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                 </div>
                 <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                        Lobby Language
                    </label>
                    <select
                        id="language"
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-[#202225] p-3 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 border-none"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                 </div>
            </div>
          </div>
        </form>
        <div className="flex-shrink-0 flex justify-end space-x-2 p-4 bg-gray-200 dark:bg-[#292b2f] border-t border-black/10 dark:border-black/20">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-800 dark:text-white hover:underline">
              Cancel
            </button>
            <button type="submit" form="lobby-settings-form" onClick={handleSubmit} disabled={!name.trim() || !hasChanges} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
              Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default LobbySettingsModal;