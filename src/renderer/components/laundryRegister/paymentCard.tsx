/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState, memo, ChangeEvent } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';

type Props = {
  items: Record<
    string,
    { _id: string; quantity: number; price: number; totalPrice: number }
  >;
  // addOnsQty: number;
  service: 'drop-off' | 'self-service';
  customer: string;
  payment: 'paid' | 'unpaid';
  onPaymentAmountChange: (amount: number) => void;
};

const PaymentCard = ({
  items,
  service,
  customer,
  payment,
  // addOnsQty,
  onPaymentAmountChange,
}: Props) => {
  const [addOns, setAddOns] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const paymentDisplay = payment === 'paid' ? 'On Drop-Off' : 'On Claim';

  useEffect(() => {
    const keys = Object.keys(items);
    setAddOns(keys.length);
    let t = 0;
    keys.forEach((k) => {
      t += items[k].totalPrice;
    });
    setTotal(t);
  }, [items]);

  useEffect(() => {
    setPaymentAmount('');
  }, [payment]);

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(e.target.value);
    onPaymentAmountChange(+e.target.value);
  };

  return (
    <Card>
      <Card.Body>
        <Row className="mb-2">
          <Col xs="6">service:</Col>
          <Col xs="6">
            <p className="m-0 mb-1 text-end text-capitalize">{service}</p>
          </Col>

          <Col xs="6">customer:</Col>
          <Col xs="6">
            <p className="m-0 mb-1 text-end">{customer}</p>
          </Col>

          <Col xs="6">add-ons:</Col>
          <Col xs="6">
            <p className="m-0 mb-1 text-end">{addOns}</p>
          </Col>

          <Col xs="6">payment:</Col>
          <Col xs="6">
            <p className="m-0 mb-1 text-end">{paymentDisplay}</p>
          </Col>

          <Col xs="6">subtotal:</Col>
          <Col xs="6">
            <p className="m-0  mb-1 text-end">
              <strong>{pesoFormat(total)}</strong>
            </p>
          </Col>

          <Col xs="6">payment amount:</Col>
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
        {payment === 'paid' && (
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
              onChange={handlePaymentChange}
              tabIndex={0}
              required
            />
          </Form.Group>
        )}
        <div className="mt-2 d-flex">
          <Button
            className="w-100"
            variant="primary"
            type="submit"
            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
            tabIndex={1}
          >
            Submit Payment
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(PaymentCard);
