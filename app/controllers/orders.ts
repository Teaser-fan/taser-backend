import { ParameterizedContext } from 'koa';
import {
  fetchOrders,
  fetchOrderById,
  saveOrder,
  editOrder,
  deleteOrder,
} from '../services/orders';
import { IOrderDocument, IOrder } from '../models/orders';
import { PaginateResult } from 'mongoose';
import { logger } from '../logger';
import { isValidMongoId } from '../shared/util';
import { ErrorResponse } from '../dtos/error-response';
import { GENERAL_MESSAGES } from '../shared/constants';
import { createOrderSchema } from '../validation/orders';
import { placeOrder } from '../stripe';
import { createShipment } from '../shippo';

export async function getOrders(ctx: ParameterizedContext) {
  try {
    const offset: number = parseInt(ctx.request.query.offset as string) || 0;
    const limit: number = parseInt(ctx.request.query.limit as string) || 20;
    const users: PaginateResult<IOrderDocument> = await fetchOrders(
      limit,
      offset
    );
    ctx.status = 200;
    ctx.body = users;
    ctx.toJSON();
  } catch (err) {
    logger.error({ err }, 'Error in ordersController->getOrders');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function getOrderById(ctx: ParameterizedContext) {
  try {
    const orderId: string = ctx.params.id;
    if (!isValidMongoId(orderId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    const order: IOrder = await fetchOrderById(orderId);
    ctx.status = 200;
    ctx.body = order;
  } catch (err) {
    logger.error({ err }, 'Error in ordersController->getOrderById');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function createOrder(ctx: ParameterizedContext) {
  try {
    await createOrderSchema.validateAsync(ctx.request.body);
    const order: IOrder = <IOrder>ctx.request.body;
    await saveOrder(order);
    await placeOrder(order.totalAmount);
    await createShipment();
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in orderController->createOrder');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function updateOrder(ctx: ParameterizedContext) {
  try {
    const orderId: string = ctx.params.id;
    const order: IOrder = <IOrder>ctx.request.body;
    if (!isValidMongoId(orderId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await editOrder(orderId, order);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in ordersController->updateOrder');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}

export async function removeOrder(ctx: ParameterizedContext) {
  try {
    const orderId: string = ctx.params.id;
    if (!isValidMongoId(orderId)) {
      throw new ErrorResponse(400, GENERAL_MESSAGES.INVALID_ID);
    }
    await deleteOrder(orderId);
    ctx.status = 200;
    ctx.body = {};
  } catch (err) {
    logger.error({ err }, 'Error in ordersController->removeOrder');
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || '',
    };
    ctx.toJSON();
  }
}
