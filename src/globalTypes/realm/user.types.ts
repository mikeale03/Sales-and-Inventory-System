export type Role = 'admin' | 'staff' | 'manager';

export type User = {
  _id: string;
  username: string;
  password?: string;
  salt?: string;
  role: Role;
  accessCode?: string;
  date_created: Date;
};

export type UserCreate = {
  username: string;
  password: string;
  role: Role;
};

export type UserUpdate = {
  _id: string;
  username?: string;
  password?: string;
  accessCode?: string;
  role?: Role;
};
