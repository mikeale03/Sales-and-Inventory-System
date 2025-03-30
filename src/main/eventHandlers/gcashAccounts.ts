import { IpcMain, IpcMainInvokeEvent } from 'electron';
import {
  GcashAccount,
  GcashAccountCreate,
} from '../../globalTypes/realm/gcashAccount.types';
import {
  createGcashAccount,
  deleteGcashAccount,
  getGcashAccounts,
  updateGcashAccount,
} from '../service/gcashAccountRealm';
import { Channels } from '../../globalTypes/channels/gcashAccountChannels';

const setGcashAccountsEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, data: GcashAccountCreate) => {
      const result = await createGcashAccount(data);
      return result;
    }
  );
  ipcMain.handle(Channels.getAll, async (event: IpcMainInvokeEvent) => {
    const result = await getGcashAccounts();
    return result;
  });
  ipcMain.handle(
    Channels.update,
    async (event: IpcMainInvokeEvent, accountNumber, data: GcashAccount) => {
      const result = await updateGcashAccount(accountNumber, data);
      return result;
    }
  );
  ipcMain.handle(Channels.delete, async (event: IpcMainInvokeEvent, number) => {
    const result = await deleteGcashAccount(number);
    return result;
  });
};

export default setGcashAccountsEventHandler;
