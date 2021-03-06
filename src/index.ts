import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { AccountMongo } from './infra/repositories/mongodb/repos/account.mongo';
import { PositionMongo } from './infra/repositories/mongodb/repos/position.mongo';
import { ErrorCodes, ErrorMessages } from './consts/errors.enum';
import { AccountService } from './usecase/account.service';
import { AssetMongo } from './infra/repositories/mongodb/repos/asset.mongo';
import { AssetService } from './usecase/asset.service';
import { AssetPriceMongo } from './infra/repositories/mongodb/repos/asset-price.mongo';
import { AssetPriceService } from './usecase/asset-price.service';
import { PortfolioService } from './usecase/portfolio.service';
import { BreakdownService } from './usecase/breakdown.service';
import { AssetSectorMongo } from './infra/repositories/mongodb/repos/asset-sector.mongo';
import { AssetSectorService } from './usecase/asset-sector.service';
import { AssetCountryService } from './usecase/asset-country.service';
import { AssetCountryMongo } from './infra/repositories/mongodb/repos/asset-country.mongo';
import { AssetDividendMongo } from './infra/repositories/mongodb/repos/asset-dividend.mongo';
import { AssetDividendService } from './usecase/asset-dividend.service';
import { DividendService } from './usecase/dividend.service';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  let body;
  let statusCode = StatusCodes.OK;
  const headers = {
    'Content-Type': 'application/json'
  };

  let userId;

  const accountMongo = new AccountMongo();
  const positionMongo = new PositionMongo();
  const accountService = new AccountService(accountMongo, positionMongo);

  const assetMongo = new AssetMongo();
  const assetService = new AssetService(assetMongo);

  const assetPriceMongo = new AssetPriceMongo();
  const assetPriceService = new AssetPriceService(assetPriceMongo);

  const portfolioService = new PortfolioService(assetService, accountService, assetPriceService);

  const assetSectorMongo = new AssetSectorMongo();
  const assetSectorService = new AssetSectorService(assetSectorMongo);

  const assetCountryMongo = new AssetCountryMongo();
  const assetCountryService = new AssetCountryService(assetCountryMongo);

  const assetDividendMongo = new AssetDividendMongo();
  const assetDividendService = new AssetDividendService(assetDividendMongo);

  const breakdownService = new BreakdownService(
    assetService,
    accountService,
    assetPriceService,
    assetSectorService,
    assetCountryService
  );

  const dividendService = new DividendService(assetService, accountService, assetPriceService, assetDividendService);

  try {
    switch (event.routeKey) {
      case 'GET /v1/accounts/{userId}':
        userId = event.pathParameters.userId;
        body = await accountService.getAccountsByUserId(userId);
        break;
      case 'POST /v1/account':
        body = await accountService.addAccount(JSON.parse(event.body));
        break;
      case 'PUT /v1/account':
        body = await accountService.updateAccount(JSON.parse(event.body));
        break;
      case 'DELETE /v1/account':
        body = await accountService.deleteAccount(JSON.parse(event.body));
        break;
      case 'GET /v1/positions/{userId}':
        userId = event.pathParameters.userId;
        body = await accountService.getPositionsByUserId(userId);
        break;
      case 'POST /v1/position':
        body = await accountService.addPosition(JSON.parse(event.body));
        break;
      case 'PUT /v1/position':
        body = await accountService.updatePosition(JSON.parse(event.body));
        break;
      case 'DELETE /v1/position':
        body = await accountService.deletePosition(JSON.parse(event.body));
        break;
      case 'GET /v1/portfolios/{userId}':
        userId = event.pathParameters.userId;
        body = await portfolioService.getPortfoliosByUserId(userId);
        break;
      case 'GET /v1/breakdowns/{userId}':
        userId = event.pathParameters.userId;
        body = await breakdownService.getBreakdownByUserId(userId);
        break;
      case 'GET /v1/dividends/{userId}':
        userId = event.pathParameters.userId;
        body = await dividendService.getDividendsByUserId(userId);
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (error) {
    statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    body = {
      error: {
        code: error.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: error.message || ErrorMessages.INTERNAL_SERVER_ERROR
      }
    };
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
