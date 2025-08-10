'use server';
import { chat as chatFlow } from '@/ai/flows/chatbot-flow';
import type { ChatInput, ChatOutput } from '@/ai/flows/chatbot-flow';

export async function chat(
  input: ChatInput
): Promise<ChatOutput> {
  return await chatFlow(input);
}
