'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import type {Message, ChatRequest, ChatResponse} from './chatbot-types';

export {type Message, type ChatRequest, type ChatResponse};

export async function chat(input: ChatRequest): Promise<ChatResponse> {
  const {history, newMessage} = input;
  const systemPrompt = `You are a helpful AI assistant named Gemini AI.`;

  // The history from the client already includes the latest user message.
  const messages = [
    ...history.map(h => ({
      role: h.role,
      content: [{text: h.content}],
    })),
  ];

  const response = await ai.generate({
    prompt: newMessage,
    system: systemPrompt,
    history: messages.slice(0, -1),
  });

  return {message: {role: 'model', content: response.text}};
}
