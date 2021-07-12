import { PaginateResult } from 'mongoose';
import { ErrorResponse } from '../dtos/error-response';
import {
  CategoryModel,
  ICategory,
  ICategoryDocument,
} from '../models/categories';
import { CATEGORY_MESSAGES } from '../shared/constants';

export async function fetchCategories(
  limit: number,
  offset: number
): Promise<PaginateResult<ICategoryDocument>> {
  return CategoryModel.paginate({}, { lean: true, limit, offset });
}

export async function fetchCategoryById(
  categoryId: string
): Promise<ICategory> {
  const category: ICategory = await CategoryModel.findById(categoryId).lean();

  if (!category) {
    throw new ErrorResponse(404, CATEGORY_MESSAGES.CATEGORY_NOT_FOUND);
  }

  return category;
}

export async function saveCategory(category: ICategory): Promise<void> {
  const newCategory: ICategoryDocument = new CategoryModel(category);
  await newCategory.save();
}

export async function editCategory(
  categoryId: string,
  updatedCategory: ICategory
): Promise<void> {
  const category: ICategoryDocument = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new ErrorResponse(404, CATEGORY_MESSAGES.CATEGORY_NOT_FOUND);
  }
  Object.assign(category, updatedCategory);

  await category.save();
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const isExist: boolean = await CategoryModel.exists({ _id: categoryId });
  if (!isExist) {
    throw new ErrorResponse(404, CATEGORY_MESSAGES.CATEGORY_NOT_FOUND);
  }
  await CategoryModel.findByIdAndDelete(categoryId);
}
