import '../../__mock__/electronMock';
import { describe, expect, it, afterAll, beforeAll } from '@jest/globals';
import { createUser, deleteUser } from '../users';
import login from '../auth';
import userLogin from '../../__mock__/mockData';

describe('Auth', () => {
  const { isValidPassword } = window.electron.utils;
  (
    isValidPassword as jest.MockedFunction<typeof isValidPassword>
  ).mockImplementation((password: string) => {
    // return password === userLogin.password;
    return password === 'password';
  });

  beforeAll(async () => {
    await createUser(userLogin);
  });

  afterAll(async () => {
    await deleteUser(userLogin.username);
  });

  it('should login user', async () => {
    const response = await login(userLogin.username, userLogin.password);
    expect(window.electron.utils.isValidPassword).toBeCalledWith(
      userLogin.password,
      'mock_hash',
      'mock_salt'
    );
    expect(response.isSuccess).toEqual(true);
  });

  it('should not login if user is not found', async () => {
    const response = await login('test-not-found', userLogin.password);
    expect(response.isSuccess).toEqual(false);
    expect(response.message).toEqual('Username error');
  });

  it('should not login if invalid password', async () => {
    const response = await login(userLogin.username, 'test-invalid-password');
    expect(response.isSuccess).toEqual(false);
    expect(response.message).toEqual('Incorrect password.');
  });
});
