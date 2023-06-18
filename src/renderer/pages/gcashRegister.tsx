import {
  faBuildingColumns,
  faPaperPlane,
  faPenToSquare,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';
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
  const [totalChargeCash, setTotalChargeCash] = useState(0);
  const [totalChargeGcash, setTotalChargeGcash] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const { user } = useContext(UserContext);

  useEffect(() => {
    let tCashIn = 0;
    let tCashOut = 0;
    let tChargeCash = 0;
    let tChargeGcash = 0;
    let tAmount = 0;
    items.forEach((item) => {
      if (item.type === 'cash in') tCashIn += item.amount;
      else tCashOut += item.amount;

      tChargeCash += item.charge_payment === 'cash' ? item.charge : 0;
      tChargeGcash += item.charge_payment !== 'cash' ? item.charge : 0;
      tAmount += item.amount + item.charge;
    });
    setTotalCashIn(tCashIn);
    setTotalCashOut(tCashOut);
    setTotalChargeCash(tChargeCash);
    setTotalChargeGcash(tChargeGcash);
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
      type: _type,
    };
    setItems([itm, ...items]);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const transaction_id = uuid();
    const gcashTrans: GcashCreate[] = items.map((item) => ({
      ...item,
      transact_by: user.username,
      transact_by_user_id: user._id,
      transaction_id,
    }));

    const response = await createGcashTransactions(gcashTrans);
    if (response.isSuccess) {
      toast.success(response.message);
      setItems([]);
    } else {
      toast.error(response.message);
      window.console.log(response.error);
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
                  <Col xs="6" className="fs-5 text-primary">
                    Total Cash In:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end text-primary">
                      <strong>{pesoFormat(totalCashIn)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              {totalCashOut > 0 && (
                <Row>
                  <Col xs="6" className="fs-5 text-danger">
                    Total Cash Out:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end text-danger">
                      <strong>{pesoFormat(totalCashOut)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs="6" className="fs-5">
                  Total Charge in Cash:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalChargeCash)}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="6" className="fs-5">
                  Total Charge in GCash:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalChargeGcash)}</strong>
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
          style={{ width: 120 }}
          onClick={() => handleSetCashInCashOutModal('cash in')}
        >
          Cash In <FontAwesomeIcon icon={faBuildingColumns} />
        </Button>
        <Button
          variant="outline-primary"
          style={{ width: 120 }}
          onClick={() => handleSetCashInCashOutModal('cash out')}
        >
          Cash Out <FontAwesomeIcon icon={faPaperPlane} color="red" />
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
                  <td>
                    {pesoFormat(item.charge)}
                    {item.charge_payment === 'gcash' ? (
                      <span className="text-primary"> (GCash)</span>
                    ) : (
                      ' (Cash)'
                    )}
                  </td>
                  <td
                    className={`text-capitalize ${
                      item.type === 'cash in' ? 'text-primary' : 'text-danger'
                    }`}
                  >
                    {item.type}
                  </td>
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
