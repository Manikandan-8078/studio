
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, Beaker, Zap, RadioTower, Image, Wifi, Bluetooth } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const initialSensors = [
  { name: 'Thermal', icon: Thermometer, status: 'Active' },
  { name: 'Smoke', icon: Wind, status: 'Active' },
  { name: 'Chemical', icon: Beaker, status: 'Active' },
  { name: 'Electrical', icon: Zap, status: 'Active' },
  { name: 'Motion', icon: RadioTower, status: 'Active' },
  { name: 'Image', icon: Image, status: 'Active' },
  { name: 'WiFi', icon: Wifi, status: 'Active' },
  { name: 'Bluetooth', icon: Bluetooth, status: 'Active' },
];

export function SensorStatus() {
  const [sensors, setSensors] = useState(initialSensors);

  useEffect(() => {
    const simulationInterval = setInterval(() => {
      setSensors(prevSensors => {
        const thermal = prevSensors.find(s => s.name === 'Thermal');
        if (!thermal) return prevSensors;

        const newSensors = [...prevSensors];
        const thermalIndex = newSensors.findIndex(s => s.name === 'Thermal');
        const smokeIndex = newSensors.findIndex(s => s.name === 'Smoke');

        if (thermal.status === 'Active') {
          newSensors[thermalIndex] = { ...newSensors[thermalIndex], status: 'Warning' };
          newSensors[smokeIndex] = { ...newSensors[smokeIndex], status: 'Warning' };
        } else if (thermal.status === 'Warning') {
          newSensors[thermalIndex] = { ...newSensors[thermalIndex], status: 'Triggered' };
          newSensors[smokeIndex] = { ...newSensors[smokeIndex], status: 'Triggered' };
        } else { // Triggered
          return initialSensors; // Reset
        }
        
        return newSensors;
      });
    }, 60000); // 60 seconds

    return () => clearInterval(simulationInterval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sensors.map((sensor) => (
          <Link 
            href={`/sensors/${sensor.name.toLowerCase()}`}
            key={sensor.name} 
            className="flex items-center justify-between p-2 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <sensor.icon className={cn("w-5 h-5 text-muted-foreground", sensor.status === 'Triggered' && "text-primary")} />
              <span className="font-medium">{sensor.name}</span>
            </div>
            <Badge variant={sensor.status === 'Triggered' ? 'destructive' : sensor.status === 'Warning' ? 'destructive' : 'secondary'}>
              {sensor.status}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
