
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import type {Message, ChatRequest, ChatResponse} from './chatbot-types';
import type {Part} from 'genkit';

export {type Message, type ChatRequest, type ChatResponse};

export async function chat(input: ChatRequest): Promise<ChatResponse> {
  const {history, newMessage, imageDataUri} = input;
  const systemPrompt = `You are a helpful AI assistant named Luffy AI.`;

  const messages = [
    ...history.map(h => ({
      role: h.role,
      content: [{text: h.content}],
    })),
  ];
  
  const userContent: Part[] = [{text: newMessage}];
  if (imageDataUri) {
    userContent.push({media: {url: imageDataUri}});
  }

  const response = await ai.generate({
    prompt: {
      role: 'user',
      content: userContent
    },
    system: systemPrompt,
    history: messages,
  });

  return {message: {role: 'model', content: response.text}};
}
