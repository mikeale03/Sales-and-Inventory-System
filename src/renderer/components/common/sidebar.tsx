import {
  faCartShopping,
  faCashRegister,
  faPesoSign,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav
      className="px-0 h-100 position-fixed bg-light shadow"
      style={{ width: '120px', left: 0, top: 0, paddingTop: '50px' }}
    >
      <ul className="nav flex-column mt-3">
        <NavLink to="cash-register">
          <li
            className="nav-link cursor-pointer text-center rounded bg-white mx-3 mb-3 py-3 px-0 shadow-sm"
            style={{ fontSize: '0.8em' }}
          >
            <FontAwesomeIcon icon={faCashRegister} size="xl" />
            <p className="m-0 text-center">Cash Register</p>
          </li>
        </NavLink>
        <NavLink to="products">
          <li
            className="nav-link cursor-pointer text-center rounded bg-white mx-3 mb-3 py-3 px-0 shadow-sm"
            style={{ fontSize: '0.8em' }}
          >
            <FontAwesomeIcon icon={faCartShopping} size="xl" />
            <p className="m-0 text-center">Products</p>
          </li>
        </NavLink>
        <NavLink to="sales">
          <li
            className="nav-link cursor-pointer text-center rounded bg-white mx-3 mb-3 py-3 px-0 shadow-sm"
            style={{ fontSize: '0.8em' }}
          >
            <FontAwesomeIcon icon={faPesoSign} size="xl" />
            <p className="m-0 text-center">Sales</p>
          </li>
        </NavLink>
        {/* <NavLink to="reporting">
          <li>
            <span className="nav-link cursor-pointer">
              <i className="fa-solid fa-money-bill-wave" /> Reporting
            </span>
          </li>
        </NavLink> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
