
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, Beaker, Zap, RadioTower, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialSensors = [
  { name: 'Thermal', icon: Thermometer, status: 'Active' },
  { name: 'Smoke', icon: Wind, status: 'Active' },
  { name: 'Chemical', icon: Beaker, status: 'Active' },
  { name: 'Electrical', icon: Zap, status: 'Active' },
  { name: 'Motion', icon: RadioTower, status: 'Active' },
  { name: 'Image', icon: Image, status: 'Active' },
];

export function SensorStatus() {
  const [sensors, setSensors] = useState(initialSensors);

  useEffect(() => {
    const timer1 = setTimeout(() => {
        setSensors((prevSensors) =>
            prevSensors.map((s) => (s.name === 'Thermal' ? { ...s, status: 'Triggered' } : s))
        );
    }, 2000);

    const timer2 = setTimeout(() => {
        setSensors((prevSensors) =>
            prevSensors.map((s) => (s.name === 'Smoke' ? { ...s, status: 'Triggered' } : s))
        );
    }, 4000);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sensors.map((sensor) => (
          <div key={sensor.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <sensor.icon className={cn("w-5 h-5 text-muted-foreground", sensor.status === 'Triggered' && "text-primary")} />
              <span className="font-medium">{sensor.name}</span>
            </div>
            <Badge variant={sensor.status === 'Triggered' ? 'destructive' : 'secondary'}>
              {sensor.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
