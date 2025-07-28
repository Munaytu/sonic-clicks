'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowDownUp, ShieldCheck } from 'lucide-react';

// Mock contract details. Replace with your actual contract ABI and address.
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const ABI: any[] = []; 

interface StatsProps {
  pendingClicks: number;
  totalClaimed: number;
  onClaimSuccess: () => void;
}

export function Stats({ pendingClicks, totalClaimed, onClaimSuccess }: StatsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();

  const handleClaim = async () => {
    if (pendingClicks < 100) {
      toast({
        title: 'Claim Failed',
        description: 'You need at least 100 clicks to claim.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // This is a mock of the writeContract call.
      // In a real app, you would use wagmi's useWriteContract hook.
      console.log('Simulating contract call to claim tokens...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      // const tx = await writeContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'claim', args: [address, pendingClicks] });
      // await waitForTransaction(tx);
      
      toast({
        title: 'Success!',
        description: `${pendingClicks} clicks have been claimed as tokens.`,
      });
      onClaimSuccess();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to claim tokens. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
        <CardDescription>Clicks accumulate here. Claim them as tokens!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Clicks to Claim</span>
          </div>
          <span className="font-bold text-xl font-mono">{pendingClicks.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="font-medium">Total Clicks Claimed</span>
          </div>
          <span className="font-bold text-xl font-mono">{totalClaimed.toLocaleString()}</span>
        </div>
        <Button onClick={handleClaim} disabled={loading || pendingClicks < 100} className="w-full" size="lg">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Claim Clicks'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
