import { IMarketplaceStats } from '@type/IMarketplaceStats';

export interface IContractStats {
  totalNFTs: bigint;
  totalOnSale: bigint;
  stats: IMarketplaceStats;
}
