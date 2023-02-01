import { Product } from 'main/service/productsRealm';
import { FormEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  product?: Product;
  onConfirm?: (quantity: number | string) => void;
  onCancel?: () => void;
};

const QuantityInputModal = ({
  show,
  toggle,
  product,
  onConfirm,
  onCancel,
}: Props) => {
  const [quantity, setQuantity] = useState<number | string>(1);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(false);
    onConfirm?.(quantity);
  };

  const onShow = () => {
    setQuantity(1);
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} onShow={onShow}>
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>
            <strong>{product?.name}</strong>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {product?.barcode && (
            <p>
              <strong>Barcode: </strong> {product.barcode}
            </p>
          )}
          <p className="text-secondary">
            <strong>Remaining: </strong>
            {product?.quantity}
          </p>
          {product?.description && (
            <p>
              <strong>Description: </strong>
              {product.description}
            </p>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Quantity of items to purchase</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Enter quantity"
              max={product?.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Ok
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default QuantityInputModal;
