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
  const systemPrompt = `You are a helpful AI assistant.`;

  // The history from the client already includes the latest user message.
  const messages = [
    ...history.map(h => ({
      role: h.role,
      content: [{text: h.content}],
    })),
  ];

  const {output} = await ai.generate({
    prompt: [
      {role: 'system', content: [{text: systemPrompt}]},
      ...messages,
    ],
    history: messages.slice(0, -1).map(h => ({
      role: h.role,
      content: h.content,
    })),
  });

  return {message: {role: 'model', content: output!.text}};
}
