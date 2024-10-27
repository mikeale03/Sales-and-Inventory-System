import { MobileLoadChannels } from 'globalTypes/channels/mobileLoadChannels';
import {
  CreateMobileLoadParams,
  MobileLoad,
  MobileLoadFilterParams,
} from 'globalTypes/realm/mobileLoad.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const getMobileLoads = async (params: MobileLoadFilterParams) => {
  const response = await ipcRenderer.invoke<Response<MobileLoad[]>>(
    MobileLoadChannels.get,
    params
  );
  return response;
};

export const createMobileLoad = async (params: CreateMobileLoadParams) => {
  const response = await ipcRenderer.invoke<Response<MobileLoad[]>>(
    MobileLoadChannels.create,
    params
  );
  return response;
};

export const deleteMobileLoad = async (id: string) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    MobileLoadChannels.delete,
    id
  );
  return response;
};
