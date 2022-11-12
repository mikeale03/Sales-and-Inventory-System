import { createUser, deleteUser } from '../usersDb';
import Role from '../../../globalTypes/dbApi/users.enums';

describe('UsersDb', () => {
  const user = {
    username: 'username4352',
    password: 'password',
    role: Role.Admin,
  };

  it('should create user', async () => {
    const response = await createUser(user);
    console.log(response);
    expect(response.isSuccess).toEqual(true);
  });

  it('should delete user', async () => {
    const response = await deleteUser(user.username);
    console.log(response);
    expect(response.isSuccess).toEqual(true);
  });
});
