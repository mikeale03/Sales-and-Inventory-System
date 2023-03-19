import { useState, FormEvent } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  type: 'cash in' | 'cash out';
  onConfirm?: (
    number: number,
    amount: number,
    type: 'cash in' | 'cash out'
  ) => void;
  onCancel?: () => void;
  onExited?: () => void;
};

const CashInOutModal = ({
  show,
  toggle,
  type,
  onConfirm,
  onCancel,
  onExited,
}: Props) => {
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(false);
    onConfirm?.(+number, +amount, type);
  };

  const onShow = () => {
    setAmount('');
    setNumber('');
  };

  return (
    <Modal
      show={show}
      onShow={onShow}
      onHide={() => toggle(false)}
      size="sm"
      onExited={onExited}
      centered
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100 text-capitalize">
            {type}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              GCash Number <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              value={number}
              type="number"
              step={1}
              min={0}
              onChange={(e) => setNumber(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              value={amount}
              type="number"
              step={1}
              min={0}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>
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

export default CashInOutModal;
