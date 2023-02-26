import { Response } from 'globalTypes/realm/response.types';
import { User } from 'main/service/usersRealm';

const {
  electron: { ipcRenderer },
} = window;

export const createUser = async (user: {
  username: string;
  password: string;
  role: 'admin' | 'staff';
}) => {
  const response = await ipcRenderer.invoke<Response<User>>(
    'users:create',
    user
  );
  return response;
};

export const getUsersQuantity = async () => {
  const response = await ipcRenderer.invoke<Response<number>>('users:quantity');
  return response;
};

export const login = async (username: string, password: string) => {
  const response = await ipcRenderer.invoke<Response<User>>(
    'users:login',
    username,
    password
  );
  return response;
};
