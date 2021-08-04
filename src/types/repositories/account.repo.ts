import { AccountEntity } from '../entities/account.entity';

export interface IAccountRepo {
  isAccountExisted: (accountId: string) => Promise<boolean>;
  searchAccounts: (query: any, projection?: any, sortBy?: any) => Promise<AccountEntity[]>;
  createAccount: (account: AccountEntity) => Promise<AccountEntity>;
  updateAccount: (account: AccountEntity) => Promise<AccountEntity>;
}
