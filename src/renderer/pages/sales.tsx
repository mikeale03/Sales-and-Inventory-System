import { Sales } from 'main/service/salesRealm';
import { useEffect, useState, useRef, useContext, useCallback } from 'react';
import {
  Card,
  Table,
  Col,
  Row,
  DropdownButton,
  Dropdown,
  FormControl,
} from 'react-bootstrap';
import { deleteSale, getSalesByTransactions } from 'renderer/service/sales';
import { debounce, pesoFormat } from 'renderer/utils/helper';
import format from 'date-fns/format';
import UserContext from 'renderer/context/userContext';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { toast } from 'react-toastify';
import SalesFilter from 'renderer/components/sales/salesFilters';

const SalesPage = () => {
  const [sales, setSales] = useState<Sales[]>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59, 999))
  );
  const [userOption, setUserOption] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalGcash, setTotalGcash] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sales | undefined>();
  const { user } = useContext(UserContext);
  const printRef = useRef<HTMLDivElement | null>(null);

  const handleGetSales = async (filter?: {
    transactByUserId?: string;
    startDate?: Date;
    endDate?: Date;
    productName: string;
  }) => {
    let qty = 0;
    let amount = 0;
    let gcash = 0;
    let cash = 0;
    const response = await getSalesByTransactions(filter);
    if (response.isSuccess && response.result) {
      setSales(
        response.result.map((sale) => {
          qty += sale.quantity;
          amount += sale.total_price;
          gcash += sale.payment === 'gcash' ? sale.total_price : 0;
          cash += sale.payment === 'cash' ? sale.price : 0;
          return sale;
        })
      );
      setTotalAmount(amount);
      setTotalQuantity(qty);
      setTotalGcash(gcash);
      setTotalCash(cash);
    }
  };

  useEffect(() => {
    handleGetSales({
      transactByUserId: userOption || undefined,
      startDate,
      endDate,
      productName: searchText,
    });
  }, [userOption, startDate, endDate, searchText]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDeleteSale = async () => {
    if (!selectedSale) return;
    const response = await deleteSale(selectedSale._id);
    if (response.isSuccess) {
      setSales(sales.filter((item) => item._id !== selectedSale._id));
    } else toast.error(response.message);
  };

  const handleShowConfirmationModal = (sale: Sales) => {
    setSelectedSale(sale);
    setShowConfirmationModal(true);
  };

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
    setSearchText(e.target.value);
  }, 300);

  return (
    <div>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={<p className="text-center">Are you sure to delete sale</p>}
        onConfirm={handleDeleteSale}
      />

      <h3>Sales</h3>

      <SalesFilter onChange={useCallback(onFilterChange, [])} />

      <div ref={printRef}>
        <Card className="d-flex">
          <Card.Body className="flex-grow-1">
            <Row className="mb-3 print-hide">
              <Col lg="6" className="d-flex flex-row">
                <DropdownButton
                  id="dropdown-basic-button"
                  title="Export"
                  variant="outline-primary"
                  className="me-3"
                >
                  {/* <Dropdown.Item>CSV</Dropdown.Item>
                  <Dropdown.Item>Excel</Dropdown.Item> */}
                  <Dropdown.Item onClick={handlePrint}>Print</Dropdown.Item>
                </DropdownButton>
                <FormControl
                  type="search"
                  placeholder="Search product name"
                  onChange={handleSearch}
                />
              </Col>
            </Row>
            <div className="d-lg-flex justify-content-between">
              <p className="m-0">Total Cash: {pesoFormat(totalCash)}</p>
              <p className="m-0">Total Gcash: {pesoFormat(totalGcash)}</p>
              <p className="m-0">Total Amount: {pesoFormat(totalAmount)}</p>
              <p className="m-0">
                Total Quantity: {totalQuantity.toLocaleString()}
              </p>
              <p className="m-0">Total Rows: {sales.length.toLocaleString()}</p>
            </div>
            <hr />
            <Table responsive>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Price</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Transact By</th>
                  {user?.role === 'admin' && <th> </th>}
                </tr>
              </thead>
              <tbody>
                {sales.map((d) => (
                  <tr key={d._id}>
                    <td>{d.product_name}</td>
                    <td>{d.quantity.toLocaleString()}</td>
                    <td>{pesoFormat(d.price)}</td>
                    <td>{pesoFormat(d.total_price)}</td>
                    <td>{d.payment === 'gcash' ? 'GCash' : 'Cash'}</td>
                    <td>{format(d.date_created, 'MM/dd/yyyy hh:mm aaa')}</td>
                    <td>{d.transact_by}</td>
                    {user?.role === 'admin' && (
                      <td>
                        <FontAwesomeIcon
                          onClick={() => handleShowConfirmationModal(d)}
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
            {sales.length === 0 && (
              <span className="ms-2 fw-light fst-italic text-secondary">
                no sales
              </span>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SalesPage;
