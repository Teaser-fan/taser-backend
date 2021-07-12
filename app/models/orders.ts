import { model, Schema, Document, PaginateModel } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  products: {
    type: Schema.Types.Array,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  shippingDate: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    default: 'PENDING',
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

OrderSchema.plugin(MongoosePaginate);

export interface IOrder {
  user: string;
  products: string[];
  totalAmount: number;
  createdDate: Date;
  status: String;
  shippingDate?: Date;
  isDeleted: boolean;
}

export interface IOrderDocument extends IOrder, Document {}
export interface IOrderModel extends PaginateModel<IOrderDocument> {}

export const OrderModel: IOrderModel = model('orders', OrderSchema);
