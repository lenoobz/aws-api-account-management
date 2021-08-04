import Joi = require('joi');

export type AddPositionRequestDto = {
  accountId: string;
  createdBy: string;
  ticker: string;
  shares: number;
};

export const AddPositionRequestScheme = Joi.object({
  accountId: Joi.string().required(),
  createdBy: Joi.string().required(),
  ticker: Joi.string().required(),
  shares: Joi.number().required()
});

export type EditPositionRequestDto = {
  accountId: string;
  createdBy: string;
  ticker: string;
  shares?: number;
  enabled?: boolean;
  deleted?: boolean;
};

export const EditPositionRequestScheme = Joi.object({
  accountId: Joi.string().required(),
  createdBy: Joi.string().required(),
  ticker: Joi.string().required(),
  shares: Joi.number(),
  enabled: Joi.boolean(),
  deleted: Joi.boolean()
});

export type DeletePositionRequestDto = {
  accountId: string;
  createdBy: string;
  ticker: string;
};

export const DeletePositionRequestScheme = Joi.object({
  accountId: Joi.string().required(),
  createdBy: Joi.string().required(),
  ticker: Joi.string().required()
});
