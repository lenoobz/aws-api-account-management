import { ObjectId } from 'bson';
import { PositionEntity } from '../entities/position.entity';

export type PositionModel = {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
} & PositionEntity;
