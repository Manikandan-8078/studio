import { mockZones } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Thermometer, Wind, Zap, Beaker, RadioTower, Image } from 'lucide-react';
import { SuppressionControls } from '@/components/dashboard/suppression-controls';
import { SensorStatus } from '@/components/dashboard/sensor-status';
import { LiveFeed } from '@/components/dashboard/live-feed';


export default function ZoneDetailPage({ params }: { params: { id: string } }) {
  const zone = mockZones.find((z) => z.id === params.id);

  if (!zone) {
    notFound();
  }

  const getSensorIcon = (sensorName: string) => {
    switch (sensorName) {
        case 'Thermal': return <Thermometer className="w-4 h-4 text-muted-foreground" />;
        case 'Smoke': return <Wind className="w-4 h-4 text-muted-foreground" />;
        case 'Electrical': return <Zap className="w-4 h-4 text-muted-foreground" />;
        case 'Chemical': return <Beaker className="w-4 h-4 text-muted-foreground" />;
        case 'Motion': return <RadioTower className="w-4 h-4 text-muted-foreground" />;
        case 'Image': return <Image className="w-4 h-4 text-muted-foreground" />;
        default: return null;
    }
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Zone Dashboard - {zone.name}</CardTitle>
                <CardDescription>
                    Live status and controls for this zone.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <SuppressionControls />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <SensorStatus />
                    <LiveFeed />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
