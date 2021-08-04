import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { ErrorCodes, ErrorMessages } from '../../../../consts/errors.enum';
import { AssetDividendMongoError } from '../../../../errors/asset-dividend.error';
import { AssetDividendEntity } from '../../../../types/entities/asset-dividend.entity';
import { AssetDividendModel } from '../../../../types/models/asset-dividend.model';
import { IAssetDividendRepo } from '../../../../types/repositories/asset-dividend.repo';
import { getClientDb } from './mongo.helper';

export class AssetDividendMongo implements IAssetDividendRepo {
  async searchAssetDividends(query: any, projection?: any, sortBy?: any): Promise<AssetDividendEntity[]> {
    console.log('search asset dividends', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ASSET_DIVIDENDS_COLLECTION];
      if (!colName) {
        throw new AssetDividendMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const dividends = await db
        .collection<AssetDividendModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return dividends.map<AssetDividendEntity>((dividend) => {
        const { _id, ...rest } = dividend;
        return { ...rest, id: _id.toString() };
      });
    } catch (error) {
      console.error('search asset dividends failed', error.message);

      if (error instanceof AssetDividendMongoError) {
        throw error;
      }

      throw new AssetDividendMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_ASSET_DIVIDENDS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
