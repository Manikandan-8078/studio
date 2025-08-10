'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const initialEvents = [
  { time: '14:30:15', message: 'System nominal. All sensors green.', type: 'info' },
];
const newEvents = [
  { time: '14:32:05', message: 'Warning: Temperature rise in Server Room.', type: 'alert' },
  { time: '14:32:10', message: 'Critical: Smoke detected in Server Room.', type: 'alert' },
  { time: '14:32:11', message: 'FIRE CONFIRMED: Server Room. Power disconnected.', type: 'alert' },
  { time: '14:32:11', message: 'Emergency lights activated building-wide.', type: 'info' },
  { time: '14:32:12', message: 'Emergency services notified.', type: 'info' },
  { time: '14:32:13', message: 'Suppression system activated in Server Room.', type: 'info' },
  { time: '14:32:45', message: 'Warning: Temperature rise in Office B.', type: 'alert' },
];

export function LiveFeed() {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    let eventIndex = 0;
    const interval = setInterval(() => {
      if (eventIndex < newEvents.length) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        setEvents((prev) => [{...newEvents[eventIndex], time: timeString}, ...prev]);
        eventIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
