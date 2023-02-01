import { FormEvent, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { purchaseProduct } from 'renderer/service/products';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  items?: Record<
    string,
    { _id: string; quantity: number; price: number; totalPrice: number }
  >;
  onDone: () => void;
  onCancel?: () => void;
};

const PaymentModal = ({ show, toggle, items, onDone, onCancel }: Props) => {
  const [payment, setPayment] = useState<number | string>('');
  const [lines, setLines] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const change = useMemo(() => +payment - total, [total, payment]);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!items) return;
    const response = await purchaseProduct(
      Object.keys(items).map((key) => items[key])
    );
    if (!response.isSuccess) {
      toast.error(response.message);
    }
    setIsDone(true);
  };

  const onShow = () => {
    if (!items) return;

    setIsDone(false);
    setPayment('');
    const keys = Object.keys(items);
    setLines(keys.length);
    let t = 0;
    keys.forEach((k) => {
      t += items[k].totalPrice;
    });
    setTotal(t);
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      onShow={onShow}
      size="sm"
      backdrop="static"
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Modal.Title>
            <strong className="text-center">Payment</strong>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col xs="6">Line</Col>
            <Col xs="6">
              <p className="m-0 text-end">{lines}</p>
            </Col>
            <Col xs="6">Subtotal</Col>
            <Col xs="6">
              <p className="m-0 text-end">
                <strong>{total}</strong>
              </p>
            </Col>
            <Col xs="6">Payment</Col>
            <Col xs="6">
              <p className="m-0 text-end">{+payment}</p>
            </Col>
            <Col xs="6">Change</Col>
            <Col xs="6">
              <p className="m-0 text-end">
                <strong>{change}</strong>
              </p>
            </Col>
          </Row>

          <p className={`text-center ${isDone && 'text-success'}`}>
            <strong>
              {isDone ? 'Payment is Successful' : 'Payment Amount'}
            </strong>
          </p>
          <Form.Control
            type="number"
            min={total}
            placeholder="Enter amount"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            disabled={isDone}
            autoFocus
            required
          />
        </Modal.Body>
        <Modal.Footer>
          {!isDone ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                Close
              </Button>

              <Button variant="primary" type="submit">
                Ok
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                toggle(false);
                onDone();
              }}
            >
              Done
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
