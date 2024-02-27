import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/productChannels';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  Product,
  // purchaseProduct,
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
    async (
      event: IpcMainInvokeEvent,
      filter?: {
        searchText?: string;
        sortProp?: keyof Product;
        sortAs?: 'asc' | 'desc';
        limit?: number;
        category?: string;
        tags?: string[];
      }
    ) => {
      const result = await getAllProducts(filter);
      return result;
    }
  );
  ipcMain.handle(
    Channels.update,
    async (
      event: IpcMainInvokeEvent,
      updates: Partial<Product> & {
        _id: string;
        updated_by: string;
        updated_by_user_id: string;
      }
    ) => {
      const result = await updateProduct(updates);
      return result;
    }
  );
  ipcMain.handle('products:search', async () => {
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
  // ipcMain.handle(
  //   Channels.purchase,
  //   async (
  //     event: IpcMainInvokeEvent,
  //     products: { _id: string; quantity: number }[]
  //   ) => {
  //     const result = await purchaseProduct(products);
  //     return result;
  //   }
  // );
};

export default setProductEventHandler;
