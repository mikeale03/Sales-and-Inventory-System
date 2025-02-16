import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from 'react-bootstrap';
import { useState } from 'react';
import {
  createMobileNumber,
  updateMobileNumber,
} from 'renderer/service/mobileNumbers';
import { toast } from 'react-toastify';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';

export type MobileNumberForm = {
  number: string;
  name: string;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedMobileNumber?: MobileNumber;
  onSuccess?: (mobileNumber: MobileNumber) => void;
};

const SetMobileNumberModal = ({
  show,
  toggle,
  selectedMobileNumber,
  onSuccess,
}: Props) => {
  const [mobileNumber, setMobileNumber] = useState<MobileNumberForm>({
    number: '',
    name: '',
  });

  const handleChange = (updates: Partial<MobileNumberForm>) => {
    setMobileNumber({ ...mobileNumber, ...updates });
  };

  const handleCancel = () => {
    toggle(false);
  };

  const handleConfirm = async () => {
    const response = selectedMobileNumber
      ? await updateMobileNumber(selectedMobileNumber.number, mobileNumber)
      : await createMobileNumber(mobileNumber);

    if (response.isSuccess && response.result) {
      toast.success(response.message);
      onSuccess?.(response.result);
      toggle(false);
    } else {
      toast.error(response.message);
    }
  };

  const onShow = () => {
    setMobileNumber(
      selectedMobileNumber ?? {
        number: '',
        name: '',
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      onShow={onShow}
      size="sm"
      centered
    >
      <Modal.Header>
        <Modal.Title className="fw-bold text-center d-block w-100">
          {selectedMobileNumber ? 'Edit' : 'Add'} Mobile Number
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className="mb-3">
          <FormLabel>
            Number <span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            value={mobileNumber.number}
            type="number"
            onChange={(e) => handleChange({ number: e.target.value })}
          />
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>
            Name <span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            value={mobileNumber.name}
            onChange={(e) => handleChange({ name: e.target.value })}
          />
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetMobileNumberModal;
