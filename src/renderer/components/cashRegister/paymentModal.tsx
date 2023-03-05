import { salesPurchase } from 'renderer/service/sales';
import { FormEvent, useMemo, useState, useContext } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';

export type Props = {
  show: boolean;
  // eslint-disable-next-line no-unused-vars
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
  const { user } = useContext(UserContext);

  const change = useMemo(() => +payment - total, [total, payment]);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!items || !user?.username) return;

    const response = await salesPurchase(
      Object.keys(items).map((key) => items[key]),
      user.username,
      user._id
    );
    window.console.log(response);
    if (!response.isSuccess) {
      toast.error(response.message);
      return;
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
      centered
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
