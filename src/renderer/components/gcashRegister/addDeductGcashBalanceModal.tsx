import { FormEvent, useState } from 'react';
import { Button, Form, FormSelect, Modal } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { GcashType } from 'globalTypes/realm/gcash.types';
import { GCashItem } from './setCashInOutModal';

type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  type: GcashType;
  selectedItem?: GCashItem;
  onConfirm: (type: GcashType, item: GCashItem) => void;
};

const AddDeductGcashBalanceModal = ({
  show,
  toggle,
  type,
  selectedItem,
  onConfirm,
}: Props) => {
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [localType, setLocalType] = useState<GcashType>(type);
  const [note, setNote] = useState('');

  const onShow = () => {
    setAmount('');
    setDate(null);
    setNote('');
    if (selectedItem) {
      setAmount(selectedItem.amount);
      setDate(selectedItem.date_transacted);
      setLocalType(selectedItem.type);
      setNote(selectedItem.note ?? '');
    }
  };

  const handleCancel = () => {
    toggle(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type !== 'add balance' && type !== 'deduct balance') return;
    date &&
      onConfirm(type, {
        key: selectedItem?.key,
        number: '',
        amount: +amount,
        charge: 0,
        charge_payment: 'cash',
        type: localType,
        date_transacted: date,
        note,
      });

    toggle(false);
  };

  return (
    <Modal
      show={show}
      onShow={onShow}
      onHide={() => toggle(false)}
      size="sm"
      centered
      backdrop="static"
    >
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <Modal.Title>
            {selectedItem ? 'Edit ' : ''}
            {type === 'deduct balance' ? 'Deduct' : 'Add'} GCash Balance
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              value={amount}
              type="number"
              step={0.01}
              min={0.01}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Date <span className="text-danger">*</span>
            </Form.Label>
            <ReactDatePicker
              className="form-control"
              selected={date}
              onChange={(selectedDate) => {
                const now = new Date();
                if (selectedDate && selectedDate > now) {
                  setDate(now);
                } else setDate(selectedDate);
              }}
              showTimeInput
              maxDate={new Date()}
              dateFormat="MM/dd/yyyy h:mm aa"
              required
            />
          </Form.Group>
          {selectedItem && (
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <FormSelect
                value={localType}
                name="type"
                onChange={(e) => setLocalType(e.target.value as GcashType)}
              >
                <option value="add balance">Add Balance</option>
                <option value="deduct balance">Deduct Balance</option>
              </FormSelect>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control
              value={note}
              onChange={(e) => setNote(e.target.value)}
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

export default AddDeductGcashBalanceModal;
