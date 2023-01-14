import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';

function HomePage() {
  return (
    <div className="container-fluid vh-100">
      <div className="d-flex flex-row h-100">
        <Sidebar />
        <main role="main" className="p-3 h-100 flex-grow-1 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HomePage;
