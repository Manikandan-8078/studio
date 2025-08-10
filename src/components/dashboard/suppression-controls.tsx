'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, Target, Waves, ShieldCheck, ShieldOff, KeyRound, MessageSquareCode, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SuppressionControls() {
  const { toast } = useToast();
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingState, setPendingState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleOverride = (gun: string) => {
    if (!isSystemActive) {
      toast({
        title: 'System Disabled',
        description: 'Cannot activate suppression system while it is turned off.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Suppression System Override',
      description: `Manually activating ${gun}.`,
    });
  };

  const handleToggleSystem = (checked: boolean) => {
    setPendingState(checked);
    setShowPasswordDialog(true);
  };
  
  const handlePasswordSubmit = () => {
    // In a real app, you'd verify the password against a backend.
    if (password === 'password1234') {
      setPasswordError('');
      setShowPasswordDialog(false);
      setShowOtpDialog(true);
      setPassword('');
      setShowPassword(false);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleOtpSubmit = () => {
    // In a real app, you'd verify the OTP against a backend.
    if (otp === '12345') {
      setOtpError('');
      setShowOtpDialog(false);
      setIsSystemActive(pendingState);
      setOtp('');
      toast({
        title: `System has been ${pendingState ? 'activated' : 'deactivated'}`,
        description: `The suppression system is now ${pendingState ? 'online' : 'offline'}.`,
        variant: pendingState ? 'default' : 'destructive',
      });
    } else {
      setOtpError('Incorrect OTP. Please try again.');
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Suppression System Controls</CardTitle>
                <CardDescription>Manual override and system status.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                {isSystemActive ? <ShieldCheck className="w-6 h-6 text-green-500" /> : <ShieldOff className="w-6 h-6 text-destructive" />}
                <Switch
                    checked={isSystemActive}
                    onCheckedChange={handleToggleSystem}
                    aria-label="Toggle Suppression System"
                />
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" size="lg" className="h-20 flex-col gap-2" onClick={() => handleOverride('Water Sprinklers')} disabled={!isSystemActive}>
            <Waves className="w-6 h-6" />
            <span>Water Sprinklers</span>
          </Button>
          <Button variant="outline" size="lg" className="h-20 flex-col gap-2" onClick={() => handleOverride('Foam Concentrate')} disabled={!isSystemActive}>
            <Power className="w-6 h-6" />
            <span>Foam Concentrate</span>
          </Button>
          <Button size="lg" className="h-20 flex-col gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleOverride('Targeted MAP Gun')} disabled={!isSystemActive}>
            <Target className="w-6 h-6" />
            <span>Targeted MAP Gun</span>
          </Button>
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPassword('');
          setPasswordError('');
          setShowPassword(false);
        }
      }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Admin Authentication Required</DialogTitle>
                <DialogDescription>
                    Please enter your password to change the system status. This action is logged.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <div className="flex items-center">
                        <KeyRound className="absolute left-3 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Enter admin password"
                          className="pl-10" 
                        />
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </div>
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
                <Button onClick={handlePasswordSubmit}>Continue</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={(open) => {
        if (!open) {
          setShowOtpDialog(false);
          setOtp('');
          setOtpError('');
        }
      }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                    Enter the one-time password sent to your registered device.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                 <div className="flex items-center space-x-2">
                    <MessageSquareCode className="w-5 h-5 text-muted-foreground" />
                    <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
                </div>
                {otpError && <p className="text-sm text-destructive">{otpError}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowOtpDialog(false)}>Cancel</Button>
                <Button onClick={handleOtpSubmit}>Confirm</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
