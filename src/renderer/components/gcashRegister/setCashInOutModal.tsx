import { useState, FormEvent } from 'react';
import { Button, Modal, Form, FormSelect } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';

type GCashForm = {
  key?: number;
  number: string;
  amount: number | string;
  charge: number;
  charge_payment: string;
  type: string;
};

export type GCashItem = {
  key?: number;
  number: string;
  amount: number;
  charge: number;
  charge_payment: 'cash' | 'gcash';
  type: 'cash in' | 'cash out';
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  type: 'cash in' | 'cash out';
  selectedItem?: GCashItem;
  onConfirm: (type: 'cash in' | 'cash out', item: GCashItem) => void;
  onCancel?: () => void;
  onExited?: () => void;
};

const initItem = {
  number: '',
  amount: '',
  charge: 0,
  charge_payment: 'cash',
  type: '',
};

const SetCashInOutModal = ({
  show,
  toggle,
  type,
  selectedItem,
  onConfirm,
  onCancel,
  onExited,
}: Props) => {
  const [item, setItem] = useState<GCashForm>(initItem);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(false);
    const { type: typ, amount, charge_payment } = item;
    if (
      (typ === 'cash in' || typ === 'cash out') &&
      (charge_payment === 'cash' || charge_payment === 'gcash')
    )
      onConfirm(type, { ...item, amount: +amount, type: typ, charge_payment });
  };

  const onShow = () => {
    selectedItem ? setItem(selectedItem) : setItem({ ...initItem, type });
  };

  const handleChange = (update: Partial<GCashForm>) => {
    if (update.type === 'cash in') update.charge_payment = 'cash';
    setItem({ ...item, ...update });
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
            {selectedItem ? 'Edit ' : ''}
            {type}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              GCash Number <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              value={item.number}
              type="number"
              step={1}
              min={0}
              onChange={(e) => handleChange({ number: e.target.value })}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              value={item.amount}
              type="amount"
              step={1}
              min={0}
              onChange={(e) => handleChange({ amount: e.target.value })}
              required
            />
          </Form.Group>
          <p>Charge: {pesoFormat(Math.ceil(+item.amount / 500) * 10)}</p>
          {selectedItem && (
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <FormSelect
                value={item.type}
                name="type"
                onChange={(e) => handleChange({ type: e.target.value })}
              >
                <option value="cash in">Cash In</option>
                <option value="cash out">Cash Out</option>
              </FormSelect>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Charge Payment</Form.Label>
            <FormSelect
              value={item.charge_payment}
              disabled={item.type === 'cash in'}
              onChange={(e) => handleChange({ charge_payment: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
            </FormSelect>
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

export default SetCashInOutModal;
