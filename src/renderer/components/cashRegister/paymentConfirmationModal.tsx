/* eslint-disable no-restricted-syntax */
import { useContext, useEffect, useState, memo, useRef } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import UserContext from 'renderer/context/userContext';
import { createGcashTransactions } from 'renderer/service/gcash';
import { salesPurchase } from 'renderer/service/sales';
import { pesoFormat } from 'renderer/utils/helper';
import ConfirmationModal from '../common/modals/confirmation';

type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  items: Record<
    string,
    { _id: string; quantity: number; price: number; totalPrice: number }
  >;
  paymentAmount: number;
  onSuccess: () => void;
  onExited: () => void;
  onError?: () => void;
};

const PaymentConfirmationModal = ({
  show,
  toggle,
  items,
  paymentAmount,
  onSuccess,
  onExited,
  onError,
}: Props) => {
  const [lines, setLines] = useState(1);
  const [total, setTotal] = useState(0);
  const [showGcashConfirmation, setShowGcashConfirmation] = useState(false);
  const { user } = useContext(UserContext);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const change = paymentAmount - total;

  useEffect(() => {
    const keys = Object.keys(items);
    setLines(keys.length);
    let t = 0;
    keys.forEach((k) => {
      t += items[k].totalPrice;
    });
    setTotal(t);
  }, [items]);

  const handlePayment = async (isGcash: boolean) => {
    if (!user?.username) return;

    const promises = [];
    const transaction_id = uuid();

    const salesPromise = salesPurchase(
      Object.keys(items).map((key) => items[key]),
      user.username,
      user._id,
      isGcash ? 'gcash' : 'cash',
      transaction_id
    );
    promises.push(salesPromise);

    if (isGcash) {
      const gcashPromise = createGcashTransactions([
        {
          type: 'gcash pay',
          amount: total,
          charge: 0,
          charge_payment: 'cash',
          transact_by: user.username,
          transact_by_user_id: user._id,
          transaction_id,
          is_product_gcash_pay: true,
        },
      ]);
      promises.push(gcashPromise);
    }

    const responses = await Promise.all(promises);

    for (const res of responses) {
      if (!res.isSuccess) {
        console.log(res.error);
        toast.error(res.message);
        onError?.();
        toggle(false);
        return;
      }
    }

    toast.success(responses[0].message);
    onSuccess();
    toggle(false);
  };

  return (
    <>
      <ConfirmationModal
        show={showGcashConfirmation}
        toggle={setShowGcashConfirmation}
        onConfirm={() => handlePayment(true)}
        onCancel={() => toggle(true)}
        message={
          <p className="text-center">
            Are you sure to pay with{' '}
            <span className="text-primary fw-bold">GCash</span> amounting{' '}
            <span className="text-primary fw-bold">{pesoFormat(total)}</span>
          </p>
        }
      />
      <Modal
        show={show}
        onHide={() => toggle(false)}
        onShow={() => cancelRef.current?.focus()}
        size="md"
        onExited={onExited}
        centered
      >
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setShowGcashConfirmation(true);
              toggle(false);
            }}
          >
            GCash Payment
          </Button>
          <div>
            <Button
              variant="secondary"
              onClick={() => toggle(false)}
              className="me-2"
              ref={cancelRef}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handlePayment(false)}
              tabIndex={0}
            >
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(PaymentConfirmationModal);
