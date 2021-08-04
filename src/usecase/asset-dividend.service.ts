import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../consts/errors.enum';
import { AssetDividendMongoError, AssetDividendServiceError } from '../errors/asset-dividend.error';
import { InvalidParamError } from '../errors/generic.error';
import { DividendDetails } from '../types/entities/asset-dividend.entity';
import { IAssetDividendRepo } from '../types/repositories/asset-dividend.repo';
import { GetAssetDividendsRequestDto, GetAssetDividendsRequestScheme } from '../types/requests/asset-dividend.request';

export class AssetDividendService {
  assetDividendRepo: IAssetDividendRepo;

  constructor(assetDividendRepo: IAssetDividendRepo) {
    this.assetDividendRepo = assetDividendRepo;
  }

  async getAssetDividendsByTickers(
    reqs: GetAssetDividendsRequestDto
  ): Promise<{ [ticker: string]: { [timestamp: number]: DividendDetails[] } }> {
    const joi = GetAssetDividendsRequestScheme.validate(reqs);
    if (joi.error) {
      throw new InvalidParamError(
        joi.error.message,
        ErrorCodes.SERVICE_SEARCH_ASSET_DIVIDENDS_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('get asset dividends by tickers', reqs.tickers);

    try {
      const dividends = await this.assetDividendRepo.searchAssetDividends(
        { deleted: false, enabled: true, ticker: { $in: reqs.tickers } },
        { enabled: 0, deleted: 0, createdAt: 0, updatedAt: 0 }
      );

      const resp: { [ticker: string]: { [timestamp: number]: DividendDetails[] } } = {};

      dividends.forEach((dividend) => {
        resp[dividend.ticker] = dividend.dividends;
      });

      return resp;
    } catch (error) {
      console.error('get asset dividends by tickers failed', error.message);

      if (error instanceof AssetDividendMongoError) {
        throw error;
      }

      throw new AssetDividendServiceError(
        error.message,
        ErrorCodes.SERVICE_SEARCH_ASSET_DIVIDENDS_FAILED,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
