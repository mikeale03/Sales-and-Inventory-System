import { Outlet } from 'react-router-dom';
import Header from 'renderer/components/common/header';
import Sidebar from '../components/common/sidebar';

function HomePage() {
  return (
    <div className="container-fluid p-0 vh-100">
      <div
        className="pe-0 h-100"
        style={{ paddingLeft: '120px', paddingTop: '50px' }}
      >
        <Sidebar />
        <Header />
        <main role="main" className="p-3 m-0 min-vh-100 flex-grow-1 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HomePage;
