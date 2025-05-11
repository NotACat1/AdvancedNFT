import { useState, useEffect } from 'react';
import { useContractRead, useWatchContractEvent } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';

export interface TokenData {
  creator: `0x${string}`;
  royaltyPercent: bigint;
  createdAt: bigint;
  price: bigint;
  isForSale: boolean;
}

export const useTokenDetails = (tokenId: bigint) => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  const { data, refetch, isLoading, isError, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTokenData',
    args: [tokenId],
  });

  useEffect(() => {
    if (data) {
      const { createdAt, creator, isForSale, price, royaltyPercent } = data;
      setTokenData({
        creator,
        royaltyPercent,
        createdAt,
        price,
        isForSale,
      });
    }
  }, [data]);

  // Обновляем информацию о токене при событиях TokenListed, TokenSold
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenListed',
    onLogs() {
      refetch();
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenSold',
    onLogs() {
      refetch();
    },
  });

  return { tokenData, isLoading, isError, error };
};
