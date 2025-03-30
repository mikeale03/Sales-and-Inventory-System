import { faMoneyBill, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  Expense,
  ExpenseDescriptionJson,
  GetExpensesFilter,
} from 'globalTypes/realm/expenses.type';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button, Card, FormCheck, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import AddExpenseModal from 'renderer/components/expenses/addExpenseModal';
import ExpensesFilter from 'renderer/components/expenses/expensesFilter';
import ItemChargeDescription from 'renderer/components/expenses/itemChargeDesciption';
import UserContext from 'renderer/context/userContext';
import {
  getExpenses,
  deleteExpense,
  updateExpense,
  updateExpenses,
} from 'renderer/service/expenses';
import { pesoFormat } from 'renderer/utils/helper';

type LocalExpense = Expense & { isChecked?: boolean };

function ExpensesPage() {
  const [filter, setFilter] = useState<GetExpensesFilter>({
    transactBy: '',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  const [expenses, setExpenses] = useState<LocalExpense[]>([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const { user } = useContext(UserContext);

  const onFilter = useCallback((filterValue: GetExpensesFilter) => {
    setFilter({ ...filterValue });
  }, []);

  const handleGetExpenses = useCallback(async () => {
    let amount = 0;
    const response = await getExpenses(filter);
    setIsCheckAll(false);

    if (response.isSuccess && response.result) {
      response.result.forEach((exp) => {
        amount += exp.amount;
      });
      setExpenses(response.result);
      setTotalAmount(amount);
    } else {
      toast.error(response.message);
    }
  }, [filter]);

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;
    const response = await deleteExpense(selectedExpense._id);
    if (response.isSuccess) {
      setExpenses(expenses.filter((item) => item._id !== selectedExpense._id));
      setTotalAmount(+(totalAmount - selectedExpense.amount).toFixed(2));
    } else toast.error(response.message);
  };

  const handleShowConfirmationModal = (exp: Expense) => {
    setSelectedExpense(exp);
    setShowConfirmationModal(true);
  };

  const handleMarkPaidUnpaid = async (exp: Expense) => {
    const response = await updateExpense({
      _id: exp._id,
      status: exp.status === 'paid' ? 'unpaid' : 'paid',
    });
    if (response.isSuccess) {
      const newExpense = expenses.map((item) =>
        item._id === response.result?._id ? response.result : item
      );
      setExpenses(newExpense);
    } else {
      toast.error(response.message);
    }
  };

  const handleMarkPaidUnpaidMany = async (status: 'paid' | 'unpaid') => {
    const response = await updateExpenses(
      expenses.filter((v) => v.isChecked).map((v) => ({ ...v, status }))
    );
    if (response.isSuccess) {
      handleGetExpenses();
    } else {
      toast.error(response.message);
    }
  };

  const handleToggleCheck = async (exp: Expense & { isChecked?: boolean }) => {
    setExpenses(
      expenses.map((item) =>
        item._id === exp._id ? { ...item, isChecked: !exp.isChecked } : item
      )
    );
  };

  const handleToggleCheckAll = async (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setExpenses(expenses.map((item) => ({ ...item, isChecked: checked })));
    setIsCheckAll(!isCheckAll);
  };

  useEffect(() => {
    handleGetExpenses();
  }, [handleGetExpenses]);

  return (
    <div>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={<p className="text-center">Are you sure to delete expense</p>}
        onConfirm={handleDeleteExpense}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        toggle={setShowAddExpenseModal}
        onSuccess={(newExpense) => setExpenses([...expenses, newExpense])}
      />
      <h3>Expenses</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => setShowAddExpenseModal(true)}
      >
        Add Expense
      </Button>
      <ExpensesFilter onFilter={onFilter} />
      <Card>
        <Card.Body>
          <p className="m-0 mb-2">Total Amount: {pesoFormat(totalAmount)}</p>
          <div className="d-flex align-items-center">
            <FormCheck
              className="me-3"
              checked={isCheckAll}
              onChange={handleToggleCheckAll}
            />
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => handleMarkPaidUnpaidMany('paid')}
            >
              Mark Selected as Paid
            </Button>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => handleMarkPaidUnpaidMany('unpaid')}
            >
              Mark Selected as Unpaid
            </Button>
          </div>
          <hr />
          <Table responsive hover>
            <thead>
              <tr>
                <th> </th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Transact By</th>
                <th>Status</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>
                    <FormCheck
                      checked={exp.isChecked ?? false}
                      onChange={() => handleToggleCheck(exp)}
                    />
                  </td>
                  <td>{exp.type}</td>
                  <td>{pesoFormat(exp.amount)}</td>
                  <td>
                    {exp.type === 'item charge' ? (
                      <ItemChargeDescription
                        description={
                          JSON.parse(
                            exp.description || ''
                          ) as ExpenseDescriptionJson
                        }
                      />
                    ) : (
                      exp.description
                    )}
                  </td>
                  <td>
                    {format(new Date(exp.date_created), 'MM/dd/yyyy hh:mm aaa')}
                  </td>
                  <td>{exp.transact_by}</td>
                  <td>{exp.status || 'unpaid'}</td>
                  <td>
                    {user?.role === 'admin' && (
                      <FontAwesomeIcon
                        onClick={() => handleMarkPaidUnpaid(exp)}
                        icon={faMoneyBill}
                        title={`Mark as ${
                          exp.status === 'paid' ? 'Unpaid' : 'Paid'
                        }`}
                        size="xl"
                        className={`me-2 ${
                          exp.status !== 'paid'
                            ? 'cursor-pointer'
                            : 'text-secondary'
                        }`}
                        role="button"
                        tabIndex={0}
                      />
                    )}
                    <FontAwesomeIcon
                      onClick={() => handleShowConfirmationModal(exp)}
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ExpensesPage;
