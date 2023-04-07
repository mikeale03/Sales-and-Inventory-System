import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import format from 'date-fns/format';
import {
  Gcash,
  GcashTransFilter as TransFilter,
} from 'globalTypes/realm/gcash.types';
import { useContext, useEffect, useState } from 'react';
import { Card, Col, FormControl, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import GcashTransFilter from 'renderer/components/gcashTransactions/gcashTransFilter';
import UserContext from 'renderer/context/userContext';
import {
  deleteGcashTransaction,
  getGcashTransactions,
} from 'renderer/service/gcash';
import { debounce, pesoFormat } from 'renderer/utils/helper';

const isEdited = (item: Gcash) => {
  if (item.type === 'gcash pay') return false;
  return item.charge !== Math.ceil(item.amount / 500) * 10;
};

const GcashTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Gcash[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [userOption, setUserOption] = useState<string>('');
  const [search, setSearch] = useState('');
  const [totalCashIn, setTotalCashIn] = useState(0);
  const [totalCashOut, setTotalCashOut] = useState(0);
  const [totalGcashPay, setTotalGcashPay] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [endingBalance, setEndingBalance] = useState(0);
  const [selectedTrans, setSelectedTrans] = useState<Gcash | undefined>();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { user } = useContext(UserContext);

  const handleGetGcashTransactions = async (filter?: TransFilter) => {
    const response = await getGcashTransactions(filter);
    if (response.isSuccess && response.result) {
      setTransactions(response.result);
    } else toast.error(response.message);
  };

  useEffect(() => {
    let cashIn = 0;
    let cashOut = 0;
    let gcashPay = 0;
    let charge = 0;
    transactions.forEach((item) => {
      cashIn += item.type === 'cash in' ? item.amount : 0;
      cashOut += item.type === 'cash out' ? item.amount : 0;
      gcashPay += item.type === 'gcash pay' ? item.amount : 0;
      charge += item.charge;
    });
    setTotalCashIn(cashIn);
    setTotalCashOut(cashOut);
    setTotalGcashPay(gcashPay);
    setTotalCharge(charge);
    setEndingBalance(cashIn - cashOut);
  }, [transactions]);

  useEffect(() => {
    userOption &&
      handleGetGcashTransactions({
        transactBy: userOption === 'all' ? undefined : userOption,
        number: search,
        startDate,
        endDate,
      });
  }, [userOption, startDate, endDate, search]);

  const onFilterChange = (filter: {
    userOption: string;
    startDate: Date;
    endDate: Date;
  }) => {
    setStartDate(filter.startDate);
    setEndDate(filter.endDate);
    setUserOption(filter.userOption);
  };

  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 300);

  const handleShowConfirmationModal = (trans: Gcash) => {
    setSelectedTrans(trans);
    setConfirmationModal(true);
  };

  const handleDeleteTrans = async () => {
    if (!selectedTrans) return;
    const response = await deleteGcashTransaction(selectedTrans._id);
    if (!response?.isSuccess) {
      toast.error(response.message);
      return;
    }
    setTransactions(
      transactions.filter((item) => item._id !== selectedTrans._id)
    );
  };

  return (
    <div>
      <ConfirmationModal
        show={confirmationModal}
        toggle={setConfirmationModal}
        message={
          <p className="text-center">
            Are you sure to delete GCash Transaction?
          </p>
        }
        onConfirm={handleDeleteTrans}
      />

      <h3>GCash Transactions</h3>
      <GcashTransFilter onChange={onFilterChange} />
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col lg="6">
              <FormControl
                type="search"
                placeholder="Search number"
                onChange={handleSearch}
              />
            </Col>
          </Row>
          <div className="d-xl-flex justify-content-between">
            <p className="m-0">Total Cash In: {pesoFormat(totalCashIn)}</p>
            <p className="m-0">Total Cash Out: {pesoFormat(totalCashOut)}</p>
            <p className="m-0">Total GCash Pay: {pesoFormat(totalGcashPay)}</p>
            <p className="m-0">Total Charge: {pesoFormat(totalCharge)}</p>
            <p className="m-0">Ending Balance: {pesoFormat(endingBalance)}</p>
            <p className="m-0">
              Quantity: {transactions.length.toLocaleString()}
            </p>
          </div>
          <hr />
          <Table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Number</th>
                <th>Date</th>
                <th>Transact By</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={`${item._id}`}>
                  <td className="text-capitalize">{item.type}</td>
                  <td>{pesoFormat(item.amount)}</td>
                  <td className={isEdited(item) ? 'text-danger' : ''}>
                    {pesoFormat(item.charge)}
                  </td>
                  <td>{item.number}</td>
                  <td>{format(item.date_created, 'MM/dd/yyyy hh:mm aaa')}</td>
                  <td>{item.transact_by}</td>
                  {user?.role === 'admin' && (
                    <td>
                      <FontAwesomeIcon
                        onClick={() => handleShowConfirmationModal(item)}
                        icon={faTrashCan}
                        title="Delete"
                        size="xl"
                        className="me-2 cursor-pointer"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          {transactions.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no transactions
            </span>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default GcashTransactionsPage;
