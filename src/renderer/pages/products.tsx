/* eslint-disable radix */
import { useEffect, useState, useContext } from 'react';
import { Button, Table, Card, Row, Col, FormControl } from 'react-bootstrap';
import { debounce, pesoFormat } from 'renderer/utils/helper';
import { deleteProduct, getProducts } from 'renderer/service/products';
import AddQuantityModal from 'renderer/components/products/addQuantityModal';
import SetProductModal from 'renderer/components/products/setProductModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Product } from 'main/service/productsRealm';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import format from 'date-fns/format';

const { console } = window;

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [showSetProductModal, setShowSetProductModal] =
    useState<boolean>(false);
  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { user } = useContext(UserContext);

  const handleGetProducts = async (searchText?: string) => {
    const response = await getProducts({
      searchText,
      sortProp: 'name',
      sortAs: 'asc',
    });
    console.log(response);
    if (response.isSuccess) {
      const data = response.result;
      setProducts(data ?? []);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    console.log(product);
    setProducts(
      products.map((prod) => (prod._id === product._id ? product : prod))
    );
  };

  const handleAddProduct = async (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleShowSetProductModal = (product: Product | undefined) => {
    setSelectedProduct(product);
    setShowSetProductModal(true);
  };

  const handleShowAddQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setShowAddQuantityModal(true);
  };

  const handleShowConfirmationModal = (product: Product) => {
    setSelectedProduct(product);
    setShowConfirmationModal(true);
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      const response = await deleteProduct(selectedProduct._id);
      response.isSuccess
        ? setProducts(
            products.filter((prod) => prod._id !== selectedProduct._id)
          )
        : toast.error(response.message);
    }
  };

  const searchProduct = debounce<void>(async (search: string) => {
    handleGetProducts(search);
  }, 500);

  useEffect(() => {
    handleGetProducts();
  }, []);

  return (
    <div>
      <SetProductModal
        show={showSetProductModal}
        toggle={setShowSetProductModal}
        selectedProduct={selectedProduct}
        onCreate={handleAddProduct}
        onUpdate={handleUpdateProduct}
      />

      <AddQuantityModal
        show={showAddQuantityModal}
        toggle={setShowAddQuantityModal}
        onUpdate={handleUpdateProduct}
        selectedProduct={selectedProduct}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={
          <p className="text-center">
            Are you sure to delete product name <b>{selectedProduct?.name}</b>
          </p>
        }
        onConfirm={handleDeleteProduct}
      />

      <h3>Products</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleShowSetProductModal(undefined)}
      >
        Add Product
      </Button>

      <Row className="mb-3">
        <Col md="6">
          <FormControl
            type="search"
            placeholder="Search name or barcode"
            // value={search}
            onChange={(e) => searchProduct(e.target.value.trim())}
            autoFocus
          />
        </Col>
      </Row>

      <Card className="d-flex">
        <Card.Body className="flex-grow-1">
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Barcode</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Last Updated By</th>
                <th>Last Updated Dated</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {products.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.barcode}</td>
                  <td>{pesoFormat(d.price)}</td>
                  <td>{d.quantity.toLocaleString()}</td>
                  <td>{d.updated_by}</td>
                  <td>
                    {d.date_updated &&
                      format(d.date_updated, 'MM/dd/yyy hh:mm aaa')}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowAddQuantityModal(d)}
                      icon={faCirclePlus}
                      title="Add quantity"
                      size="xl"
                      className="me-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => handleShowSetProductModal(d)}
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2 cursor-pointer"
                    />
                    {user?.role === 'admin' && (
                      <FontAwesomeIcon
                        onClick={() => handleShowConfirmationModal(d)}
                        icon={faTrashCan}
                        title="Delete"
                        size="xl"
                        className="me-2 cursor-pointer"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {products.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no products
            </span>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductsPage;
