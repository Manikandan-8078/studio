'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, MapPin, Milestone } from 'lucide-react';

interface EvacuationRoutesProps {
    criticalZoneId: string;
}

const evacuationPlans: Record<string, { title: string; steps: string[] }> = {
    'zone-4': {
        title: 'Server Room Fire',
        steps: [
            "Exit Server Room, turn left.",
            "Proceed down the main corridor.",
            "Evacuate via EXIT A at the end of the hall.",
            "Secondary Route: Turn right, proceed to EXIT B.",
        ]
    },
    'default': {
        title: 'General Evacuation',
        steps: [
            "Proceed to the nearest marked exit.",
            "Listen for announcements from building staff.",
            "Do not use elevators.",
        ]
    }
}

export function EvacuationRoutes({ criticalZoneId }: EvacuationRoutesProps) {
    const plan = evacuationPlans[criticalZoneId] || evacuationPlans['default'];

    return (
        <Card className="border-primary bg-primary/5">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-primary">Evacuation Route Activated</CardTitle>
                        <CardDescription className="text-primary/80">Follow these instructions for safe egress.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Plan for: {plan.title}</h4>
                    </div>
                    <ul className="space-y-3 pl-5">
                        {plan.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Milestone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
