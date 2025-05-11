import { useWriteContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';

export function useListForSale() {
  const { data, error, isError, writeContract } = useWriteContract();

  const list = (tokenId: bigint, price: bigint) =>
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'listForSale',
      args: [tokenId, price],
    });

  return {
    data,
    error,
    isError,
    list,
  };
}
