import Joi = require('joi');

export type GetAssetDetailsRequestDto = {
  tickers: string[];
};

export const GetAssetDetailsRequestScheme = Joi.object({
  tickers: Joi.array().items(Joi.string()).required()
});
