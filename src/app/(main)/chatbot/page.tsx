'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {chat} from '@/app/actions/chat';
import type {Message} from '@/ai/flows/chatbot-flow';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Send, Bot, User} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Skeleton} from '@/components/ui/skeleton';

const formSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});
type FormValues = z.infer<typeof formSchema>;

export default function ChatbotPage() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    const userMessage: Message = {role: 'user', content: data.message};
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    form.reset();

    try {
      const response = await chat({
        history: newHistory.slice(0, -1),
        newMessage: data.message,
      });
      setHistory([...newHistory, response.message]);
    } catch (error) {
      console.error('Error chatting with AI', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setHistory([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>AI Chatbot</CardTitle>
          <CardDescription>
            Your general-purpose AI assistant. Ask me anything!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {history.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 text-sm bg-muted">
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 border-t pt-4"
          >
            <Input
              {...form.register('message')}
              placeholder="Type your message..."
              autoComplete="off"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
