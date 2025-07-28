'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Button onClick={() => disconnect()} variant="outline" className="font-mono">
        <span className="hidden sm:inline">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <LogOut className="h-4 w-4 sm:ml-2" />
      </Button>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })}>
      <LogIn className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
