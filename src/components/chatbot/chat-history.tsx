'use client';
import type { ChatHistory } from '@/ai/flows/chatbot-types';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ChatHistory({ history }: { history: ChatHistory }) {
    if (history.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            {history.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                        'flex items-start gap-4',
                        message.role === 'user' ? 'justify-end' : ''
                    )}
                >
                    {message.role === 'model' && (
                         <Avatar>
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                            'rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-lg',
                            message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary'
                        )}
                    >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <Avatar>
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
        </div>
    );
}
