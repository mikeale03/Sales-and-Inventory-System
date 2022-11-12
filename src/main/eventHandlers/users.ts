import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { createUser } from '../service/usersDb';

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
};

export default setUserEventHandler;
