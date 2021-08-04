import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../consts/errors.enum';

export class PositionMongoError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, PositionMongoError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PositionServiceError extends Error {
  constructor(msg: string, readonly errorCode: ErrorCodes, readonly statusCode: StatusCodes) {
    super(msg);
    Object.setPrototypeOf(this, PositionServiceError.prototype);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
