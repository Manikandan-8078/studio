
'use client';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
  timestamp: number;
}

export function ChatHistory() {
  const [history, setHistory] = useState<Message[]>([]);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      const allMessages: Message[] = JSON.parse(storedMessages);
      const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
      const filteredMessages = allMessages.filter(
        (msg) => msg.timestamp >= sixtyDaysAgo
      );
      setHistory(filteredMessages);
    }
  }, []);

  return (
    <ScrollArea className="h-96 pr-4">
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((message, index) => (
            <div key={index}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-secondary">
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-secondary-foreground" />
                  ) : (
                    <Bot className="w-5 h-5 text-secondary-foreground" />
                  )}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-sm whitespace-pre-wrap">{message.content[0].text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(message.timestamp), 'PPP p')}
                  </p>
                </div>
              </div>
              {index < history.length - 1 && <Separator className="my-2" />}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No chat history found from the last 60 days.</p>
        )}
      </div>
    </ScrollArea>
  );
}
