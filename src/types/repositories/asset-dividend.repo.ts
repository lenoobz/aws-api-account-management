import { AssetDividendEntity } from '../entities/asset-dividend.entity';

export interface IAssetDividendRepo {
  searchAssetDividends: (query: any, projection?: any, sortBy?: any) => Promise<AssetDividendEntity[]>;
}
