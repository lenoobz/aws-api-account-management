import { ObjectId } from 'bson';
import { AccountEntity } from '../../../../types/entities/account.entity';

export type AccountModel = {
  _id?: ObjectId;
} & AccountEntity;
