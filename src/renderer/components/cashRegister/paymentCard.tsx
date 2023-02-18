import { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import { salesPurchase } from 'renderer/service/sales';
import { pesoFormat } from 'renderer/utils/helper';

type Props = {
  items: Record<
    string,
    { _id: string; quantity: number; price: number; totalPrice: number }
  >;
  onPaymentDone: () => void;
  onReset: () => void;
};

const PaymentCard = ({ items, onPaymentDone, onReset }: Props) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentInput, setPaymentInput] = useState('');
  const [lines, setLines] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { user } = useContext(UserContext);
  const change = paymentAmount - total;

  useEffect(() => {
    !isDone && setPaymentAmount(+paymentInput);
  }, [isDone, paymentInput]);

  useEffect(() => {
    setIsDone(false);
    const keys = Object.keys(items);
    setLines(keys.length);
    let t = 0;
    keys.forEach((k) => {
      t += items[k].totalPrice;
    });
    setTotal(t);
  }, [items]);

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!user?.username) return;

    const response = await salesPurchase(
      Object.keys(items).map((key) => items[key]),
      user.username
    );
    window.console.log(response);
    if (!response.isSuccess) {
      toast.error(response.message);
      return;
    }
    setIsDone(true);
    setPaymentInput('');
    onPaymentDone();
  };

  const handleReset = () => {
    setIsDone(false);
    setPaymentInput('');
    onReset();
  };

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={(e) => !isDone && handlePayment(e)}>
          <Row className="mb-2">
            <Col xs="6">line:</Col>
            <Col xs="6">
              <p className="m-0 mb-1 text-end">{lines}</p>
            </Col>
            <Col xs="6">subtotal:</Col>
            <Col xs="6">
              <p className="m-0  mb-1 text-end">
                <strong>{pesoFormat(total)}</strong>
              </p>
            </Col>
            <Col xs="6">payment:</Col>
            <Col xs="6">
              <p className="m-0  mb-1 text-end">{pesoFormat(paymentAmount)}</p>
            </Col>
            <Col xs="6">change:</Col>
            <Col xs="6">
              <p className="m-0  mb-1 text-end">
                <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
              </p>
            </Col>
            <Col xs="6">status:</Col>
            <Col xs="6">
              <p className="m-0  mb-1 text-end">
                <strong>{isDone ? 'Paid' : 'Not Paid'}</strong>
              </p>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="d-block fw-bold text-center">
              Payment Amount
            </Form.Label>
            {!isDone ? (
              <Form.Control
                className="text-center"
                type="number"
                min={total}
                placeholder="Enter amount"
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                disabled={isDone}
                required
              />
            ) : (
              <p className="text-center">{pesoFormat(paymentAmount)}</p>
            )}
          </Form.Group>

          <div className="mt-2">
            {!isDone && (
              <Button
                className="w-100"
                variant="primary"
                type="submit"
                disabled={!lines}
              >
                Submit Payment
              </Button>
            )}
          </div>
        </Form>
        {isDone && (
          <Button className="w-100" variant="success" onClick={handleReset}>
            Done
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default PaymentCard;
