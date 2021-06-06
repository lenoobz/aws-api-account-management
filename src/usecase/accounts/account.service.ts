import { StatusCodes } from 'http-status-codes';
import { AccountServiceError } from '../../errors/AccountServiceError';
import { AccountEntity } from '../../types/entities/account.entity';
import { ErrorCodes, ErrorMessages } from '../../types/enums/errorCodes.enum';
import { IAccountRepo } from '../../types/repositories/IAccountRepo';

export class AccountService {
  accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this.accountRepo = accountRepo;
  }

  async addAccount(accountReq: any): Promise<AccountEntity> {
    console.log('add account', accountReq);

    try {
      return await this.accountRepo.createAccount(accountReq);
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

  async updateAccount(accountReq: any): Promise<AccountEntity> {
    console.log('update account', accountReq);

    try {
      const { id } = accountReq;
      const isExisting = await this.accountRepo.isAccountExisted(id);

      if (!isExisting) {
        throw new AccountServiceError(
          ErrorMessages.SERVICE_ACCOUNT_NOT_EXISTED,
          ErrorCodes.SERVICE_ACCOUNT_NOT_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      return await this.accountRepo.updateAccount(accountReq);
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

  async getAccountsByUserId(userId: string): Promise<AccountEntity[]> {
    console.log('get accounts by user id', userId);

    try {
      return await this.accountRepo.searchAccounts(
        { createdBy: userId, deleted: false, enabled: true },
        { enabled: 0, deleted: 0, createdAt: 0 },
        { updatedAt: 1 }
      );
    } catch (error) {
      console.error('get accounts by user id', error.message);

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
}
