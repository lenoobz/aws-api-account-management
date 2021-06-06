import { ObjectId } from 'bson';
import { AccountEntity } from '../entities/account.entity';

export type AccountModel = {
  _id?: ObjectId;
  enabled?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} & AccountEntity;
