
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function MessagingPage() {
    const { toast } = useToast();

    const handleBroadcast = () => {
        toast({
            title: "Message Broadcast",
            description: "Evacuation instructions have been sent to all personnel.",
            variant: "default",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Employee Safety Messaging</CardTitle>
                <CardDescription>Broadcast instructions and alerts to all personnel or specific zones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="zone-select">Target Zone</Label>
                    <Select defaultValue="all">
                        <SelectTrigger id="zone-select">
                            <SelectValue placeholder="Select a zone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Zones</SelectItem>
                            <SelectItem value="floor1">Floor 1</SelectItem>
                            <SelectItem value="floor2">Floor 2</SelectItem>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message-input">Message</Label>
                    <Textarea id="message-input" placeholder="Type your message here. e.g., Evacuate immediately via the East exit." rows={5} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleBroadcast}>
                    <Send className="mr-2 h-4 w-4" />
                    Broadcast Message
                </Button>
            </CardFooter>
        </Card>
    );
}
