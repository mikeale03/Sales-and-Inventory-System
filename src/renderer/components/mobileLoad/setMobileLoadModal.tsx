import { MobileLoad, Source } from 'globalTypes/realm/mobileLoad.types';
import { useState, FormEvent } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { pesoFormat } from 'renderer/utils/helper';
import MobileNumberInput from '../common/forms/mobileNumberInput';

export type MobileLoadForm = {
  _id?: string;
  number: string;
  amount: string | number;
  total_amount: string | number;
  source: string;
  date_transacted: Date | null;
};

export type MobileLoadResponse = {
  _id?: string;
  number: string;
  amount: number;
  charge: number;
  total_amount: number;
  source: Source;
  date_transacted: Date;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedItem?: MobileLoad;
  onConfirm: (mobileLoad: MobileLoadResponse) => void;
  onCancel?: () => void;
  onExited?: () => void;
};

const initMobileLoad = {
  number: '',
  amount: '',
  total_amount: '',
  source: 'gcash',
  date_transacted: null,
};

const SetMobileLoadModal = ({
  show,
  toggle,
  selectedItem,
  onConfirm,
  onCancel,
  onExited,
}: Props) => {
  const [mobileLoad, setMobileLoad] = useState<MobileLoadForm>(initMobileLoad);

  const charge = (+mobileLoad.total_amount - +mobileLoad.amount).toFixed(2);

  const handleOnChange = async (update: Partial<MobileLoadForm>) => {
    setMobileLoad({ ...mobileLoad, ...update });
  };

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { amount, total_amount, source, date_transacted } = mobileLoad;
    if (!date_transacted) return;

    onConfirm({
      ...mobileLoad,
      amount: +amount,
      charge: +charge,
      source: source as Source,
      total_amount: +total_amount,
      date_transacted,
    });
    toggle(false);
  };

  const onShow = () => {
    setMobileLoad(selectedItem || initMobileLoad);
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
          <Modal.Title>Mobile Load</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Mobile Number <span className="text-danger">*</span>
            </Form.Label>
            <MobileNumberInput
              value={mobileLoad.number}
              onChange={(number) => handleOnChange({ number })}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              step={0.01}
              min={0}
              required
              value={mobileLoad.amount}
              onChange={(e) => handleOnChange({ amount: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Total Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              step={0.01}
              min={mobileLoad.amount}
              required
              value={mobileLoad.total_amount}
              onChange={(e) => handleOnChange({ total_amount: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Date <span className="text-danger">*</span>
            </Form.Label>
            <ReactDatePicker
              className="form-control"
              selected={mobileLoad.date_transacted}
              onChange={(date_transacted) =>
                handleOnChange({ date_transacted })
              }
              showTimeInput
              maxDate={new Date()}
              dateFormat="MM/dd/yyyy h:mm aa"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Source <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="select"
              value={mobileLoad.source}
              onChange={(e) => handleOnChange({ source: e.target.value })}
            >
              <option value="other">Other</option>
              <option value="gcash">GCash</option>
            </Form.Control>
          </Form.Group>
          <p>
            <strong>Charge Amount:</strong>{' '}
            <span>{charge ? pesoFormat(+charge) : 0}</span>
          </p>
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

export default SetMobileLoadModal;
