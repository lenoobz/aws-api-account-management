import { PortfolioEntity } from '../entities/portfolio.entity';

export interface IPortfolioRepo {
  searchPortfolios: (query: any, projection?: any, sortBy?: any) => Promise<PortfolioEntity[]>;
  createPortfolio: (portfolio: PortfolioEntity) => Promise<PortfolioEntity>;
  updatePortfolio: (portfolio: PortfolioEntity) => Promise<PortfolioEntity>;
}
