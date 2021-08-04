import { ObjectId } from 'bson';
import { AssetCountryEntity } from '../entities/asset-country.entity';

export type AssetCountryModel = {
  _id?: ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
} & AssetCountryEntity;
