
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
    const tempInterval = setInterval(() => {
      setMapZones(prevZones => prevZones.map(zone => {
        if (zone.status === 'normal') {
          const tempChange = (Math.random() - 0.5); // Small fluctuation
          return {...zone, temp: Math.round(zone.temp + tempChange) };
        }
        return zone;
      }));
    }, 3000);

    const simulationInterval = setInterval(() => {
        setMapZones(prevZones => {
            const warehouseIndex = prevZones.findIndex(z => z.id === 'zone-6');
            if (warehouseIndex === -1) return prevZones;

            const newZones = [...prevZones];
            const warehouseZone = { ...newZones[warehouseIndex] };

            if (warehouseZone.status === 'normal') {
                warehouseZone.status = 'warning';
                warehouseZone.temp = 45;
                setFireDetected(false);
                setCriticalZoneId(null);
            } else if (warehouseZone.status === 'warning') {
                warehouseZone.status = 'critical';
                warehouseZone.temp = 90;
                setFireDetected(true);
                setCriticalZoneId('zone-6');
            } else { // critical
                warehouseZone.status = 'normal';
                warehouseZone.temp = 20;
                setFireDetected(false);
                setCriticalZoneId(null);
                 // Reset other zones that might have been affected
                return mockZones;
            }
            
            newZones[warehouseIndex] = warehouseZone;
            return newZones;
        });
    }, 60000); // 60 seconds

    return () => {
      clearInterval(tempInterval);
      clearInterval(simulationInterval);
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
          </div>
        </CardContent>
      </Card>
      {fireDetected && criticalZoneId && <EvacuationRoutes criticalZoneId={criticalZoneId} />}
    </>
  );
}
