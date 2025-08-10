'use server';
/**
 * @fileOverview A chatbot AI flow.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 * - ChatHistory - The type for the chat history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ChatHistorySchema = z.array(
  z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })
);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

export const ChatInputSchema = z.object({
  history: ChatHistorySchema,
  message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  message: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {history, message} = input;
    const systemPrompt = `You are a helpful AI assistant named Luffy AI.`;

    const {output} = await ai.generate({
      prompt: [
        {text: systemPrompt},
        ...history.map(h => ({
          role: h.role,
          content: [{text: h.content}],
        })),
        {role: 'user', content: [{text: message}]},
      ],
      config: {
        temperature: 0.5,
      },
    });

    return {message: output!.text};
  }
);
