import { mockZones } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flame, Thermometer, Wind, Beaker, Zap } from 'lucide-react';

export default function ZoneDetailPage({ params }: { params: { id: string } }) {
  const zone = mockZones.find((z) => z.id === params.id);

  if (!zone) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zone Details - {zone.name}</CardTitle>
          <CardDescription>
            Live status and sensor readings for this zone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Live Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-muted-foreground mb-1">Overall Status</h4>
                            <p className={cn("capitalize font-bold text-lg", {
                                'text-green-500': zone.status === 'normal',
                                'text-yellow-500': zone.status === 'warning',
                                'text-red-500': zone.status === 'critical',
                            })}>{zone.status}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-muted-foreground mb-1">Temperature</h4>
                            <p className="text-lg">{zone.temp}°C</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Sensor Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {zone.sensors.map(sensor => (
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
                    </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
