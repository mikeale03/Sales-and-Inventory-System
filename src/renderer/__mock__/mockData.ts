import { Role } from '../service/users';

class UserLogin {
  username: string;

  password: string;

  role: Role;

  constructor(username = 'username', password = 'password', role: Role.Admin) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setRole(role: Role) {
    this.role = role;
  }
}

const userLogin = new UserLogin('username', 'password', Role.Admin);

export default userLogin;
