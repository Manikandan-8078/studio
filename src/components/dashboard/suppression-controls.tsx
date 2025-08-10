'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, Target, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SuppressionControls() {
  const { toast } = useToast();

  const handleOverride = (gun: string) => {
    toast({
      title: 'Suppression System Override',
      description: `Manually activating ${gun}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suppression System Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" size="lg" className="h-20 flex-col gap-2" onClick={() => handleOverride('Water Sprinklers')}>
          <Waves className="w-6 h-6" />
          <span>Water Sprinklers</span>
        </Button>
        <Button variant="outline" size="lg" className="h-20 flex-col gap-2" onClick={() => handleOverride('Foam Concentrate')}>
          <Power className="w-6 h-6" />
          <span>Foam Concentrate</span>
        </Button>
        <Button size="lg" className="h-20 flex-col gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleOverride('Targeted MAP Gun')}>
          <Target className="w-6 h-6" />
          <span>Targeted MAP Gun</span>
        </Button>
      </CardContent>
    </Card>
  );
}
