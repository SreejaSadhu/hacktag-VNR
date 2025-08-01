import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private chat: any;

  constructor() {
    this.chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful AI business assistant. You help entrepreneurs and business owners with marketing, website copy, business strategies, and growth ideas. Be conversational, professional, and provide actionable advice. Keep responses concise but informative." }]
        },
        {
          role: "model",
          parts: [{ text: "I understand! I'm here to help you with your business needs. I can assist with marketing strategies, website copy, business growth ideas, and much more. I'll provide practical, actionable advice while keeping our conversation engaging and professional. What can I help you with today?" }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  // Method to start a new chat session
  startNewChat() {
    this.chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();