import { ParameterizedContext } from 'koa';
import { ErrorResponse } from '../dtos/error-response';
import { logger } from '../logger';
import { ICategory, ICategoryDocument } from '../models/categories';
import { PaginateResult } from 'mongoose';
import {
  deleteCategory,
  editCategory,
  fetchCategories,
  fetchCategoryById,
  saveCategory,
} from '../services/categories';
import { GENERAL_MESSAGES } from '../shared/constants';
import { isValidMongoId } from '../shared/util';

export async function getCategories(ctx: ParameterizedContext) {
  try {
    const offset: number = parseInt(ctx.request.query.offset as string) || 0;
    const limit: number = parseInt(ctx.request.query.limit as string) || 20;
    const categories: PaginateResult<ICategoryDocument> = await fetchCategories(limit, offset);
    ctx.status = 200;
    ctx.body = categories;
    ctx.toJSON();
  } catch (err) {
    logger.error({ err }, 'Error in categoriesController->getCategories');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function getCategoryById(ctx: ParameterizedContext) {
  try {
    const categoryId: string = ctx.params.id;
    if (!isValidMongoId(categoryId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    const category: ICategory = await fetchCategoryById(categoryId);
    ctx.status = 200;
    ctx.body = category;
  } catch (err) {
    logger.error({ err }, 'Error in categoriesController->getCategoryById');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function createCategory(ctx: ParameterizedContext) {
  try {
    const category: ICategory = <ICategory>ctx.request.body;
    await saveCategory(category);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in categoriesController->createCategory');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function updateCategory(ctx: ParameterizedContext) {
  try {
    const categoryId: string = ctx.params.id;
    const category: ICategory = <ICategory>ctx.request.body;
    if (!isValidMongoId(categoryId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await editCategory(categoryId, category);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in categoriesController->updateCategory');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function removeCategory(ctx: ParameterizedContext) {
  try {
    const categoryId: string = ctx.params.id;
    if (!isValidMongoId(categoryId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await deleteCategory(categoryId);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in categoriesController->removeCategory');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}
