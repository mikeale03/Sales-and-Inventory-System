import { User } from 'globalTypes/realm/user.types';
import { useContext, useEffect, useState } from 'react';
import { FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import UserContext from 'renderer/context/userContext';
import { getUsers } from 'renderer/service/users';

export type Props = {
  value: string;
  onSelect: (userId: string) => void;
  noAllOption?: boolean;
};

function UsersSelect({ value, onSelect, noAllOption }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) {
        setUsers(response.result);
      }
    })();
  }, [user]);

  return (
    <FormGroup>
      <FormLabel>User</FormLabel>
      <FormSelect value={value} onChange={(e) => onSelect(e.target.value)}>
        {!noAllOption && <option value="all">All</option>}
        {users.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.username}
          </option>
        ))}
      </FormSelect>
    </FormGroup>
  );
}

export default UsersSelect;
