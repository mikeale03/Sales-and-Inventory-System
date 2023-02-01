import { ProductUpdate } from 'globalTypes/dbApi/products.types';
import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/productChannels';
import { getProductByBarcode } from '../service/productsDb';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  Product,
  purchaseProduct,
  updateProduct,
} from '../service/productsRealm';

const setProductEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, product: Omit<Product, '_id'>) => {
      const result = await createProduct(product);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getAll,
    async (event: IpcMainInvokeEvent, searchText?: string) => {
      const result = await getAllProducts(searchText);
      return result;
    }
  );
  ipcMain.handle(
    Channels.update,
    async (event: IpcMainInvokeEvent, updates: ProductUpdate) => {
      const result = await updateProduct(updates);
      return result;
    }
  );
  ipcMain.handle('products:search', async (event: IpcMainInvokeEvent) => {
    const result = await getAllProducts();
    return result;
  });
  ipcMain.handle(
    'products:delete',
    async (event: IpcMainInvokeEvent, productId: string) => {
      const result = await deleteProduct(productId);
      return result;
    }
  );
  ipcMain.handle(
    'products:get-barcode',
    async (event: IpcMainInvokeEvent, barcode: number) => {
      const result = await getProductByBarcode(barcode);
      return result;
    }
  );
  ipcMain.handle(
    Channels.purchase,
    async (
      event: IpcMainInvokeEvent,
      products: { _id: string; quantity: number }[]
    ) => {
      const result = await purchaseProduct(products);
      return result;
    }
  );
};

export default setProductEventHandler;
