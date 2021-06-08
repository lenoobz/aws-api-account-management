import { PositionEntity } from '../entities/portfolio.entity';

export interface IPositionRepo {
  isPositionExisted: (accountId: string, createdBy: string, ticker: string) => Promise<boolean>;
  searchPositions: (query: any, projection?: any, sortBy?: any) => Promise<PositionEntity[]>;
  createPosition: (position: PositionEntity) => Promise<PositionEntity>;
  updatePosition: (position: PositionEntity) => Promise<PositionEntity>;
}
