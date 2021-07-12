import { model, Schema, Document, PaginateModel } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

CategorySchema.plugin(MongoosePaginate);

export interface ICategory {
  name: string;
  createdDate: Date;
}

export interface ICategoryDocument extends ICategory, Document {}

export interface ICategoryModel extends PaginateModel<ICategoryDocument> {}

export const CategoryModel: ICategoryModel = model(
  'categories',
  CategorySchema
);
