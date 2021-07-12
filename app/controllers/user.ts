import { ParameterizedContext } from 'koa';
import { PaginateResult } from 'mongoose';
import { IUserDocument, IUser } from '../models/user';
import {
  fetchUsers,
  fetchUserById,
  saveUser,
  editUser,
  deleteUser,
  authenticateUser,
  verifyEmail,
  resetPasswordEmail,
  editPassword,
} from '../services/user';
import { logger } from '../logger';
import { isValidMongoId } from '../shared/util';
import { ErrorResponse } from '../dtos/error-response';
import { GENERAL_MESSAGES, USER_TYPES } from '../shared/constants';
import {
  createUserSchema,
  loginUserSchema,
  emailVerificationSchema,
  updatePasswordSchema,
  resetPasswordSchema,
} from '../validation/user';

export async function getUsers(ctx: ParameterizedContext) {
  try {
    const offset: number = parseInt(ctx.request.query.offset as string) || 0;
    const limit: number = parseInt(ctx.request.query.limit as string) || 20;
    const users: PaginateResult<IUserDocument> = await fetchUsers(
      limit,
      offset
    );
    ctx.status = 200;
    ctx.body = users;
    ctx.toJSON();
  } catch (err) {
    logger.error({ err }, 'Error in userController->getUsers');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function getUserById(ctx: ParameterizedContext) {
  try {
    const userId: string = ctx.params.id;
    if (!isValidMongoId(userId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    const user: IUser = await fetchUserById(userId);
    ctx.status = 200;
    ctx.body = user;
  } catch (err) {
    logger.error({ err }, 'Error in userController->getUserById');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function createUser(ctx: ParameterizedContext) {
  try {
    await createUserSchema.validateAsync(ctx.request.body);
    const user: IUser = <IUser>ctx.request.body;
    user.type = USER_TYPES.CUSTOMER;
    await saveUser(user);
    ctx.status = 200;
    ctx.body = {};
    ctx.toJSON();
  } catch (err) {
    logger.error({ err }, 'Error in userController->createUser');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function createVendor(ctx: ParameterizedContext) {
  try {
    await createUserSchema.validateAsync(ctx.request.body);
    const user: IUser = <IUser>ctx.request.body;
    user.type = USER_TYPES.VENDOR;
    await saveUser(user);
    ctx.status = 200;
    ctx.body = {};
    ctx.toJSON();
  } catch (err) {
    logger.error({ err }, 'Error in userController->createUser');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function updateUser(ctx: ParameterizedContext) {
  try {
    const userId: string = ctx.params.id;
    const user: IUser = <IUser>ctx.request.body;
    if (!isValidMongoId(userId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await editUser(userId, user);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in userController->updateUser');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function removeUser(ctx: ParameterizedContext) {
  try {
    const userId: string = ctx.params.id;
    if (!isValidMongoId(userId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await deleteUser(userId);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in userController->removeUser');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function loginUser(ctx: ParameterizedContext) {
  try {
    await loginUserSchema.validateAsync(ctx.request.body);
    const payload = ctx.request.body;
    const authResponse = await authenticateUser(payload);
    ctx.status = 200;
    ctx.body = authResponse;
  } catch (err) {
    logger.error({ err }, 'Error in userController->loginUser');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function emailVerification(ctx: ParameterizedContext) {
  try {
    await emailVerificationSchema.validateAsync(ctx.request.query);
    const payload = ctx.request.query;
    await verifyEmail(payload);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in userController->emailVerification');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function resetPassword(ctx: ParameterizedContext) {
  try {
    await resetPasswordSchema.validateAsync(ctx.request.query);
    const payload = ctx.request.query;
    await resetPasswordEmail(payload);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in userController->resetPassword');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function updatePassword(ctx: ParameterizedContext) {
  try {
    await updatePasswordSchema.validateAsync(ctx.request.body);
    const payload = ctx.request.body;
    await editPassword(payload);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in userController->updatePassword');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}
