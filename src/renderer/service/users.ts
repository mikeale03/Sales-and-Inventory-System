import { Response } from 'globalTypes/realm/response.types';
import { Channels } from 'globalTypes/channels/usersChannels';
import { UserUpdate, User } from 'globalTypes/realm/user.types';

const {
  electron: { ipcRenderer },
} = window;

export const createUser = async (user: {
  username: string;
  password: string;
  role: 'admin' | 'staff';
}) => {
  const response = await ipcRenderer.invoke<Response<User>>(
    Channels.create,
    user
  );
  return response;
};

export const getUsersQuantity = async () => {
  const response = await ipcRenderer.invoke<Response<number>>(
    Channels.getAdminQuantity
  );
  return response;
};

export const login = async (username: string, password: string) => {
  const response = await ipcRenderer.invoke<Response<User>>(
    Channels.login,
    username,
    password
  );
  return response;
};

export const getUsers = async () => {
  const response = await ipcRenderer.invoke<Response<User[]>>(Channels.getAll);
  return response;
};

export const updateUser = async (updates: UserUpdate) => {
  const response = await ipcRenderer.invoke<Response<User>>(
    Channels.updateUser,
    updates
  );
  return response;
};

export const deleteUser = async (userId: string) => {
  const response = await ipcRenderer.invoke<Response<undefined>>(
    Channels.delete,
    userId
  );
  return response;
};
