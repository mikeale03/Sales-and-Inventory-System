export enum Role {
  Admin = 'Admin',
  Cashier = 'Cashier',
}

export interface IUser {
  _id?: string;
  _rev?: string;
  username?: string;
  salt?: string;
  hash?: string;
  role?: Role;
}

export interface IUserLogin {
  username: string;
  password: string;
}
