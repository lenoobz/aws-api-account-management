import { StatusCodes } from 'http-status-codes';
import { AccountServiceError } from '../../errors/account.error';
import { InvalidParamError } from '../../errors/generic.error';
import { PositionServiceError } from '../../errors/position.error';
import { AccountEntity } from '../../types/entities/account.entity';
import { PositionEntity } from '../../types/entities/position.entity';
import { ErrorCodes, ErrorMessages } from '../../consts/errors.enum';
import { IAccountRepo } from '../../types/repositories/account.repo';
import { IPositionRepo } from '../../types/repositories/position.repo';
import {
  AddAccountRequestDto,
  AddAccountRequestScheme,
  DeleteAccountRequestDto,
  DeleteAccountRequestScheme,
  EditAccountRequestDto,
  EditAccountRequestScheme
} from '../../types/requests/account.request';
import {
  AddPositionRequestDto,
  AddPositionRequestScheme,
  DeletePositionRequestDto,
  DeletePositionRequestScheme,
  EditPositionRequestDto,
  EditPositionRequestScheme
} from '../../types/requests/position.request';

export class AccountService {
  accountRepo: IAccountRepo;
  positionRepo: IPositionRepo;

  constructor(accountRepo: IAccountRepo, positionRepo: IPositionRepo) {
    this.accountRepo = accountRepo;
    this.positionRepo = positionRepo;
  }

  async getAccountsByUserId(userId: string): Promise<AccountEntity[]> {
    console.log('get accounts by user id', userId);

    try {
      return await this.accountRepo.searchAccounts(
        { createdBy: userId, deleted: false, enabled: true },
        { enabled: 0, deleted: 0, updatedAt: 0 },
        { createdAt: 1 }
      );
    } catch (error) {
      console.error('get accounts by user id failed', error.message);

      if (error instanceof AccountServiceError) {
        throw error;
      }
      throw new AccountServiceError(
        error.message,
        ErrorCodes.SERVICE_SEARCH_ACCOUNTS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addAccount(addAccountReq: AddAccountRequestDto): Promise<AccountEntity> {
    console.log('add account', addAccountReq);

    const joi = AddAccountRequestScheme.validate(addAccountReq);
    if (joi.error) {
      throw new InvalidParamError(joi.error.message, ErrorCodes.SERVICE_CREATE_ACCOUNT_FAILED, StatusCodes.BAD_REQUEST);
    }

    try {
      return await this.accountRepo.createAccount(addAccountReq);
    } catch (error) {
      console.error('add account failed', error.message);

      if (error instanceof AccountServiceError) {
        throw error;
      }
      throw new AccountServiceError(
        error.message,
        ErrorCodes.SERVICE_CREATE_ACCOUNT_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateAccount(editAccountReq: EditAccountRequestDto): Promise<AccountEntity> {
    console.log('update account', editAccountReq);

    const joi = EditAccountRequestScheme.validate(editAccountReq);
    if (joi.error) {
      throw new InvalidParamError(joi.error.message, ErrorCodes.SERVICE_UPDATE_ACCOUNT_FAILED, StatusCodes.BAD_REQUEST);
    }

    try {
      const { id } = editAccountReq;
      const isExisting = await this.accountRepo.isAccountExisted(id);

      if (!isExisting) {
        throw new AccountServiceError(
          ErrorMessages.SERVICE_ACCOUNT_NOT_EXISTED,
          ErrorCodes.SERVICE_ACCOUNT_NOT_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      const editAccount: AccountEntity = { ...editAccountReq };
      return await this.accountRepo.updateAccount(editAccount);
    } catch (error) {
      console.error('update account failed', error.message);

      if (error instanceof AccountServiceError) {
        throw error;
      }
      throw new AccountServiceError(
        error.message,
        ErrorCodes.SERVICE_UPDATE_ACCOUNT_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAccount(deleteAccountReq: DeleteAccountRequestDto): Promise<AccountEntity[]> {
    console.log('delete account', deleteAccountReq);

    const joi = DeleteAccountRequestScheme.validate(deleteAccountReq);
    if (joi.error) {
      throw new InvalidParamError(joi.error.message, ErrorCodes.SERVICE_UPDATE_ACCOUNT_FAILED, StatusCodes.BAD_REQUEST);
    }

    try {
      const { id, createdBy } = deleteAccountReq;

      const positions = await this.getPositionsByAccountId(id);
      if (positions && positions.length > 0) {
        const deletePromises = positions.map((p) =>
          this.updatePosition({ accountId: id, createdBy, ticker: p.ticker, enabled: false, deleted: true })
        );

        await Promise.all(deletePromises);
      }

      await this.updateAccount({ id, createdBy, deleted: true });
      return await this.getAccountsByUserId(createdBy);
    } catch (error) {
      console.error('delete account failed', error.message);

      if (error instanceof AccountServiceError) {
        throw error;
      }
      throw new AccountServiceError(
        error.message,
        ErrorCodes.SERVICE_DELETE_ACCOUNT_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
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
      const accounts = await this.getAccountsByUserId(userId);
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
      console.error('get positions by user id failed', error.message);

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

  async addPosition(addPositionReq: AddPositionRequestDto): Promise<PositionEntity[]> {
    console.log('add postion', addPositionReq);

    const joi = AddPositionRequestScheme.validate(addPositionReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_CREATE_POSITION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    try {
      const { accountId, createdBy, ticker } = addPositionReq;
      const isExisting = await this.positionRepo.isPositionExisted(accountId, createdBy, ticker);

      if (isExisting) {
        await this.positionRepo.updatePosition(addPositionReq);
      } else {
        await this.positionRepo.createPosition(addPositionReq);
      }

      return await this.getPositionsByAccountId(accountId);
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

  async updatePosition(editPositionReq: EditPositionRequestDto): Promise<PositionEntity[]> {
    console.log('edit position', editPositionReq);

    const joi = EditPositionRequestScheme.validate(editPositionReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_UPDATE_POSITION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

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
      await this.positionRepo.updatePosition(editPosition);
      return await this.getPositionsByAccountId(accountId);
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
    console.log('delete position', deletePositionReq);

    const joi = DeletePositionRequestScheme.validate(deletePositionReq);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_DELETE_POSITION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    try {
      const { accountId, createdBy, ticker } = deletePositionReq;
      return await this.updatePosition({ accountId, createdBy, ticker, enabled: false, deleted: true });
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
