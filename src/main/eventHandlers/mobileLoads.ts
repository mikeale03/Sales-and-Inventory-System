import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { MobileLoadChannels } from '../../globalTypes/channels/mobileLoadChannels';
import {
  CreateMobileLoadParams,
  MobileLoadFilterParams,
} from '../../globalTypes/realm/mobileLoad.types';
import {
  createMobileLoad,
  deleteMobileLoad,
  getMobileLoads,
} from '../service/mobileLoadRealm';

const setMobileLoadEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    MobileLoadChannels.get,
    async (event: IpcMainInvokeEvent, params: MobileLoadFilterParams) => {
      const result = await getMobileLoads(params);
      return result;
    }
  );
  ipcMain.handle(
    MobileLoadChannels.create,
    async (event: IpcMainInvokeEvent, params: CreateMobileLoadParams) => {
      const result = await createMobileLoad(params);
      return result;
    }
  );
  ipcMain.handle(
    MobileLoadChannels.delete,
    async (event: IpcMainInvokeEvent, id: string) => {
      const result = await deleteMobileLoad(id);
      return result;
    }
  );
};

export default setMobileLoadEventHandler;
