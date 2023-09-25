import { Channels } from 'globalTypes/channels/activitiesChannels';
import {
  Activity,
  CreateProductAddActivityParams,
  CreateProductAddQtyActivityParams,
  CreateProductEditActivityParams,
  CreateSalesDeleteActivityParams,
  GetActivitiesFilter,
} from 'globalTypes/realm/activities.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const createProductAddActivity = async (
  params: CreateProductAddActivityParams
) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.createProductAddActivity,
    params
  );
  return response;
};

export const createProductEditActivity = async (
  params: CreateProductEditActivityParams
) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.createProductEditActivity,
    params
  );
  return response;
};

export const createProductAddQtyActivity = async (
  params: CreateProductAddQtyActivityParams
) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.createProductAddQtyActivity,
    params
  );
  return response;
};

export const createProductDeleteActivity = async (
  params: CreateProductAddActivityParams
) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.createProductDeleteActivity,
    params
  );
  return response;
};

export const createSalesDeleteActivity = async (
  params: CreateSalesDeleteActivityParams
) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    Channels.createSalesDeleteActivity,
    params
  );
  return response;
};

export const getActivities = async (filter?: GetActivitiesFilter) => {
  const response = await ipcRenderer.invoke<Response<Activity[]>>(
    Channels.getActivities,
    filter
  );
  return response;
};
