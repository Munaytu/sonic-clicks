
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl) {
  throw new Error('Missing UPSTASH_REDIS_REST_URL environment variable');
}
if (!redisToken) {
  throw new Error('Missing UPSTASH_REDIS_REST_TOKEN environment variable');
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
