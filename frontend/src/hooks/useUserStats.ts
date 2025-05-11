import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useWatchContractEvent } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@config/contract';
import { IUserStats } from '@type/IUserStats';

export function useUserStats() {
  const { address } = useAccount();
  const [userStats, setUserStats] = useState<IUserStats | null>(null);

  const { data, refetch, isLoading, isError, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
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
      setUserStats(data as IUserStats);
    }
  }, [data]);

  return { userStats, isLoading, isError, error, refetch };
}
