import { ObjectId } from 'bson';
import { PositionEntity } from '../entities/portfolio.entity';

export type PortfolioModel = {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
} & PositionEntity;
