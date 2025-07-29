import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

async function getTopClickersByCountry(): Promise<{ [country: string]: any[] }> {
  const { data, error } = await supabase
    .from('users')
    .select('wallet_address, total_clicks, country')
    .order('total_clicks', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching top clickers:', error);
    return {};
  }

  console.log('Fetched users for leaderboard:', data);

  const topClickersByCountry: { [country: string]: any[] } = {};

  for (const user of data) {
    if (user.country) {
      if (!topClickersByCountry[user.country]) {
        topClickersByCountry[user.country] = [];
      }
      topClickersByCountry[user.country].push({
        wallet: user.wallet_address,
        clicks: user.total_clicks,
      });
    }
  }

  return topClickersByCountry;
}

export async function GET(req: NextRequest) {
  const topClickers = await getTopClickersByCountry();

  return NextResponse.json({ topClickers });
}