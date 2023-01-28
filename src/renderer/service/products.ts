import { Channels } from 'globalTypes/channels/productChannels';
import { IProduct } from 'globalTypes/dbApi/products.types';
import {
  DeleteResponse,
  ExistingDoc,
  IResponse,
  PutResponse,
} from 'globalTypes/dbApi/response.types';
import { Product } from 'main/service/productsRealm';

type ProductUpdateParam = Partial<{
  name: string;
  barcode: string | number;
  description: string;
  quantity: string | number;
  price: string | number;
  updated_by: string;
  date_updated: Date;
}> & { _id: string };

type ProductCreateParam = {
  name: string;
  barcode?: string | number;
  description?: string;
  quantity: string | number;
  price: string | number;
  created_by: string;
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

export const updateProduct = async (updates: ProductUpdateParam) => {
  const newUpdate = { ...updates };
  if (newUpdate.barcode) newUpdate.barcode = +newUpdate.barcode;
  if (newUpdate.price) newUpdate.price = +newUpdate.price;
  if (newUpdate.quantity) newUpdate.quantity = +newUpdate.quantity;

  const response = await ipcRenderer.invoke<IResponse<Product>>(
    Channels.update,
    newUpdate
  );
  return response;
};

export const createProduct = async (product: ProductCreateParam) => {
  const barcode = product.barcode ? +product.barcode : undefined;
  const price = +product.price;
  const quantity = +product.quantity;

  const data = { ...product, barcode, quantity, price };
  const response = await ipcRenderer.invoke<IResponse<Product>>(
    Channels.create,
    data
  );
  return response;
};

export const deleteProduct = async (productId: string) => {
  const response = await ipcRenderer.invoke<IResponse<undefined>>(
    Channels.delete,
    productId
  );
  console.log(response);
  return response;
};