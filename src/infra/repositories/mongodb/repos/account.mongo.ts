import { ObjectId } from 'bson';
import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { AccountMongoError } from '../../../../errors/account.error';
import { AccountEntity } from '../../../../types/entities/account.entity';
import { ErrorCodes, ErrorMessages } from '../../../../consts/errors.enum';
import { IAccountRepo } from '../../../../types/repositories/account.repo';
import { AccountModel } from '../../../../types/models/account.model';
import { getClientDb } from './mongo.helper';

export class AccountMongo implements IAccountRepo {
  async isAccountExisted(id: string): Promise<boolean> {
    console.log('check is account existed', id);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ACCOUNTS_COLLECTION];
      if (!colName) {
        throw new AccountMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const count = await db
        .collection<AccountModel>(colName)
        .find({ _id: new ObjectId(id) })
        .project({ _id: 1 })
        .limit(1)
        .count();

      return count > 0;
    } catch (error) {
      console.error('check is account existed failed', error.message);

      if (error instanceof AccountMongoError) {
        throw error;
      }
      throw new AccountMongoError(
        error.message,
        ErrorCodes.MONGO_CHECK_ACCOUNT_EXISTED_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async searchAccounts(query: any, projection?: any, sortBy?: any): Promise<AccountEntity[]> {
    console.log('search accounts', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ACCOUNTS_COLLECTION];
      if (!colName) {
        throw new AccountMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const accounts = await db
        .collection<AccountModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return accounts.map<AccountEntity>((account) => {
        const { _id, ...rest } = account;
        return { ...rest, id: _id.toString() };
      });
    } catch (error) {
      console.error('search accounts failed', error.message);

      if (error instanceof AccountMongoError) {
        throw error;
      }
      throw new AccountMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_ACCOUNTS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createAccount(account: AccountEntity): Promise<AccountEntity> {
    console.log('create account', account);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ACCOUNTS_COLLECTION];
      if (!colName) {
        throw new AccountMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);

      const newAccount: AccountModel = {
        ...account,
        enabled: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection<AccountModel>(colName).insertOne(newAccount);

      const insertedId = result.insertedId;
      return {
        ...account,
        id: insertedId.toString()
      };
    } catch (error) {
      console.error('create account failed', error.message);

      if (error instanceof AccountMongoError) {
        throw error;
      }
      throw new AccountMongoError(
        error.message,
        ErrorCodes.MONGO_CREATE_ACCOUNT_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateAccount(account: AccountEntity): Promise<AccountEntity> {
    console.log('update account', account);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ACCOUNTS_COLLECTION];
      if (!colName) {
        throw new AccountMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);

      const { id, ...rest } = account;
      const updateAccount: AccountModel = {
        ...rest,
        updatedAt: new Date()
      };
      await db.collection<AccountModel>(colName).updateOne({ _id: new ObjectId(id) }, { $set: updateAccount });

      return account;
    } catch (error) {
      console.error('update account failed', error.message);

      if (error instanceof AccountMongoError) {
        throw error;
      }
      throw new AccountMongoError(
        error.message,
        ErrorCodes.MONGO_UPDATE_ACCOUNT_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
