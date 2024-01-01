import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  Expense,
  ExpenseDescriptionJson,
  GetExpensesFilter,
} from 'globalTypes/realm/expenses.type';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import AddExpenseModal from 'renderer/components/expenses/addExpenseModal';
import ExpensesFilter from 'renderer/components/expenses/expensesFilter';
import ItemChargeDescription from 'renderer/components/expenses/itemChargeDesciption';
import { getExpenses, deleteExpense } from 'renderer/service/expenses';
import { pesoFormat } from 'renderer/utils/helper';

function ExpensesPage() {
  const [filter, setFilter] = useState<GetExpensesFilter>({
    transactBy: '',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [totalAmount, setTotalAmount] = useState(0);

  const onFilter = useCallback((filterValue: GetExpensesFilter) => {
    setFilter({ ...filterValue });
  }, []);

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

  useEffect(() => {
    let amount = 0;
    (async () => {
      const response = await getExpenses(filter);
      if (response.isSuccess && response.result) {
        response.result.forEach((exp) => {
          amount += exp.amount;
        });
        setExpenses(response.result);
        setTotalAmount(amount);
      } else {
        toast.error(response.message);
      }
    })();
  }, [filter]);

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
          <p className="m-0">Total Amount: {pesoFormat(totalAmount)}</p>
          <hr />
          <Table responsive hover>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Transact By</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
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
                  <td>
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
