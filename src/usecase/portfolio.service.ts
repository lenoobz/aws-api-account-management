import { AccountService } from './account.service';
import { AssetPriceService } from './asset-price.service';
import { AssetService } from './asset.service';

export class PortfolioService {
  assetService: AssetService;
  accountService: AccountService;
  assetPriceService: AssetPriceService;

  constructor(assetService: AssetService, accountService: AccountService, assetPriceService: AssetPriceService) {
    this.assetService = assetService;
    this.accountService = accountService;
    this.assetPriceService = assetPriceService;
  }

  async getPortfoliosByUserId(userId: string): Promise<any> {
    console.log('get portfolios by user id', userId);

    try {
      const accounts = await this.accountService.getAccountsByUserId(userId);

      const resp = accounts.map(async (account) => {
        const positions = await this.accountService.getPositionsByAccountId(account.id);
        const tickers = positions.map((position) => position.ticker);
        const assets = await this.assetService.getAssetDetailsByTickers({ tickers: tickers });
        const prices = await this.assetPriceService.getAssetPricesByTickers({ tickers: tickers });

        const positionDetails = positions.map((position) => {
          return {
            ticker: position.ticker,
            shares: position.shares,
            name: assets[position.ticker].name,
            price: prices[position.ticker].price,
            currency: prices[position.ticker].currency ?? assets[position.ticker].currency
          };
        });

        return {
          accountId: account.id,
          accountName: account.name,
          positions: positionDetails
        };
      });

      return resp;
    } catch (error) {
      console.error('get portfolios by user id failed', error.message);
    }
  }
}
