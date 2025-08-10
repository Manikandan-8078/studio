'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flame, Thermometer, DoorOpen, ChevronsRight } from 'lucide-react';
import type { Zone, ZoneStatus } from '@/lib/types';
import { mockZones } from '@/lib/mock-data';
import Link from 'next/link';
import { EvacuationRoutes } from './evacuation-routes';

export function BuildingMap() {
  const [mapZones, setMapZones] = useState<Zone[]>(mockZones);
  const [fireDetected, setFireDetected] = useState(false);
  const [criticalZoneId, setCriticalZoneId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate a fire event and temperature changes
    const timer1 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 'zone-4' ? { ...z, status: 'warning', temp: 45, sensors: z.sensors.map(s => s.name === 'Thermal' ? {...s, status: 'Triggered'} : s) } : z))
      );
    }, 2000);

    const timer2 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 'zone-4' ? { ...z, status: 'critical', temp: 75, sensors: z.sensors.map(s => s.name === 'Smoke' ? {...s, status: 'Triggered'} : s) } : z))
      );
      setFireDetected(true);
      setCriticalZoneId('zone-4');
    }, 4000);
    
    const timer3 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 'zone-3' ? { ...z, status: 'warning', temp: 35 } : z))
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

  const getZoneClass = (status: ZoneStatus) => {
    switch (status) {
      case 'critical':
        return 'bg-primary/80 border-primary animate-pulse';
      case 'warning':
        return 'bg-accent/80 border-accent';
      default:
        return 'bg-secondary hover:bg-secondary/80 cursor-pointer';
    }
  };

  const getStatusIcon = (status: ZoneStatus) => {
    switch(status) {
        case 'critical': return <Flame className="mx-auto mb-1" />;
        case 'warning': return <Thermometer size={18} className="mx-auto mb-1 text-accent-foreground" />;
        default: return null;
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Building Map - Live Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/9] bg-background p-2 rounded-md border">
            <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
                {mapZones.map((zone) => (
                <Link
                    href={`/zones/${zone.id}`}
                    key={zone.id}
                    className={cn(
                    'rounded-md border-2 flex items-center justify-center p-2 transition-colors duration-500',
                    getZoneClass(zone.status)
                    )}
                    data-ai-hint="building interior"
                >
                    <div className="text-center text-primary-foreground">
                    { getStatusIcon(zone.status) ? getStatusIcon(zone.status) :
                        <div className="flex justify-center items-center mb-1">
                        <Thermometer size={18} className="mr-1" />
                        <span>{zone.temp}°C</span>
                        </div>
                    }
                    <p className="text-sm font-medium">{zone.name}</p>
                    </div>
                </Link>
                ))}
            </div>
             {fireDetected && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Exit Icons */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
                    <DoorOpen className="h-8 w-8 mx-auto text-green-500" />
                    <p className="text-xs font-bold text-green-500">EXIT A</p>
                </div>
                 <div className="absolute -top-10 right-4 text-center pointer-events-auto">
                    <DoorOpen className="h-8 w-8 mx-auto text-green-500" />
                    <p className="text-xs font-bold text-green-500">EXIT B</p>
                </div>

                {/* Evacuation Path */}
                 <div className="absolute top-[25%] left-[50%] animate-pulse">
                    <ChevronsRight className="w-12 h-12 text-green-400 -rotate-90" />
                </div>
                <div className="absolute top-[58%] left-[58%] animate-pulse">
                    <ChevronsRight className="w-12 h-12 text-green-400 -rotate-90" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {fireDetected && criticalZoneId && <EvacuationRoutes criticalZoneId={criticalZoneId} />}
    </>
  );
}
