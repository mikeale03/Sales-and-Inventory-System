import { FormEvent, useRef, useState } from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const CancelCodeModal = ({ show, toggle, onConfirm, onCancel }: Props) => {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCancel = () => {
    setCode('');
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (code === '1101') {
      setCode('');
      toggle(false);
      return onConfirm?.();
    }
    setCode('');
    return toast.error('Code is invalid!');
  };

  const onShow = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  return (
    <Modal show={show} onHide={handleCancel} onShow={onShow} size="sm" centered>
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100">
            Enter Cancellation Code
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
          <Button className="w-100" variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CancelCodeModal;
