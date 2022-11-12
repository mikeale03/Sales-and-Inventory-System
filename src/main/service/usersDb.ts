import PouchDb from 'pouchdb';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { TResponse } from './responseType';
import Role from '../../globalTypes/dbApi/users.enums';

const hashAndSaltPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
  const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex');
  return { salt, hash };
};

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

export const usersDb = new PouchDb<IUser>('database/Users');

export const createUser = async (user: {
  username: string;
  password: string;
  role: string;
}): Promise<TResponse<PouchDB.Core.Response>> => {
  if (!isValidRole(user.role)) {
    return {
      isSuccess: false,
      result: undefined,
      message: 'Invalid Role',
    };
  }

  const { hash, salt } = hashAndSaltPassword(user.password);

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

export const deleteUser = async (id: string): Promise<TResponse<unknown>> => {
  const response: TResponse<unknown> = {
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
    _rev: PouchDB.Core.RevisionId;
    _deleted: boolean;
  }>[] = allDocs.rows.map((doc) => ({
    _id: doc.id,
    _rev: doc.value.rev,
    _deleted: true,
  }));

  return usersDb.bulkDocs(docs);
};

const usersApi = {
  createUser,
  getAllUsers,
  removeAll,
  deleteUser,
};

export default usersApi;
