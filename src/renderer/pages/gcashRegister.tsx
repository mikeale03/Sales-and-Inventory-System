import { useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import CashInOutModal from 'renderer/components/gcashRegister/cashInOutModal';
import { pesoFormat } from 'renderer/utils/helper';

type GCashItem = {
  key: number;
  number: number;
  amount: number;
  charge: number;
  type: 'cash in' | 'cash out';
};

let key = 0;

const GcashRegisterPage = () => {
  const [showCashInOutModal, setShowCashInOutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [type, setType] = useState<'cash in' | 'cash out'>('cash in');
  const [cashIn, setCashIn] = useState<GCashItem[]>([]);
  const [cashOut, setCashOut] = useState<GCashItem[]>([]);
  const [totalCashIn, setTotalCashIn] = useState(0);
  const [totalCashOut, setTotalCashOut] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const items = cashIn.concat(cashOut);

  const handleCashIn = () => {
    setShowCashInOutModal(true);
    setType('cash in');
  };

  const handleCashOut = () => {
    setShowCashInOutModal(true);
    setType('cash out');
  };

  const handleAddItem = (
    number: number,
    amount: number,
    _type: 'cash in' | 'cash out'
  ) => {
    key += 1;
    const itm = {
      key,
      number,
      amount,
      charge: Math.ceil(amount / 500) * 10,
      type: _type,
    };
    _type === 'cash in'
      ? setCashIn([itm, ...cashIn])
      : setCashOut([itm, ...cashOut]);
    _type === 'cash in'
      ? setTotalCashIn((value) => value + itm.amount)
      : setTotalCashOut((value) => value + itm.amount);

    setTotalCharge((value) => value + itm.charge);
    setTotalAmount((value) => value + itm.amount + itm.charge);
  };

  return (
    <div>
      <CashInOutModal
        show={showCashInOutModal}
        toggle={setShowCashInOutModal}
        type={type}
        onConfirm={handleAddItem}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        size="md"
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
        <Button className="me-2" style={{ width: 100 }} onClick={handleCashIn}>
          Cash In
        </Button>
        <Button style={{ width: 100 }} onClick={handleCashOut}>
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
                </tr>
              ))}
            </tbody>
          </Table>
          {items.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no transaction
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
