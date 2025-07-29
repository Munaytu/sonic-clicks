import Redis from 'ioredis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variable');
}

export const redis = new Redis(redisUrl, {
  password: redisToken,
  tls: {
    rejectUnauthorized: false,
  },
});
