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
  FormCheck,
} from 'react-bootstrap';
import {
  deleteSale,
  getSalesByProducts,
  getSalesByTransactions,
} from 'renderer/service/sales';
import { debounce, pesoFormat } from 'renderer/utils/helper';
import format from 'date-fns/format';
import UserContext from 'renderer/context/userContext';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { toast } from 'react-toastify';
import SalesFilter from 'renderer/components/sales/salesFilters';
import FilterContext from 'renderer/context/filterContext';
import { createSalesDeleteActivity } from 'renderer/service/activities';

const SalesPage = () => {
  const [sales, setSales] = useState<Sales[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalGcash, setTotalGcash] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sales | undefined>();
  const [isGroupByProduct, setIsGroupByProduct] = useState(false);
  const { user } = useContext(UserContext);
  const {
    salesFilter: { userOption, startDate, endDate },
  } = useContext(FilterContext);
  const printRef = useRef<HTMLDivElement | null>(null);

  const handleGetSales = useCallback(
    async (
      isGroupByProd: boolean,
      filter?: {
        transactByUserId?: string;
        startDate?: Date;
        endDate?: Date;
        productName: string;
      }
    ) => {
      const response = isGroupByProd
        ? await getSalesByProducts({ ...filter, verifiedOnly: true })
        : await getSalesByTransactions(filter);

      console.log(response);
      if (response.isSuccess && response.result) {
        setSales(response.result);
      } else {
        toast.error(response.message);
      }
    },
    []
  );

  useEffect(() => {
    let qty = 0;
    let amount = 0;
    let gcash = 0;
    let cash = 0;
    sales.forEach((sale) => {
      qty += sale.quantity;
      amount += sale.total_price;
      if (sale.payment === 'gcash') {
        gcash += sale.total_price;
      } else {
        cash += sale.total_price;
      }
      return sale;
    });

    setTotalAmount(amount);
    setTotalQuantity(qty);
    setTotalGcash(gcash);
    setTotalCash(cash);
  }, [sales]);

  useEffect(() => {
    if (userOption)
      handleGetSales(isGroupByProduct, {
        transactByUserId: userOption === 'all' ? undefined : userOption,
        startDate,
        endDate,
        productName: searchText,
      });
  }, [
    userOption,
    startDate,
    endDate,
    searchText,
    isGroupByProduct,
    handleGetSales,
  ]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDeleteSale = async () => {
    if (!selectedSale || !user) return;
    const response = await deleteSale(selectedSale._id);
    if (response.isSuccess) {
      setSales(sales.filter((item) => item._id !== selectedSale._id));
      createSalesDeleteActivity({
        sales: selectedSale,
        transact_by: user.username,
        transact_by_user_id: user._id,
      });
    } else toast.error(response.message);
  };

  const handleShowConfirmationModal = (sale: Sales) => {
    setSelectedSale(sale);
    setShowConfirmationModal(true);
  };

  const handleSearch = debounce((e) => {
    setSearchText(e.target.value);
  }, 300);

  return (
    <>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={<p className="text-center">Are you sure to delete sale</p>}
        onConfirm={handleDeleteSale}
      />

      <div ref={printRef}>
        <h3 className="print-m1">Sales</h3>

        <SalesFilter className="print-ml1 print-mr1" />

        <div>
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
                <Col
                  lg="6"
                  className="d-flex justify-content-end align-items-center"
                >
                  <FormCheck
                    type="checkbox"
                    label="Group by Verified Products"
                    checked={isGroupByProduct}
                    onChange={(e) => setIsGroupByProduct(e.target.checked)}
                  />
                </Col>
              </Row>
              <div className="d-lg-flex justify-content-between">
                {!isGroupByProduct && (
                  <p className="m-0">Total Cash: {pesoFormat(totalCash)}</p>
                )}
                {!isGroupByProduct && (
                  <p className="m-0">Total Gcash: {pesoFormat(totalGcash)}</p>
                )}
                <p className="m-0">Total Amount: {pesoFormat(totalAmount)}</p>
                <p className="m-0">
                  Total Quantity: {totalQuantity.toLocaleString()}
                </p>
                <p className="m-0">
                  Total Rows: {sales.length.toLocaleString()}
                </p>
              </div>
              <hr />
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    {!isGroupByProduct && <th>Price</th>}
                    <th>Total Price</th>
                    {!isGroupByProduct && <th>Payment</th>}
                    {!isGroupByProduct && <th>Date</th>}
                    <th>Transact By</th>
                    {user?.role === 'admin' && (
                      <th className="print-hide"> </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sales.map((d) => (
                    <tr key={d._id}>
                      <td>{d.product_name}</td>
                      <td>{d.quantity.toLocaleString()}</td>
                      {!isGroupByProduct && <td>{pesoFormat(d.price)}</td>}
                      <td>{pesoFormat(d.total_price)}</td>
                      {!isGroupByProduct && (
                        <td
                          className={
                            d.payment === 'gcash' ? 'text-primary' : ''
                          }
                        >
                          {d.payment === 'gcash' ? 'GCash' : 'Cash'}
                        </td>
                      )}
                      {!isGroupByProduct && (
                        <td>
                          {format(d.date_created, 'MM/dd/yyyy hh:mm aaa')}
                        </td>
                      )}
                      <td>{d.transact_by}</td>
                      {user?.role === 'admin' && (
                        <td className="print-hide">
                          <FontAwesomeIcon
                            onClick={() => handleShowConfirmationModal(d)}
                            icon={faTrashCan}
                            title="Delete"
                            size="xl"
                            className="me-2 cursor-pointer"
                            role="button"
                            tabIndex={0}
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
    </>
  );
};

export default SalesPage;
