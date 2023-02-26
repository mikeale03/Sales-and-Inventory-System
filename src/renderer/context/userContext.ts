import { createContext } from 'react';
import { User } from 'main/service/usersRealm';

const UserContext = createContext<{
  user: User | undefined;
  setUser: (user: User) => void;
}>({
  user: undefined,
  setUser: () => {},
});

export default UserContext;
