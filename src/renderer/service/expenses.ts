import { Channels } from 'globalTypes/channels/expensesChannels';
import {
  CreateExpenseRequest,
  Expense,
  GetExpensesFilter,
  UpdateExpenseRequest,
} from 'globalTypes/realm/expenses.type';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const createExpense = async (params: CreateExpenseRequest) => {
  const response = await ipcRenderer.invoke<Response<Expense>>(
    Channels.create,
    params
  );
  return response;
};

export const updateExpense = async (params: UpdateExpenseRequest) => {
  const response = await ipcRenderer.invoke<Response<Expense>>(
    Channels.update,
    params
  );
  return response;
};

export const getExpenses = async (filter?: GetExpensesFilter) => {
  const response = await ipcRenderer.invoke<Response<Expense[]>>(
    Channels.getAll,
    filter
  );
  return response;
};

export const deleteExpense = async (id: string) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.delete,
    id
  );
  return response;
};
