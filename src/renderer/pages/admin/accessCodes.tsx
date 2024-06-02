import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'globalTypes/realm/user.types';
import { useContext, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SetAccessCodeModal from 'renderer/components/accessCodes/setAccessCodeModal';
import UsersContext from 'renderer/context/usersContext';
import { updateUser } from 'renderer/service/users';

const AccessCodesPage = () => {
  const [showSetAccessCodeModal, setShowSetAccessCodeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const { users, setUsers } = useContext(UsersContext);
  const navigate = useNavigate();

  const usersWithAccessCode = users.filter((user) => !!user.accessCode);

  const handleDeleteAccessCode = async (_id: string) => {
    const response = await updateUser({
      accessCode: '',
      _id,
    });

    if (response.isSuccess && response.result) {
      toast.success('Access code deleted');
      setUsers(
        users.map((u) => (u._id === response.result?._id ? response.result : u))
      );
    } else {
      toast.error('Failed to delete access code');
    }
  };

  const handleShowSetAccessCodeModal = (user?: User) => {
    setSelectedUser(user);
    setShowSetAccessCodeModal(true);
  };

  return (
    <div>
      <SetAccessCodeModal
        show={showSetAccessCodeModal}
        toggle={setShowSetAccessCodeModal}
        selectedUser={selectedUser}
      />

      <h3>Access Codes</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleShowSetAccessCodeModal()}
      >
        Add Access Code
      </Button>
      <Row>
        <Col xl="6" xxl="4">
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
                  {usersWithAccessCode.map((d) => (
                    <tr key={d._id}>
                      <td>{d.username}</td>
                      <td>{d.role}</td>
                      <td>
                        <FontAwesomeIcon
                          onClick={() => handleShowSetAccessCodeModal(d)}
                          icon={faPenToSquare}
                          title="Edit"
                          size="xl"
                          className="me-2"
                        />
                        <FontAwesomeIcon
                          onClick={() => handleDeleteAccessCode(d._id)}
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
              {/* <Form onSubmit={handleSaveCode}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    className="mb-2"
                    type={showPassword ? 'text' : 'password'}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Show code"
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                </Form.Group>
              */}
              {users.length === 0 && (
                <span className="ms-2 fw-light fst-italic text-secondary">
                  no access codes
                </span>
              )}
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AccessCodesPage;
