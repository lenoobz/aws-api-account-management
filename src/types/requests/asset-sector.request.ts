import Joi = require('joi');

export type GetAssetSectorsRequestDto = {
  tickers: string[];
};

export const GetAssetSectorsRequestScheme = Joi.object({
  tickers: Joi.array().items(Joi.string()).required()
});
