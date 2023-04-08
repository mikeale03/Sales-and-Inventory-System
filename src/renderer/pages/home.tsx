import { Outlet, useLocation } from 'react-router-dom';
import Header from 'renderer/components/common/header';
import { useMemo, useState } from 'react';
import { barcodeScan } from 'renderer/utils/helper';
import Sidebar from 'renderer/components/common/sidebar';

export type BarcodeContext = {
  barcode: string;
  setBarcode: (barcode: string) => void;
};

function HomePage() {
  const location = useLocation();
  const [barcode, setBarcode] = useState('');

  const barcodeScanCb = useMemo(
    () =>
      barcodeScan((bcode: string) => {
        location.pathname === '/home/cash-register' && setBarcode(bcode);
      }),
    [location.pathname]
  );

  return (
    <div
      className="container-fluid p-0 vh-100"
      onKeyDown={barcodeScanCb}
      role="button"
      tabIndex={0}
    >
      <div className="pe-0 h-100" style={{ paddingLeft: '120px' }}>
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
  );
}

export default HomePage;
