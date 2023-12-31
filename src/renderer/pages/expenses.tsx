import { format } from 'date-fns';
import {
  Expense,
  ExpenseDescriptionJson,
  GetExpensesFilter,
} from 'globalTypes/realm/expenses.type';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AddExpenseModal from 'renderer/components/expenses/addExpenseModal';
import ExpensesFilter from 'renderer/components/expenses/expensesFilter';
import ItemChargeDescription from 'renderer/components/expenses/itemChargeDesciption';
import { getExpenses } from 'renderer/service/expenses';
import { pesoFormat } from 'renderer/utils/helper';

function ExpensesPage() {
  const [filter, setFilter] = useState<GetExpensesFilter>({
    transactBy: '',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const onFilter = useCallback((filterValue: GetExpensesFilter) => {
    setFilter({ ...filterValue });
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr>
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
