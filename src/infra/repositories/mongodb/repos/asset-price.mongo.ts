import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { ErrorCodes, ErrorMessages } from '../../../../consts/errors.enum';
import { AssetPriceMongoError } from '../../../../errors/asset-price.error';
import { AssetPriceEntity } from '../../../../types/entities/asset-price.entity';
import { AssetPriceModel } from '../../../../types/models/asset-price.model';
import { IAssetPriceRepo } from '../../../../types/repositories/asset-price.repo';
import { getClientDb } from './mongo.helper';

export class AssetPriceMongo implements IAssetPriceRepo {
  async searchAssetPrices(query: any, projection?: any, sortBy?: any): Promise<AssetPriceEntity[]> {
    console.log('search asset prices', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ASSET_PRICES_COLLECTION];
      if (!colName) {
        throw new AssetPriceMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const prices = await db
        .collection<AssetPriceModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return prices.map<AssetPriceEntity>((price) => {
        const { _id, ...rest } = price;
        return { ...rest, id: _id.toString() };
      });
    } catch (error) {
      console.error('search asset prices failed', error.message);

      if (error instanceof AssetPriceMongoError) {
        throw error;
      }

      throw new AssetPriceMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_ASSET_PRICES_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
