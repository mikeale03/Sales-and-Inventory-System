import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/salesChannels';
import {
  deleteSale,
  getSalesByProducts,
  getSalesByTransactions,
  getSalesByDateRange,
  salesPurchase,
  updateSalesByGcashTransDelete,
  getSalesGroupByDate,
} from '../service/salesRealm';
import { Gcash } from '../../globalTypes/realm/gcash.types';

export type SalesPurchaseArg = Parameters<typeof salesPurchase>;

const setSalesEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.purchase,
    async (event: IpcMainInvokeEvent, ...args: SalesPurchaseArg) => {
      const result = await salesPurchase(...args);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getByProducts,
    async (
      event: IpcMainInvokeEvent,
      filter?: {
        transactByUserId?: string;
        startDate?: Date;
        endDate?: Date;
        productName?: string;
      }
    ) => {
      const result = await getSalesByProducts(filter);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getByTransactions,
    async (
      event: IpcMainInvokeEvent,
      filter?: {
        transactByUserId: string;
        startDate: Date;
        endDate: Date;
        productName: string;
      }
    ) => {
      const result = await getSalesByTransactions(filter);
      return result;
    }
  );
  ipcMain.handle(
    Channels.delete,
    async (event: IpcMainInvokeEvent, saleId: string) => {
      const result = await deleteSale(saleId);
      return result;
    }
  );
  ipcMain.handle(
    Channels.updateByGcashDelete,
    async (event: IpcMainInvokeEvent, gcash: Gcash) => {
      const result = await updateSalesByGcashTransDelete(gcash);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getSalesByDateRange,
    async (event: IpcMainInvokeEvent, startDate: Date, endDate: Date) => {
      const result = await getSalesByDateRange(startDate, endDate);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getSalesGroupByDate,
    async (event: IpcMainInvokeEvent, startDate: Date, endDate: Date) => {
      const result = await getSalesGroupByDate(startDate, endDate);
      return result;
    }
  );
};

export default setSalesEventHandler;
