'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flame, Thermometer } from 'lucide-react';

const zones = [
  { id: 1, name: 'Lobby', status: 'normal', temp: 22 },
  { id: 2, name: 'Office A', status: 'normal', temp: 23 },
  { id: 3, name: 'Office B', status: 'normal', temp: 23 },
  { id: 4, name: 'Server Room', status: 'normal', temp: 25 },
  { id: 5, name: 'Kitchen', status: 'normal', temp: 24 },
  { id: 6, name: 'Warehouse', status: 'normal', temp: 20 },
];

export function BuildingMap() {
  const [mapZones, setMapZones] = useState(zones);

  useEffect(() => {
    // Simulate a fire event and temperature changes
    const timer1 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 4 ? { ...z, status: 'warning', temp: 45 } : z))
      );
    }, 2000);

    const timer2 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 4 ? { ...z, status: 'critical', temp: 75 } : z))
      );
    }, 4000);
    
    const timer3 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 3 ? { ...z, status: 'warning', temp: 35 } : z))
      );
    }, 5500);

    const tempInterval = setInterval(() => {
      setMapZones(prevZones => prevZones.map(zone => {
        if (zone.status === 'normal') {
          const tempChange = (Math.random() - 0.5); // Small fluctuation
          return {...zone, temp: Math.round(zone.temp + tempChange) };
        }
        return zone;
      }));
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(tempInterval);
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
              <div className="text-center text-primary-foreground">
                {zone.status === 'critical' ? (
                  <Flame className="mx-auto mb-1" />
                ) : (
                  <div className="flex justify-center items-center mb-1">
                    <Thermometer size={18} className="mr-1" />
                    <span>{zone.temp}°C</span>
                  </div>
                )}
                <p className="text-sm font-medium">{zone.name}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
