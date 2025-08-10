'use server';
/**
 * @fileOverview A chatbot AI flow.
 *
 * - chat - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import {
    ChatInput,
    ChatInputSchema,
    ChatOutput,
    ChatOutputSchema,
} from '@/ai/flows/chatbot-types';

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
        {role: 'user', content: [{text: systemPrompt}]},
        {role: 'model', content: [{text: "Ok, I am Luffy AI. How can I help you?"}]},
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
