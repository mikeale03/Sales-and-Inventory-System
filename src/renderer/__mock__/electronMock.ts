// import userLogin from './mockData';

Object.defineProperty(window, 'electron', {
  writable: true,
  value: {
    utils: {
      hashAndSaltPassword: jest.fn().mockImplementation(() => {
        return {
          salt: 'mock_salt',
          hash: 'mock_hash',
        };
      }),
      isValidPassword: jest.fn().mockImplementation((password: string) => {
        // return password === userLogin.password;
        return password === 'pass';
      }),
    },
  },
});
