'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import {ChatRequest, ChatResponse} from './chatbot-types';

const systemPrompt = `You are a helpful and friendly AI assistant.`;

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const history = [
    {role: 'user' as const, content: [{text: systemPrompt}]},
    {
      role: 'model' as const,
      content: [{text: 'Ok, I am a helpful and friendly AI assistant.'}],
    },
    ...req.history,
  ];

  const {output} = await ai.generate({
    prompt: [
      ...history.flatMap(h => h.content.map(c => c.text)),
      req.message,
    ].join('\n'),
  });

  return {message: output!.text};
}
