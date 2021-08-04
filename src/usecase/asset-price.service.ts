import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../consts/errors.enum';
import { AssetPriceMongoError, AssetPriceServiceError } from '../errors/asset-price.error';
import { InvalidParamError } from '../errors/generic.error';
import { AssetPriceEntity } from '../types/entities/asset-price.entity';
import { IAssetPriceRepo } from '../types/repositories/asset-price.repo';
import { GetAssetPricesRequestDto, GetAssetPricesRequestScheme } from '../types/requests/asset-price.request';

export class AssetPriceService {
  assetPriceRepo: IAssetPriceRepo;

  constructor(assetPriceRepo: IAssetPriceRepo) {
    this.assetPriceRepo = assetPriceRepo;
  }

  async getAssetPricesByTickers(reqs: GetAssetPricesRequestDto): Promise<{ [ticker: string]: AssetPriceEntity }> {
    const joi = GetAssetPricesRequestScheme.validate(reqs);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_SEARCH_ASSET_PRICES_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('get asset prices by tickers', reqs.tickers);

    try {
      const prices = await this.assetPriceRepo.searchAssetPrices(
        { deleted: false, enabled: true, ticker: { $in: reqs.tickers } },
        { enabled: 0, deleted: 0, createdAt: 0, updatedAt: 0 }
      );

      const resp: { [ticker: string]: AssetPriceEntity } = {};

      prices.forEach((price) => {
        resp[price.ticker] = price;
      });

      return resp;
    } catch (error) {
      console.error('get asset prices by tickers failed', error.message);

      if (error instanceof AssetPriceMongoError) {
        throw error;
      }

      throw new AssetPriceServiceError(
        error.message,
        ErrorCodes.SERVICE_SEARCH_ASSET_PRICES_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
