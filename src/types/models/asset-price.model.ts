import { ObjectId } from 'bson';
import { AssetPriceEntity } from '../entities/asset-price.entity';

export type AssetPriceModel = {
  _id?: ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
} & AssetPriceEntity;
