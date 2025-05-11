import { useState, useEffect } from 'react';
import { useContractRead, useWatchContractEvent } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@config/contract';
import { IContractStats } from '@type/IContractStats';
import { IMarketplaceStats } from '@type/IMarketplaceStats';

export function useContractStats() {
  const [stats, setStats] = useState<IContractStats | null>(null);

  const { data, refetch, isLoading, isError, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getContractStats',
  });

  // Subscribe to relevant events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenSold',
    onLogs() {
      refetch();
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenListed',
    onLogs() {
      refetch();
    },
  });

  useEffect(() => {
    if (data) {
      const [totalNFTs, totalOnSale, marketplaceStats] = data as [
        bigint,
        bigint,
        IMarketplaceStats,
      ];
      setStats({
        totalNFTs,
        totalOnSale,
        stats: marketplaceStats,
      });
    }
  }, [data]);

  return { stats, isLoading, isError, error, refetch };
}
