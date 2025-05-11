import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';
import { Address } from 'viem';
import { useState } from 'react';
import { parseEther } from 'ethers';

interface MintNFTParams {
  ipfsURI: string;
  price: string;
  royaltyPercent: string;
}

export const useMintNFT = () => {
  const { address } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: hash, error: writeError, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = async ({ ipfsURI, price, royaltyPercent }: MintNFTParams) => {
    if (!address) {
      setMintError('Please connect your wallet');
      return;
    }

    if (!ipfsURI) {
      setMintError('IPFS URI is required');
      return;
    }

    setIsMinting(true);
    setMintError(null);
    setIsSuccess(false);

    try {
      writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: CONTRACT_ABI,
        functionName: 'mintNFT',
        args: [ipfsURI, parseEther(price), BigInt(Math.floor(Number(royaltyPercent) * 100))],
      });
    } catch (error) {
      console.error('Minting error:', error);
      setMintError(error instanceof Error ? error.message : 'Failed to mint NFT');
      setIsMinting(false);
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && !isSuccess) {
    setIsSuccess(true);
    setIsMinting(false);
    // You might want to extract the tokenId from transaction logs here
  }

  return {
    mintNFT,
    isMinting: isMinting || isConfirming,
    isSuccess,
    error: mintError || writeError?.message,
    hash,
  };
};
