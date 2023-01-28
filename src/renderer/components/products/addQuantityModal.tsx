import { Product } from 'main/service/productsRealm';
import { FormEvent, useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
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

    if (selectedProduct) {
      const response = await updateProduct({
        _id: selectedProduct._id,
        quantity: selectedProduct.quantity + numQuality,
        updated_by: user?.username,
        date_updated: new Date(),
      });

      if (response.isSuccess && response.result) onUpdate(response.result);
      else alert(response.message);

      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
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
