import { useWriteContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';

export function useBuyNFT() {
  const { data, error, isError, writeContract } = useWriteContract();

  const buy = (tokenId: bigint, price: bigint) =>
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'buyNFT',
      args: [tokenId],
      value: price,
    });

  return {
    data,
    error,
    isError,
    buy,
  };
}
