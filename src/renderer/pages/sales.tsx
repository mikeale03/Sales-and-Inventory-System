import { Sales } from 'main/service/salesRealm';
import { ChangeEvent, useEffect, useState, useContext } from 'react';
import { Card, Table, FormSelect, Col } from 'react-bootstrap';
import { getSalesByTransactions } from 'renderer/service/sales';
import { pesoFormat } from 'renderer/utils/helper';
import format from 'date-fns/format';
import UserContext from 'renderer/context/userContext';

const SalesPage = () => {
  const [sales, setSales] = useState<Sales[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 999))
  );
  const { user } = useContext(UserContext);

  const handlegetSales = async (filter?: {
    transactBy?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const response = await getSalesByTransactions(filter);
    if (response.isSuccess && response.result) {
      setSales(response.result);
    }
    console.log(response);
  };

  useEffect(() => {
    handlegetSales({ transactBy: user?._id, startDate, endDate });
  }, [user, startDate, endDate]);

  const handlePeriodSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let sDate: Date;
    let eDate: Date;
    if (value === 'Daily') {
      sDate = new Date(new Date().setHours(0, 0, 0, 0));
      eDate = new Date(new Date().setHours(23, 59, 59, 999));
    } else {
      const today = new Date();
      sDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      eDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }
    setStartDate(sDate);
    setEndDate(eDate);
  };

  return (
    <div>
      <h3>Sales</h3>

      <Col md="2" className="mb-3">
        <FormSelect onChange={handlePeriodSelect}>
          <option>Daily</option>
          <option>Monthly</option>
        </FormSelect>
      </Col>
      <Card className="d-flex">
        <Card.Body className="flex-grow-1">
          <Table responsive>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Transact By</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((d) => (
                <tr key={d._id}>
                  <td>{d.product_name}</td>
                  <td>{d.quantity.toLocaleString()}</td>
                  <td>{pesoFormat(d.price)}</td>
                  <td>{pesoFormat(d.total_price)}</td>
                  <td>{format(d.date_created, 'MM/dd/yyyy hh:mm aaa')}</td>
                  <td>{d.transact_by}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* {products.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no products
            </span>
          )} */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesPage;
