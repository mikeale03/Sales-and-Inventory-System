import { Response } from '../../globalTypes/realm/response.types';
import { User } from './usersRealm';

const login = async (
  username: string,
  password: string
): Promise<Response<User>> => {
  // if (isValidPassword(password, user.hash!, user.salt!)) {
  if (username === 'user' && password === 'pass') {
    return {
      isSuccess: true,
      message: 'Login successful',
    };
  }

  return {
    isSuccess: false,
    message: 'Incorrect password',
  };
};

export default login;
