import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/categoriesChannels';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../service/categoriesRealm';

const setCategoriesEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, name: string) => {
      const result = await createCategory(name);
      return result;
    }
  );
  ipcMain.handle(Channels.getAll, async (event: IpcMainInvokeEvent) => {
    const result = await getCategories();
    return result;
  });
  ipcMain.handle(
    Channels.update,
    async (event: IpcMainInvokeEvent, _id: string, name: string) => {
      const result = await updateCategory(_id, name);
      return result;
    }
  );
  ipcMain.handle(
    Channels.delete,
    async (event: IpcMainInvokeEvent, _id: string) => {
      const result = await deleteCategory(_id);
      return result;
    }
  );
};

export default setCategoriesEventHandler;
