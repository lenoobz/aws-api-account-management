import { AccountEntity } from '../entities/account.entity';

export interface IAccountRepo {
  searchAccounts: (query: any, projection?: any, sortBy?: any) => Promise<AccountEntity[]>;
  createAccount: (account: AccountEntity) => Promise<AccountEntity>;
  updateAccount: (id: string, account: AccountEntity) => Promise<AccountEntity>;
}
