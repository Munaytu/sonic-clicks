import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet } = body;

    if (!wallet) {
      return new Response(JSON.stringify({ success: false, error: 'Wallet address is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In a real application, you would perform a fast, non-blocking operation here.
    // For example, incrementing a counter in an in-memory database like Redis (Upstash).
    // console.log(`Received click from: ${wallet}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
     return new Response(JSON.stringify({ success: false, error: 'Invalid request body.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
  }
}
