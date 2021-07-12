import { model, Schema, Document, PaginateModel } from 'mongoose';
import { ICategory } from './categories';
import MongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Schema.Types.Array,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

ProductSchema.plugin(MongoosePaginate);

export interface IProduct {
  name: string;
  description: string;
  category: ICategory | string;
  price: number;
  createdDate: Date;
  images?: string[];
}
export interface IProductDocument extends IProduct, Document {}
export interface IProductModel extends PaginateModel<IProductDocument> {}

export const ProductModel: IProductModel = model('products', ProductSchema);
