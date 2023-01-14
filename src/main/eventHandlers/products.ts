import { IProduct, ProductUpdate } from 'globalTypes/dbApi/products.types';
import { IpcMain, IpcMainInvokeEvent } from 'electron';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../service/productsDb';

const setProductEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    'products:create',
    async (event: IpcMainInvokeEvent, product: IProduct) => {
      const result = await createProduct(product);
      return result;
    }
  );
  ipcMain.handle('products:get-all', async () => {
    const result = await getAllProducts();
    return result;
  });
  ipcMain.handle(
    'products:update',
    async (event: IpcMainInvokeEvent, product: ProductUpdate) => {
      const result = await updateProduct(product);
      return result;
    }
  );
  ipcMain.handle(
    'products:search',
    async (event: IpcMainInvokeEvent, search: string) => {
      const result = await getAllProducts(search);
      return result;
    }
  );
  ipcMain.handle(
    'products:delete',
    async (event: IpcMainInvokeEvent, id: string) => {
      const result = await deleteProduct(id);
      return result;
    }
  )
};

export default setProductEventHandler;
