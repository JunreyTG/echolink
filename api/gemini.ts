import { GoogleGenAI, Chat } from "@google/genai";

let chat: Chat | null = null;

const getChat = (): Chat => {
    if (chat) {
        return chat;
    }

    // This will be populated by the environment variable
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        // This prevents the app from crashing on load, and throws an error
        // when a Gemini call is made without an API key.
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Create a single chat session that will be reused to preserve conversation history.
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a friendly and helpful chat bot in a gaming chat application called EchoLink. Keep your responses concise and fun.',
      },
    });

    return chat;
};


export async function getGeminiResponse(
    prompt: string, 
    onChunk: (chunk: string) => void
): Promise<void> {
    try {
        const chatSession = getChat();
        const responseStream = await chatSession.sendMessageStream({ message: prompt });

        for await (const chunk of responseStream) {
             onChunk(chunk.text);
        }

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        if (error instanceof Error && error.message.includes("API_KEY")) {
             onChunk("Could not connect to Gemini. Please ensure the API key is configured correctly.");
        } else {
            onChunk("There was an error trying to get a response. Please check the console for more details.");
        }
    }
}