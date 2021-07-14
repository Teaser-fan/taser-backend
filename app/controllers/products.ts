import { ParameterizedContext } from 'koa';
import { ErrorResponse } from '../dtos/error-response';
import { logger } from '../logger';
import { IProduct, IProductDocument } from '../models/products';
import { PaginateResult } from 'mongoose';
import {
  fetchProductById,
  fetchProducts,
  saveProduct,
  editProduct,
  deleteProduct,
  getImageUploadUrl,
} from '../services/products';
import { GENERAL_MESSAGES } from '../shared/constants';
import { isValidMongoId } from '../shared/util';

export async function getProducts(ctx: ParameterizedContext) {
  try {
    const offset: number = parseInt(ctx.request.query.offset as string) || 0;
    const limit: number = parseInt(ctx.request.query.limit as string) || 20;
    const products: PaginateResult<IProductDocument> = await fetchProducts(limit, offset);
    ctx.status = 200;
    ctx.body = products;
    ctx.toJSON();
  } catch (err) {
    logger.error({ err }, 'Error in productsController->getAllProducts');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function getProductById(ctx: ParameterizedContext) {
  try {
    const productId: string = ctx.params.id;
    if (!isValidMongoId(productId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    const product: IProduct = await fetchProductById(productId);
    ctx.status = 200;
    ctx.body = product;
  } catch (err) {
    logger.error({ err }, 'Error in productsController->getProductById');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function createProduct(ctx: ParameterizedContext) {
  try {
    const product: IProduct = <IProduct>ctx.request.body;
    await saveProduct(product);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in productsController->createProduct');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function updateProduct(ctx: ParameterizedContext) {
  try {
    const productId: string = ctx.params.id;
    const product: IProduct = <IProduct>ctx.request.body;
    if (!isValidMongoId(productId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await editProduct(productId, product);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in productsController->updateProduct');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function removeProduct(ctx: ParameterizedContext) {
  try {
    const productId: string = ctx.params.id;
    if (!isValidMongoId(productId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await deleteProduct(productId);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in productsController->removeProduct');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function uploadImage(ctx: ParameterizedContext) {
  try {
    const url = await getImageUploadUrl();
    ctx.status = 200;
    ctx.body = {url};
  } catch (err) {
    logger.error({ err }, 'Error in productsController->uploadImage');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}
