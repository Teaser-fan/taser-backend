import { ErrorResponse } from '../dtos/error-response';
import { ORDER_MESSAGES, USER_MESSAGES, PRODUCT_MESSAGES } from '../shared/constants';
import { PaginateResult } from 'mongoose';
import { IOrderDocument, OrderModel, IOrder } from '../models/orders';
import { UserModel } from '../models/user';
import { ProductModel } from '../models/products';

export async function fetchOrders(
  limit: number,
  offset: number
): Promise<PaginateResult<IOrderDocument>> {
  return OrderModel.paginate(
    {},
    {
      lean: true,
      limit,
      offset,
      populate: 'user products'
    }
  );
}

export async function fetchOrderById(orderId: string): Promise<IOrder> {
  const order: IOrder = await OrderModel.findById(orderId)
    .where('isDeleted')
    .equals(false)
    .populate('user products')
    .lean();

  if (!order) {
    throw new ErrorResponse(404, ORDER_MESSAGES.ORDER_NOT_FOUND);
  }

  return order;
}

export async function saveOrder(order: IOrder): Promise<void> {
  const userExists: boolean = await UserModel.exists({_id: order.user});
  const productsExists: boolean = await ProductModel.exists({_id: {$in: order.products}});

  if (!userExists) {
    throw new ErrorResponse(400, USER_MESSAGES.USER_NOT_FOUND);
  }

  if (!productsExists) {
    throw new ErrorResponse(400, PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
  }

  const newOrder = new OrderModel(order);
  await newOrder.save();
}

export async function editOrder(
  orderId: string,
  updatedOrder: IOrder
): Promise<void> {
  const order: IOrderDocument = await OrderModel.findById(orderId);
  if (!order) {
    throw new ErrorResponse(404, ORDER_MESSAGES.ORDER_NOT_FOUND);
  }
  Object.assign(order, updatedOrder);

  await order.save();
}

export async function deleteOrder(orderId: string): Promise<void> {
  const isExist: boolean = await OrderModel.exists({
    _id: orderId,
    isDeleted: false,
  });
  if (!isExist) {
    throw new ErrorResponse(404, ORDER_MESSAGES.ORDER_NOT_FOUND);
  }
  await OrderModel.findByIdAndDelete(orderId);
}
