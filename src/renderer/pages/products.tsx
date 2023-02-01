/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { Button, Table, Card, Row, Col, FormControl } from 'react-bootstrap';
import { debounce } from 'renderer/utils/helper';
import { deleteProduct, getProducts } from 'renderer/service/products';
import AddQuantityModal from 'renderer/components/products/addQuantityModal';
import SetProductModal from 'renderer/components/products/setProductModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Product } from 'main/service/productsRealm';
import { toast } from 'react-toastify';

const { console } = window;

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [showSetProductModal, setShowSetProductModal] =
    useState<boolean>(false);
  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleGetProducts = async (searchText?: string) => {
    const response = await getProducts(searchText);
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
        message={`Are you sure to delete product '${selectedProduct?.name}'`}
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
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {products.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.barcode}</td>
                  <td>{d.price}</td>
                  <td>{d.quantity}</td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowAddQuantityModal(d)}
                      icon={faCirclePlus}
                      title="Add quantity"
                      size="xl"
                      className="me-2"
                    />
                    <FontAwesomeIcon
                      onClick={() => handleShowSetProductModal(d)}
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2"
                    />
                    <FontAwesomeIcon
                      onClick={() => handleShowConfirmationModal(d)}
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2"
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
};

export default ProductsPage;
