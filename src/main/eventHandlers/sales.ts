import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/salesChannels';
import { getSalesByProducts, salesPurchase } from '../service/salesRealm';

const setSalesEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.purchase,
    async (
      event: IpcMainInvokeEvent,
      items: { _id: string; quantity: number }[],
      transactBy: string
    ) => {
      const result = await salesPurchase(items, transactBy);
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
};

export default setSalesEventHandler;
