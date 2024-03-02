import { Channels } from 'globalTypes/channels/tagsChannels';
import { TagResult } from 'globalTypes/realm/tags.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const createTag = async (name: string) => {
  const response = await ipcRenderer.invoke<Response<TagResult>>(
    Channels.create,
    name
  );
  return response;
};

export const updateTag = async (_id: string, name: string) => {
  const response = await ipcRenderer.invoke<Response<TagResult>>(
    Channels.update,
    _id,
    name
  );
  return response;
};

export const getTags = async () => {
  const response = await ipcRenderer.invoke<Response<TagResult[]>>(
    Channels.getAll
  );
  return response;
};

export const deleteTag = async (_id: string) => {
  const response = await ipcRenderer.invoke<Response<TagResult[]>>(
    Channels.delete,
    _id
  );
  return response;
};
