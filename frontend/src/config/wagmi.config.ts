import { createConfig } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { http } from 'viem';

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});
