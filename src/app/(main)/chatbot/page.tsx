
'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, User, Send, CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chat } from '@/app/actions/chat';
import type { ChatHistorySchema } from '@/ai/flows/chatbot-types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty' }),
});

type ChatMessage = z.infer<typeof ChatHistorySchema>;

export default function ChatbotPage() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isPending, setIsPending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const { errors } = useFormState({ control: form.control });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: [{ text: data.message }],
    };

    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    form.reset();
    setIsPending(true);
    scrollToBottom();

    try {
      const response = await chat({
        history: history,
        message: data.message,
      });

      const modelMessage: ChatMessage = {
        role: 'model',
        content: [{ text: response.message }],
      };
      setHistory([...newHistory, modelMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: [{ text: 'Sorry, something went wrong. Please try again.' }],
      };
      setHistory([...newHistory, errorMessage]);
    } finally {
      setIsPending(false);
      scrollToBottom();
    }
  };

  useEffect(scrollToBottom, [history]);

  return (
    <Card className="flex flex-col h-[calc(100vh-4rem)] max-h-[850px]">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Chat with our friendly AI to get help and information.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-6 space-y-6">
            <AnimatePresence>
              {history.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex items-start gap-4',
                    entry.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  {entry.role === 'model' && (
                    <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                      <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-prose p-3 rounded-lg whitespace-pre-wrap',
                      entry.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    )}
                  >
                    {entry.content[0].text}
                  </div>
                  {entry.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
              {isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-prose p-3 rounded-lg bg-secondary flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start gap-2">
          <Textarea
            {...form.register('message')}
            placeholder="Ask a question..."
            className="flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isPending) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
      {errors.message && (
        <p className="text-xs text-destructive px-6 pb-2">{errors.message.message}</p>
      )}
    </Card>
  );
}
