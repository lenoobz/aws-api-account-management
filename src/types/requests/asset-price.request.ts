import Joi = require('joi');

export type GetAssetPricesRequestDto = {
  tickers: string[];
};

export const GetAssetPricesRequestScheme = Joi.object({
  tickers: Joi.array().items(Joi.string()).required()
});
