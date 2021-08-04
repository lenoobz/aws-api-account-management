import { ObjectId } from 'bson';
import { AssetDetailsEntity } from '../entities/asset.entity';

export type AssetSectorModel = {
  _id?: ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
} & AssetDetailsEntity;
