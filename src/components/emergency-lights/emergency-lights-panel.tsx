
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BatteryCharging, Battery, AlertTriangle, WandSparkles, PowerOff, Power } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type LightStatus = 'Charged' | 'Active' | 'Testing' | 'Fault' | 'Off';

export function EmergencyLightsPanel() {
    const { toast } = useToast();
    const [status, setStatus] = useState<LightStatus>('Charged');
    const [charge, setCharge] = useState(100);

    useEffect(() => {
        // Simulate fire event activation
        const timer = setTimeout(() => {
            if (status === 'Charged') setStatus('Active');
        }, 4000);

        // Simulate charge depletion while active
        let chargeInterval: NodeJS.Timeout | undefined;
        if (status === 'Active') {
            chargeInterval = setInterval(() => {
                setCharge((prev) => Math.max(prev - 1, 85));
            }, 1000);
        } else if (status === 'Charged') {
            if (charge < 100) {
                 chargeInterval = setInterval(() => {
                    setCharge((prev) => Math.min(prev + 2, 100));
                }, 1000);
            }
        }


        return () => {
            clearTimeout(timer);
            if (chargeInterval) {
                clearInterval(chargeInterval);
            }
        };
    }, [status, charge]);


    const handleTest = () => {
        if (status !== 'Charged') {
            toast({
                title: 'Test Blocked',
                description: `Cannot start test while system is ${status.toLowerCase()}.`,
                variant: 'destructive'
            });
            return;
        }

        setStatus('Testing');
        toast({
            title: 'Emergency Light Test Initiated',
            description: 'The system test will run for 15 seconds.'
        });

        const initialCharge = charge;
        setCharge(prev => Math.max(prev - 2, 0));

        setTimeout(() => {
            setStatus('Charged');
             if (charge < initialCharge) {
                // Do not fully recharge, just set back to charged status
            }
            toast({
                title: 'Test Complete',
                description: 'Emergency light system is fully operational.'
            });
        }, 15000); // 15 second test
    }
    
    const handlePowerOff = () => {
        setStatus('Off');
        toast({
            title: 'Emergency Lights Powered Off',
            description: 'The system has been manually deactivated.',
            variant: 'destructive'
        });
    }

    const handlePowerOn = () => {
        setStatus('Charged');
         toast({
            title: 'Emergency Lights Powered On',
            description: 'The system is now active and charging.',
        });
    }

    const getStatusInfo = () => {
        switch (status) {
            case 'Active':
                return { icon: <Battery className="text-primary animate-pulse h-6 w-6" />, label: 'Active - Building Power Lost' };
            case 'Testing':
                return { icon: <WandSparkles className="text-accent h-6 w-6" />, label: 'System Self-Test in Progress...' };
            case 'Fault':
                return { icon: <AlertTriangle className="text-destructive h-6 w-6" />, label: 'System Fault Detected' };
            case 'Off':
                return { icon: <PowerOff className="text-muted-foreground h-6 w-6" />, label: 'System Manually Off' };
            default: // Charged
                return { icon: <BatteryCharging className="text-green-500 h-6 w-6" />, label: 'Fully Charged & Ready' };
        }
    }

    const statusInfo = getStatusInfo();

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Emergency Lights Status & Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div className="flex items-center gap-4">
                        {statusInfo.icon}
                        <span className="font-semibold text-lg text-secondary-foreground">{statusInfo.label}</span>
                    </div>
                </div>
                <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground">Battery Level</span>
                        <span className="font-bold text-lg">{status === 'Off' ? '--' : `${charge}%`}</span>
                    </div>
                    <Progress value={status === 'Off' ? 0 : charge} className="h-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {status === 'Off' ? (
                         <Button onClick={handlePowerOn} className="w-full bg-green-600 hover:bg-green-700">
                            <Power className="mr-2 h-4 w-4" />
                            Power On System
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleTest} disabled={status !== 'Charged'} className="w-full">
                                <WandSparkles className="mr-2 h-4 w-4" />
                                Initiate System Test
                            </Button>
                            <Button onClick={handlePowerOff} disabled={status !== 'Charged'} className="w-full" variant="destructive">
                                <PowerOff className="mr-2 h-4 w-4" />
                                Power Off Lights
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
