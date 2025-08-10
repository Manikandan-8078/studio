import {z} from 'genkit';

export const ChatHistorySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({text: z.string()})),
});

export const ChatRequestSchema = z.object({
  history: z.array(ChatHistorySchema),
  message: z.string(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  message: z.string(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
