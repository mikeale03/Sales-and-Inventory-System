import { pbkdf2Sync } from 'crypto';
import { usersDb, GetUserResponse } from './usersDb';
import { TResponse } from './responseType';

const isValidPassword = (password: string, hash: string, salt: string) => {
  const passwordHash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(
    `hex`
  );
  return passwordHash === hash;
};

const login = async (
  username: string,
  password: string
): Promise<TResponse<GetUserResponse>> => {
  let user: GetUserResponse;
  const response: TResponse<GetUserResponse> = {
    isSuccess: false,
    message: '',
  };

  try {
    user = await usersDb.get(username);
  } catch (error) {
    response.message = 'Username error';
    response.error = error;
    return response;
  }

  if (isValidPassword(password, user.hash!, user.salt!)) {
    response.isSuccess = true;
    response.message = 'Login successful.';
  } else {
    response.isSuccess = false;
    response.message = 'Incorrect password.';
  }
  return response;
};

export default login;
