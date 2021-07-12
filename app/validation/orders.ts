import joi from 'joi';

export const createOrderSchema = joi.object({
  user: joi.string().required(),
  products: joi.array().required(),
  totalAmount: joi.number().required().min(1)
});
