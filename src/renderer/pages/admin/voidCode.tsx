import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createVoidCode, getVoidCode } from 'renderer/service/sales';

const VoidCodePage = () => {
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSaveCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createVoidCode(code);
    console.log(response);
    if (response.isSuccess) {
      toast.success('Void code is save successfully');
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getVoidCode();
      if (response.isSuccess && response.result) setCode(response.result);
    })();
  }, []);

  return (
    <div>
      <h3>Sales Void Code</h3>
      <Row>
        <Col xl="6" xxl="4">
          <Card className="mb-3">
            <Card.Body>
              <Form onSubmit={handleSaveCode}>
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
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VoidCodePage;
