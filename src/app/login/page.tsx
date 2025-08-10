
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, KeyRound, Eye, EyeOff } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setError('');

    if (role === 'admin') {
      if (username === 'mk' && password === '1234') {
        toast({
          title: 'Login Successful',
          description: 'Welcome back, Admin!',
        });
        router.push('/');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } else if (role === 'client') {
       if (username === 'client' && password === 'password') {
        toast({
          title: 'Login Successful',
          description: 'Welcome back, Client!',
        });
        router.push('/');
      } else {
        setError('Invalid client credentials. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="text-primary size-12" />
          </div>
          <CardTitle className="text-2xl">Inferno Shield</CardTitle>
          <CardDescription>Please log in to access the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <RadioGroup defaultValue="admin" onValueChange={setRole} className="flex justify-center gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">Client</Label>
                </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
            </div>
          </div>
          {error && <p className="text-sm text-center text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleLogin}>
                Login
            </Button>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="remember" className="h-4 w-4" />
                    <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
                </div>
                <Button variant="link" className="text-sm p-0 h-auto">Forgot your password?</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
