import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { ErrorCodes, ErrorMessages } from '../../../../consts/errors.enum';
import { AssetCountryMongoError } from '../../../../errors/asset-country.error';
import { AssetCountryEntity } from '../../../../types/entities/asset-country.entity';
import { AssetCountryModel } from '../../../../types/models/asset-country.model';
import { IAssetCountryRepo } from '../../../../types/repositories/asset-country.repo';
import { getClientDb } from './mongo.helper';

export class AssetCountryMongo implements IAssetCountryRepo {
  async searchAssetCountries(query: any, projection?: any, sortBy?: any): Promise<AssetCountryEntity[]> {
    console.log('search asset countries', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ASSET_COUNTRIES_COLLECTION];
      if (!colName) {
        throw new AssetCountryMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const countries = await db
        .collection<AssetCountryModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return countries.map<AssetCountryEntity>((country) => {
        const { _id, ...rest } = country;
        return { ...rest, id: _id.toString() };
      });
    } catch (error) {
      console.error('search asset countries failed', error.message);

      if (error instanceof AssetCountryMongoError) {
        throw error;
      }

      throw new AssetCountryMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_ASSET_COUNTRIES_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
