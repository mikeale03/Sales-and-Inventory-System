import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h3>Admin</h3>
      <Card>
        <Card.Body>
          <Row>
            <Col lg="4">
              <p className="mb-0">
                <strong>Manage Users test</strong>
              </p>
              <Link to="users" className="d-block">
                Users
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminPage;
