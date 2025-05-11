import { useAccount, useContractRead } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';

export function useIsCardOwner(tokenId: bigint) {
  const { address } = useAccount();

  // Проверяем владельца токена
  const { data, isLoading, isError, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
  });

  // Проверяем, является ли текущий пользователь владельцем
  const isOwner = data && address ? data.toLowerCase() === address.toLowerCase() : false;

  return {
    data,
    isOwner,
    isLoading,
    isError,
    error,
  };
}
