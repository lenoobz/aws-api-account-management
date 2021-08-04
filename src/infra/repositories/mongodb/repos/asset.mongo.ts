import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { ErrorCodes, ErrorMessages } from '../../../../consts/errors.enum';
import { AssetMongoError } from '../../../../errors/asset.error';
import { AssetDetailsEntity } from '../../../../types/entities/asset.entity';
import { AssetDetailsModel } from '../../../../types/models/asset.model';
import { IAssetRepo } from '../../../../types/repositories/asset.repo';
import { getClientDb } from './mongo.helper';

export class AssetMongo implements IAssetRepo {
  async searchAssets(query: any, projection?: any, sortBy?: any): Promise<AssetDetailsEntity[]> {
    console.log('search assets', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ASSETS_COLLECTION];
      if (!colName) {
        throw new AssetMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const assets = await db
        .collection<AssetDetailsModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return assets.map<AssetDetailsEntity>((asset) => {
        const { _id, ...rest } = asset;
        return { ...rest, id: _id.toString() };
      });
    } catch (error) {
      console.error('search assets failed', error.message);

      if (error instanceof AssetMongoError) {
        throw error;
      }

      throw new AssetMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_ASSETS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
