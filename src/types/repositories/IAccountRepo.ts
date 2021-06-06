import { AccountEntity } from '../entities/account.entity';

export interface IAccountRepo {
  searchAccounts: (query: any, projection?: any, sortBy?: any) => Promise<AccountEntity[]>;
  createAccount: (account: AccountEntity) => Promise<AccountEntity>;
  updateAccount: (account: AccountEntity) => Promise<AccountEntity>;
}
