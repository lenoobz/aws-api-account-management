import { AccountService } from './account.service';
import { AssetDividendService } from './asset-dividend.service';
import { AssetPriceService } from './asset-price.service';
import { AssetService } from './asset.service';

export class DividendService {
  assetService: AssetService;
  accountService: AccountService;
  assetPriceService: AssetPriceService;
  assetDividendService: AssetDividendService;

  constructor(
    assetService: AssetService,
    accountService: AccountService,
    assetPriceService: AssetPriceService,
    assetDividendService: AssetDividendService
  ) {
    this.assetService = assetService;
    this.accountService = accountService;
    this.assetPriceService = assetPriceService;
    this.assetDividendService = assetDividendService;
  }

  async getDividendsByUserId(userId: string): Promise<any> {
    console.log('get dividends by user id', userId);

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

        const dividendsPromise = this.assetDividendService.getAssetDividendsByTickers({ tickers: tickers });
        promises.push(dividendsPromise);

        const [assets, prices, dividends] = await Promise.all(promises);

        const positionDetails = positions.map((position) => {
          return {
            ticker: position.ticker,
            shares: position.shares,
            name: assets[position.ticker].name,
            price: prices[position.ticker].price,
            currency: prices[position.ticker].currency ?? assets[position.ticker].currency,
            dividends: dividends[position.ticker]
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
      console.error('get dividends by user id failed', error.message);
    }
  }
}
