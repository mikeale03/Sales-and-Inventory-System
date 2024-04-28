import { User } from 'globalTypes/realm/user.types';
import { FormEvent, useContext, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import UsersContext from 'renderer/context/usersContext';
import { updateUser } from 'renderer/service/users';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedUserId?: string;
};

const SetAccessCodeModal = ({ show, toggle, selectedUserId }: Props) => {
  const [codeUser, setCodeUser] = useState<User | undefined>();
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const { users, setUsers } = useContext(UsersContext);
  const { user, setUser } = useContext(UserContext);

  const usersWithoutAccessCode = users.filter((u) => !u.accessCode);

  const handleCancel = () => {
    toggle(false);
    toggle(false);
    setCodeUser(undefined);
    setAccessCode('');
    setShowAccessCode(false);
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    if (!codeUser) return;
    e.preventDefault();
    e.stopPropagation();

    const exist = users.find((u) => u.accessCode === accessCode);

    if (exist) {
      exist._id !== selectedUserId
        ? toast.error('Access code already exist')
        : handleCancel();

      return;
    }

    const response = await updateUser({
      accessCode,
      _id: codeUser._id,
    });

    if (response.isSuccess && response.result) {
      toast.success(
        `Access code successfully ${selectedUserId ? 'updated' : 'created'}`
      );
      setUsers(
        users.map((u) => (u._id === response.result?._id ? response.result : u))
      );
      if (user?._id === response.result._id) {
        setUser(response.result);
      }
      handleCancel();
    } else {
      toast.error(
        `Failed to ${selectedUserId ? 'updated' : 'created'} access code`
      );
    }
  };

  const onShow = () => {
    if (selectedUserId) {
      const selectedUser = users.find((u) => u._id === selectedUserId);
      setCodeUser(selectedUser);
      setAccessCode(selectedUser?.accessCode ?? '');
    } else {
      setAccessCode('');
    }
  };

  return (
    <Modal show={show} onHide={handleCancel} onShow={onShow} size="sm">
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>
            {selectedUserId ? 'Edit' : 'Create'} Access Code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User</Form.Label>
            <Form.Select
              required
              disabled={!!selectedUserId}
              value={codeUser?._id ?? ''}
              onChange={(e) =>
                setCodeUser(users.find((u) => u._id === e.target.value))
              }
            >
              <option value="" disabled>
                Select User
              </option>
              {usersWithoutAccessCode.map((opt) => (
                <option key={opt._id} value={opt._id}>
                  {opt.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              required
              value={accessCode ?? ''}
              type={showAccessCode ? 'text' : 'password'}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </Form.Group>
          <Form.Check
            label="Show Code"
            type="checkbox"
            checked={showAccessCode}
            onChange={(e) => setShowAccessCode(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SetAccessCodeModal;
