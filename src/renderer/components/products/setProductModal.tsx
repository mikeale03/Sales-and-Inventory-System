import { IProduct } from 'globalTypes/dbApi/products.types';
import { FormEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createProduct, updateProduct } from 'renderer/service/products';
import FormInput from '../common/forms/formInput';

type Product = {
  _id?: string;
  _rev?: string;
  name: string;
  barcode?: string | number;
  description?: string;
  quantity: string | number;
  price: string | number;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedProduct?: Product;
  onCreate?: (product: { _id: string; _rev: string; } & IProduct | undefined) => void;
  onUpdate?: (product: { _id: string; _rev: string; } & IProduct | undefined) => void;
};

const SetProductModal = ({
  show,
  toggle,
  selectedProduct,
  onUpdate,
  onCreate,
}: Props) => {
  const [product, setProduct] = useState<Product>({
    name: '',
    barcode: '',
    description: '',
    quantity: '',
    price: '',
  });

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    let result: { _id: string; _rev: string; } & IProduct | undefined;
    if (product?._id && product?._rev) {
      result = await updateProduct(product);
      onUpdate?.(result);
    }
    else {
      result = await createProduct(product);
      onCreate?.(result);
    }
    toggle(false);
  };

  const handleChange = (updateFields: Partial<Product>) => {
    setProduct({ ...product, ...updateFields });
  };

  const onShow = () => {
    if (selectedProduct) setProduct(selectedProduct);
    else
      setProduct({
        name: '',
        barcode: '',
        description: '',
        quantity: '',
        price: '',
      });
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} onShow={onShow}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <FormInput
            formGroupProps={{ className: 'mb-2' }}
            label="Product Name"
            value={product.name}
            onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
              handleChange({ name: e.target.value })
            }
            required={true}
          />
          <FormInput
            formGroupProps={{ className: 'mb-2' }}
            label="Barcode"
            type="number"
            min="0"
            value={product.barcode ?? '' }
            onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
              handleChange({ barcode: e.target.value })
            }
          />
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step={0.01}
              value={product.price ?? ''}
              onChange={(e) => handleChange({ price: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={product.quantity}
              onChange={(e) => handleChange({ quantity: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={product.description ?? ''}
              onChange={(e) => handleChange({ description: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggle(false)}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SetProductModal;
