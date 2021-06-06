import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../types/enums/errorCodes.enum';

export class PortfolioServiceError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, PortfolioServiceError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
