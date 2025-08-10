import {z} from 'genkit';

export const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChatRequestSchema = z.object({
  history: z.array(MessageSchema),
  newMessage: z.string(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  message: MessageSchema,
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
