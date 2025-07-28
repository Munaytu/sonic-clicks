import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // In a real app, you would fetch this from your main database (e.g., Supabase)
  const claimed = Math.floor(Math.random() * 50000) + 1000;
  
  return Response.json({ claimed });
}
