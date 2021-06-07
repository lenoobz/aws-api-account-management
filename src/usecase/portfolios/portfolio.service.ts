import { StatusCodes } from 'http-status-codes';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { PortfolioServiceError } from '../../errors/PortfolioServiceError';
import { PortfolioEntity } from '../../types/entities/portfolio.entity';
import { ErrorCodes, ErrorMessages } from '../../types/enums/errorCodes.enum';
import { IPortfolioRepo } from '../../types/repositories/IPortfolioRepo';
import {
  AddPortfolioRequestDto,
  AddPortfolioRequestScheme,
  EditPortfolioRequestDto,
  EditPortfolioRequestScheme,
  DeletePortfolioRequestDto,
  DeletePortfolioRequestScheme
} from '../../types/requests/PortfolioRequest.dto';

export class PortfolioService {
  portfolioRepo: IPortfolioRepo;

  constructor(portfolioRepo: IPortfolioRepo) {
    this.portfolioRepo = portfolioRepo;
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

  async addPortfolio(addPortfolioReq: AddPortfolioRequestDto): Promise<PortfolioEntity> {
    const joi = AddPortfolioRequestScheme.validate(addPortfolioReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_CREATE_PORTFOLIO_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('add portfolio', addPortfolioReq);

    try {
      const { accountId } = addPortfolioReq;
      const isExisting = await this.portfolioRepo.isPortfolioExisted(accountId);

      if (isExisting) {
        throw new PortfolioServiceError(
          ErrorMessages.SERVICE_PORTFOLIO_EXISTED,
          ErrorCodes.SERVICE_PORTFOLIO_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      return await this.portfolioRepo.createPortfolio(addPortfolioReq);
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

  async updatePortfolio(editPortfolioReq: EditPortfolioRequestDto): Promise<PortfolioEntity> {
    const joi = EditPortfolioRequestScheme.validate(editPortfolioReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_UPDATE_PORTFOLIO_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('update portfolio', editPortfolioReq);

    try {
      const { accountId } = editPortfolioReq;
      const isExisting = await this.portfolioRepo.isPortfolioExisted(accountId);

      if (!isExisting) {
        throw new PortfolioServiceError(
          ErrorMessages.SERVICE_PORTFOLIO_NOT_EXISTED,
          ErrorCodes.SERVICE_PORTFOLIO_NOT_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      return await this.portfolioRepo.updatePortfolio(editPortfolioReq);
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

  async deletePortfolio(deletePortfolioReq: DeletePortfolioRequestDto): Promise<PortfolioEntity[]> {
    const joi = DeletePortfolioRequestScheme.validate(deletePortfolioReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_DELETE_PORTFOLIO_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('delete portfolio', deletePortfolioReq);

    try {
      const { accountId, createdBy } = deletePortfolioReq;
      await this.updatePortfolio({ accountId, createdBy, deleted: true });
      return await this.getPortfoliosByAccountId(createdBy);
    } catch (error) {
      console.error('delete portfolio failed', error.message);

      if (error instanceof PortfolioServiceError) {
        throw error;
      }
      throw new PortfolioServiceError(
        error.message,
        ErrorCodes.SERVICE_DELETE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addPosition(portfolioReq: any): Promise<PortfolioEntity> {
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

  async editPosition(portfolioReq: any): Promise<PortfolioEntity> {
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

  async deletePosition(portfolioReq: any): Promise<PortfolioEntity> {
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
}
