import { useEffect, useState } from 'react';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Table } from 'react-bootstrap';
import { User } from 'globalTypes/realm/user.types';
import { deleteUser, getUsers } from 'renderer/service/users';
import { useNavigate } from 'react-router-dom';
import SetUserModal from 'renderer/components/user/setUserModal';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showSetUserModal, setShowSetUserModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) setUsers(response.result);
    })();
  }, []);

  const handleShowSetUserModal = (user: User | undefined) => {
    setSelectedUser(user);
    setShowSetUserModal(true);
  };

  const handleShowConfirmationModal = (user: User) => {
    setSelectedUser(user);
    setShowConfirmationModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const response = await deleteUser(selectedUser._id);
    if (response.isSuccess) {
      users.filter((user) => user._id !== selectedUser._id);
    }
  };

  return (
    <div>
      <SetUserModal
        show={showSetUserModal}
        toggle={setShowSetUserModal}
        selectedUser={selectedUser}
      />
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={`Are you sure you want to delete user "${selectedUser?.username}"`}
        onConfirm={handleDeleteUser}
      />
      <h3>Users</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleShowSetUserModal(undefined)}
      >
        Add Product
      </Button>
      <Card className="mb-3">
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {users.map((d) => (
                <tr key={d._id}>
                  <td>{d.username}</td>
                  <td>{d.role}</td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleShowSetUserModal(d)}
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

export default UsersPage;
