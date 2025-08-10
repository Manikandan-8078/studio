'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Flame, Thermometer, Wind, Beaker, Zap } from 'lucide-react';

type ZoneStatus = 'normal' | 'warning' | 'critical';

interface Zone {
  id: number;
  name: string;
  status: ZoneStatus;
  temp: number;
  sensors: { name: string; status: string }[];
}

const initialZones: Zone[] = [
  { id: 1, name: 'Lobby', status: 'normal', temp: 22, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
  { id: 2, name: 'Office A', status: 'normal', temp: 23, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
  { id: 3, name: 'Office B', status: 'normal', temp: 23, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
  { id: 4, name: 'Server Room', status: 'normal', temp: 25, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}, {name: 'Electrical', status: 'Active'}] },
  { id: 5, name: 'Kitchen', status: 'normal', temp: 24, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}, {name: 'Chemical', status: 'Active'}] },
  { id: 6, name: 'Warehouse', status: 'normal', temp: 20, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
];

export function BuildingMap() {
  const [mapZones, setMapZones] = useState(initialZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    // Simulate a fire event and temperature changes
    const timer1 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 4 ? { ...z, status: 'warning', temp: 45, sensors: z.sensors.map(s => s.name === 'Thermal' ? {...s, status: 'Triggered'} : s) } : z))
      );
    }, 2000);

    const timer2 = setTimeout(() => {
      setMapZones((prevZones) =>
        prevZones.map((z) => (z.id === 4 ? { ...z, status: 'critical', temp: 75, sensors: z.sensors.map(s => s.name === 'Smoke' ? {...s, status: 'Triggered'} : s) } : z))
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

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
  };
  
  const handleCloseDialog = () => {
    setSelectedZone(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Building Map - Live Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[16/9] bg-background p-2 rounded-md border">
            {mapZones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedZone} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent>
          {selectedZone && (
            <>
              <DialogHeader>
                <DialogTitle>Status for {selectedZone.name}</DialogTitle>
                <DialogDescription>
                  Detailed sensor readings and zone status.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                  <div>
                      <h4 className="font-semibold mb-2">Overall Status</h4>
                      <p className={cn("capitalize font-bold", {
                          'text-green-500': selectedZone.status === 'normal',
                          'text-yellow-500': selectedZone.status === 'warning',
                          'text-red-500': selectedZone.status === 'critical',
                      })}>{selectedZone.status}</p>
                  </div>
                   <div>
                      <h4 className="font-semibold mb-2">Temperature</h4>
                      <p>{selectedZone.temp}°C</p>
                  </div>
                  <div>
                      <h4 className="font-semibold mb-2">Sensor Details</h4>
                      <ul className="space-y-2">
                        {selectedZone.sensors.map(sensor => (
                            <li key={sensor.name} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    {sensor.name === 'Smoke' && <Wind className="w-4 h-4 text-muted-foreground" />}
                                    {sensor.name === 'Thermal' && <Thermometer className="w-4 h-4 text-muted-foreground" />}
                                    {sensor.name === 'Electrical' && <Zap className="w-4 h-4 text-muted-foreground" />}
                                    {sensor.name === 'Chemical' && <Beaker className="w-4 h-4 text-muted-foreground" />}
                                    {sensor.name}
                                </span>
                                 <span className={cn('font-medium', {'text-green-500': sensor.status === 'Active', 'text-red-500': sensor.status === 'Triggered'})}>
                                    {sensor.status}
                                </span>
                            </li>
                        ))}
                      </ul>
                  </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
