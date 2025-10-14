import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉', '🚀', '💯', '🤔', '👏'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[#24273a] p-4 rounded-lg shadow-xl border border-black/20"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="grid grid-cols-6 gap-2">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              className="text-3xl p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;