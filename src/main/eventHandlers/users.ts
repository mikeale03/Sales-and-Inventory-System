import { IpcMain, IpcMainInvokeEvent } from 'electron';
import login from '../service/auth';

const setUserEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    'users:login',
    async (event: IpcMainInvokeEvent, username: string, password: string) => {
      const result = await login(username, password);
      return result;
    }
  );
};

export default setUserEventHandler;
