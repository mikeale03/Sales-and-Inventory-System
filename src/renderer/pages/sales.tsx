import { Sales } from 'main/service/salesRealm';
import { ChangeEvent, useEffect, useState, useContext } from 'react';
import { Card, Table, FormSelect, Col, Row, FormLabel } from 'react-bootstrap';
import { getSalesByTransactions } from 'renderer/service/sales';
import { pesoFormat } from 'renderer/utils/helper';
import format from 'date-fns/format';
import UserContext from 'renderer/context/userContext';
import { User } from 'main/service/usersRealm';
import { getUsers } from 'renderer/service/users';

const SalesPage = () => {
  const [sales, setSales] = useState<Sales[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 999))
  );
  const [users, setUsers] = useState<User[]>([]);
  const [userOption, setUserOption] = useState<string>('');
  const { user } = useContext(UserContext);

  const handlegetSales = async (filter?: {
    transactByUserId?: string;
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
    handlegetSales({
      transactByUserId: userOption || undefined,
      startDate,
      endDate,
    });
  }, [userOption, startDate, endDate]);

  useEffect(() => {
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) {
        setUsers(response.result);
      }
    })();
  }, []);

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
      <Row>
        <Col md="2" className="mb-3">
          <FormLabel>Period</FormLabel>
          <FormSelect onChange={handlePeriodSelect}>
            <option>Daily</option>
            <option>Monthly</option>
          </FormSelect>
        </Col>
        <Col md="2" className="mb-3">
          <FormLabel>User</FormLabel>
          <FormSelect onChange={(e) => setUserOption(e.target.value)}>
            <option value="">All</option>
            {users.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.username}
              </option>
            ))}
          </FormSelect>
        </Col>
      </Row>

      <Card className="d-flex">
        <Card.Body className="flex-grow-1">
          <Row>
            <Col lg="6">
              <span>Total Amount: P 100,000.00</span>
            </Col>
            <Col lg="6">
              <span>Quantity: {sales.length.toLocaleString()}</span>
            </Col>
          </Row>
          <hr />
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
