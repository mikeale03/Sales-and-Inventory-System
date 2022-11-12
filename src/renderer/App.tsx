import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Role from '../globalTypes/dbApi/users.enums';
import './App.css';

const { console, electron } = window;

const Hello = () => {
  // const handleSendMessage = () => {
  //   electron.ipcRenderer.sendMessage('ipc-example', ['hello world', 'jjj']);
  //   electron.ipcRenderer.on('ipc-example', (args) => {
  //     console.log(args);
  //   });
  // };

  interface User {
    username: string;
    password: string;
    role: string;
  }

  const roles = Object.values(Role);

  const [user, setUser] = useState<User>({
    username: '',
    password: '',
    role: '',
  });

  const handleChange = (updateField: Partial<User>) => {
    setUser({ ...user, ...updateField });
  };

  const handleInvokeCreateUser = async () => {
    const newUser = await electron.ipcRenderer.invoke('users:create', user);
    console.log(newUser);
  };

  return (
    <>
      <div>
        <input onChange={(e) => handleChange({ username: e.target.value })} />
        <input onChange={(e) => handleChange({ password: e.target.value })} />
        <select
          defaultValue=""
          onChange={(e) => handleChange({ role: e.target.value })}
        >
          <option value="" disabled>
            Select Role
          </option>
          {roles.map((role) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleInvokeCreateUser}>
          add user
        </button>
        {/* <button type="button" onClick={getUsers}>
          get users
        </button>
        <button type="button" onClick={deleteAll}>
          delete all
        </button>
        <button type="button" onClick={handleLogin}>
          login
        </button>
      </div>
      {userData?.username && <p>WELCOME {userData.username}!</p>} */}
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
