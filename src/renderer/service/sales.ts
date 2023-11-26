import { Channels } from 'globalTypes/channels/salesChannels';
import { Gcash } from 'globalTypes/realm/gcash.types';
import { SalesPurchaseArg } from 'main/eventHandlers/sales';
import { Response } from 'globalTypes/realm/response.types';
import { Sales } from 'main/service/salesRealm';

const {
  electron: { ipcRenderer },
} = window;

export const salesPurchase = async (...args: SalesPurchaseArg) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.purchase,
    ...args
  );
  return response;
};

export const getSalesByProducts = async (filter?: {
  transactByUserId?: string;
  startDate?: Date;
  endDate?: Date;
  productName?: string;
  verifiedOnly?: boolean;
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
  productName?: string;
}) => {
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

export const updateByGcashDelete = async (gcash: Gcash) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.updateByGcashDelete,
    gcash
  );
  return response;
};

export const getSalesQtyByDateRange = async (
  startDate: Date,
  endDate: Date
) => {
  const response = await ipcRenderer.invoke<
    Response<{ quantity: number; product_name: string }[]>
  >(Channels.getSalesByDateRange, startDate, endDate);
  return response;
};

export const getSalesGroupByDate = async (startDate: Date, endDate: Date) => {
  const response = await ipcRenderer.invoke<
    Response<
      Map<
        string,
        {
          product_name: string;
          quantity: number;
          total_price: number;
          date: string;
        }
      >
    >
  >(Channels.getSalesGroupByDate, startDate, endDate);
  return response;
};
