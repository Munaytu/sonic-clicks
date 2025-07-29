import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('get_user_rank', { user_wallet: wallet });

  if (error) {
    console.error('Error fetching user rank:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ rank: data });
}
