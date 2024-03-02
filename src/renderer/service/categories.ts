import { Channels } from 'globalTypes/channels/categoriesChannels';
import { CategoryResult } from 'globalTypes/realm/categories.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const createCategory = async (name: string) => {
  const response = await ipcRenderer.invoke<Response<CategoryResult>>(
    Channels.create,
    name
  );
  return response;
};

export const updateCategory = async (_id: string, name: string) => {
  const response = await ipcRenderer.invoke<Response<CategoryResult>>(
    Channels.update,
    _id,
    name
  );
  return response;
};

export const getCategories = async () => {
  const response = await ipcRenderer.invoke<Response<CategoryResult[]>>(
    Channels.getAll
  );
  return response;
};

export const deleteCategory = async (_id: string) => {
  const response = await ipcRenderer.invoke<Response<CategoryResult[]>>(
    Channels.delete,
    _id
  );
  return response;
};
