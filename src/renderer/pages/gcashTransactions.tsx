import format from 'date-fns/format';
import {
  Gcash,
  GcashTransFilter as TransFilter,
} from 'globalTypes/realm/gcash.types';
import { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import GcashTransFilter from 'renderer/components/gcashTransactions/gcashTransFilter';
import { getGcashTransactions } from 'renderer/service/gcash';
import { pesoFormat } from 'renderer/utils/helper';

const GcashTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Gcash[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [userOption, setUserOption] = useState<string>('');

  const handleGetGcashTransactions = async (filter?: TransFilter) => {
    const response = await getGcashTransactions(filter);
    window.console.log(response);
    if (response.isSuccess && response.result) setTransactions(response.result);
    else toast.error(response.message);
  };

  useEffect(() => {
    handleGetGcashTransactions({
      transactBy: userOption,
      startDate,
      endDate,
    });
  }, [userOption, startDate, endDate]);

  const onFilterChange = (filter: {
    userOption: string;
    startDate: Date;
    endDate: Date;
  }) => {
    setStartDate(filter.startDate);
    setEndDate(filter.endDate);
    setUserOption(filter.userOption);
  };

  return (
    <div>
      <h3>GCash Transactions</h3>
      <GcashTransFilter onChange={onFilterChange} />
      <Card>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Number</th>
                <th>Date</th>
                <th>Transact By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={`${item._id}`}>
                  <td className="text-capitalize">{item.type}</td>
                  <td>{pesoFormat(item.amount)}</td>
                  <td>{pesoFormat(item.charge)}</td>
                  <td>{item.number}</td>
                  <td>{format(item.date_created, 'MM/dd/yyyy hh:mm aaa')}</td>
                  <td>{item.transact_by}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GcashTransactionsPage;
