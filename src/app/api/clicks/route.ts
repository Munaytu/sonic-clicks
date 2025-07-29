import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { redis } from '@/lib/redis';
import IPinfoWrapper from 'node-ipinfo';

const ipinfo = new IPinfoWrapper(process.env.IPINFO_TOKEN);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const clicksToAdd = data.clicks || 1;
    const wallet = data.wallet;

    if (typeof clicksToAdd !== 'number' || clicksToAdd <= 0 || !wallet) {
      return NextResponse.json({ error: 'Invalid click data' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.ip;
    console.log('Incoming IP:', ip);
    let country = null;
    if (ip) {
      try {
        console.log('Attempting IP lookup for:', ip);
        const response = await ipinfo.lookupIp(ip);
        country = response.country;
        console.log('IPinfo response:', response);
        console.log('Detected country:', country);
      } catch (ipinfoError) {
        console.error('Error looking up IP with IPinfo:', ipinfoError);
        if (ipinfoError.response) {
          console.error('IPinfo API error response data:', ipinfoError.response.data);
        }
      }
    }

    const { error } = await supabase.from('clicks').insert([
      { wallet_address: wallet, country: country },
    ]);

    if (error) {
      console.error('Error inserting click into Supabase:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    await redis.incrby('total_clicks', clicksToAdd);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_clicks')
      .eq('wallet_address', wallet)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Ignore 'not found' error
      console.error('Error fetching user from Supabase:', userError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (userData) {
      console.log(`Updating existing user ${wallet} with country ${country} and clicks ${userData.total_clicks + clicksToAdd}`);
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ total_clicks: userData.total_clicks + clicksToAdd, country: country }) // Update country here
        .eq('wallet_address', wallet);
      if (updateUserError) {
        console.error('Error updating user in Supabase:', updateUserError);
      }
    } else {
      console.log(`Inserting new user ${wallet} with country ${country} and clicks ${clicksToAdd}`);
      const { error: insertUserError } = await supabase
        .from('users')
        .insert([{ wallet_address: wallet, total_clicks: clicksToAdd, country: country }]);
      if (insertUserError) {
        console.error('Error inserting user into Supabase:', insertUserError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing click data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const totalClicks = await redis.get('total_clicks') || 0;
    return NextResponse.json({ totalClicks });
  } catch (error) {
    console.error('Error fetching total clicks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}