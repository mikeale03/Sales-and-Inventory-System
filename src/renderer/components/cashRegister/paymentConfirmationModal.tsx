/* eslint-disable react/no-unstable-nested-components */
import { useContext, useEffect, useState, memo } from 'react';
import { Col, Row } from 'react-bootstrap';
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
  const { user } = useContext(UserContext);
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

  const handlePayment = async () => {
    if (!user?.username) return;

    const response = await salesPurchase(
      Object.keys(items).map((key) => items[key]),
      user.username,
      user._id
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
    <ConfirmationModal
      show={show}
      toggle={toggle}
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
      onExited={onExited}
      size="sm"
    />
  );
};

export default memo(PaymentConfirmationModal);
