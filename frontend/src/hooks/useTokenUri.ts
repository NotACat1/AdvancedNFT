import { useContractRead } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@config/contract';

/**
 * Преобразует ipfs:// ссылку в HTTP-ссылку через заданный шлюз
 */
const ipfsToToken = (uri: string): string => {
  if (!uri) return '';
  return uri.startsWith('ipfs://') ? uri.replace('ipfs://', '') : uri;
};

/**
 * Хук для получения и конвертации tokenURI
 */
export const useTokenUri = (tokenId?: bigint) => {
  const {
    data: rawUri,
    isLoading,
    isError,
    error,
    refetch,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
  });

  const token = rawUri ? ipfsToToken(rawUri as string) : '';

  return {
    token,
    rawUri: rawUri as string | undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
};
