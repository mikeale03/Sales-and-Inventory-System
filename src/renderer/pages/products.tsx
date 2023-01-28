/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { Button, Table, Card, Row, Col, FormControl } from 'react-bootstrap';
import { IProduct } from 'globalTypes/dbApi/products.types';
import { AllDocsResponse, IResponse } from 'globalTypes/dbApi/response.types';
import { debounce } from 'renderer/utils/helper';
import { deleteProduct } from 'renderer/service/products';
import AddQuantityModal from 'renderer/components/products/addQuantityModal';
import SetProductModal from 'renderer/components/products/setProductModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Product } from 'main/service/productsRealm';

const {
  electron: { ipcRenderer },
  console,
} = window;

const products1 = [
  {
    _id: 1,
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    _id: 2,
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    _id: 3,
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    _id: 4,
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    _id: 5,
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
  {
    barcode: 12,
    created_by: 'user',
    date_updated: null,
    description: '',
    image: null,
    name: 'name',
    price: 3,
    quantity: 3,
    updated_by: null,
  },
];

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [showSetProductModal, setShowSetProductModal] =
    useState<boolean>(false);
  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleGetAllProducts = async () => {
    const response = await ipcRenderer.invoke<IResponse<Product[]>>(
      'products:get-all'
    );
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
        : alert(response.message);
    }
  };

  const searchProduct = debounce<void>(async (search: string) => {
    const response = await ipcRenderer.invoke<AllDocsResponse<IProduct>>(
      'products:search',
      search
    );
    console.log(response);
    if (response.isSuccess) {
      const data = response.result?.rows;
      setProducts(data ?? []);
    }
  }, 500);

  const searchBarcode = debounce<void>(async (search: number) => {
    const response = await ipcRenderer.invoke<AllDocsResponse<IProduct>>(
      'products:get-barcode',
      search
    );
    console.log(response);
    if (response.isSuccess) {
      const data = response.result?.rows;
      setProducts(data ?? []);
    }
  }, 500);

  useEffect(() => {
    // handleGetAllProducts();
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
            placeholder="Search name"
            // value={search}
            onChange={(e) => searchProduct(e.target.value)}
          />
        </Col>
        <Col md="6">
          <FormControl
            type="search"
            placeholder="Search barcode"
            // value={search}
            onChange={(e) => searchBarcode(e.target.value)}
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
              {products1.map((d, i) => (
                <tr key={i+''}>
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
