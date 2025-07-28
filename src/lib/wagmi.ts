'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { getDefaultConfig, createModal } from '@rabby-wallet/rabbykit';

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

const chains = [sonic, mainnet, sepolia] as const;

export const config = createConfig(
  getDefaultConfig({
    appName: 'ClickWave',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    chains: chains,
    transports: {
      [sonic.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
  })
);

export const rabbyKit = createModal({
  wagmi: config,
  chains,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  theme: 'dark'
});
