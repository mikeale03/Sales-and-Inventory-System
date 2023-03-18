import { useContext, useEffect, useState, memo, useRef } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
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
  const confirmRef = useRef<HTMLButtonElement | null>(null);
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

    const response = await salesPurchase(
      Object.keys(items).map((key) => items[key]),
      user.username,
      user._id,
      isGcash ? 'gcash' : 'cash'
    );
    if (!response.isSuccess) {
      toast.error(response.message);
      onError?.();
      toggle(false);
      return;
    }
    toast.success(response.message);
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
            <span className="text-primary fw-bold">GCash</span>
          </p>
        }
      />
      <Modal
        show={show}
        onHide={() => toggle(false)}
        onShow={() => confirmRef.current?.focus()}
        size="sm"
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
          <Button
            variant="outline-primary"
            size="sm"
            tabIndex={0}
            onClick={() => {
              setShowGcashConfirmation(true);
              toggle(false);
            }}
          >
            GCash Payment
          </Button>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => toggle(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            ref={confirmRef}
            onClick={() => handlePayment(false)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(PaymentConfirmationModal);
