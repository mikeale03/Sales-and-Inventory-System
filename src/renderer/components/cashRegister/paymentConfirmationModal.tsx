/* eslint-disable no-restricted-syntax */
import {
  useContext,
  useEffect,
  useState,
  memo,
  useRef,
  ReactNode,
} from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import UserContext from 'renderer/context/userContext';
// import { createGcashTransactions } from 'renderer/service/gcash';
import { salesPurchase } from 'renderer/service/sales';
import { pesoFormat } from 'renderer/utils/helper';
import { User } from 'globalTypes/realm/user.types';
import { createExpense } from 'renderer/service/expenses';
import ChargeToUserModal from 'renderer/components/cashRegister/chargeToUserModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { ExpenseDescriptionJson } from 'globalTypes/realm/expenses.type';
import { Items } from 'globalTypes/realm/sales.types';
import { createCashRegisterCancelActivity } from 'renderer/service/activities';
import CancelCodeModal from './cancelCodeModal';

type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  items: Items;
  paymentAmount: number;
  onCancel: () => void;
  onSuccess: () => void;
  onExited: () => void;
  onError?: () => void;
};

const PaymentConfirmationModal = ({
  show,
  toggle,
  items,
  onCancel,
  paymentAmount,
  onSuccess,
  onExited,
  onError,
}: Props) => {
  const [lines, setLines] = useState(1);
  const [total, setTotal] = useState(0);
  const [showGcashConfirmation, setShowGcashConfirmation] = useState(false);
  const [showChargeToModal, setShowChargeToModal] = useState(false);
  const [cancelCodeModal, setCancelCodeModal] = useState(false);
  const [isChargeToUser, setIsChargeToUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const { user } = useContext(UserContext);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const change = paymentAmount - total;

  const [message, setMessage] = useState<ReactNode>(
    <p className="text-center">
      Are you sure to pay with{' '}
      <span className="text-primary fw-bold">GCash</span> amounting{' '}
      <span className="text-primary fw-bold">{pesoFormat(total)}</span>
    </p>
  );

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

    // if (isGcash) {
    //   const gcashPromise = createGcashTransactions([
    //     {
    //       type: 'gcash pay',
    //       amount: total,
    //       charge: 0,
    //       charge_payment: 'cash',
    //       transact_by: user.username,
    //       transact_by_user_id: user._id,
    //       transaction_id,
    //       is_product_gcash_pay: true,
    //     },
    //   ]);
    //   promises.push(gcashPromise);
    // }

    const responses = await Promise.all(promises);

    for (const res of responses) {
      if (!res.isSuccess) {
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

  const handleChargeToUser = async () => {
    if (!selectedUser || !user) return;
    const description: ExpenseDescriptionJson = {
      chargeToId: selectedUser?._id,
      chargeToUser: selectedUser?.username,
      items: Object.values(items).map((i) => ({
        productId: i._id,
        productName: i.name,
        quantity: i.quantity,
        amount: i.totalPrice,
      })),
    };
    const response = await createExpense({
      type: 'item charge',
      amount: total,
      description: JSON.stringify(description),
      charge_to_user_id: selectedUser._id,
      transact_by: user.username,
      transact_by_user_id: user._id,
    });

    if (response.isSuccess) {
      toast.success(response.message);
      onSuccess();
      toggle(false);
    } else {
      toast.error(response.message);
    }
  };

  const handleShowGcashPaymentConfirmation = () => {
    setShowGcashConfirmation(true);
    setMessage(
      <p className="text-center">
        Are you sure to pay with{' '}
        <span className="text-primary fw-bold">GCash</span> amounting{' '}
        <span className="text-primary fw-bold">{pesoFormat(total)}</span>
      </p>
    );
    toggle(false);
  };

  const handleShowChargeToUserConfirmation = (chargedUser: User) => {
    setShowGcashConfirmation(true);
    setMessage(
      <p className="text-center">
        Are you sure to charge the item/s to{' '}
        <span className="text-primary fw-bold">{chargedUser.username}</span>{' '}
        amounting{' '}
        <span className="text-primary fw-bold">{pesoFormat(total)}</span>
      </p>
    );
    setShowChargeToModal(false);
    setSelectedUser(chargedUser);
    setIsChargeToUser(true);
  };

  const handleConfirm = () => {
    isChargeToUser ? handleChargeToUser() : handlePayment(true);
    setIsChargeToUser(false);
  };

  const handleCancelCodeConfirm = () => {
    onCancel();
    toggle(false);
  };

  const handleCancel = () => {
    setCancelCodeModal(true);
    toggle(false);
  };

  const onHide = () => {
    if (!user) return;
    createCashRegisterCancelActivity({
      items,
      transact_by: user.username,
      transact_by_user_id: user._id,
    });
    toggle(false);
  };

  return (
    <>
      <CancelCodeModal
        show={cancelCodeModal}
        toggle={setCancelCodeModal}
        onConfirm={handleCancelCodeConfirm}
        onCancel={() => toggle(true)}
      />
      <ChargeToUserModal
        show={showChargeToModal}
        toggle={setShowChargeToModal}
        onConfirm={handleShowChargeToUserConfirmation}
        onCancel={() => toggle(true)}
      />
      <ConfirmationModal
        show={showGcashConfirmation}
        toggle={setShowGcashConfirmation}
        onConfirm={handleConfirm}
        onCancel={() => toggle(true)}
        message={message}
      />
      <Modal
        show={show}
        onHide={onHide}
        onShow={() => cancelRef.current?.focus()}
        onExited={onExited}
        backdrop="static"
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
              <p className="m-0 mb-1 fs-3 text-end">
                <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
              </p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button
              variant="outline-primary me-2"
              size="sm"
              onClick={handleShowGcashPaymentConfirmation}
            >
              GCash Payment
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setShowChargeToModal(true);
                toggle(false);
              }}
            >
              Charge to User
            </Button>
          </div>

          <div>
            <Button variant="secondary" onClick={onHide} className="me-2">
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
