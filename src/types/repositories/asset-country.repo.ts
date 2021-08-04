import { AssetCountryEntity } from '../entities/asset-country.entity';

export interface IAssetCountryRepo {
  searchAssetCountries: (query: any, projection?: any, sortBy?: any) => Promise<AssetCountryEntity[]>;
}
