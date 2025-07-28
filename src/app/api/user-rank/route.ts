import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // In a real app, you would query your database to get the user's actual rank
  const rank = Math.floor(Math.random() * (10000 - 11 + 1)) + 11;
  
  return Response.json({ rank });
}
