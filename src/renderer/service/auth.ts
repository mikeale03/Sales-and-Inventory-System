import { usersDb, GetUserResponse } from './users';
import { Response } from './response';

const { utils } = window.electron;

const login = async (
  username: string,
  password: string
): Promise<Response<GetUserResponse>> => {
  let user: GetUserResponse;
  const response: Response<GetUserResponse> = {
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

  if (utils.isValidPassword(password, user.hash!, user.salt!)) {
    response.isSuccess = true;
    response.message = 'Login successful.';
  } else {
    response.isSuccess = false;
    response.message = 'Incorrect password.';
  }
  return response;
};

export default login;
