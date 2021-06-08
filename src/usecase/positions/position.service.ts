import { StatusCodes } from 'http-status-codes';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { PositionServiceError } from '../../errors/PositionServiceError';
import { PositionEntity } from '../../types/entities/portfolio.entity';
import { ErrorCodes, ErrorMessages } from '../../types/enums/errorCodes.enum';
import { IPositionRepo } from '../../types/repositories/IPositionRepo';
import {
  AddPositionRequestDto,
  AddPositionRequestScheme,
  EditPositionRequestDto,
  EditPositionRequestScheme,
  DeletePositionRequestDto,
  DeletePositionRequestScheme
} from '../../types/requests/PositionRequest.dto';
import { AccountService } from '../accounts/account.service';

export class PositionService {
  positionRepo: IPositionRepo;
  accountService: AccountService;

  constructor(positionRepo: IPositionRepo, accountService: AccountService) {
    this.positionRepo = positionRepo;
    this.accountService = accountService;
  }

  async getPositionsByAccountId(accountId: string): Promise<PositionEntity[]> {
    console.log('get positions by account id', accountId);

    try {
      return await this.positionRepo.searchPositions(
        { accountId, deleted: false, enabled: true },
        { _id: 0, accountId: 0, enabled: 0, deleted: 0, updatedAt: 0, createdAt: 0, createdBy: 0 },
        { ticker: 1 }
      );
    } catch (error) {
      console.error('get positions by account id', error.message);

      if (error instanceof PositionServiceError) {
        throw error;
      }
      throw new PositionServiceError(
        error.message,
        ErrorCodes.SERVICE_SEARCH_POSITIONS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPositionsByUserId(userId: string): Promise<{ [accountId: string]: PositionEntity[] }> {
    console.log('get positions by user id', userId);

    try {
      const accounts = await this.accountService.getAccountsByUserId(userId);
      const accountIds = accounts.map((account) => account.id).filter((id) => id);

      const getPositionPromises = accountIds.map((id) => this.getPositionsByAccountId(id));
      const positions = await Promise.all(getPositionPromises);

      const result: { [accountId: string]: PositionEntity[] } = {};
      accountIds.forEach((id, i) => {
        if (!result[id]) {
          result[id] = positions[i];
        }
      });

      return result;
    } catch (error) {
      console.error('get positions by user id', error.message);

      if (error instanceof PositionServiceError) {
        throw error;
      }
      throw new PositionServiceError(
        error.message,
        ErrorCodes.SERVICE_SEARCH_POSITIONS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addPosition(addPositionReq: AddPositionRequestDto): Promise<PositionEntity> {
    const joi = AddPositionRequestScheme.validate(addPositionReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_CREATE_POSITION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('add postion', addPositionReq);

    try {
      const { accountId, createdBy, ticker } = addPositionReq;
      const isExisting = await this.positionRepo.isPositionExisted(accountId, createdBy, ticker);

      if (isExisting) {
        throw new PositionServiceError(
          ErrorMessages.SERVICE_POSITION_EXISTED,
          ErrorCodes.SERVICE_POSITION_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      return await this.positionRepo.createPosition(addPositionReq);
    } catch (error) {
      console.error('add position failed', error.message);

      if (error instanceof PositionServiceError) {
        throw error;
      }
      throw new PositionServiceError(
        error.message,
        ErrorCodes.SERVICE_UPDATE_POSITION_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePosition(editPositionReq: EditPositionRequestDto): Promise<PositionEntity> {
    const joi = EditPositionRequestScheme.validate(editPositionReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_UPDATE_POSITION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('edit position', editPositionReq);

    try {
      const { accountId, createdBy, ticker } = editPositionReq;
      const isExisting = await this.positionRepo.isPositionExisted(accountId, createdBy, ticker);

      if (!isExisting) {
        throw new PositionServiceError(
          ErrorMessages.SERVICE_POSITION_NOT_EXISTED,
          ErrorCodes.SERVICE_POSITION_NOT_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      const editPosition: PositionEntity = { ...editPositionReq };
      return await this.positionRepo.updatePosition(editPosition);
    } catch (error) {
      console.error('edit position failed', error.message);

      if (error instanceof PositionServiceError) {
        throw error;
      }
      throw new PositionServiceError(
        error.message,
        ErrorCodes.SERVICE_UPDATE_POSITION_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deletePosition(deletePositionReq: DeletePositionRequestDto): Promise<PositionEntity[]> {
    const joi = DeletePositionRequestScheme.validate(deletePositionReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_DELETE_POSITION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('delete position', deletePositionReq);

    try {
      const { accountId, createdBy, ticker } = deletePositionReq;
      await this.updatePosition({ accountId, createdBy, ticker, deleted: true });
      return await this.getPositionsByAccountId(accountId);
    } catch (error) {
      console.error('delete position failed', error.message);

      if (error instanceof PositionServiceError) {
        throw error;
      }
      throw new PositionServiceError(
        error.message,
        ErrorCodes.SERVICE_DELETE_POSITION_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}