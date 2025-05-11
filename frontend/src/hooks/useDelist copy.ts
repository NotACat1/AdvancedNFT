import { useWriteContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';

export function useDelist() {
  const { data, error, isError, writeContract } = useWriteContract();

  const delist = (tokenId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'delist',
      args: [tokenId],
    });
  };

  return {
    data,
    error,
    isError,
    delist,
  };
}
