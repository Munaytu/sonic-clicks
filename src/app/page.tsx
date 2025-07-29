'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Clicker } from '@/components/Clicker';
import { WalletButton } from '@/components/WalletButton';
import { Stats } from '@/components/Stats';
import { Leaderboard } from '@/components/Leaderboard';

import { UserRank } from '@/components/UserRank';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Gem } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [localClicks, setLocalClicks] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0); // Mock balance
  const [userRank, setUserRank] = useState<number | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!address) return;

    try {
      const [pendingRes, claimedRes, rankRes] = await Promise.all([
        fetch(`/api/pending-clicks?wallet=${address}`),
        fetch(`/api/claimed?wallet=${address}`),
        fetch(`/api/user-rank?wallet=${address}`),
      ]);
      const pendingData = await pendingRes.json();
      const claimedData = await claimedRes.json();
      const rankData = await rankRes.json();
      
      setLocalClicks(pendingData.clicks || 0);
      setTotalClaimed(claimedData.claimed || 0);
      setWalletBalance(Math.random() * 1); // Mock wallet token balance
      setUserRank(rankData.rank || null);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      fetchUserData();
    } else {
      setLocalClicks(0);
      setTotalClaimed(0);
      setWalletBalance(0);
      setUserRank(null);
    }
  }, [isConnected, address, fetchUserData]);

  const handleGlobalClick = () => {
    if (!isConnected) return;
    setLocalClicks((prev) => prev + 1);
    trackClick();
  };

  const trackClick = () => {
    if (!address) return;
    // Fire-and-forget request to the backend
    try {
      navigator.sendBeacon('/api/clicks', JSON.stringify({ wallet: address }));
      fetchUserData(); // Refresh data immediately after sending beacon
    } catch (error) {
       // Fallback for environments where sendBeacon is not supported
       fetch('/api/clicks', {
        method: 'POST',
        body: JSON.stringify({ wallet: address }),
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      }).then(() => fetchUserData()).catch(err => console.error("Fallback click tracking failed:", err));
    }
  };

  const handleClaimSuccess = async () => {
    await fetchUserData();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-background to-primary/20 p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Gem className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-headline">
            ClickWave
          </h1>
        </div>
        <div className="flex items-center gap-4">
           {isConnected && (
            <div className="hidden sm:block text-right">
              <p className="text-sm text-muted-foreground">Tokens in Wallet</p>
              <p className="font-bold text-lg text-primary">{walletBalance.toFixed(4)} $PULSE</p>
            </div>
          )}
          <WalletButton />
        </div>
      </header>

      <main className="w-full flex-grow flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
        <div className="flex-grow flex flex-col items-center justify-center gap-8">
          <Clicker onClick={handleGlobalClick} disabled={!isConnected} />
          {isConnected && (
            <Stats
              pendingClicks={localClicks}
              totalClaimed={totalClaimed}
              onClaimSuccess={handleClaimSuccess}
            />
          )}
        </div>

        {isConnected && (
          <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 space-y-8">
            {userRank !== null && <UserRank rank={userRank} />}
            <Leaderboard />
            
          </aside>
        )}
      </main>
    </div>
  );
}
