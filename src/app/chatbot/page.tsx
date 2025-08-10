
'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, History, KeyRound, Eye, EyeOff } from 'lucide-react';
import { chat } from '@/app/actions/chat';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ChatHistory } from '@/components/chatbot/chat-history';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
  timestamp: number;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: [{ text: input }],
      timestamp: Date.now()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat({
        history: newMessages.map(m => ({role: m.role, content: m.content})), // Pass history without timestamp to the AI
        message: input,
      });

      const modelMessage: Message = {
        role: 'model',
        content: [{ text: result.response }],
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        role: 'model',
        content: [{ text: 'Sorry, I encountered an error. Please try again.' }],
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handlePasswordSubmit = () => {
    if (password === 'password1234') {
      setPasswordError('');
      setShowPasswordDialog(false);
      setShowHistoryDialog(true);
      setPassword('');
      setShowPassword(false);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };


  return (
    <>
      <Card className="flex flex-col h-[calc(100vh-5rem)]">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>AI Chatbot</CardTitle>
                <CardDescription>Have a conversation with our AI assistant.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                <History className="mr-2 h-4 w-4" />
                View History
            </Button>
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
      
      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPassword('');
          setPasswordError('');
          setShowPassword(false);
        }
      }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Admin Authentication</DialogTitle>
                <DialogDescription>
                    Enter the admin password to view chat history.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                 <div className="relative">
                    <div className="flex items-center">
                        <KeyRound className="absolute left-3 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Enter admin password"
                          className="pl-10" 
                        />
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </div>
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
                <Button onClick={handlePasswordSubmit}>View History</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-2xl">
              <DialogHeader>
                  <DialogTitle>Chat History (Last 60 Days)</DialogTitle>
                  <DialogDescription>
                      Review of all conversations with the AI chatbot.
                  </DialogDescription>
              </DialogHeader>
              <ChatHistory />
              <DialogFooter>
                  <Button onClick={() => setShowHistoryDialog(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
