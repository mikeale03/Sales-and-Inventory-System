import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { TagResult } from 'globalTypes/realm/tags.types';
import { useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SetTagModal from 'renderer/components/tags/setTagModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { getTags, deleteTag } from 'renderer/service/tags';

const TagsPage = () => {
  const [tags, setTags] = useState<TagResult[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selected, setSelected] = useState<TagResult | undefined>();
  const navigate = useNavigate();

  const handleDeleteTag = async () => {
    if (!selected) return;
    const response = await deleteTag(selected._id);
    if (response.isSuccess) {
      toast.success(response.message);
      setTags(tags.filter((c) => c._id !== selected._id));
    } else {
      toast.error(response.message);
    }
  };

  const handleShowConfirmationModal = (tag: TagResult) => {
    setSelected(tag);
    setShowConfirmationModal(true);
  };

  const handleShowSetTag = (tag?: TagResult) => {
    setSelected(tag);
    setShowTagModal(true);
  };

  const handleOnCreate = (tag: TagResult) => {
    setTags([...tags, tag]);
  };

  const handleOnUpdate = (tag: TagResult) => {
    setTags(tags.map((c) => (c._id === tag._id ? tag : c)));
  };

  useEffect(() => {
    (async () => {
      const response = await getTags();
      if (response.isSuccess && response.result) setTags(response.result);
    })();
  }, []);

  return (
    <div>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={`Are you sure you want to delete user "${selected?.name}"`}
        onConfirm={handleDeleteTag}
      />
      <SetTagModal
        show={showTagModal}
        toggle={setShowTagModal}
        selectedTag={selected}
        onCreate={handleOnCreate}
        onUpdate={handleOnUpdate}
      />
      <h3>Tags</h3>
      <Button className="mb-3 mt-1" onClick={() => handleShowSetTag()}>
        Add Tag
      </Button>
      <Card className="mb-3">
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Created</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {tags.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>
                    {format(new Date(d.date_created), 'MM/dd/yyyy hh:mm aaa')}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowSetTag(d)}
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2"
                    />
                    <FontAwesomeIcon
                      onClick={() => handleShowConfirmationModal(d)}
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
};

export default TagsPage;
