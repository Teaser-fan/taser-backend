import joi from 'joi';

export const createUserSchema = joi.object({
  name: joi.string().required().min(2),
  email: joi.string().required().email(),
  phoneNumber: joi.string().required(),
  age: joi.number(),
  password: joi.string().required().min(4).max(16),
  location: joi.object(),
});

export const loginUserSchema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});

export const emailVerificationSchema = joi.object({
  email: joi.string().required().email(),
  token: joi.string().required(),
});

export const resetPasswordSchema = joi.object({
  email: joi.string().required().email()
});

export const updatePasswordSchema = joi.object({
  email: joi.string().required().email(),
  token: joi.string().required(),
  oldPassword: joi.string().required(),
  newPassword: joi.string().required()
});
