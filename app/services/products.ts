import { PaginateResult } from 'mongoose';
import { ErrorResponse } from '../dtos/error-response';
import { IProduct, IProductDocument, ProductModel } from '../models/products';
import { PRODUCT_MESSAGES } from '../shared/constants';

export async function fetchProducts(
  limit: number,
  offset: number
): Promise<PaginateResult<IProductDocument>> {
  return ProductModel.paginate(
    {},
    {
      lean: true,
      limit,
      offset,
      populate: 'category',
    }
  );
}

export async function fetchProductById(productId: string): Promise<IProduct> {
  const product: IProduct = await ProductModel.findById(productId)
    .populate('category')
    .lean();

  if (!product) {
    throw new ErrorResponse(404, PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return product;
}

export async function saveProduct(product: IProduct): Promise<void> {
  const newProduct: IProductDocument = new ProductModel(product);
  await newProduct.save();
}

export async function editProduct(
  productId: string,
  updatedProduct: IProduct
): Promise<void> {
  const product: IProductDocument = await ProductModel.findById(productId);
  if (!product) {
    throw new ErrorResponse(404, PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
  }
  Object.assign(product, updatedProduct);

  await product.save();
}

export async function deleteProduct(productId: string): Promise<void> {
  const isExist: boolean = await ProductModel.exists({ _id: productId });
  if (!isExist) {
    throw new ErrorResponse(404, PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
  }
  await ProductModel.findByIdAndDelete(productId);
}

export async function deleteProductsByCategory(
  categoryId: string
): Promise<void> {
  await ProductModel.deleteMany({ category: categoryId });
}

export async function getImageUploadUrl() {
  return;
}
