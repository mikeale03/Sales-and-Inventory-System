import { Product } from 'main/service/productsRealm';
import { FormEvent, useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import { updateProduct } from 'renderer/service/products';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedProduct: Product | undefined;
  onUpdate: (product: Product) => void;
};

const AddQuantityModal = ({
  show,
  toggle,
  selectedProduct,
  onUpdate,
}: Props) => {
  const [quantity, setQuantity] = useState('');
  const { user } = useContext(UserContext);

  const onHide = () => {
    setQuantity('');
    toggle(false);
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const numQuality = +quantity;

    if (selectedProduct && user) {
      const response = await updateProduct({
        _id: selectedProduct._id,
        quantity: selectedProduct.quantity + numQuality,
        updated_by: user?.username,
        updated_by_user_id: user._id,
      });

      if (response.isSuccess && response.result) onUpdate(response.result);
      else toast(response.message);

      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Add Quantity</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggle(false)}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddQuantityModal;
