import '../../__mock__/electronMock';
import { describe, expect, it } from '@jest/globals';
import { createUser, deleteUser, Role } from '../users';

describe('UsersRepository', () => {
  const userLogin = {
    username: 'username4352',
    password: 'password',
    role: Role.Admin,
  };

  it('should create user', async () => {
    const response = await createUser(userLogin);
    console.log(response);
    expect(response.isSuccess).toEqual(true);
  });

  it('should delete user', async () => {
    const response = await deleteUser(userLogin.username);
    console.log(response);
    expect(response.isSuccess).toEqual(true);
  });
});
