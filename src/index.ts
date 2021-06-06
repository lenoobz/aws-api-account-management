import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { AccountMongo } from './infra/repositories/mongodb/repos/account.mongo';
import { AccountService } from './usecase/accounts/account.service';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json'
  };

  const accountMongo = new AccountMongo();
  const accountService = new AccountService(accountMongo);

  let requestJSON = JSON.parse(event.body);

  try {
    switch (event.routeKey) {
      case 'POST /v1/account':
        body = await accountService.addAccount(requestJSON);
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
