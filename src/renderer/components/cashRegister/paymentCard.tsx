/* eslint-disable react/no-unstable-nested-components */
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import { salesPurchase } from 'renderer/service/sales';
import { pesoFormat } from 'renderer/utils/helper';
import ConfirmationModal from '../common/modals/confirmation';

type Props = {
  items: Record<
    string,
    { _id: string; quantity: number; price: number; totalPrice: number }
  >;
  onPaymentDone: () => void;
};

const PaymentCard = ({ items, onPaymentDone }: Props) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentInput, setPaymentInput] = useState('');
  const [lines, setLines] = useState(1);
  const [total, setTotal] = useState(0);
  const { user } = useContext(UserContext);
  const change = paymentAmount - total;

  useEffect(() => {
    setPaymentAmount(+paymentInput);
  }, [paymentInput]);

  useEffect(() => {
    const keys = Object.keys(items);
    setLines(keys.length);
    let t = 0;
    keys.forEach((k) => {
      t += items[k].totalPrice;
    });
    setTotal(t);
  }, [items]);

  const handlePayment = async () => {
    if (!user?.username) return;

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
    setPaymentInput('');
    onPaymentDone();
  };

  const handleShowConfirmationModal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmationModal(true);
  };

  return (
    <>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={
          <Row className="mb-2">
            <Col xs="6" className="fs-5">
              line:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{lines}</strong>
              </p>
            </Col>
            <Col xs="6" className="fs-5">
              subtotal:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{pesoFormat(total)}</strong>
              </p>
            </Col>
            <Col xs="6" className="fs-5">
              payment:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{pesoFormat(paymentAmount)}</strong>
              </p>
            </Col>
            <Col xs="6" className="fs-5">
              change:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
              </p>
            </Col>
          </Row>
        }
        onConfirm={handlePayment}
        size="sm"
      />
      <Card>
        <Card.Body>
          <Form onSubmit={(e) => handleShowConfirmationModal(e)}>
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
                <p className="m-0  mb-1 text-end">
                  {pesoFormat(paymentAmount)}
                </p>
              </Col>
              <Col xs="6">change:</Col>
              <Col xs="6">
                <p className="m-0  mb-1 text-end">
                  <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
                </p>
              </Col>
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
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                required
              />
            </Form.Group>

            <div className="mt-2">
              <Button
                className="w-100"
                variant="primary"
                type="submit"
                disabled={!lines}
              >
                Submit Payment
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default PaymentCard;
