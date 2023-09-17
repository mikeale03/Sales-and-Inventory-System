import { User } from 'globalTypes/realm/user.types';
import { createContext } from 'react';

const UserContext = createContext<{
  user: User | undefined;
  setUser: (user: User) => void;
}>({
  user: undefined,
  setUser: () => {},
});

export default UserContext;
