import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { UserCreate, UserUpdate } from '../../globalTypes/realm/user.types';
import { Channels } from '../../globalTypes/channels/usersChannels';
import {
  createUser,
  deleteUser,
  getUsers,
  getAdminUsersQuantity,
  updateUser,
  userLogin,
} from '../service/usersRealm';

const setUserEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, user: UserCreate) => {
      const result = await createUser(user);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getAdminQuantity,
    async (event: IpcMainInvokeEvent) => {
      const result = await getAdminUsersQuantity();
      return result;
    }
  );
  ipcMain.handle(
    Channels.login,
    async (event: IpcMainInvokeEvent, username: string, password: string) => {
      const result = await userLogin(username, password);
      return result;
    }
  );
  ipcMain.handle(Channels.getAll, async (event: IpcMainInvokeEvent) => {
    const result = await getUsers();
    return result;
  });
  ipcMain.handle(
    Channels.updateUser,
    async (event: IpcMainInvokeEvent, updates: UserUpdate) => {
      const result = await updateUser(updates);
      return result;
    }
  );
  ipcMain.handle(
    Channels.delete,
    async (event: IpcMainInvokeEvent, userId: string) => {
      const result = await deleteUser(userId);
      return result;
    }
  );
};

export default setUserEventHandler;
