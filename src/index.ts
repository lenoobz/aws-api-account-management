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
  const accountMongo = new AccountMongo();
  const accountService = new AccountService(accountMongo);

  const portfolioMongo = new PortfolioMongo();
  const portfolioService = new PortfolioService(portfolioMongo);

  try {
    switch (event.routeKey) {
      case 'POST /v1/account':
        const newAccount = JSON.parse(event.body);
        body = await accountService.addAccount(newAccount);
        break;
      case 'PUT /v1/account':
        const updateAccount = JSON.parse(event.body);
        body = await accountService.updateAccount(updateAccount);
        break;
      case 'DELETE /v1/account':
        const deleteAccount = JSON.parse(event.body);
        body = await accountService.deleteAccount(deleteAccount);
        break;
      case 'GET /v1/accounts/{userId}':
        userId = event.pathParameters.userId;
        body = await accountService.getAccountsByUserId(userId);
        break;
      case 'POST /v1/portfolio':
        const newPortfolio = JSON.parse(event.body);
        body = await portfolioService.addPortfolio(newPortfolio);
        break;
      case 'PUT /v1/portfolio':
        const updatePortfolio = JSON.parse(event.body);
        body = await portfolioService.updatePortfolio(updatePortfolio);
        break;
      case 'GET /v1/portfolios/{accountId}':
        accountId = event.pathParameters.accountId;
        body = await portfolioService.getPortfoliosByAccountId(accountId);
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
