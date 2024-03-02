import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/tagsChannels';
import { createTag, deleteTag, getTags, updateTag } from '../service/tagsRealm';

const setTagsEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, name: string) => {
      const result = await createTag(name);
      return result;
    }
  );
  ipcMain.handle(Channels.getAll, async (event: IpcMainInvokeEvent) => {
    const result = await getTags();
    return result;
  });
  ipcMain.handle(
    Channels.update,
    async (event: IpcMainInvokeEvent, _id: string, name: string) => {
      const result = await updateTag(_id, name);
      return result;
    }
  );
  ipcMain.handle(
    Channels.delete,
    async (event: IpcMainInvokeEvent, _id: string) => {
      const result = await deleteTag(_id);
      return result;
    }
  );
};

export default setTagsEventHandler;
