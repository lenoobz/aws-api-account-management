import { StatusCodes } from 'http-status-codes';
import { PortfolioServiceError } from '../../errors/PortfolioServiceError';
import { PortfolioEntity } from '../../types/entities/portfolio.entity';
import { ErrorCodes, ErrorMessages } from '../../types/enums/errorCodes.enum';
import { IPortfolioRepo } from '../../types/repositories/IPortfolioRepo';

export class PortfolioService {
  portfolioRepo: IPortfolioRepo;

  constructor(portfolioRepo: IPortfolioRepo) {
    this.portfolioRepo = portfolioRepo;
  }

  async addPortfolio(portfolioReq: any): Promise<PortfolioEntity> {
    console.log('add portfolio', portfolioReq);

    try {
      const { accountId } = portfolioReq;
      const isExisting = await this.portfolioRepo.isPortfolioExisted(accountId);

      if (isExisting) {
        throw new PortfolioServiceError(
          ErrorMessages.SERVICE_PORTFOLIO_EXISTED,
          ErrorCodes.SERVICE_PORTFOLIO_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      return await this.portfolioRepo.createPortfolio(portfolioReq);
    } catch (error) {
      console.error('add portfolio failed', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.SERVICE_CREATE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePortfolio(portfolioReq: any): Promise<PortfolioEntity> {
    console.log('update portfolio', portfolioReq);

    try {
      const { accountId } = portfolioReq;
      const isExisting = await this.portfolioRepo.isPortfolioExisted(accountId);

      if (!isExisting) {
        throw new PortfolioServiceError(
          ErrorMessages.SERVICE_PORTFOLIO_NOT_EXISTED,
          ErrorCodes.SERVICE_PORTFOLIO_NOT_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      return await this.portfolioRepo.updatePortfolio(portfolioReq);
    } catch (error) {
      console.error('update portfolio failed', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.SERVICE_UPDATE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPortfoliosByAccountId(accountId: string): Promise<PortfolioEntity[]> {
    console.log('get portfolios by account id', accountId);

    try {
      return await this.portfolioRepo.searchPortfolios(
        { accountId: accountId, deleted: false, enabled: true },
        { _id: 0, enabled: 0, deleted: 0, updatedAt: 0 },
        { createdAt: 1 }
      );
    } catch (error) {
      console.error('get portfolios by account id', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.SERVICE_SEARCH_PORTFOLIOS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
