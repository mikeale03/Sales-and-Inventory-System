import { IProduct } from 'globalTypes/dbApi/products.types';
import {
  DeleteResponse,
  ExistingDoc,
  PutResponse,
} from 'globalTypes/dbApi/response.types';

export type ProductForm = {
  _id?: string;
  _rev?: string;
  name: string;
  barcode?: string | number;
  description?: string;
  quantity: string | number;
  price: string | number;
};

export type SetProductResult =
  | ({
      _id: string;
      _rev: string;
    } & IProduct)
  | undefined;

const {
  electron: { ipcRenderer },
} = window;

export const updateProduct = async (product: ProductForm) => {
  const { barcode, price, quantity } = product;
  let data: ExistingDoc<IProduct>;

  if (product._id && product._rev)
    data = {
      ...product,
      _id: product._id,
      _rev: product._rev,
      barcode: barcode ? +barcode : undefined,
      price: +price,
      quantity: +quantity,
    };
  else {
    throw Error('Product _id and _rev is required');
  }

  const response = await ipcRenderer.invoke<PutResponse<IProduct>>(
    'products:update',
    data
  );

  if (response.isSuccess) {
    return response.result;
  } else {
    alert(response.message);
    return undefined;
  }
};

export const createProduct = async (product: ProductForm) => {
  let barcode: number | undefined;

  if (product.barcode) barcode = +product.barcode;

  const quantity: number = +product.quantity;
  const price: number = +product.price;

  const data: IProduct = { ...product, barcode, quantity, price };
  const response = await ipcRenderer.invoke<PutResponse<IProduct>>(
    'products:create',
    data
  );
  console.log(response);
  if (response.isSuccess && response.result) {
    return response.result;
  } else {
    alert(response.message);
    return undefined;
  }
};

export const deleteProduct = async (productId: string) => {
  const response = await ipcRenderer.invoke<DeleteResponse>(
    'products:delete',
    productId
  );
  console.log(response);
  if (response.isSuccess && response.result) {
    return response.result;
  } else {
    alert(response.message);
    return undefined;
  }
};
