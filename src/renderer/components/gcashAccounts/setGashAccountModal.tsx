import { GcashAccount } from 'globalTypes/realm/gcashAccount.types';
import { FormEvent, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  createGcashAccount,
  updateGcashAccount,
} from 'renderer/service/gcashAccounts';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedGcashAccount?: GcashAccount;
  onUpdate?: (account: GcashAccount) => void;
  onCreate?: (account: GcashAccount) => void;
  onCancel?: () => void;
};

type AccountForm = {
  name: string;
  number: string;
  mpin: string;
  email?: string;
};

const SetGcashAccountModal = ({
  show,
  toggle,
  selectedGcashAccount,
  onUpdate,
  onCreate,
  onCancel,
}: Props) => {
  const [account, setAccount] = useState<AccountForm>({
    name: '',
    number: '',
    mpin: '',
    email: '',
  });

  const handleChange = (update: Partial<AccountForm>) => {
    setAccount({ ...account, ...update });
  };

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const response = selectedGcashAccount
      ? await updateGcashAccount(selectedGcashAccount.number, account)
      : await createGcashAccount(account);
    if (response.isSuccess && response.result) {
      toast.success(response.message);
      toggle(false);
      selectedGcashAccount
        ? onUpdate?.(response.result)
        : onCreate?.(response.result);
    } else {
      toast.error(response.message);
    }
  };

  const onShow = () => {
    if (selectedGcashAccount) {
      setAccount({ ...selectedGcashAccount });
    } else {
      setAccount({
        name: '',
        number: '',
        mpin: '',
        email: '',
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      onShow={onShow}
      size="sm"
      centered
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>
            {selectedGcashAccount ? 'Edit' : 'Create'} GCash Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Account Number <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={account.number}
              onChange={(e) => handleChange({ number: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Account Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={account.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              MPIN <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={account.mpin}
              onChange={(e) => handleChange({ mpin: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={account.email}
              onChange={(e) => handleChange({ email: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SetGcashAccountModal;
