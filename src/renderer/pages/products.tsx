/* eslint-disable radix */
import { FormEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
// import SortableTable from 'reactstrap-sortable-table';
import { IProduct } from 'globalTypes/dbApi/products.types';
import {
  AllDocsResponse,
  CreateResponse,
} from 'globalTypes/dbApi/response.types';

const {
  electron: { ipcRenderer },
  console,
} = window;

type Product = {
  name: string;
  barcode: string;
  description: string;
  quantity: string | number;
};

const ProductsPage = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    barcode: '',
    description: '',
    quantity: '',
  });
  const [products, setProducts] = useState([]);
  const [showProductAddModal, setShowProductAddModal] =
    useState<boolean>(false);

  const handleGetAllProducts = async () => {
    const response = await ipcRenderer.invoke<AllDocsResponse<IProduct>>(
      'products:get-all'
    );
    console.log(response);
  };

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { quantity } = product;
    const data = { ...product };
    data.quantity = +quantity;

    const response = await ipcRenderer.invoke<CreateResponse<IProduct>>(
      'products:create',
      product
    );
    console.log(response);
  };

  const handleChange = (updateFields: Partial<Product>) => {
    setProduct({ ...product, ...updateFields });
  };

  return (
    <div>
      <Button onClick={() => setShowProductAddModal(true)}>Add Product</Button>

      <Modal show={showProductAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProduct}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={product.name}
                onChange={(e) => handleChange({ name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={product.barcode}
                onChange={(e) => handleChange({ barcode: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={product.quantity}
                onChange={(e) => handleChange({ quantity: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={product.description}
                onChange={(e) => handleChange({ description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowProductAddModal(false)}
            >
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Button onClick={handleGetAllProducts}> All Products </Button>
    </div>
  );
};

export default ProductsPage;
