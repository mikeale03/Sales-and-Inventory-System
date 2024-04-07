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
                <strong>Manage Users</strong>
              </p>
              <Link to="users" className="d-block">
                Users
              </Link>
            </Col>
            <Col lg="4">
              <p className="mb-0">
                <strong>Manage Products</strong>
              </p>
              <Link to="categories" className="d-block">
                Categories
              </Link>
              <Link to="tags" className="d-block">
                Tags
              </Link>
            </Col>
            <Col lg="4">
              <p className="mb-0">
                <strong>Manage Sales</strong>
              </p>
              <Link to="void-code" className="d-block">
                Sales Void Code
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminPage;
