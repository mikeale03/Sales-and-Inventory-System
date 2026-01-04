import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import {
  faBuildingColumns,
  faPenToSquare,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GcashType } from 'globalTypes/realm/gcash.types';
import { useState, FormEvent } from 'react';
import { Button, Modal, Form, FormSelect, FormControl } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { getGcashCharge, pesoFormat } from 'renderer/utils/helper';
import useGcashAccountStore from 'renderer/store/gcashAccountsStore';
import useSelectedGcashAccountStore from 'renderer/store/selectedGcashAccountStore';
import MobileNumberInput from '../common/forms/mobileNumberInput';
import GcashAccountSelect from '../common/selects/gcashAccountSelect';

type Type = 'cash in' | 'cash out' | 'add balance' | 'deduct balance';

type GCashForm = {
  key?: number;
  number: string;
  amount: number | string;
  charge: number | string;
  charge_payment: string;
  type: string;
  date_transacted: Date | null;
};

export type GCashItem = {
  key?: number;
  account_number?: string;
  number: string;
  amount: number;
  charge: number;
  charge_payment: 'cash' | 'gcash';
  type: GcashType;
  date_transacted: Date;
  note?: string;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  type: GcashType;
  selectedItem?: GCashItem;
  onConfirm: (type: Type, item: GCashItem) => void;
  onCancel?: () => void;
  onExited?: () => void;
};

const initItem = {
  number: '',
  amount: '',
  charge: 0,
  charge_payment: 'cash',
  type: '',
  date_transacted: null,
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
  const [isEditCharge, setIsEditCharge] = useState(false);

  const { gcashAccounts } = useGcashAccountStore((state) => state);
  const { selectedGcashAccount } = useSelectedGcashAccountStore(
    (state) => state
  );

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(false);

    const { number: account_number } = selectedGcashAccount || {};
    const { type: typ, amount, charge_payment, charge, date_transacted } = item;

    if (!date_transacted) return;
    if (
      (typ === 'cash in' || typ === 'cash out') &&
      (charge_payment === 'cash' || charge_payment === 'gcash')
    )
      onConfirm(type as Type, {
        ...item,
        date_transacted,
        amount: +amount,
        type: typ,
        charge_payment,
        charge: +charge,
        account_number,
      });
  };

  const onShow = () => {
    selectedItem ? setItem(selectedItem) : setItem({ ...initItem, type });
  };

  const handleChange = (update: Partial<GCashForm>) => {
    if (update.type === 'cash in') update.charge_payment = 'cash';

    if (update.amount !== undefined) {
      const amount = +update.amount;
      const charge = getGcashCharge(amount);
      update.charge = charge;
    }

    if (update.date_transacted && update.date_transacted > new Date()) {
      update.date_transacted = new Date();
    }

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
      backdrop="static"
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title
            className={`fw-bold text-center d-block w-100 text-capitalize ${
              type === 'cash in' ? 'text-primary' : 'text-danger'
            }`}
          >
            {selectedItem ? 'Edit ' : ''}
            {`${type} `}
            {type === 'cash in' ? (
              <FontAwesomeIcon icon={faBuildingColumns} />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {gcashAccounts.length > 0 && <GcashAccountSelect />}
          <Form.Group className="mb-3">
            <Form.Label>
              GCash Number <span className="text-danger">*</span>
            </Form.Label>
            {/* <Form.Control
              value={item.number}
              onChange={(e) => handleChange({ number: e.target.value })}
              required
              autoFocus
            /> */}
            <MobileNumberInput
              value={item.number}
              onChange={(number) => handleChange({ number })}
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
              type="number"
              step={1}
              min={0}
              onChange={(e) => handleChange({ amount: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Date <span className="text-danger">*</span>
            </Form.Label>
            <ReactDatePicker
              className="form-control"
              selected={item.date_transacted}
              onChange={(date_transacted) => handleChange({ date_transacted })}
              showTimeInput
              maxDate={new Date()}
              dateFormat="MM/dd/yyyy h:mm aa"
              required
            />
          </Form.Group>
          <p className="m-0 mb-1">
            <span className="me-2">Charge</span>
            <FontAwesomeIcon
              onClick={() => setIsEditCharge(true)}
              icon={faPenToSquare}
              title="Edit charge"
              className="me-2 cursor-pointer"
            />
            <FontAwesomeIcon
              onClick={() => {
                handleChange({ charge: getGcashCharge(+item.amount) });
                setIsEditCharge(false);
              }}
              icon={faRotateRight}
              title="Restore default"
              className="me-2 cursor-pointer"
            />
          </p>
          {!isEditCharge ? (
            <p className="ms-1 mb-3">{pesoFormat(+item.charge)}</p>
          ) : (
            <FormControl
              className="mb-3"
              type="number"
              value={item.charge}
              onChange={(e) => handleChange({ charge: e.target.value })}
              onBlur={() => setIsEditCharge(false)}
              autoFocus
            />
          )}
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
