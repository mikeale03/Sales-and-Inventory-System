import { IProduct } from 'globalTypes/dbApi/products.types';
import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { createProduct, getAllProducts } from '../service/productsDb';

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
};

export default setProductEventHandler;
