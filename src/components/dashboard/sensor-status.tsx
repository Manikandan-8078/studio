import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, Beaker, Zap, RadioTower, Image } from 'lucide-react';

const sensors = [
  { name: 'Thermal', icon: Thermometer, status: 'Active' },
  { name: 'Smoke', icon: Wind, status: 'Active' },
  { name: 'Chemical', icon: Beaker, status: 'Active' },
  { name: 'Electrical', icon: 'Triggered', status: 'Triggered' },
  { name: 'Motion', icon: RadioTower, status: 'Active' },
  { name: 'Image', icon: Image, status: 'Active' },
];

export function SensorStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sensors.map((sensor) => (
          <div key={sensor.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <sensor.icon className="w-5 h-5 text-muted-foreground" />
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
