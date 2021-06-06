import { ObjectId } from 'bson';
import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { PortfolioMongoError } from '../../../../errors/PortfolioMongoError';
import { PortfolioEntity } from '../../../../types/entities/portfolio.entity';
import { ErrorCodes, ErrorMessages } from '../../../../types/enums/errorCodes.enum';
import { PortfolioModel } from '../../../../types/models/portfolio.model';
import { IPortfolioRepo } from '../../../../types/repositories/IPortfolioRepo';
import { getClientDb } from './mongo.helper';

export class PortfolioMongo implements IPortfolioRepo {
  async searchPortfolios(query: any, projection?: any, sortBy?: any): Promise<PortfolioEntity[]> {
    console.log('search portfolios', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PortfolioMongoError(
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

      return portfolios.map<PortfolioEntity>((portfolio) => {
        const { _id, ...rest } = portfolio;
        return { ...rest };
      });
    } catch (error) {
      console.error('search accounts failed', error.message);

      if (error instanceof PortfolioMongoError) {
        throw error;
      }
      throw new PortfolioMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_PORTFOLIOS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createPortfolio(portfolio: PortfolioEntity): Promise<PortfolioEntity> {
    console.log('create portfolio', portfolio);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PortfolioMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);

      const newPortfolio: PortfolioModel = {
        ...portfolio,
        enabled: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection<PortfolioModel>(colName).insertOne(newPortfolio);

      return portfolio;
    } catch (error) {
      console.error('create portfolio failed', error.message);

      if (error instanceof PortfolioMongoError) {
        throw error;
      }
      throw new PortfolioMongoError(
        error.message,
        ErrorCodes.MONGO_CREATE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePortfolio(portfolio: PortfolioEntity): Promise<PortfolioEntity> {
    console.log('update portfolio', portfolio);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.PORTFOLIOS_COLLECTION];
      if (!colName) {
        throw new PortfolioMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);

      const { accountId } = portfolio;
      const updateAccount: PortfolioModel = {
        ...portfolio,
        updatedAt: new Date()
      };
      await db.collection<PortfolioModel>(colName).updateOne({ accountId: accountId }, { $set: updateAccount });

      return portfolio;
    } catch (error) {
      console.error('update portfolio failed', error.message);

      if (error instanceof PortfolioMongoError) {
        throw error;
      }
      throw new PortfolioMongoError(
        error.message,
        ErrorCodes.MONGO_UPDATE_PORTFOLIO_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
