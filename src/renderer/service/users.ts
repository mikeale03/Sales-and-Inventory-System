import PouchDb from 'pouchdb';
import { Response } from './response';

const { utils } = window.electron;

export enum Role {
  Admin = 'Admin',
  Cashier = 'Cashier',
}

function isValidRole(role: string): role is Role {
  return Object.values<string>(Role).includes(role);
}

export interface IUser {
  _id: string;
  username?: string;
  salt?: string;
  hash?: string;
  role?: Role;
}

export type GetUserResponse = IUser &
  PouchDB.Core.IdMeta &
  PouchDB.Core.GetMeta;

export const usersDb = new PouchDb<IUser>('Users');

export const createUser = async (user: {
  username: string;
  password: string;
  role: string;
}): Promise<Response<PouchDB.Core.Response>> => {
  if (!isValidRole(user.role)) {
    return {
      isSuccess: false,
      result: undefined,
      message: 'Invalid Role',
    };
  }

  const { hash, salt } = utils.hashAndSaltPassword(user.password);

  try {
    const newUser = await usersDb.put({
      _id: user.username,
      username: user.username,
      salt,
      hash,
      role: user.role,
    });

    return {
      isSuccess: true,
      result: newUser,
      message: 'Successfully created a new user.',
    };
  } catch (error) {
    return {
      isSuccess: false,
      result: undefined,
      message: 'Error occured while creating a user.',
      error,
    };
  }
};

export const getAllUsers = async () =>
  usersDb.allDocs({
    include_docs: true,
  });

export const deleteUser = async (id: string): Promise<Response<unknown>> => {
  const response: Response<unknown> = {
    isSuccess: false,
    result: undefined,
    message: '',
  };

  let user: GetUserResponse;

  try {
    user = await usersDb.get(id);
  } catch (error) {
    response.message = 'Error occured while searching a user.';
    response.error = error;
    return response;
  }

  try {
    response.result = await usersDb.remove(user);
    response.isSuccess = true;
    response.message = 'Successfully deleted a user.';
  } catch (error: unknown) {
    response.result = error;
    response.message = 'Error occured while deleting a user.';
  }

  return response;
};

export const removeAll = async () => {
  const allDocs = await usersDb.allDocs();
  const docs: PouchDB.Core.PutDocument<{
    _id: string;
    _rev: string;
    _deleted: boolean;
  }>[] = allDocs.rows.map((doc) => ({
    _id: doc.id,
    _rev: doc.value.rev,
    _deleted: true,
  }));

  return usersDb.bulkDocs(docs);
};
