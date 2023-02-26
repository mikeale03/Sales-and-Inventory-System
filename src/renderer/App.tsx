import { useMemo, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { IUser } from 'globalTypes/dbApi/users.types';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import CashRegisterPage from './pages/cashRegister';
import ProductsPage from './pages/products';
import SalesPage from './pages/sales';
import ReportingPage from './pages/reporting';
import UserContext from './context/userContext';

export default function App() {
  const [user, setUser] = useState<IUser | undefined>();
  return (
    <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />}>
            <Route index element={<CashRegisterPage />} />
            <Route path="cash-register" element={<CashRegisterPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="reporting" element={<ReportingPage />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </UserContext.Provider>
  );
}
