import { createContext } from 'react';
import { IUser } from 'globalTypes/dbApi/users.types';

const UserContext = createContext<{
  user: IUser | undefined;
  setUser: (user: IUser) => void;
}>({
  user: undefined,
  setUser: () => {},
});

export default UserContext;
