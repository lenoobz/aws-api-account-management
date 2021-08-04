import { StatusCodes } from 'http-status-codes';
import { AppConf } from '../../../../config/app.config';
import { AppConsts } from '../../../../consts/app.const';
import { ErrorCodes, ErrorMessages } from '../../../../consts/errors.enum';
import { AssetSectorMongoError } from '../../../../errors/asset-sector.error';
import { AssetSectorEntity } from '../../../../types/entities/asset-sector.entity';
import { AssetSectorModel } from '../../../../types/models/asset-sector.model';
import { IAssetSectorRepo } from '../../../../types/repositories/asset-sector.repo';
import { getClientDb } from './mongo.helper';

export class AssetSectorMongo implements IAssetSectorRepo {
  async searchAssetSectors(query: any, projection?: any, sortBy?: any): Promise<AssetSectorEntity[]> {
    console.log('search asset sectors', query);

    try {
      const colName = AppConf.mongo.colNames[AppConsts.ASSET_SECTORS_COLLECTION];
      if (!colName) {
        throw new AssetSectorMongoError(
          ErrorMessages.COLLECTION_NOT_FOUND,
          ErrorCodes.COLLECTION_NOT_FOUND,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const db = await getClientDb(AppConf.mongo.dbName);
      const sectors = await db
        .collection<AssetSectorModel>(colName)
        .find({ ...query })
        .project(projection ?? {})
        .sort(sortBy ?? {})
        .toArray();

      return sectors.map<AssetSectorEntity>((sector) => {
        const { _id, ...rest } = sector;
        return { ...rest, id: _id.toString() };
      });
    } catch (error) {
      console.error('search asset sectors failed', error.message);

      if (error instanceof AssetSectorMongoError) {
        throw error;
      }

      throw new AssetSectorMongoError(
        error.message,
        ErrorCodes.MONGO_SEARCH_ASSET_SECTORS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
