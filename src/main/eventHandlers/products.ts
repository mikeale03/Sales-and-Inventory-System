import { ProductUpdate } from 'globalTypes/dbApi/products.types';
import { Channels } from 'globalTypes/electron/productChannels';
import { IpcMain, IpcMainInvokeEvent } from 'electron';
import {
  deleteProduct,
  getProductByBarcode,
  updateProduct,
} from '../service/productsDb';
import {
  createProduct,
  CreateProductParam,
  getAllProducts,
} from '../service/productsRealm';

const setProductEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, product: CreateProductParam) => {
      const result = await createProduct(product);
      return result;
    }
  );
  ipcMain.handle(Channels.getAll, async () => {
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
  ipcMain.handle('products:search', async (event: IpcMainInvokeEvent) => {
    const result = await getAllProducts();
    return result;
  });
  ipcMain.handle(
    'products:delete',
    async (event: IpcMainInvokeEvent, id: string) => {
      const result = await deleteProduct(id);
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
};

export default setProductEventHandler;
