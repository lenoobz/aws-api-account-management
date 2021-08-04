import Joi = require('joi');

export type GetAssetCountriesRequestDto = {
  tickers: string[];
};

export const GetAssetCountriesRequestScheme = Joi.object({
  tickers: Joi.array().items(Joi.string()).required()
});
