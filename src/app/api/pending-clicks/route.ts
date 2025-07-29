import { redis } from '@/lib/db';
import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(req: NextRequest) {
  const totalClicks = await redis.get('total_clicks') || 0;
  return Response.json({ clicks: totalClicks });
}
