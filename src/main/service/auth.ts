import { pbkdf2Sync } from 'crypto';
import { IResponse } from 'globalTypes/dbApi/response.types';

const isValidPassword = (password: string, hash: string, salt: string) => {
  const passwordHash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(
    `hex`
  );
  return passwordHash === hash;
};

const user = {
  _id: 1,
  username: 'user',
  password: 'pass',
  role: 'Admin',
};

const login = async (
  username: string,
  password: string
): Promise<IResponse<typeof user>> => {
  // let user: IUser & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

  // try {
  //   user = await usersDb.get(username);
  // } catch (error) {
  //   return {
  //     isSuccess: false,
  //     message: 'Cannot get user',
  //     error,
  //   };
  // }

  // if (isValidPassword(password, user.hash!, user.salt!)) {
  if (username === 'user' && password === 'pass') {
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
