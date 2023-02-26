import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { createUser, getUsersQuantity, userLogin } from '../service/usersRealm';

const setUserEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    'users:create',
    async (
      event: IpcMainInvokeEvent,
      user: {
        username: string;
        password: string;
        role: 'admin' | 'staff';
      }
    ) => {
      const result = await createUser(user);
      return result;
    }
  );
  ipcMain.handle('users:quantity', async (event: IpcMainInvokeEvent) => {
    const result = await getUsersQuantity();
    return result;
  });
  ipcMain.handle(
    'users:login',
    async (event: IpcMainInvokeEvent, username: string, password: string) => {
      const result = await userLogin(username, password);
      return result;
    }
  );
};

export default setUserEventHandler;
