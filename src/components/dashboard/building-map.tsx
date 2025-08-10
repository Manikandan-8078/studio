'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

const zones = [
  { id: 1, name: 'Lobby', status: 'normal' },
  { id: 2, name: 'Office A', status: 'normal' },
  { id: 3, name: 'Office B', status: 'normal' },
  { id: 4, name: 'Server Room', status: 'normal' },
  { id: 5, name: 'Kitchen', status: 'normal' },
  { id: 6, name: 'Warehouse', status: 'normal' },
];

export function BuildingMap() {
  const [mapZones, setMapZones] = useState(zones);

  useEffect(() => {
    // Simulate a fire event
    const timer1 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 4 ? { ...z, status: 'warning' } : z))
      );
    }, 2000);

    const timer2 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 4 ? { ...z, status: 'critical' } : z))
      );
    }, 4000);
    
    const timer3 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 3 ? { ...z, status: 'warning' } : z))
      );
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const getZoneClass = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-primary/80 border-primary animate-pulse';
      case 'warning':
        return 'bg-accent/80 border-accent';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Building Map - Live Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[16/9] bg-background p-2 rounded-md border">
          {mapZones.map((zone) => (
            <div
              key={zone.id}
              className={cn(
                'rounded-md border-2 flex items-center justify-center p-2 transition-colors duration-500',
                getZoneClass(zone.status)
              )}
              data-ai-hint="building interior"
            >
              <div className="text-center">
                {zone.status === 'critical' && <Flame className="mx-auto mb-1 text-primary-foreground" />}
                <p className="text-sm font-medium text-primary-foreground">{zone.name}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
