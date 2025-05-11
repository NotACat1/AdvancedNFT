import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IPinataConfig, IPinataPinOptions, IPinataPinResponse } from '@type/IPinata';

export class PinataClient {
  private axios: AxiosInstance;
  private readonly pinataApiUrl = 'https://api.pinata.cloud';

  constructor(private config: IPinataConfig) {
    this.axios = axios.create({
      baseURL: this.pinataApiUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(config.jwtToken
          ? { Authorization: `Bearer ${config.jwtToken}` }
          : {
              pinata_api_key: config.apiKey,
              pinata_secret_api_key: config.apiSecret,
            }),
      },
    });
  }

  /**
   * Загружает файл в IPFS через Pinata
   * @param file Файл для загрузки
   * @param options Опции загрузки
   * @returns Хэш загруженного файла в IPFS
   */
  async uploadFile(file: File, options?: IPinataPinOptions): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.pinataMetadata) {
      formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
    }

    if (options?.pinataOptions) {
      formData.append('pinataOptions', JSON.stringify(options.pinataOptions));
    }

    try {
      const response: AxiosResponse<IPinataPinResponse> = await this.axios.post(
        '/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw error;
    }
  }

  /**
   * Загружает JSON данные в IPFS через Pinata
   * @param data Данные для загрузки
   * @param options Опции загрузки
   * @returns Хэш загруженных данных в IPFS
   */
  async uploadJson(data: unknown, options?: IPinataPinOptions): Promise<string> {
    try {
      const response: AxiosResponse<IPinataPinResponse> = await this.axios.post(
        '/pinning/pinJSONToIPFS',
        {
          pinataContent: data,
          pinataMetadata: options?.pinataMetadata,
          pinataOptions: options?.pinataOptions,
        },
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw error;
    }
  }

  /**
   * Получает данные по IPFS хэшу
   * @param ipfsHash Хэш IPFS
   * @returns Данные по указанному хэшу
   */
  async getData(ipfsHash: string): Promise<unknown> {
    try {
      // Используем публичный шлюз Pinata для получения данных
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data from Pinata:', error);
      throw error;
    }
  }

  /**
   * Получает файл по IPFS хэшу
   * @param ipfsHash Хэш IPFS
   * @returns Blob файла
   */
  async getFile(ipfsHash: string): Promise<Blob> {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching file from Pinata:', error);
      throw error;
    }
  }

  /**
   * Проверяет доступность аккаунта Pinata
   * @returns Информация об аккаунте
   */
  async testAuthentication(): Promise<any> {
    try {
      const response = await this.axios.get('/data/testAuthentication');
      return response.data;
    } catch (error) {
      console.error('Pinata authentication failed:', error);
      throw error;
    }
  }

  /**
   * Updates metadata for an existing IPFS hash
   * @param ipfsHash The IPFS hash to update metadata for
   * @param newMetadata The new metadata to set
   * @returns The updated IPFS hash (usually the same as input)
   */
  async updateMetadata(ipfsHash: string, newMetadata: Record<string, any>): Promise<string> {
    try {
      const response: AxiosResponse<{ IpfsHash: string }> = await this.axios.put(
        '/pinning/hashMetadata',
        {
          ipfsPinHash: ipfsHash,
          name: newMetadata.name, // Name is required by Pinata API
          keyvalues: newMetadata.keyvalues || {},
        },
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error updating metadata in Pinata:', error);
      throw error;
    }
  }
}
