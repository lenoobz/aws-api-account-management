import { AssetPriceEntity } from '../entities/asset-price.entity';

export interface IAssetPriceRepo {
  searchAssetPrices: (query: any, projection?: any, sortBy?: any) => Promise<AssetPriceEntity[]>;
}
