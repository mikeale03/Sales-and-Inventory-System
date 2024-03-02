import { TagResult } from 'globalTypes/realm/tags.types';
import { FormEvent, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createTag, updateTag } from 'renderer/service/tags';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedTag?: TagResult;
  onUpdate?: (category: TagResult) => void;
  onCreate?: (category: TagResult) => void;
  onCancel?: () => void;
};

const SetTagModal = ({
  show,
  toggle,
  selectedTag,
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
    const response = selectedTag
      ? await updateTag(selectedTag._id, name)
      : await createTag(name);
    if (response.isSuccess && response.result) {
      toast.success(response.message);
      toggle(false);
      selectedTag ? onUpdate?.(response.result) : onCreate?.(response.result);
    } else {
      toast.error(response.message);
    }
  };

  const onShow = () => {
    if (selectedTag) {
      setName(selectedTag.name);
    } else {
      setName('');
    }
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} onShow={onShow}>
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title>{selectedTag ? 'Edit' : 'Create'} Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tag Name</Form.Label>
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

export default SetTagModal;
