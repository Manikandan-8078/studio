
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const initialEvents = [
  { time: '14:30:15', message: 'System nominal. All sensors green.', type: 'info' },
];

export function LiveFeed() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Event Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          <div className="space-y-4 pr-4">
            {events.map((event, index) => (
              <div key={index}>
                <div className="flex items-start gap-3">
                  {event.type === 'alert' ? (
                    <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.message}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                {index < events.length - 1 && <Separator className="my-2 opacity-50" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
