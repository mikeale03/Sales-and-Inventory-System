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
  voidSale,
} from '../service/salesRealm';
import { Gcash } from '../../globalTypes/realm/gcash.types';
import { createVoidCode, getVoidCode } from '../service/voidCode';

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
        verifiedOnly?: boolean;
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
    Channels.void,
    async (event: IpcMainInvokeEvent, saleId: string) => {
      const result = await voidSale(saleId);
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
    async (
      event: IpcMainInvokeEvent,
      startDate: Date,
      endDate: Date,
      category: string,
      tags?: string[],
      sortByProp: 'quantity' | 'total_price' = 'quantity',
      sort: 'asc' | 'desc' = 'desc',
      limit: number = 10
    ) => {
      const result = await getSalesByDateRange(
        startDate,
        endDate,
        category,
        tags,
        sortByProp,
        sort,
        limit
      );
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
  ipcMain.handle(Channels.getVoidCode, async (event: IpcMainInvokeEvent) => {
    const result = await getVoidCode();
    return result;
  });
  ipcMain.handle(
    Channels.createVoidCode,
    async (event: IpcMainInvokeEvent, code) => {
      const result = await createVoidCode(code);
      return result;
    }
  );
};

export default setSalesEventHandler;
