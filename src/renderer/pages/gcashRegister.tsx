import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GcashCreate } from 'globalTypes/realm/gcash.types';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import SetCashInOutModal, {
  GCashItem,
} from 'renderer/components/gcashRegister/setCashInOutModal';
import UserContext from 'renderer/context/userContext';
import { createGcashTransactions } from 'renderer/service/gcash';
import { pesoFormat } from 'renderer/utils/helper';

let key = 0;

const GcashRegisterPage = () => {
  const [showCashInOutModal, setShowCashInOutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [type, setType] = useState<'cash in' | 'cash out'>('cash in');
  const [items, setItems] = useState<GCashItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GCashItem | undefined>();
  const [totalCashIn, setTotalCashIn] = useState(0);
  const [totalCashOut, setTotalCashOut] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const { user } = useContext(UserContext);

  useEffect(() => {
    let tCashIn = 0;
    let tCashOut = 0;
    let tCharge = 0;
    let tAmount = 0;
    items.forEach((item) => {
      if (item.type === 'cash in') tCashIn += item.amount;
      else tCashOut += item.amount;

      tCharge += item.charge;
      tAmount += item.amount + item.charge;
    });
    setTotalCashIn(tCashIn);
    setTotalCashOut(tCashOut);
    setTotalCharge(tCharge);
    setTotalAmount(tAmount);
  }, [items]);

  const handleSetCashInCashOutModal = (
    _type: 'cash in' | 'cash out',
    item?: GCashItem
  ) => {
    setSelectedItem(item);
    setType(_type);
    setShowCashInOutModal(true);
  };

  const handleSetItem = (_type: 'cash in' | 'cash out', item: GCashItem) => {
    if (item.key) {
      setItems(
        items.map((itm) =>
          itm.key === item.key
            ? {
                ...itm,
                ...item,
                charge: Math.ceil(item.amount / 500) * 10,
              }
            : itm
        )
      );
      return;
    }

    key += 1;
    const itm = {
      ...item,
      key,
      charge: Math.ceil(item.amount / 500) * 10,
      type: _type,
    };
    setItems([itm, ...items]);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const gcashTrans: GcashCreate[] = items.map((item) => ({
      ...item,
      transact_by: user.username,
      transact_by_user_id: user._id,
    }));

    const response = await createGcashTransactions(gcashTrans);
    if (response.isSuccess) {
      toast.success(response.message);
      setItems([]);
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteItem = (item: GCashItem) => {
    setItems(items.filter((itm) => item.key !== itm.key));
  };

  return (
    <div>
      <SetCashInOutModal
        show={showCashInOutModal}
        toggle={setShowCashInOutModal}
        type={type}
        selectedItem={selectedItem}
        onConfirm={handleSetItem}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        size="md"
        onConfirm={handleSubmit}
        message={
          <Row className="mb-2">
            <Col>
              {totalCashIn > 0 && (
                <Row>
                  <Col xs="6" className="fs-5">
                    Total Cash In:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end">
                      <strong>{pesoFormat(totalCashIn)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              {totalCashOut > 0 && (
                <Row>
                  <Col xs="6" className="fs-5">
                    Total Cash Out:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end">
                      <strong>{pesoFormat(totalCashOut)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs="6" className="fs-5">
                  Total Charge:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalCharge)}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="6" className="fs-5">
                  Total Amount:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalAmount)}</strong>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      />

      <h3>GCash Register</h3>
      <div className="my-3">
        <Button
          className="me-2"
          style={{ width: 100 }}
          onClick={() => handleSetCashInCashOutModal('cash in')}
        >
          Cash In
        </Button>
        <Button
          style={{ width: 100 }}
          onClick={() => handleSetCashInCashOutModal('cash out')}
        >
          Cash Out
        </Button>
      </div>

      <Card>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Type</th>
                <th>Total</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.key}`}>
                  <td>{item.number}</td>
                  <td>{pesoFormat(item.amount)}</td>
                  <td>{pesoFormat(item.charge)}</td>
                  <td className="text-capitalize">{item.type}</td>
                  <td>{pesoFormat(item.amount + item.charge)}</td>

                  <td className="align-middle text-center">
                    <FontAwesomeIcon
                      onClick={() =>
                        handleSetCashInCashOutModal(item.type, item)
                      }
                      icon={faPenToSquare}
                      title="Edit"
                      className="me-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      title="remove"
                      icon={faXmark}
                      className="btn"
                      onClick={() => handleDeleteItem(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {items.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no transactions
            </span>
          )}
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-3">
        <Button
          style={{ width: 100 }}
          onClick={() => setShowConfirmationModal(true)}
          disabled={items.length === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default GcashRegisterPage;
