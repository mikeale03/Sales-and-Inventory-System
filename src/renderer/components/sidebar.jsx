import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sidebar px-0 h-100" style={{ width: '120px' }}>
      <div className="sidebar-sticky">
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
      </div>
    </nav>
  );
};

export default Sidebar;
