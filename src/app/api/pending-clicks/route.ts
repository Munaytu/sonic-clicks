import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // In a real app, you would fetch this from Redis or your database
  const clicks = Math.floor(Math.random() * 1000);
  
  return Response.json({ clicks });
}
