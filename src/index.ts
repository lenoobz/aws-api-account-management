import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json'
  };

  console.log('[DEBUG] event.routeKey', event.routeKey);
  console.log('[DEBUG] event', event);

  try {
    switch (event.routeKey) {
      case 'DELETE /portfolio/{id}':
        body = { message: `DELETE portfolio ${event.pathParameters.id}` };
        break;
      case 'GET /portfolio/{id}':
        body = { message: `GET portfolio ${event.pathParameters.id}` };
        break;
      case 'GET /portfolios':
        body = body = { message: `GET all portfolios` };
        break;
      case 'PUT /portfolios':
        let requestJSON = JSON.parse(event.body);
        body = { message: `PUT portfolios`, request: requestJSON };
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
