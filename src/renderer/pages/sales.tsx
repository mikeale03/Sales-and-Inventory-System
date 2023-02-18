import { Sales } from 'main/service/salesRealm';
import { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { getSalesByProducts } from 'renderer/service/sales';

const SalesPage = () => {
  const [sales, setSales] = useState<Sales[]>([]);

  const handlegetSales = async () => {
    const response = await getSalesByProducts();
    if (response.isSuccess && response.result) {
      console.log(response.result);
      setSales(response.result);
    }
  };

  useEffect(() => {
    handlegetSales();
  }, []);

  return (
    <div>
      <h3>Sales</h3>
      <Card className="d-flex">
        <Card.Body className="flex-grow-1">
          <Table responsive>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Transact By</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((d) => (
                <tr key={d._id}>
                  <td>{d.product_name}</td>
                  <td>{d.quantity}</td>
                  <td>{d.price}</td>
                  <td>{d.total_price}</td>
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
