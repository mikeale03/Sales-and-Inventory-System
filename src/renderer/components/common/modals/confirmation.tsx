import { Button, Modal } from 'react-bootstrap';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  message: string;
  onConfirm?: () => void;
  onCancel?:() => void;
};

const ConfirmationModal = ({
  show,
  toggle,
  message,
  onConfirm,
  onCancel,
}: Props) => {

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  }

  const handleConfirm = () => {
    toggle(false);
    onConfirm?.();
  }

  return (
    <Modal show={show} onHide={() => toggle(false)}>
      <Modal.Header>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Ok
          </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
