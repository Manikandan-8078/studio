/**
 * @fileOverview This file defines the data structures for the chatbot flow.
 *
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 * - ChatHistory - The type for the chat history.
 */

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
