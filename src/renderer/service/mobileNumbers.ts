import { Channels } from 'globalTypes/channels/mobileNumberChannels';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const createMobileNumber = async (data: MobileNumber) => {
  const response = await ipcRenderer.invoke<Response<MobileNumber>>(
    Channels.create,
    data
  );
  return response;
};

export const updateMobileNumber = async (
  currentNumber: string,
  data: MobileNumber
) => {
  const response = await ipcRenderer.invoke<Response<MobileNumber>>(
    Channels.update,
    currentNumber,
    data
  );
  return response;
};

export const getMobileNumbers = async (searchText: string) => {
  const response = await ipcRenderer.invoke<Response<MobileNumber[]>>(
    Channels.getAll,
    searchText
  );
  return response;
};

export const deleteMobileNumber = async (number: string) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.delete,
    number
  );
  return response;
};
