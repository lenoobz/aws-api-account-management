import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { AccountMongo } from './infra/repositories/mongodb/repos/account.mongo';
import { PortfolioMongo } from './infra/repositories/mongodb/repos/portfolio.mongo';
import { AccountService } from './usecase/accounts/account.service';
import { PositionService } from './usecase/positions/position.service';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json'
  };

  let userId;

  const accountMongo = new AccountMongo();
  const accountService = new AccountService(accountMongo);

  const portfolioMongo = new PortfolioMongo();
  const portfolioService = new PositionService(portfolioMongo, accountService);

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
        body = await portfolioService.getPositionsByUserId(userId);
        break;
      case 'POST /v1/position':
        body = await portfolioService.addPosition(JSON.parse(event.body));
        break;
      case 'PUT /v1/position':
        body = await portfolioService.updatePosition(JSON.parse(event.body));
        break;
      case 'DELETE /v1/position':
        body = await portfolioService.deletePosition(JSON.parse(event.body));
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
