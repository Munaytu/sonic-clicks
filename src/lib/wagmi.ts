'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

export const sonic = defineChain({
  id: 6420, // This is a fictional ID. Replace with the actual Sonic Chain ID.
  name: 'Sonic',
  nativeCurrency: { name: 'Sonic', symbol: 'SNC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sonic.org'] }, // Replace with actual RPC endpoint
  },
  blockExplorers: {
    default: { name: 'SonicScan', url: 'https://explorer.sonic.org' }, // Replace with actual explorer
  },
  testnet: true,
});

export const config = createConfig({
  chains: [sonic, mainnet, sepolia],
  transports: {
    [sonic.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
