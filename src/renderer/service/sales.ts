import { Channels } from 'globalTypes/channels/salesChannels';
import { IResponse } from 'globalTypes/dbApi/response.types';
import { Sales } from 'main/service/salesRealm';

const {
  electron: { ipcRenderer },
} = window;

export const salesPurchase = async (
  items: {
    _id: string;
    quantity: string | number;
  }[],
  transactBy: string
) => {
  const response = await ipcRenderer.invoke<IResponse<undefined>>(
    Channels.purchase,
    items,
    transactBy
  );
  return response;
};

export const getSalesByProducts = async (filter?: {
  transactBy: string;
  startDate: Date;
  endDate: Date;
}) => {
  const response = await ipcRenderer.invoke<IResponse<Sales[]>>(
    Channels.getByProducts,
    filter
  );
  return response;
};
