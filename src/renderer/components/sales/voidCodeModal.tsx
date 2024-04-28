import { User } from 'globalTypes/realm/user.types';
import { FormEvent, useContext, useRef, useState } from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UsersContext from 'renderer/context/usersContext';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  voidCode?: string;
  onConfirm?: (user: User) => void;
  onCancel?: () => void;
};

const VoidCodeModal = ({
  show,
  toggle,
  voidCode,
  onConfirm,
  onCancel,
}: Props) => {
  const [code, setCode] = useState('');
  const { users } = useContext(UsersContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCancel = () => {
    setCode('');
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessCodeUser = users.find((u) => u.accessCode === code);

    if (accessCodeUser) {
      setCode('');
      toggle(false);
      return onConfirm?.(accessCodeUser);
    }
    setCode('');
    return toast.error('Code is invalid!');
  };

  const onShow = () => {
    inputRef.current?.focus();
  };

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      onShow={onShow}
      size="sm"
      centered
      animation={false}
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100">
            Enter Void Code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            ref={inputRef}
            className="mb-2"
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default VoidCodeModal;
