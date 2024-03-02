import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { CategoryResult } from 'globalTypes/realm/categories.types';
import { useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SetCategoryModal from 'renderer/components/categories/setCategoryModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import { getCategories, deleteCategory } from 'renderer/service/categories';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryResult[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selected, setSelected] = useState<CategoryResult | undefined>();
  const navigate = useNavigate();

  const handleDeleteCategory = async () => {
    if (!selected) return;
    const response = await deleteCategory(selected._id);
    if (response.isSuccess) {
      toast.success(response.message);
      setCategories(categories.filter((c) => c._id !== selected._id));
    } else {
      toast.error(response.message);
    }
  };

  const handleShowConfirmationModal = (category: CategoryResult) => {
    setSelected(category);
    setShowConfirmationModal(true);
  };

  const handleShowSetCategory = (category?: CategoryResult) => {
    setSelected(category);
    setShowCategoryModal(true);
  };

  const handleOnCreate = (category: CategoryResult) => {
    setCategories([...categories, category]);
  };

  const handleOnUpdate = (category: CategoryResult) => {
    setCategories(
      categories.map((c) => (c._id === category._id ? category : c))
    );
  };

  useEffect(() => {
    (async () => {
      const response = await getCategories();
      if (response.isSuccess && response.result) setCategories(response.result);
    })();
  }, []);

  return (
    <div>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={`Are you sure you want to delete user "${selected?.name}"`}
        onConfirm={handleDeleteCategory}
      />
      <SetCategoryModal
        show={showCategoryModal}
        toggle={setShowCategoryModal}
        selectedCategory={selected}
        onCreate={handleOnCreate}
        onUpdate={handleOnUpdate}
      />
      <h3>Categories</h3>
      <Button className="mb-3 mt-1" onClick={() => handleShowSetCategory()}>
        Add Category
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
              {categories.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>
                    {format(new Date(d.date_created), 'MM/dd/yyyy hh:mm aaa')}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowSetCategory(d)}
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

export default CategoriesPage;
