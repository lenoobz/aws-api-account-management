import { ObjectId } from 'bson';
import { AccountEntity } from '../entities/account.entity';

export type AccountModel = {
  _id?: ObjectId;
} & AccountEntity;
