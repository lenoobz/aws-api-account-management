import Joi = require('joi');

export type AddPortfolioRequestDto = {
  accountId: string;
  createdBy: string;
};

export const AddPortfolioRequestScheme = Joi.object({
  accountId: Joi.string().required(),
  createdBy: Joi.string().required()
});

export type EditPortfolioRequestDto = {
  accountId: string;
  createdBy: string;
  deleted?: boolean;
};

export const EditPortfolioRequestScheme = Joi.object({
  accountId: Joi.string().required(),
  createdBy: Joi.string().required(),
  deleted: Joi.boolean()
});

export type DeletePortfolioRequestDto = {
  accountId: string;
  createdBy: string;
};

export const DeletePortfolioRequestScheme = Joi.object({
  accountId: Joi.string().required(),
  createdBy: Joi.string().required()
});
