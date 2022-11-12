import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { createUser } from '../service/usersDb';
import login from '../service/auth';

const setUserEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    'users:create',
    async (
      event: IpcMainInvokeEvent,
      userData: {
        username: string;
        password: string;
        role: string;
      }
    ) => {
      const result = await createUser(userData);
      return result;
    }
  );
  ipcMain.handle(
    'users:login',
    async (event: IpcMainInvokeEvent, username: string, password: string) => {
      const result = await login(username, password);
      return result;
    }
  );
};

export default setUserEventHandler;
