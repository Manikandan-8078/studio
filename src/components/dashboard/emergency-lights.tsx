'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, BatteryCharging, Power, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LightStatus = 'Charged' | 'Active' | 'Testing' | 'Fault';

export function EmergencyLights() {
    const { toast } = useToast();
    const [status, setStatus] = useState<LightStatus>('Charged');
    const [lastTest, setLastTest] = useState('2024-07-01');

    useEffect(() => {
      const timer = setTimeout(() => {
        setStatus('Active');
      }, 4000);
      return () => clearTimeout(timer);
    }, []);

    const handleTest = () => {
        setStatus('Testing');
        toast({
            title: 'Emergency Light Test Initiated',
            description: 'The test will take approximately 60 seconds.',
        });
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1; // 90% success rate
            if (isSuccess) {
                setStatus('Charged');
                setLastTest(new Date().toISOString().split('T')[0]);
                toast({
                    title: 'Test Complete',
                    description: 'Emergency lighting system is fully functional.',
                });
            } else {
                setStatus('Fault');
                 toast({
                    title: 'Test Failed',
                    description: 'A fault was detected in the emergency lighting system.',
                    variant: 'destructive',
                });
            }
        }, 5000); // Simulate a 5-second test
    }

    const getStatusInfo = () => {
        switch(status) {
            case 'Charged':
                return { icon: <BatteryCharging className="w-5 h-5 text-green-500" />, badge: <Badge variant="secondary">Charged</Badge>, text: 'Ready and fully charged.' };
            case 'Active':
                return { icon: <Zap className="w-5 h-5 text-accent" />, badge: <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">Active</Badge>, text: 'Emergency power is active.' };
            case 'Testing':
                return { icon: <Power className="w-5 h-5 text-blue-500 animate-spin" />, badge: <Badge className="bg-blue-500 text-white">Testing</Badge>, text: 'System test in progress.' };
            case 'Fault':
                return { icon: <AlertTriangle className="w-5 h-5 text-destructive" />, badge: <Badge variant="destructive">Fault</Badge>, text: 'A fault has been detected.' };
        }
    }
    
    const { icon, badge, text } = getStatusInfo();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Emergency Lights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {icon}
                        <span className="font-medium">Status</span>
                    </div>
                    {badge}
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5" />
                        <span>Last System Test</span>
                    </div>
                    <span className="font-mono">{lastTest}</span>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" size="sm" onClick={handleTest} disabled={status === 'Testing' || status === 'Active'}>
                    <Power className="mr-2 h-4 w-4" />
                    Initiate System Test
                </Button>
            </CardFooter>
        </Card>
    )
}
