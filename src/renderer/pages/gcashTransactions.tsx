import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import format from 'date-fns/format';
import {
  Gcash,
  GcashTransFilter as TransFilter,
} from 'globalTypes/realm/gcash.types';
import { useContext, useEffect, useRef, useState } from 'react';
import { Card, Col, FormCheck, FormControl, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import GcashTransFilter from 'renderer/components/gcashTransactions/gcashTransFilter';
import UserContext from 'renderer/context/userContext';
import { createGcashTransDeleteActivity } from 'renderer/service/activities';
import {
  deleteGcashTransaction,
  getGcashTransactions,
} from 'renderer/service/gcash';
import { updateByGcashDelete } from 'renderer/service/sales';
import useGcashFilterStore from 'renderer/store/filtersStore/gcashFilterStore';
import { debounce, pesoFormat } from 'renderer/utils/helper';

const isEdited = (item: Gcash) => {
  if (item.type === 'gcash pay') return false;
  return item.charge !== Math.ceil(item.amount / 500) * 10;
};

const GcashTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Gcash[]>([]);
  const [search, setSearch] = useState('');
  const [totalCashIn, setTotalCashIn] = useState(0);
  const [totalCashOut, setTotalCashOut] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const [endingBalance, setEndingBalance] = useState(0);
  const [selectedTrans, setSelectedTrans] = useState<Gcash | undefined>();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const reasonInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useContext(UserContext);
  const gcashTransFilter = useGcashFilterStore(
    (filterState) => filterState.state
  );

  const handleGetGcashTransactions = async (filter?: TransFilter) => {
    const response = await getGcashTransactions(filter);
    if (response.isSuccess && response.result) {
      setTransactions(response.result);
    } else toast.error(response.message);
  };

  useEffect(() => {
    let cashIn = 0;
    let cashOut = 0;
    // let gcashPay = 0;
    let charge = 0;
    transactions.forEach((item) => {
      cashIn += item.type === 'cash in' ? item.amount : 0;
      cashOut += item.type === 'cash out' ? item.amount : 0;
      // gcashPay += item.type === 'gcash pay' ? item.amount : 0;
      charge += item.charge;
    });
    setTotalCashIn(cashIn);
    setTotalCashOut(cashOut);
    // setTotalGcashPay(gcashPay);
    setTotalCharge(charge);
    setEndingBalance(cashIn - cashOut);
  }, [transactions]);

  useEffect(() => {
    const { userOption, selectedType, selectedDateFilter, startDate, endDate } =
      gcashTransFilter;
    userOption &&
      handleGetGcashTransactions({
        transactBy: userOption === 'all' ? undefined : userOption,
        type: selectedType,
        number: search,
        dateFilter: selectedDateFilter,
        startDate,
        endDate,
      });
  }, [gcashTransFilter, search]);

  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 300);

  const handleShowConfirmationModal = (trans: Gcash) => {
    setSelectedTrans(trans);
    setConfirmationModal(true);
    setDeleteReason('');
  };

  const handleDeleteTrans = async () => {
    const { userOption, selectedType, selectedDateFilter, startDate, endDate } =
      gcashTransFilter;
    if (!selectedTrans || !user) return;
    if (!deleteReason) {
      toast.error('Reason is required');
      setConfirmationModal(true);
      reasonInputRef.current?.focus();
      return;
    }

    const [response1, response2] = await Promise.all([
      deleteGcashTransaction(selectedTrans._id),
      updateByGcashDelete(selectedTrans),
      createGcashTransDeleteActivity({
        gcash: selectedTrans,
        reason: deleteReason,
        transact_by: user.username,
        transact_by_user_id: user._id,
      }),
    ]);
    if (!response1?.isSuccess) {
      toast.error(response1.message);
      return;
    }
    window.console.log(response2);
    await handleGetGcashTransactions({
      transactBy: userOption === 'all' ? undefined : userOption,
      type: selectedType,
      number: search,
      dateFilter: selectedDateFilter,
      startDate,
      endDate,
    });
  };

  const isPossibleDoubleEntry = (index: number) => {
    if (index === 0) return false;
    const prevTransaction = transactions[index - 1];
    const transaction = transactions[index];

    if (
      prevTransaction.amount === transaction.amount &&
      prevTransaction.number === transaction.number &&
      prevTransaction.type === transaction.type
    ) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <ConfirmationModal
        show={confirmationModal}
        toggle={setConfirmationModal}
        message={
          <>
            <p className="text-center">
              Are you sure to delete GCash Transaction? Enter your reason.
            </p>
            <FormControl
              ref={reasonInputRef}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
          </>
        }
        onConfirm={handleDeleteTrans}
      />

      <h3>GCash Transactions</h3>
      <GcashTransFilter />
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col lg="6">
              <FormControl
                type="search"
                placeholder="Search number or amount"
                onChange={handleSearch}
              />
            </Col>
          </Row>
          <div className="d-xl-flex justify-content-between">
            {gcashTransFilter.selectedType !== 'cash out' && (
              <p className="m-0">Total Cash In: {pesoFormat(totalCashIn)}</p>
            )}
            {gcashTransFilter.selectedType !== 'cash in' && (
              <p className="m-0">Total Cash Out: {pesoFormat(totalCashOut)}</p>
            )}
            {/* <p className="m-0">Total GCash Pay: {pesoFormat(totalGcashPay)}</p> */}
            <p className="m-0">Total Charge: {pesoFormat(totalCharge)}</p>
            {!gcashTransFilter.selectedType && (
              <p className="m-0">Ending Balance: {pesoFormat(endingBalance)}</p>
            )}
            <p className="m-0">
              Quantity: {transactions.length.toLocaleString()}
            </p>
          </div>
          <hr />
          <Table responsive hover>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Number</th>
                <th>Date Transacted</th>
                <th>GCash Balance</th>
                <th>Transact By</th>
                <th>Date Created</th>
                <th>Note</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item, index) => (
                <tr
                  key={`${item._id}`}
                  title={
                    isPossibleDoubleEntry(index) ? 'possible double entry' : ''
                  }
                  className={isPossibleDoubleEntry(index) ? 'text-danger' : ''}
                >
                  <td
                    className={`text-capitalize ${
                      item.type === 'cash in' && 'text-primary'
                    } ${item.type === 'cash out' && 'text-danger'}
                    `}
                  >
                    {item.type}
                  </td>
                  <td>{pesoFormat(item.amount)}</td>
                  <td className={isEdited(item) ? 'text-danger' : ''}>
                    {pesoFormat(item.charge)}
                    {item.charge_payment === 'gcash' && (
                      <span className="text-primary">(GCash)</span>
                    )}
                  </td>
                  <td>{item.number}</td>
                  <td>
                    {item.date_transacted &&
                      format(
                        new Date(item.date_transacted),
                        'MM/dd/yyyy hh:mm aaa'
                      )}
                  </td>
                  <td>{pesoFormat(item.gcash_balance)}</td>
                  <td>{item.transact_by}</td>
                  <td>
                    {format(
                      new Date(item.date_created),
                      'MM/dd/yyyy hh:mm aaa'
                    )}
                  </td>
                  <td>{item.note}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <FormCheck className="me-2" type="checkbox" />
                      {item.type !== 'mobile load' && (
                        <FontAwesomeIcon
                          onClick={() => handleShowConfirmationModal(item)}
                          icon={faTrashCan}
                          title="Delete"
                          size="xl"
                          className="me-2 cursor-pointer"
                          role="button"
                          tabIndex={0}
                        />
                      )}
                    </div>
                  </td>
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
