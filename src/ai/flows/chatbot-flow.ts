
'use server';

/**
 * @fileOverview This file defines a Genkit flow for a simple chatbot.
 * - chat - A function that generates a chat response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).describe('The chat history.'),
  message: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: z.object({
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() })),
    })),
    message: z.string(),
  })},
  output: {schema: ChatOutputSchema},
  prompt: `You are Luffy AI, a helpful AI assistant.

You have access to the following chat history. Continue the conversation.

{{#each history}}
{{#if (eq role 'user')}}User: {{content.[0].text}}{{/if}}
{{#if (eq role 'model')}}You: {{content.[0].text}}{{/if}}
{{/each}}

User: {{{message}}}
You:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history, message } = input;
    // The prompt expects the history to not include the current message
    const aipromptHistory = history.slice(0, -1);
    
    const {output} = await prompt({
        history: aipromptHistory,
        message: message,
    });
    return output!;
  }
);
