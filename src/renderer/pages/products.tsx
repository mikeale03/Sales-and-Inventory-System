/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { Button, Form, Table, Card } from 'react-bootstrap';
import { AllProductItem, IProduct } from 'globalTypes/dbApi/products.types';
import { AllDocsResponse } from 'globalTypes/dbApi/response.types';
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

const {
  electron: { ipcRenderer },
  console,
} = window;

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<
    ProductForm | undefined
  >();
  const [products, setProducts] = useState<AllProductItem[]>([]);
  const [showSetProductModal, setShowSetProductModal] =
    useState<boolean>(false);
  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleGetAllProducts = async () => {
    const response = await ipcRenderer.invoke<AllDocsResponse<IProduct>>(
      'products:get-all'
    );
    console.log(response);
    if (response.isSuccess) {
      const data = response.result?.rows;
      setProducts(data ?? []);
    }
  };

  const handleUpdateProduct = async (product: SetProductResult) => {
    product &&
      setProducts(
        products.map((prod) =>
          prod.doc?._id === product!._id
            ? { ...prod, doc: { ...prod.doc, ...product } }
            : prod
        )
      );
  };

  const handleCreateProduct = async (product: SetProductResult) => {
    product &&
      setProducts([
        {
          doc: product!,
          id: product!._id,
          key: product!._id,
          value: { rev: product!._rev },
        },
        ...products,
      ]);
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
  }

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
    if(selectedProduct?._id) {
      const result = await deleteProduct(selectedProduct._id);
      if(result) {
        setProducts(
          products.filter((prod) =>
            prod.doc?._id !== selectedProduct._id
          )
        );
        setSelectedProduct(undefined);
      }
    }
  }

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

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div>
      <SetProductModal
        show={showSetProductModal}
        toggle={setShowSetProductModal}
        selectedProduct={selectedProduct}
        onCreate={handleCreateProduct}
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
      <Form.Group className="mb-3">
        <Form.Control
          type="search"
          placeholder="Search product"
          // value={search}
          onChange={(e) => searchProduct(e.target.value)}
        />
      </Form.Group>

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
                <tr key={d.id}>
                  <td>{d.doc?.name}</td>
                  <td>{d.doc?.barcode}</td>
                  <td>{d.doc?.price}</td>
                  <td>{d.doc?.quantity}</td>
                  <td>
                    <Button
                      onClick={() => d.doc && handleShowSetProductModal(d.doc)}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => d.doc && handleShowAddQuantityModal(d.doc)}
                    >
                      Add Quantity
                    </Button>
                    <Button
                      onClick={() => d.doc && handleShowConfirmationModal(d.doc)}
                    >
                      Delete
                    </Button>
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
