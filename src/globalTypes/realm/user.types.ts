export type User = {
  _id: string;
  username: string;
  password?: string;
  salt?: string;
  role: 'admin' | 'staff';
  date_created: Date;
};

export type UserCreate = {
  username: string;
  password: string;
  role: 'admin' | 'staff';
};

export type UserUpdate = {
  _id: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'staff';
};
