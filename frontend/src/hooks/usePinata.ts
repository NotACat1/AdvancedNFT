import { PinataClient } from '@services/PinataClient';
import { IPinataConfig, IPinataMetadata } from '@type/IPinata';
import { useCallback, useMemo } from 'react';

export function usePinata() {
  const pinataConfig: IPinataConfig = useMemo(
    () => ({
      apiKey: import.meta.env.VITE_PINATA_API_KEY,
      apiSecret: import.meta.env.VITE_PINATA_SECRET_API_KEY,
    }),
    [],
  );

  const pinataClient = useMemo(() => new PinataClient(pinataConfig), [pinataConfig]);

  const uploadFileToIpfs = useCallback(
    async (file: File, metadata?: IPinataMetadata) => {
      try {
        if (!file) {
          throw new Error('No file provided for upload');
        }

        const ipfsHash = await pinataClient.uploadFile(file, {
          pinataMetadata: metadata,
        });

        return {
          success: true,
          hash: ipfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        };
      } catch (error) {
        console.error('Failed to upload file to IPFS:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
    [pinataClient],
  );

  const uploadJsonToIpfs = useCallback(
    async (data: unknown, metadata?: IPinataMetadata) => {
      try {
        if (!data) {
          throw new Error('No data provided for upload');
        }

        const ipfsHash = await pinataClient.uploadJson(data, {
          pinataMetadata: metadata,
        });

        return {
          success: true,
          hash: ipfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        };
      } catch (error) {
        console.error('Failed to upload JSON to IPFS:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
    [pinataClient],
  );

  const fetchFromIpfs = useCallback(
    async (ipfsHash: string) => {
      try {
        if (!ipfsHash) {
          throw new Error('No IPFS hash provided');
        }

        const data = await pinataClient.getData(ipfsHash);
        return {
          success: true,
          data,
        };
      } catch (error) {
        console.error('Failed to fetch from IPFS:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
    [pinataClient],
  );

  const fetchFileFromIpfs = useCallback(
    async (ipfsHash: string) => {
      try {
        if (!ipfsHash) {
          throw new Error('No IPFS hash provided');
        }

        const file = await pinataClient.getFile(ipfsHash);
        return {
          success: true,
          file,
          url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        };
      } catch (error) {
        console.error('Failed to fetch file from IPFS:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
    [pinataClient],
  );

  const testConnection = useCallback(async () => {
    try {
      const result = await pinataClient.testAuthentication();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Failed to test Pinata connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }, [pinataClient]);

  return {
    uploadFileToIpfs,
    uploadJsonToIpfs,
    fetchFromIpfs,
    fetchFileFromIpfs,
    testConnection,
    getIpfsUrl: (hash: string) => `https://gateway.pinata.cloud/ipfs/${hash}`,
  };
}
