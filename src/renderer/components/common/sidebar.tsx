import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav
      className="px-0 h-100 position-fixed"
      style={{ width: '120px', left: 0, top: 0 }}
    >
      <ul className="nav flex-column mt-5">
        <NavLink to="cash-register">
          <li>
            <span className="nav-link cursor-pointer">
              <i className="fa-solid fa-table-columns" /> Cash Register
            </span>
          </li>
        </NavLink>
        <NavLink to="products">
          <li>
            <span className="nav-link cursor-pointer">
              <i className="fa-solid fa-money-bill-wave" /> Products
            </span>
          </li>
        </NavLink>
        <NavLink to="sales">
          <li>
            <span className="nav-link cursor-pointer">
              <i className="fa-solid fa-table-columns" /> Sales
            </span>
          </li>
        </NavLink>
        <NavLink to="reporting">
          <li>
            <span className="nav-link cursor-pointer">
              <i className="fa-solid fa-money-bill-wave" /> Reporting
            </span>
          </li>
        </NavLink>
      </ul>
    </nav>
  );
};

export default Sidebar;
