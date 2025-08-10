'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import type { ChatHistory } from '@/ai/flows/chatbot-types';
import { chat } from '@/app/actions/chat';
import { ChatHistory as ChatHistoryComponent } from '@/components/chatbot/chat-history';

export default function ChatbotPage() {
  const [history, setHistory] = useState<ChatHistory>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage = { role: 'user' as const, content: message };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setMessage('');

    try {
      const result = await chat({
        history: history, // Send history *before* the new user message
        message: message,
      });

      if (result.message) {
        setHistory([...newHistory, { role: 'model'as const, content: result.message }]);
      } else {
        setError('The AI returned an empty response.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while communicating with the AI.');
      // Revert history if the API call fails
      setHistory(history);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-5rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot /> Gemini AI
        </CardTitle>
        <CardDescription>
          Ask me anything about fire safety, incident analysis, or system status.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <ChatHistoryComponent history={history} />
        {error && <p className="text-destructive text-center">{error}</p>}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                </>
            ) : (
                <>
                    <Send className="mr-2 h-4 w-4" />
                    <span>Send</span>
                </>
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
