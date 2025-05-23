import { IpcMain, IpcMainInvokeEvent } from 'electron';
import {
  createCashRegisterCancelActivity,
  createGcashTransDeleteActivity,
  createProductAddActivity,
  createProductAddQtyActivity,
  createProductDeleteActivity,
  createProductEditActivity,
  createSalesDeleteActivity,
  createSalesVoidActivity,
  getActivities,
} from '../service/activitiesRealm';
import {
  CreateCashRegisterCancelActivityParams,
  CreateGcashTransDeleteActivityParams,
  CreateProductAddActivityParams,
  CreateProductAddQtyActivityParams,
  CreateProductEditActivityParams,
  CreateSalesDeleteActivityParams,
  CreateSalesVoidActivityParams,
  GetActivitiesFilter,
} from '../../globalTypes/realm/activities.types';
import { Channels } from '../../globalTypes/channels/activitiesChannels';

const setActivitiesEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.createProductAddActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateProductAddActivityParams
    ) => {
      const result = await createProductAddActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createProductEditActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateProductEditActivityParams
    ) => {
      const result = await createProductEditActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createProductAddQtyActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateProductAddQtyActivityParams
    ) => {
      const result = await createProductAddQtyActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createProductDeleteActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateProductAddActivityParams
    ) => {
      const result = await createProductDeleteActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createSalesDeleteActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateSalesDeleteActivityParams
    ) => {
      const result = await createSalesDeleteActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createSalesVoidActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateSalesVoidActivityParams
    ) => {
      const result = await createSalesVoidActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createGcashDeleteActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateGcashTransDeleteActivityParams
    ) => {
      const result = await createGcashTransDeleteActivity(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getActivities,
    async (event: IpcMainInvokeEvent, filter?: GetActivitiesFilter) => {
      const result = await getActivities(filter);
      return result;
    }
  );
  ipcMain.handle(
    Channels.createCashRegisterCancelActivity,
    async (
      event: IpcMainInvokeEvent,
      params: CreateCashRegisterCancelActivityParams
    ) => {
      const result = await createCashRegisterCancelActivity(params);
      return result;
    }
  );
};

export default setActivitiesEventHandler;
