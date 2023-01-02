import { pbkdf2Sync } from 'crypto';
import { IUser } from 'globalTypes/dbApi/users.types';
import { GetResponse } from 'globalTypes/dbApi/response.types';
import { usersDb } from './usersDb';

const isValidPassword = (password: string, hash: string, salt: string) => {
  const passwordHash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(
    `hex`
  );
  return passwordHash === hash;
};

const login = async (
  username: string,
  password: string
): Promise<GetResponse<IUser>> => {
  let user: IUser & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

  try {
    user = await usersDb.get(username);
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Cannot get user',
      error,
    };
  }

  if (isValidPassword(password, user.hash!, user.salt!)) {
    return {
      isSuccess: true,
      result: user,
      message: 'Login successful',
    };
  }

  return {
    isSuccess: false,
    message: 'Incorrect password',
  };
};

export default login;
