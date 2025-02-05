/* eslint-disable react/no-unstable-nested-components */
import {
  FormEvent,
  useEffect,
  useState,
  memo,
  Dispatch,
  SetStateAction,
} from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';

type Props = {
  items: Record<
    string,
    { _id: string; quantity: number; price: number; totalPrice: number }
  >;
  paymentAmount: string;
  setPaymentAmount: Dispatch<SetStateAction<string>>;
  onPayment: () => void;
  onReset: () => void;
};

const PaymentCard = ({
  items,
  paymentAmount,
  setPaymentAmount,
  onReset,
  onPayment,
}: Props) => {
  const [lines, setLines] = useState(1);
  const [total, setTotal] = useState(0);
  const change = +paymentAmount - total;

  useEffect(() => {
    const keys = Object.keys(items);
    setLines(keys.length);
    let t = 0;
    keys.forEach((k) => {
      t += items[k].totalPrice;
    });
    setTotal(t);
  }, [items]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onPayment();
  };

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
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
              <p className="m-0  mb-1 text-end">{pesoFormat(+paymentAmount)}</p>
            </Col>
            {/* <Col xs="6">change:</Col>
            <Col xs="6">
              <p className="m-0  mb-1 text-end">
                <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
              </p>
            </Col> */}
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="d-block fw-bold text-center">
              Payment Amount
            </Form.Label>
            <Form.Control
              className="text-center"
              type="number"
              min={total}
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              tabIndex={0}
              required
            />
          </Form.Group>

          <div className="mt-2 d-flex">
            <Button
              variant="light"
              className="me-2"
              type="button"
              onClick={onReset}
              // eslint-disable-next-line jsx-a11y/tabindex-no-positive
              tabIndex={-1}
            >
              Clear
            </Button>
            <Button
              className="w-100"
              variant="primary"
              type="submit"
              disabled={!lines}
              // eslint-disable-next-line jsx-a11y/tabindex-no-positive
              tabIndex={1}
            >
              Submit Payment
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(PaymentCard);
