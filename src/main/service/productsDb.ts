import { IProduct } from 'globalTypes/dbApi/products.types';
import {
  AllDocsResponse,
  CreateResponse,
  DeleteResponse,
} from 'globalTypes/dbApi/response.types';
import PouchDb from 'pouchdb';

export const productsDb = new PouchDb<IProduct>('database/Products');

export const createProduct = async (
  product: IProduct
): Promise<CreateResponse<IProduct>> => {
  try {
    const { id, rev } = await productsDb.put({
      ...product,
      _id: product.name,
    });

    return {
      isSuccess: true,
      result: { ...product, _id: id, _rev: rev },
      message: 'Successfully created a product',
    };
  } catch (error) {
    return {
      isSuccess: false,
      result: undefined,
      message: 'Error occured while creating a user.',
      error,
    };
  }
};

export const deleteProduct = async (
  productId: string
): Promise<DeleteResponse> => {
  try {
    const product = await productsDb.get(productId);
    const response = await productsDb.remove(product);

    return {
      isSuccess: true,
      result: response,
      message: 'Successfully deleted a product',
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Error deleting a product',
      error,
    };
  }
};

export const getAllProducts = async (): Promise<AllDocsResponse<IProduct>> => {
  try {
    const response = await productsDb.allDocs({ include_docs: true });
    return {
      isSuccess: true,
      result: response,
      message: 'Successfully get all products',
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Error getting all products',
    };
  }
};
