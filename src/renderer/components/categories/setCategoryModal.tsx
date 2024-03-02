import { CategoryResult } from 'globalTypes/realm/categories.types';
import { FormEvent, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createCategory, updateCategory } from 'renderer/service/categories';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedCategory?: CategoryResult;
  onUpdate?: (category: CategoryResult) => void;
  onCreate?: (category: CategoryResult) => void;
  onCancel?: () => void;
};

const SetCategoryModal = ({
  show,
  toggle,
  selectedCategory,
  onUpdate,
  onCreate,
  onCancel,
}: Props) => {
  const [name, setName] = useState('');

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const response = selectedCategory
      ? await updateCategory(selectedCategory._id, name)
      : await createCategory(name);
    if (response.isSuccess && response.result) {
      toast.success(response.message);
      toggle(false);
      selectedCategory
        ? onUpdate?.(response.result)
        : onCreate?.(response.result);
    } else {
      toast.error(response.message);
    }
  };

  const onShow = () => {
    if (selectedCategory) {
      setName(selectedCategory.name);
    } else {
      setName('');
    }
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} onShow={onShow}>
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>
            {selectedCategory ? 'Edit' : 'Create'} Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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

export default SetCategoryModal;
