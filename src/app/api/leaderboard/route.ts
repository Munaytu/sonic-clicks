import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, you would fetch this from a cached view of your database
  const leaderboardData = [
    { rank: 1, wallet: '0x1A2b...c3D4', clicks: 1_245_789 },
    { rank: 2, wallet: '0x5E6f...g7H8', clicks: 987_123 },
    { rank: 3, wallet: '0x9I0j...k1L2', clicks: 854_321 },
    { rank: 4, wallet: '0x3M4n...o5P6', clicks: 765_432 },
    { rank: 5, wallet: '0x7Q8r...s9T0', clicks: 612_345 },
    { rank: 6, wallet: '0xAbC...dEfG', clicks: 587_901 },
    { rank: 7, wallet: '0xH1j...kLmN', clicks: 555_432 },
    { rank: 8, wallet: '0xOpQ...rStU', clicks: 512_876 },
    { rank: 9, wallet: '0xVwX...yZaB', clicks: 499_123 },
    { rank: 10, wallet: '0xCdE...fGhI', clicks: 487_654 },
  ];
  
  return NextResponse.json(leaderboardData);
}
