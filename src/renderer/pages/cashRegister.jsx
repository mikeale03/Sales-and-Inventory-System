import { Col, Row } from 'react-bootstrap';
import FormInput from '../components/common/forms/formInput';

function CashRegisterPage() {
  return (
    <div>
      <h4>Cash Register</h4>
      <Row className="mb-2">
        <Col lg="6">
          <FormInput type="search" placeholder="Search Expenses" />
        </Col>
      </Row>
    </div>
  );
}

export default CashRegisterPage;
