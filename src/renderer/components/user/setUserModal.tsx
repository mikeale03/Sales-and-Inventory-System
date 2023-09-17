import { Role, User } from 'globalTypes/realm/user.types';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Modal, Form, FormSelect } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createUser, updateUser } from 'renderer/service/users';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedUser?: User;
  onUpdate?: (user: User) => void;
  onCreate?: (user: User) => void;
  onCancel?: () => void;
};

const SetUserModal = ({
  show,
  toggle,
  selectedUser,
  onUpdate,
  onCreate,
  onCancel,
}: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('staff');
  const [isSetPassword, setIsSetPassword] = useState(false);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSetPassword && password !== confirmPassword) {
      toast.error('Password and Confirm Password does not match');
      return;
    }
    const response = selectedUser
      ? await updateUser({
          username,
          password,
          role,
          _id: selectedUser._id,
        })
      : await createUser({
          username,
          password,
          role,
        });
    if (response.isSuccess && response.result) {
      toast.success(response.message);
      toggle(false);
      selectedUser ? onUpdate?.(response.result) : onCreate?.(response.result);
    } else {
      toast.error(response.message);
    }
  };

  const onShow = () => {
    if (selectedUser) {
      setUsername(selectedUser.username);
      setRole(selectedUser.role);
      setIsSetPassword(false);
    } else {
      setUsername('');
      setRole('staff');
      setIsSetPassword(true);
    }
  };

  const handleShowChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsSetPassword(isChecked);
    if (!isChecked) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} onShow={onShow}>
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>{selectedUser ? 'Edit' : 'Create'} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <FormSelect
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              required
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </FormSelect>
          </Form.Group>
          {selectedUser && (
            <Form.Check
              type="checkbox"
              id="checkbox"
              label="Change Password"
              onChange={handleShowChangePassword}
            />
          )}
          {isSetPassword && (
            <>
              <Form.Group className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}
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

export default SetUserModal;
