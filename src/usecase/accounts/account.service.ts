import { StatusCodes } from 'http-status-codes';
import { AccountServiceError } from '../../errors/AccountServiceError';
import { InvalidParamError } from '../../errors/InvalidParamError';
import { AccountEntity } from '../../types/entities/account.entity';
import { ErrorCodes, ErrorMessages } from '../../types/enums/errorCodes.enum';
import { IAccountRepo } from '../../types/repositories/IAccountRepo';
import {
  AddAccountRequestDto,
  AddAccountRequestScheme,
  DeleteAccountRequestDto,
  DeleteAccountRequestScheme,
  EditAccountRequestDto,
  EditAccountRequestScheme
} from '../../types/requests/AccountRequest.dto';
import { PortfolioService } from '../portfolios/portfolio.service';

export class AccountService {
  accountRepo: IAccountRepo;
  portfolioService: PortfolioService;

  constructor(accountRepo: IAccountRepo, portfolioService: PortfolioService) {
    this.accountRepo = accountRepo;
    this.portfolioService = portfolioService;
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

  async addAccount(addAccountReq: AddAccountRequestDto): Promise<AccountEntity> {
    const joi = AddAccountRequestScheme.validate(addAccountReq);
    if (joi.error) {
      throw new InvalidParamError(joi.error.message, ErrorCodes.SERVICE_CREATE_ACCOUNT_FAILED, StatusCodes.BAD_REQUEST);
    }

    console.log('add account', addAccountReq);

    try {
      const newAccount = await this.accountRepo.createAccount(addAccountReq);

      // go ahead and create a new portfolio associated with the new account
      this.portfolioService.addPortfolio({ createdBy: newAccount.createdBy, accountId: newAccount.id });

      return newAccount;
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
    const joi = EditAccountRequestScheme.validate(editAccountReq);
    if (joi.error) {
      throw new InvalidParamError(joi.error.message, ErrorCodes.SERVICE_UPDATE_ACCOUNT_FAILED, StatusCodes.BAD_REQUEST);
    }

    console.log('update account', editAccountReq);

    try {
      const { id, name } = editAccountReq;
      const isExisting = await this.accountRepo.isAccountExisted(id);

      if (!isExisting) {
        throw new AccountServiceError(
          ErrorMessages.SERVICE_ACCOUNT_NOT_EXISTED,
          ErrorCodes.SERVICE_ACCOUNT_NOT_EXISTED,
          StatusCodes.CONFLICT
        );
      }

      const editAccount: AccountEntity = { ...editAccountReq, name };
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
    const joi = DeleteAccountRequestScheme.validate(deleteAccountReq);
    if (joi.error) {
      throw new InvalidParamError(joi.error.message, ErrorCodes.SERVICE_UPDATE_ACCOUNT_FAILED, StatusCodes.BAD_REQUEST);
    }

    console.log('delete account', deleteAccountReq);

    try {
      const { id, createdBy } = deleteAccountReq;
      await this.updateAccount({ id, createdBy, deleted: true });
      await this.portfolioService.deletePortfolio({ accountId: id, createdBy });
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
}
