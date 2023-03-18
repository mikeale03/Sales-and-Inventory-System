import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/salesChannels';
import {
  deleteSale,
  getSalesByProducts,
  getSalesByTransactions,
  salesPurchase,
} from '../service/salesRealm';

const setSalesEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.purchase,
    async (
      event: IpcMainInvokeEvent,
      items: { _id: string; quantity: number }[],
      transactBy: string,
      transactByUserId: string,
      payment: 'cash' | 'gcash'
    ) => {
      const result = await salesPurchase(
        items,
        transactBy,
        transactByUserId,
        payment
      );
      return result;
    }
  );
  ipcMain.handle(
    Channels.getByProducts,
    async (
      event: IpcMainInvokeEvent,
      filter?: {
        transactBy: string;
        startDate: Date;
        endDate: Date;
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
};

export default setSalesEventHandler;
