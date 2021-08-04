import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../consts/errors.enum';

export class AssetDividendMongoError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, AssetDividendMongoError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AssetDividendServiceError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, AssetDividendServiceError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
