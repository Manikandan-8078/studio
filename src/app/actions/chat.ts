'use server';
import { chat as chatFlow, type ChatInput, type ChatOutput } from '@/ai/flows/chatbot-flow';

export async function chat(
    input: ChatInput
): Promise<ChatOutput> {
    return await chatFlow(input);
}
