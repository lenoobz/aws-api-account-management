import Joi = require('joi');

export type AddAccountRequestDto = {
  name: string;
  createdBy: string;
};

export const AddAccountRequestScheme = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.string().required()
});

export type EditAccountRequestDto = {
  id: string;
  createdBy: string;
  name?: string;
  deleted?: boolean;
};

export const EditAccountRequestScheme = Joi.object({
  id: Joi.string().required(),
  createdBy: Joi.string().required(),
  name: Joi.string(),
  deleted: Joi.string()
});

export type DeleteAccountRequestDto = {
  id: string;
  createdBy: string;
};

export const DeleteAccountRequestScheme = Joi.object({
  id: Joi.string().required(),
  createdBy: Joi.string().required()
});
