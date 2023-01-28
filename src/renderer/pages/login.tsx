import {
  Button,
  Card,
  Col,
  FormControl,
  InputGroup,
  Row,
  Form,
} from 'react-bootstrap';
import { FormEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GetResponse } from 'globalTypes/dbApi/response.types';
import { IUser } from 'globalTypes/dbApi/users.types';
import UserContext from 'renderer/context/userContext';

const {
  electron: { ipcRenderer },
  console,
} = window;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await ipcRenderer.invoke<GetResponse<IUser>>(
      'users:login',
      username,
      password
    );

    if (!response.isSuccess) {
      console.log(response);
    } else {
      response.result && setUser?.(response.result);
      navigate('Home');
    }
  };

  return (
    <section style={{ height: '100vh', backgroundColor: '#fff' }}>
      <div className="h-100">
        <Row className="justify-content-center h-100 g-0">
          <Col md="6" lg="4" className="h-100">
            <div className="d-flex align-items-center h-100">
              <div className="w-100 m-2">
                <Card>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <p className="text-center">Please log in to start</p>
                      <InputGroup className="mb-2">
                        <FormControl
                          className="border-right-0"
                          placeholder="Username"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputGroup.Text>
                          <i className="fa-solid fa-user" />
                        </InputGroup.Text>
                      </InputGroup>
                      <InputGroup className="mb-2">
                        <FormControl
                          className="border-right-0"
                          type="password"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputGroup.Text>
                          <i className="fa-solid fa-lock" />
                        </InputGroup.Text>
                      </InputGroup>

                      <p className="mb-1 mt-n1 text-center">
                        <Link to="/forgot-password">
                          <small>Forgot Password?</small>
                        </Link>
                      </p>

                      <Button className="w-100 mt-2" type="submit">
                        Login
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default LoginPage;
