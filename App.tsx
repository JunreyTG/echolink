import React, { useState } from 'react';
import { Room, Message } from './types';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import UserPanel from './components/UserPanel';
import { CURRENT_USER, GEMINI_USER, MESSAGES } from './constants';
import { getGeminiResponse } from './api/gemini';


const App: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<Room | null>({ id: 'room-1', name: 'general', type: 'text' });
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>(MESSAGES);
  const [isGeminiTyping, setIsGeminiTyping] = useState(false);

  const handleSendMessage = async (roomId: string, content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      author: CURRENT_USER,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    setMessages(prevMessages => {
      const roomMessages = prevMessages[roomId] ? [...prevMessages[roomId], userMessage] : [userMessage];
      return {
        ...prevMessages,
        [roomId]: roomMessages,
      };
    });

    if (roomId === 'room-ai') {
      setIsGeminiTyping(true);
      
      const aiMessageId = `msg-ai-${Date.now()}`;
      const placeholderAiMessage: Message = {
          id: aiMessageId,
          author: GEMINI_USER,
          content: "", // Start with empty content
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prevMessages => ({
        ...prevMessages,
        [roomId]: [...prevMessages[roomId], placeholderAiMessage],
      }));

      try {
        await getGeminiResponse(content, (chunk) => {
            setMessages(prevMessages => {
                const updatedRoomMessages = prevMessages[roomId].map(msg => {
                    if (msg.id === aiMessageId) {
                        return { ...msg, content: msg.content + chunk };
                    }
                    return msg;
                });
                return { ...prevMessages, [roomId]: updatedRoomMessages };
            });
        });
      } catch (error) {
        console.error("Gemini API stream error:", error);
         setMessages(prevMessages => {
            const updatedRoomMessages = prevMessages[roomId].map(msg => {
                if (msg.id === aiMessageId) {
                    return { ...msg, content: "Sorry, I encountered an error. Please try again later." };
                }
                return msg;
            });
            return { ...prevMessages, [roomId]: updatedRoomMessages };
        });
      } finally {
        setIsGeminiTyping(false);
      }
    }
  };

  const handleAddReaction = (roomId: string, messageId: string, emoji: string) => {
    setMessages(prevMessages => {
        const roomMessages = prevMessages[roomId] || [];
        const newRoomMessages = roomMessages.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions ? JSON.parse(JSON.stringify(msg.reactions)) : [];
                const reactionIndex = reactions.findIndex((r: { emoji: string; }) => r.emoji === emoji);

                if (reactionIndex > -1) { // Reaction with this emoji exists
                    const userIndex = reactions[reactionIndex].users.findIndex((u: { id:string; }) => u.id === CURRENT_USER.id);
                    if (userIndex > -1) { // User has already reacted, so remove reaction
                        reactions[reactionIndex].users.splice(userIndex, 1);
                        if (reactions[reactionIndex].users.length === 0) {
                            reactions.splice(reactionIndex, 1);
                        }
                    } else { // User has not reacted, so add them
                        reactions[reactionIndex].users.push(CURRENT_USER);
                    }
                } else { // New reaction
                    reactions.push({ emoji: emoji, users: [CURRENT_USER] });
                }

                return { ...msg, reactions };
            }
            return msg;
        });

        return {
            ...prevMessages,
            [roomId]: newRoomMessages,
        };
    });
  };


  return (
    <div className="flex h-screen w-screen bg-[#202225] text-gray-300 overflow-hidden">
      <div className="flex flex-col bg-[#2f3136] w-72">
        <header className="h-12 flex items-center px-4 shadow-md font-bold text-white">
          EchoLink
        </header>
        <div className="flex-1 overflow-y-auto">
          <Sidebar activeRoom={activeRoom} onRoomSelect={setActiveRoom} />
        </div>
        <UserPanel user={CURRENT_USER} />
      </div>
      <MainContent 
        activeRoom={activeRoom} 
        messages={messages} 
        onSendMessage={handleSendMessage}
        onAddReaction={handleAddReaction}
        isGeminiTyping={isGeminiTyping}
      />
    </div>
  );
};

export default App;