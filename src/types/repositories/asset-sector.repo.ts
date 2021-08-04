import { AssetSectorEntity } from '../entities/asset-sector.entity';

export interface IAssetSectorRepo {
  searchAssetSectors: (query: any, projection?: any, sortBy?: any) => Promise<AssetSectorEntity[]>;
}
