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

  const {output} = await ai.generate({
    prompt: [
      {role: 'system', content: [{text: systemPrompt}]},
      ...history.map(h => ({
        role: h.role,
        content: [{text: h.content}],
      })),
      {role: 'user', content: [{text: newMessage}]},
    ],
    // IMPORTANT: The history has to be structured as a sequence of user and model messages.
    // The "system" message is optional.
    // The last message in the list must be from the user.
    history: history.map(h => ({
      role: h.role,
      content: [{text: h.content}],
    })),
  });

  return {message: {role: 'model', content: output!.text}};
}
