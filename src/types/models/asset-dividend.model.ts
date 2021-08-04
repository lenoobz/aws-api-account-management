import { ObjectId } from 'bson';
import { AssetDividendEntity } from '../entities/asset-dividend.entity';

export type AssetDividendModel = {
  _id?: ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
} & AssetDividendEntity;
