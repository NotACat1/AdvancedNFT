import { useCallback, useEffect, useState } from 'react';
import { useContractRead, useWatchContractEvent, useAccount } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';
import { IToken } from '@type/IToken';

export const useUserTokens = (ownerAddress?: `0x${string}`) => {
  const { address: connectedAddress } = useAccount();
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Чтение списка токенов на продаже
  const { data, refetch, isLoading, isError, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getOwnedTokens',
    args:
      ownerAddress || connectedAddress
        ? [(ownerAddress ?? connectedAddress) as `0x${string}`, BigInt(0), BigInt(1000)]
        : undefined,
  });

  // Обновление токенов при успешном запросе
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setTokens((data as bigint[]).map((tokenId) => ({ tokenId })));
    }
  }, [data]);

  // Автоматическое перезапрашивание при событиях
  const triggerReload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  // Слушаем события
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenListed',
    onLogs() {
      triggerReload();
      refetch();
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenDelisted',
    onLogs() {
      triggerReload();
      refetch();
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenSold',
    onLogs() {
      triggerReload();
      refetch();
    },
  });

  // При изменении триггера запрашиваем заново
  useEffect(() => {
    refetch();
  }, [reloadTrigger, refetch]);

  return { tokens, isLoading, isError, error, refetch };
};
