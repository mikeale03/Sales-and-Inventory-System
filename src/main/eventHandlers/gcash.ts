import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/gcashChannels';
import {
  GcashCreate,
  GcashTransFilter,
} from '../../globalTypes/realm/gcash.types';
import {
  createGcashTransactions,
  deleteGcashTransaction,
  getGcashTransactions,
} from '../service/gcashRealm';

const setGcashEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.getTransactions,
    async (event: IpcMainInvokeEvent, filter?: GcashTransFilter) => {
      const result = await getGcashTransactions(filter);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createTransactions,
    async (event: IpcMainInvokeEvent, gcashTrans: GcashCreate[]) => {
      const result = await createGcashTransactions(gcashTrans);
      return result;
    }
  );
  ipcMain.handle(
    Channels.deleteTransaction,
    async (event: IpcMainInvokeEvent, id: string) => {
      const result = await deleteGcashTransaction(id);
      return result;
    }
  );
};

export default setGcashEventHandler;
