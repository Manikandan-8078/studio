
'use client';

import { useState } from 'react';
import { mockUsers as initialUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function UserManagement() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const { toast } = useToast();

    const handlePermissionChange = (userId: string, canLogin: boolean) => {
        setUsers(users.map(u => u.id === userId ? { ...u, canLogin } : u));
        const updatedUser = users.find(u => u.id === userId);
        if (updatedUser) {
            toast({
                title: 'Permission Updated',
                description: `Login for ${updatedUser.username} has been ${canLogin ? 'enabled' : 'disabled'}.`
            });
        }
    };

    const clientUsers = users.filter(u => u.role === 'client');

    return (
        <div className="space-y-4">
            {clientUsers.map(user => (
                 <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor={`login-switch-${user.id}`} className="text-base font-medium">
                            {user.username}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            {user.canLogin ? 'Login is enabled for this client.' : 'Login is disabled for this client.'}
                        </p>
                    </div>
                    <Switch
                        id={`login-switch-${user.id}`}
                        checked={user.canLogin}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, checked)}
                    />
                </div>
            ))}
        </div>
    );
}
