'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User } from 'lucide-react';
import { chat } from '@/app/actions/chat';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: [{ text: input }],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat({
        history: messages,
        message: input,
      });

      const modelMessage: Message = {
        role: 'model',
        content: [{ text: result.response }],
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        role: 'model',
        content: [{ text: 'Sorry, I encountered an error. Please try again.' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-5rem)]">
      <CardHeader>
        <CardTitle>AI Chatbot</CardTitle>
        <CardDescription>Have a conversation with our AI assistant.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-secondary">
                  {message.role === 'user' ? <User className="w-5 h-5 text-secondary-foreground" /> : <Bot className="w-5 h-5 text-secondary-foreground" />}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-sm whitespace-pre-wrap">{message.content[0].text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <div className="p-2 rounded-full bg-secondary">
                    <Bot className="w-5 h-5 text-secondary-foreground" />
                 </div>
                 <div className="flex-1 pt-1.5 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
