import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { AccountMongo } from './infra/repositories/mongodb/repos/account.mongo';
import { PortfolioMongo } from './infra/repositories/mongodb/repos/portfolio.mongo';
import { AccountService } from './usecase/accounts/account.service';
import { PortfolioService } from './usecase/portfolios/portfolio.service';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json'
  };

  let userId, accountId;
  const portfolioMongo = new PortfolioMongo();
  const portfolioService = new PortfolioService(portfolioMongo);

  const accountMongo = new AccountMongo();
  const accountService = new AccountService(accountMongo, portfolioService);

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
      case 'GET /v1/portfolios/{accountId}':
        accountId = event.pathParameters.accountId;
        body = await portfolioService.getPortfoliosByAccountId(accountId);
        break;
      case 'POST /v1/position':
        const newPosition = JSON.parse(event.body);
        body = await portfolioService.addPosition(newPosition);
        break;
      case 'PUT /v1/position':
        const editPosition = JSON.parse(event.body);
        body = await portfolioService.editPosition(editPosition);
        break;
      case 'DELETE /v1/position':
        const deletePosition = JSON.parse(event.body);
        body = await portfolioService.deletePosition(deletePosition);
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
