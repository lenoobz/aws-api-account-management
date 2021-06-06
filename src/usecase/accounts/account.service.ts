import { StatusCodes } from 'http-status-codes';
import { AccountServiceError } from '../../errors/AccountServiceError';
import { AccountEntity } from '../../types/entities/account.entity';
import { ErrorCodes } from '../../types/enums/errorCodes.enum';
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
        ErrorCodes.MONGO_SEARCH_ACCOUNTS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}