
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ShieldCheck, Wifi } from 'lucide-react';

interface Event {
  time: string;
  message: string;
  type: 'info' | 'alert' | 'system';
}

const initialEvents: Event[] = [
  { time: new Date().toLocaleTimeString(), message: 'System nominal. All sensors green.', type: 'info' },
];

const systemMessages = [
    'Running routine diagnostic on Zone 2 sensors.',
    'Network connectivity stable.',
    'Backup power battery at 100%.',
    'Checking for system updates.',
    'All systems responding normally.'
];

export function LiveFeed() {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  useEffect(() => {
    const addEvent = (event: Event) => {
        setEvents(prev => [event, ...prev].slice(0, 50));
    };

    const simulationInterval = setInterval(() => {
        const newMessage: Event = {
            time: new Date().toLocaleTimeString(),
            message: systemMessages[Math.floor(Math.random() * systemMessages.length)],
            type: 'system',
        };
        addEvent(newMessage);
    }, 8000);

    const syncInterval = setInterval(() => {
        const criticalZone = document.querySelector('.bg-primary\\/80');
        const warningZone = document.querySelector('.bg-accent\\/80');

        const criticalEventExists = events.some(e => e.message.includes('Critical'));
        const warningEventExists = events.some(e => e.message.includes('Warning'));

        if (criticalZone && !criticalEventExists) {
             addEvent({
                time: new Date().toLocaleTimeString(),
                message: 'Critical event detected in Warehouse! Suppression system activated.',
                type: 'alert'
            });
        } else if (warningZone && !warningEventExists && !criticalEventExists) {
             addEvent({
                time: new Date().toLocaleTimeString(),
                message: 'Warning: Elevated temperature detected in Warehouse.',
                type: 'alert'
            });
        } else if (!criticalZone && !warningZone && (criticalEventExists || warningEventExists)) {
             addEvent({
                time: new Date().toLocaleTimeString(),
                message: 'All systems returned to normal status.',
                type: 'info'
            });
        }

    }, 2000);

    return () => {
        clearInterval(simulationInterval);
        clearInterval(syncInterval);
    }
  }, [events]);

  const getIcon = (type: Event['type']) => {
    switch (type) {
        case 'alert':
            return <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />;
        case 'info':
            return <ShieldCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />;
        default:
            return <Wifi className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />;
    }
  }

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
                  {getIcon(event.type)}
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
