import { ObjectId } from 'bson';
import { PortfolioEntity } from '../entities/portfolio.entity';

export type PortfolioModel = {
  _id?: ObjectId;
  enabled?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} & PortfolioEntity;
