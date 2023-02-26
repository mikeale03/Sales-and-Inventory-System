import { Product } from 'main/service/productsRealm';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import { createProduct, updateProduct } from 'renderer/service/products';
import FormInput from '../common/forms/formInput';

type ProductForm = {
  _id?: string;
  name: string;
  barcode?: string | number;
  description?: string;
  quantity: string | number;
  price: string | number;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedProduct?: ProductForm;
  onCreate?: (product: Product) => void;
  onUpdate?: (product: Product) => void;
};

const SetProductModal = ({
  show,
  toggle,
  selectedProduct,
  onUpdate,
  onCreate,
}: Props) => {
  const [product, setProduct] = useState<ProductForm>({
    name: '',
    barcode: '',
    description: '',
    quantity: '',
    price: '',
  });

  const { user } = useContext(UserContext);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (product?._id && user?.username) {
      const response = await updateProduct({
        ...product,
        _id: product._id,
        updated_by: user.username,
        updated_by_user_id: user._id,
      });
      response.isSuccess && response.result
        ? onUpdate?.(response.result)
        : toast.error(response.message);
    } else if (user?.username) {
      const response = await createProduct({
        ...product,
        created_by: user.username,
        created_by_user_id: user._id,
      });
      response.isSuccess && response.result
        ? onCreate?.(response.result)
        : toast.error(response.message);
    }
    toggle(false);
  };

  const handleChange = (updateFields: Partial<ProductForm>) => {
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
            onChange={(e: ChangeEvent<HTMLFormElement>) =>
              handleChange({ name: e.target.value })
            }
            required
            autoFocus
          />
          <FormInput
            formGroupProps={{ className: 'mb-2' }}
            label="Barcode"
            type="number"
            min="0"
            value={product.barcode ?? ''}
            onChange={(e: ChangeEvent<HTMLFormElement>) =>
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
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SetProductModal;
