import { StatusCodes } from 'http-status-codes';
import { PortfolioServiceError } from '../../errors/PortfolioServiceError';
import { PortfolioEntity } from '../../types/entities/portfolio.entity';
import { ErrorCodes } from '../../types/enums/errorCodes.enum';
import { IPortfolioRepo } from '../../types/repositories/IPortfolioRepo';

export class PortfolioService {
  portfolioRepo: IPortfolioRepo;

  constructor(portfolioRepo: IPortfolioRepo) {
    this.portfolioRepo = portfolioRepo;
  }

  async addPortfolio(portfolioReq: any): Promise<PortfolioEntity> {
    console.log('add portfolio', portfolioReq);

    try {
      return await this.portfolioRepo.createPortfolio(portfolioReq);
    } catch (error) {
      console.error('add portfolio failed', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.MONGO_CREATE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePortfolio(portfolioReq: any): Promise<PortfolioEntity> {
    console.log('update portfolio', portfolioReq);

    try {
      return await this.portfolioRepo.updatePortfolio(portfolioReq);
    } catch (error) {
      console.error('update portfolio failed', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.MONGO_UPDATE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPortfoliosByAccountId(accountId: string): Promise<PortfolioEntity[]> {
    console.log('get portfolios by account id', accountId);

    try {
      return await this.portfolioRepo.searchPortfolios(
        { accountId: accountId, deleted: false, enabled: true },
        { _id: 0, enabled: 0, deleted: 0, createdAt: 0 },
        { updatedAt: 1 }
      );
    } catch (error) {
      console.error('get portfolios by account id', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.MONGO_SEARCH_PORTFOLIOS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
