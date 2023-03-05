import { Channels } from 'globalTypes/channels/salesChannels';
import { Response } from '../../globalTypes/realm/response.types';
import { Sales } from '../../main/service/salesRealm';

const {
  electron: { ipcRenderer },
} = window;

export const salesPurchase = async (
  items: {
    _id: string;
    quantity: string | number;
  }[],
  transactBy: string,
  transactByUserId: string
) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.purchase,
    items,
    transactBy,
    transactByUserId
  );
  return response;
};

export const getSalesByProducts = async (filter?: {
  transactBy?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const response = await ipcRenderer.invoke<Response<Sales[]>>(
    Channels.getByProducts,
    filter
  );
  return response;
};

export const getSalesByTransactions = async (filter?: {
  transactByUserId?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  console.log(filter);
  const response = await ipcRenderer.invoke<Response<Sales[]>>(
    Channels.getByTransactions,
    filter
  );
  return response;
};

export const deleteSale = async (saleId: string) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.delete,
    saleId
  );
  return response;
};
