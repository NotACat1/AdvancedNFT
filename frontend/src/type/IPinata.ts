export interface IPinataConfig {
  apiKey: string;
  apiSecret: string;
  jwtToken?: string;
}

export interface IPinataPinResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface IPinataMetadata {
  name?: string;
  keyvalues?: Record<string, string | number | boolean>;
}

export interface IPinataPinOptions {
  pinataMetadata?: IPinataMetadata;
  pinataOptions?: {
    cidVersion?: 0 | 1;
    wrapWithDirectory?: boolean;
  };
}
