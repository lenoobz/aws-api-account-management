import { ObjectId } from 'bson';
import { AssetDetailsEntity } from '../entities/asset.entity';

export type AssetDetailsModel = {
  _id?: ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
} & AssetDetailsEntity;
