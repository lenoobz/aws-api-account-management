import { AssetDetailsEntity } from '../entities/asset.entity';

export interface IAssetRepo {
  searchAssets: (query: any, projection?: any, sortBy?: any) => Promise<AssetDetailsEntity[]>;
}
