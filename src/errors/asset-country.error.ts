import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../consts/errors.enum';

export class AssetCountryMongoError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, AssetCountryMongoError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AssetCountryServiceError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, AssetCountryServiceError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
