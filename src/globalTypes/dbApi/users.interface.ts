import Role from './users.enums';
import { IResponse } from '../response.interface';

export interface User {
  _id: string;
  username?: string;
  salt?: string;
  hash?: string;
  role?: Role;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface CreateUser {
  (userLogin: UserLogin): IResponse<PouchDB.Core.Response>;
}
