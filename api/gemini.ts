
import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

const BOT_PERSONALITY = `You are EchoBot, a friendly and knowledgeable AI assistant for the EchoLink gaming chat platform. You love all things gaming, are helpful, and have a bit of a playful personality. Your responses should be formatted with Markdown. Keep your responses concise and engaging.`;

let chat: Chat | null = null;

const initializeChat = (apiKey: string, history: Message[]) => {
  const ai = new GoogleGenAI({ apiKey });
  
  // Map our app's Message type to the Gemini API's Content type
  const geminiHistory = history.map(msg => ({
      role: msg.author.isBot ? "model" : "user",
      parts: [{ text: msg.content }]
  }));

  // Remove the last message if it's from the model, as we'll be generating a new one.
  if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === 'model') {
      geminiHistory.pop();
  }

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: BOT_PERSONALITY,
    },
    history: geminiHistory,
  });
};

export const getEchoBotResponse = async (message: string, history: Message[]): Promise<string> => {
    // Note: In a real-world application, the API key would not be hardcoded.
    // We assume process.env.API_KEY is properly configured in the build environment.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is not set.");
        return "Sorry, I can't connect to my brain right now. Please make sure the API key is configured.";
    }

    if (!chat) {
      initializeChat(apiKey, history);
    }
    
    try {
        const response = await chat!.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting response from Gemini API:", error);
        // Reset chat session on error
        chat = null;
        return "Oops! Something went wrong while trying to connect. Let's try starting over.";
    }
};
