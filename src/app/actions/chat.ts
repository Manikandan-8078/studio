'use server';
import { chat as chatFlow } from '@/ai/flows/chatbot-flow';
import type { ChatRequest, ChatResponse } from '@/ai/flows/chatbot-types';

export async function chat(
  input: ChatRequest
): Promise<ChatResponse> {
  return await chatFlow(input);
}
