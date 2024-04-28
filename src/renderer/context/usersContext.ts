import { User } from 'globalTypes/realm/user.types';
import { Dispatch, SetStateAction, createContext } from 'react';

const UsersContext = createContext<{
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
}>({
  users: [],
  setUsers: () => {},
});

export default UsersContext;
