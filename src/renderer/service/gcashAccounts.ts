import { Channels } from 'globalTypes/channels/gcashAccountChannels';
import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const createGcashAccount = async (data: GcashAccount) => {
  const response = await ipcRenderer.invoke<Response<GcashAccount>>(
    Channels.create,
    data
  );
  return response;
};

export const updateGcashAccount = async (
  accountNumber: string,
  data: GcashAccount
) => {
  const response = await ipcRenderer.invoke<Response<GcashAccount>>(
    Channels.update,
    accountNumber,
    data
  );
  return response;
};

export const getGcashAccounts = async () => {
  const response = await ipcRenderer.invoke<Response<GcashAccount[]>>(
    Channels.getAll
  );
  return response;
};

export const deleteGcashAccount = async (number: string) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.delete,
    number
  );
  return response;
};
