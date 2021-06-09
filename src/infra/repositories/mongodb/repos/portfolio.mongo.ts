import { ObjectId } from 'bson';
import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { PositionMongoError } from '../../../../errors/PositionMongoError';
import { PositionEntity } from '../../../../types/entities/portfolio.entity';
import { ErrorCodes, ErrorMessages } from '../../../../types/enums/errorCodes.enum';
import { PortfolioModel } from '../../../../types/models/portfolio.model';
import { IPositionRepo } from '../../../../types/repositories/IPositionRepo';
import { getClientDb } from './mongo.helper';

export class PortfolioMongo implements IPositionRepo {
  async isPositionExisted(accountId: string, createdBy: string, ticker: string): Promise<boolean> {
    console.log('check is position existed', accountId);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PositionMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const count = await db
        .collection<PortfolioModel>(colName)
        .find({ accountId, createdBy, ticker, deleted: false })
        .project({ _id: 1 })
        .limit(1)
        .count();

      return count > 0;
    } catch (error) {
      console.error('check is portfolio existed failed', error.message);

      if (error instanceof PositionMongoError) {
        throw error;
      }
      throw new PositionMongoError(
        error.message,
        ErrorCodes.MONGO_CHECK_POSITION_EXISTED_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchPositions(query: any, projection?: any, sortBy?: any): Promise<PositionEntity[]> {
    console.log('search portfolios', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PositionMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const portfolios = await db
        .collection<PortfolioModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return portfolios.map<PositionEntity>((portfolio) => {
        const { _id, ...rest } = portfolio;
        return { ...rest };
      });
    } catch (error) {
      console.error('search accounts failed', error.message);

      if (error instanceof PositionMongoError) {
        throw error;
      }
      throw new PositionMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_POSITIONS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createPosition(position: PositionEntity): Promise<PositionEntity> {
    console.log('create position', position);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PositionMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);

      const newPosition: PortfolioModel = {
        ...position,
        enabled: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection<PortfolioModel>(colName).insertOne(newPosition);

      return position;
    } catch (error) {
      console.error('create position failed', error.message);

      if (error instanceof PositionMongoError) {
        throw error;
      }
      throw new PositionMongoError(
        error.message,
        ErrorCodes.MONGO_CREATE_POSITION_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePosition(position: PositionEntity): Promise<PositionEntity> {
    console.log('update position', position);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PositionMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);

      const { accountId, createdBy, ticker } = position;
      const updateAccount: PortfolioModel = {
        ...position,
        updatedAt: new Date()
      };
      await db
        .collection<PortfolioModel>(colName)
        .updateOne({ accountId, createdBy, ticker, enabled: true }, { $set: updateAccount });

      return position;
    } catch (error) {
      console.error('update position failed', error.message);

      if (error instanceof PositionMongoError) {
        throw error;
      }
      throw new PositionMongoError(
        error.message,
        ErrorCodes.MONGO_UPDATE_POSITION_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
