import { pbkdf2Sync, randomBytes } from 'crypto';
import { IResponse, PutResponse } from 'globalTypes/dbApi/response.types';
import PouchDb from './pouchDb';
import { IUser, Role } from '../../globalTypes/dbApi/users.types';

const hashAndSaltPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
  const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex');
  return { salt, hash };
};

function isValidRole(role: string): role is Role {
  return Object.values<string>(Role).includes(role);
}

export const usersDb = new PouchDb<IUser>('database/Users');

export const createUser = async (user: {
  username: string;
  password: string;
  role: string;
}): Promise<PutResponse<IUser>> => {
  if (!isValidRole(user.role)) {
    return {
      isSuccess: false,
      result: undefined,
      message: 'Invalid Role',
    };
  }

  const { hash, salt } = hashAndSaltPassword(user.password);

  const newUser = {
    _id: user.username,
    username: user.username,
    salt,
    hash,
    role: user.role,
  };

  try {
    const { rev } = await usersDb.put(newUser);

    return {
      isSuccess: true,
      result: { ...newUser, _rev: rev },
      message: 'Successfully created a new user.',
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Error occured while creating a user.',
      error,
    };
  }
};

export const getAllUsers = async (): Promise<
  IResponse<PouchDB.Core.AllDocsResponse<IUser>>
> => {
  const response = await usersDb.allDocs({
    include_docs: true,
  });
  return {
    isSuccess: true,
    result: response,
    message: 'Successfully get all users',
  };
};

export const deleteUser = async (id: string) => {
  let user: IUser & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

  try {
    user = await usersDb.get(id);
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Error occured while searching user.',
      error,
    };
  }

  try {
    const result = await usersDb.remove(user);
    return {
      isSuccess: true,
      result,
      message: 'Deleting user is successful.',
    };
  } catch (error: unknown) {
    return {
      isSuccess: false,
      message: 'Error in deleting user.',
      error,
    };
  }
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
