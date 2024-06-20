import { Outlet, useLocation } from 'react-router-dom';
import Header from 'renderer/components/common/header';
import { useEffect, useMemo, useState } from 'react';
import { barcodeScan } from 'renderer/utils/helper';
import Sidebar from 'renderer/components/common/sidebar';
import { User } from 'globalTypes/realm/user.types';
import { getUsers } from 'renderer/service/users';
import UsersContext from 'renderer/context/usersContext';

export type BarcodeContext = {
  barcode: string;
  setBarcode: (barcode: string) => void;
};

function HomePage() {
  const location = useLocation();
  const [barcode, setBarcode] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const barcodeScanCb = useMemo(
    () =>
      barcodeScan((bcode: string) => {
        location.pathname === '/home/cash-register' && setBarcode(bcode);
      }),
    [location.pathname]
  );

  useEffect(() => {
    (async () => {
      const response = await getUsers();
      if (response.isSuccess && response.result) setUsers(response.result);
    })();
  }, []);

  return (
    <UsersContext.Provider
      value={useMemo(() => ({ users, setUsers }), [users])}
    >
      <div
        className="container-fluid p-0 vh-100"
        onKeyDown={barcodeScanCb}
        role="menu"
        tabIndex={-1}
      >
        <div className="pe-0 h-100" style={{ paddingLeft: '130px' }}>
          <Sidebar />
          <Header />
          <main
            role="main"
            className="px-3 m-0 min-vh-100 flex-grow-1 bg-light"
            style={{ paddingTop: '60px' }}
          >
            <Outlet
              context={useMemo(
                () => ({
                  barcode,
                  setBarcode,
                }),
                [barcode]
              )}
            />
          </main>
        </div>
      </div>
    </UsersContext.Provider>
  );
}

export default HomePage;
