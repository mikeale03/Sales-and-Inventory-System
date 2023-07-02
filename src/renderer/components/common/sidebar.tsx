import { useContext } from 'react';
import {
  faCartShopping,
  faCashRegister,
  faMobileRetro,
  faMoneyBillTransfer,
  faPesoSign,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import UserContext from 'renderer/context/userContext';

const Sidebar = () => {
  const { user } = useContext(UserContext);
  return (
    <nav
      className="px-0 h-100 position-fixed bg-light shadow"
      style={{ width: '120px', left: 0, top: 0, paddingTop: '50px' }}
    >
      <ul className="nav flex-column mt-3">
        <NavLink to="cash-register" className="mb-3">
          {({ isActive }) => (
            <li
              className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 shadow-sm transition-all
              ${isActive && 'active'}`}
              style={{ fontSize: '0.8em' }}
            >
              <FontAwesomeIcon icon={faCashRegister} size="xl" />
              <p className="m-0 text-center">Cash Register</p>
            </li>
          )}
        </NavLink>
        <NavLink to="gcash-register" className="mb-3">
          {({ isActive }) => (
            <li
              className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 shadow-sm transition-all
            ${isActive && 'active'}`}
              style={{ fontSize: '0.8em' }}
            >
              <FontAwesomeIcon icon={faMobileRetro} size="xl" />
              <p className="m-0 text-center">GCash Register</p>
            </li>
          )}
        </NavLink>
        <NavLink to="products" className="mb-3">
          {({ isActive }) => (
            <li
              className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 shadow-sm transition-all
            ${isActive && 'active'}`}
              style={{ fontSize: '0.8em' }}
            >
              <FontAwesomeIcon icon={faCartShopping} size="xl" />
              <p className="m-0 text-center">Products</p>
            </li>
          )}
        </NavLink>
        <NavLink to="sales" className="mb-3">
          {({ isActive }) => (
            <li
              className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 shadow-sm transition-all
            ${isActive && 'active'}`}
              style={{ fontSize: '0.8em' }}
            >
              <FontAwesomeIcon icon={faPesoSign} size="xl" />
              <p className="m-0 text-center">Sales</p>
            </li>
          )}
        </NavLink>
        <NavLink to="gcash-transactions" className="mb-3">
          {({ isActive }) => (
            <li
              className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 shadow-sm transition-all
            ${isActive && 'active'}`}
              style={{ fontSize: '0.8em' }}
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} size="xl" />
              <p className="m-0 text-center">GCash Trans.</p>
            </li>
          )}
        </NavLink>
        <NavLink to="reports">
          {({ isActive }) => (
            <li
              className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 shadow-sm transition-all
            ${isActive && 'active'}`}
              style={{ fontSize: '0.8em' }}
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} size="xl" />
              <p className="m-0 text-center">Reports</p>
            </li>
          )}
        </NavLink>
      </ul>
      {user?.role === 'admin' && (
        <div className="container bg-white position-absolute bottom-0 start-0 p-2">
          <ul className="nav flex-column">
            <NavLink to="admin" className="mb-0">
              <li>
                <span className="nav-link cursor-pointer">
                  {/* <i className="fa-solid fa-gear"></i> */}
                  <strong>Admin</strong>
                </span>
              </li>
            </NavLink>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
