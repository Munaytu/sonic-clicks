'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface UserRankProps {
  rank: number;
}

export function UserRank({ rank }: UserRankProps) {
  return (
    <Card className="bg-primary/10 border-primary">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <p className="font-semibold text-foreground">Your World Rank</p>
        </div>
        <p className="font-bold text-2xl text-primary font-mono">#{rank.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
