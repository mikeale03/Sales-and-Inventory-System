import { FormEvent, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createUser } from 'renderer/service/users';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const CreateAdminModal = ({ show, toggle, onSuccess, onCancel }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (password !== confirmPassword) {
      toast.error('Password and Confirm Password does not match');
      return;
    }
    const response = await createUser({
      username,
      password,
      role: 'admin',
    });
    if (response.isSuccess) {
      toast.success(response.message);
      toggle(false);
      onSuccess?.();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Modal show={show} onHide={() => toggle(false)}>
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>Create Admin Account</Modal.Title>
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
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

export default CreateAdminModal;
