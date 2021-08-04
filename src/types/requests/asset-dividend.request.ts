import Joi = require('joi');

export type GetAssetDividendsRequestDto = {
  tickers: string[];
};

export const GetAssetDividendsRequestScheme = Joi.object({
  tickers: Joi.array().items(Joi.string()).required()
});
