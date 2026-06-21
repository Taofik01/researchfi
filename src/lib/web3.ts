import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

export const zeroGTestnet = defineChain({
  id: 16602,
  name: '0G Newton Testnet',
  nativeCurrency: { name: '0G', symbol: 'OG', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: {
      name: '0G Explorer',
      url: 'https://chainscan-galileo.0g.ai',
    },
  },
})

export const config = createConfig({
  chains: [zeroGTestnet],
  transports: {
    [zeroGTestnet.id]: http(),
  },
})