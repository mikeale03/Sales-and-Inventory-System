/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { Button, Table, Card, Row, Col, FormControl } from 'react-bootstrap';
import { AllProductItem, IProduct } from 'globalTypes/dbApi/products.types';
import { AllDocsResponse, IResponse } from 'globalTypes/dbApi/response.types';
import { debounce } from 'renderer/utils/helper';
import {
  deleteProduct,
  ProductForm,
  SetProductResult,
  updateProduct,
} from 'renderer/service/products';
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

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<
    ProductForm | undefined
  >();
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

  const handleUpdateProduct = async (product: SetProductResult) => {
  //   product &&
  //     setProducts(
  //       products.map((prod) =>
  //         prod.doc?._id === product!._id
  //           ? { ...prod, doc: { ...prod.doc, ...product } }
  //           : prod
  //       )
  //     );
  };

  const handleAddProduct = async (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleShowSetProductModal = (doc: IProduct | undefined) => {
    setSelectedProduct(doc);
    setShowSetProductModal(true);
  };

  const handleShowAddQuantityModal = (doc: IProduct) => {
    setSelectedProduct(doc);
    setShowAddQuantityModal(true);
  };

  const handleShowConfirmationModal = (doc: IProduct) => {
    setSelectedProduct(doc);
    setShowConfirmationModal(true);
  };

  const handleAddQuantity = async (qty: number) => {
    let quantity = selectedProduct?.quantity ? +selectedProduct?.quantity : 0;
    quantity = qty + quantity;

    if (selectedProduct) {
      const product = await updateProduct({ ...selectedProduct, quantity });
      setProducts(
        products.map((prod) =>
          prod.doc?._id === product!._id
            ? { ...prod, doc: { ...prod.doc, ...product } }
            : prod
        )
      );
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct?._id) {
      const result = await deleteProduct(selectedProduct._id);
      if (result) {
        setProducts(
          products.filter((prod) => prod.doc?._id !== selectedProduct._id)
        );
        setSelectedProduct(undefined);
      }
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
    handleGetAllProducts();
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
        onSubmit={handleAddQuantity}
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

      <Card>
        <Card.Body>
          <Table>
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
                      onClick={() => d.doc && handleShowAddQuantityModal(d.doc)}
                      icon={faCirclePlus}
                      title="Add quantity"
                      size="xl"
                      className="me-2"
                    />
                    <FontAwesomeIcon
                      onClick={() => d.doc && handleShowSetProductModal(d.doc)}
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2"
                    />
                    <FontAwesomeIcon
                      onClick={() =>
                        d.doc && handleShowConfirmationModal(d.doc)
                      }
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
