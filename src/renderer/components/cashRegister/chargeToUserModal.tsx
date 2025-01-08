import {
  Button,
  FormGroup,
  FormLabel,
  FormSelect,
  Modal,
} from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { getUsers } from 'renderer/service/users';
import UserContext from 'renderer/context/userContext';
import { User } from 'globalTypes/realm/user.types';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  onConfirm?: (selectedUser: User) => void;
  onCancel?: () => void;
};

const ChargeToUserModal = ({ show, toggle, onConfirm, onCancel }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) {
        setUsers(response.result);
      }
      setSelectedUser(user);
    })();
  }, [user]);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    toggle(false);
    if (!selectedUser) return;
    onConfirm?.(selectedUser);
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      size="sm"
      backdrop="static"
      centered
    >
      <Modal.Header>
        <Modal.Title className="fw-bold text-center d-block w-100">
          Charge to User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <FormLabel>Select User</FormLabel>
          <FormSelect
            value={selectedUser?._id}
            onChange={(e) =>
              setSelectedUser(users.find((u) => u._id === e.target.value))
            }
          >
            {users.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.username}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChargeToUserModal;
