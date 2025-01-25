import { User } from 'globalTypes/realm/user.types';
import { useContext, useEffect, useState } from 'react';
import { FormLabel, FormSelect } from 'react-bootstrap';
import UserContext from 'renderer/context/userContext';
import { getUsers } from 'renderer/service/users';

function ExpenseTypeSelect({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const [value, setValue] = useState('all');
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
    <>
      <FormLabel>Type</FormLabel>
      <FormSelect
        value={value}
        onChange={(e) => {
          onSelect(e.target.value);
          setValue(e.target.value);
        }}
      >
        <option value="all">All</option>
        <option value="item charge">Item Charge</option>
        <option value="not item charge">Not Item Charge</option>
        {users.map((u) => (
          <option value={u._id} key={u.username}>
            Charge to {u.username}
          </option>
        ))}
      </FormSelect>
    </>
  );
}

export default ExpenseTypeSelect;
