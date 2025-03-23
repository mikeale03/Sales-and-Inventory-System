import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/expensesChannels';
import {
  CreateExpenseRequest,
  GetExpensesFilter,
  UpdateExpenseRequest,
  UpdateExpensesRequest,
} from '../../globalTypes/realm/expenses.type';
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
  updateExpenses,
} from '../service/expenseRealm';

const setExpensesEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (event: IpcMainInvokeEvent, params: CreateExpenseRequest) => {
      const result = await createExpense(params);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getAll,
    async (event: IpcMainInvokeEvent, filter?: GetExpensesFilter) => {
      const result = await getExpenses(filter);
      return result;
    }
  );
  ipcMain.handle(
    Channels.delete,
    async (event: IpcMainInvokeEvent, id: string) => {
      const result = await deleteExpense(id);
      return result;
    }
  );
  ipcMain.handle(
    Channels.update,
    async (event: IpcMainInvokeEvent, data: UpdateExpenseRequest) => {
      const result = await updateExpense(data);
      return result;
    }
  );
  ipcMain.handle(
    Channels.updateMany,
    async (event: IpcMainInvokeEvent, data: UpdateExpensesRequest) => {
      const result = await updateExpenses(data);
      return result;
    }
  );
};

export default setExpensesEventHandler;
