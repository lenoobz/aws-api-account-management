import { AccountService } from './account.service';
import { AssetCountryService } from './asset-country.service';
import { AssetPriceService } from './asset-price.service';
import { AssetSectorService } from './asset-sector.service';
import { AssetService } from './asset.service';

export class BreakdownService {
  assetService: AssetService;
  accountService: AccountService;
  assetPriceService: AssetPriceService;
  assetSectorService: AssetSectorService;
  assetCountryService: AssetCountryService;

  constructor(
    assetService: AssetService,
    accountService: AccountService,
    assetPriceService: AssetPriceService,
    assetSectorService: AssetSectorService,
    assetCountryService: AssetCountryService
  ) {
    this.assetService = assetService;
    this.accountService = accountService;
    this.assetPriceService = assetPriceService;
    this.assetSectorService = assetSectorService;
    this.assetCountryService = assetCountryService;
  }

  async getBreakdownByUserId(userId: string): Promise<any> {
    console.log('get breakdown by user id', userId);
    try {
      const accounts = await this.accountService.getAccountsByUserId(userId);

      const resp = [];
      for (const account of accounts) {
        const positions = await this.accountService.getPositionsByAccountId(account.id);
        const tickers = positions.map((position) => position.ticker);

        const promises: Promise<any>[] = [];

        const assetsPromise = this.assetService.getAssetDetailsByTickers({ tickers: tickers });
        promises.push(assetsPromise);

        const pricesPromise = this.assetPriceService.getAssetPricesByTickers({ tickers: tickers });
        promises.push(pricesPromise);

        const sectorsPromise = this.assetSectorService.getAssetSectorsByTickers({ tickers: tickers });
        promises.push(sectorsPromise);

        const countriesPromise = this.assetCountryService.getAssetCountriesByTickers({ tickers: tickers });
        promises.push(countriesPromise);

        const [assets, prices, sectors, countries] = await Promise.all(promises);

        const positionDetails = positions.map((position) => {
          return {
            ticker: position.ticker,
            shares: position.shares,
            name: assets[position.ticker].name,
            price: prices[position.ticker].price,
            currency: prices[position.ticker].currency ?? assets[position.ticker].currency,
            allocationCash: assets[position.ticker].allocationCash,
            allocationBond: assets[position.ticker].allocationBond,
            allocationStock: assets[position.ticker].allocationStock,
            sectors: sectors[position.ticker],
            countries: countries[position.ticker]
          };
        });

        resp.push({
          accountId: account.id,
          accountName: account.name,
          positions: positionDetails
        });
      }

      return resp;
    } catch (error) {
      console.error('get breakdown by user id failed', error.message);
    }
  }
}
