import { Channels } from '../../globalTypes/channels/productChannels';
import { Response } from '../../globalTypes/realm/response.types';
import { Product } from '../../main/service/productsRealm';

type ProductUpdateParam = Partial<{
  name: string;
  barcode: string | number | null;
  description: string;
  quantity: string | number;
  price: string | number;
}> & { _id: string; updated_by: string; updated_by_user_id: string };

type ProductCreateParam = {
  name: string;
  barcode?: string | number | null;
  description?: string;
  quantity: string | number;
  price: string | number;
  inventory_verified?: boolean;
  created_by: string;
  created_by_user_id: string;
};

const {
  electron: { ipcRenderer },
} = window;

export const updateProduct = async (updates: ProductUpdateParam) => {
  const newUpdate = { ...updates };
  if (newUpdate.barcode) newUpdate.barcode = +newUpdate.barcode;
  if (newUpdate.price) newUpdate.price = +newUpdate.price;
  if (newUpdate.quantity) newUpdate.quantity = +newUpdate.quantity;

  const response = await ipcRenderer.invoke<Response<Product>>(
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
  const response = await ipcRenderer.invoke<Response<Product>>(
    Channels.create,
    data
  );
  return response;
};

export const getProducts = async (filter?: {
  searchText?: string;
  sortProp?: keyof Product;
  sortAs?: 'asc' | 'desc';
  limit?: number;
}) => {
  const response = await ipcRenderer.invoke<Response<Product[]>>(
    Channels.getAll,
    filter
  );
  return response;
};

export const deleteProduct = async (productId: string) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.delete,
    productId
  );
  return response;
};

export const purchaseProduct = async (
  products: {
    _id: string;
    quantity: string | number;
  }[]
) => {
  const response = await ipcRenderer.invoke<Response<Product>>(
    Channels.purchase,
    products
  );
  return response;
};
