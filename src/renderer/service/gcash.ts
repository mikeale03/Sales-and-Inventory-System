import { Channels } from 'globalTypes/channels/gcashChannels';
import {
  Gcash,
  GcashCreate,
  GcashTransFilter,
} from 'globalTypes/realm/gcash.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const getGcashTransactions = async (filter?: GcashTransFilter) => {
  const response = await ipcRenderer.invoke<Response<Gcash[]>>(
    Channels.getTransactions,
    filter
  );
  return response;
};

export const createGcashTransactions = async (gcashTrans: GcashCreate[]) => {
  const response = await ipcRenderer.invoke<Response<Gcash[]>>(
    Channels.createTransactions,
    gcashTrans
  );
  return response;
};