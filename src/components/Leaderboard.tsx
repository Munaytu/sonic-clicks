'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface LeaderboardEntry {
  rank: number;
  country: string; // Changed from wallet to country
  clicks: number;
}

interface TokenHolderEntry {
  rank: number;
  wallet: string;
  tokens: number;
}

interface LeaderboardData {
  topClickers: { [country: string]: any[] };
  topTokenHolders: TokenHolderEntry[]; // Assuming this will be an array of token holders
}

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null); // Changed state type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const leaderboardData: LeaderboardData = await res.json();
        setData(leaderboardData);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Function to process and flatten the data for the country leaderboard display
  const getCountryLeaderboardData = (topClickers: { [country: string]: any[] } | undefined): LeaderboardEntry[] => {
    if (!topClickers) return [];

    // Flatten the nested country data and assign ranks
    const flattenedData: LeaderboardEntry[] = Object.entries(topClickers)
      .map(([country, entries]) => ({
        country,
        clicks: entries.reduce((sum, entry) => sum + entry.clicks, 0), // Sum clicks for each country
      }))
      .sort((a, b) => b.clicks - a.clicks) // Sort by total clicks
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return flattenedData;
  };

  const countryLeaderboardData = getCountryLeaderboardData(data?.topClickers);
  const tokenHoldersData = data?.topTokenHolders || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top clicking countries and token holders.</CardDescription> {/* Updated description */}
      </CardHeader>
      <CardContent>
        {/* Country Leaderboard */}
        <h3 className="text-lg font-semibold mb-2">Top Clicking Countries</h3>
        <ScrollArea className="h-[300px] mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Total Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                countryLeaderboardData.map((entry) => (
                  <TableRow key={entry.rank}>
                    <TableCell className="font-bold">{entry.rank}</TableCell>
                    <TableCell className="font-mono">{entry.country}</TableCell>
                    <TableCell className="text-right font-bold">{entry.clicks.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <Separator className="my-4" />

        {/* Top Token Holders */}
        <h3 className="text-lg font-semibold mb-2">Top Token Holders</h3>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead className="text-right">Tokens Held</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : tokenHoldersData.length > 0 ? (
                tokenHoldersData.map((entry, index) => (
                  <TableRow key={index}> {/* Using index as key for now, assuming no unique ID in placeholder */}
                    <TableCell className="font-bold">{index + 1}</TableCell>
                    <TableCell className="font-mono">{entry.wallet.slice(0, 6)}...{entry.wallet.slice(-4)}</TableCell>
                    <TableCell className="text-right font-bold">{entry.tokens.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No token holders data available yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
