import { useMemo, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { User } from 'globalTypes/realm/user.types';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import CashRegisterPage from './pages/cashRegister';
import ProductsPage from './pages/products';
import SalesPage from './pages/sales';
import ReportsPage from './pages/reports';
import ActivitiesPage from './pages/activities';
import UserContext from './context/userContext';
import AdminPage from './pages/admin';
import UsersPage from './pages/admin/users';
import GcashRegisterPage from './pages/gcashRegister';
import GcashTransactionsPage from './pages/gcashTransactions';
import FilterContext, { Filter, GcashFilter } from './context/filterContext';
import ExpensesPage from './pages/expenses';
import CategoriesPage from './pages/admin/categories';
import TagsPage from './pages/admin/tags';
import VoidCodePage from './pages/admin/voidCode';

export default function App() {
  const [user, setUser] = useState<User | undefined>();
  const [salesFilter, setSalesFilter] = useState<Filter>({
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    category: '',
    tags: [],
  });
  const [gcashTransFilter, setGcashTransFilter] = useState<GcashFilter>({
    selectedDate: new Date(),
    userOption: '',
    selectedPeriod: 'Daily',
    selectedDateFilter: 'Date Transacted',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });
  console.dir(salesFilter);

  return (
    <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
      <FilterContext.Provider
        value={useMemo(
          () => ({
            salesFilter,
            setSalesFilter,
            gcashTransFilter,
            setGcashTransFilter,
          }),
          [salesFilter, gcashTransFilter]
        )}
      >
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />}>
              <Route path="cash-register" element={<CashRegisterPage />} />
              <Route path="gcash-register" element={<GcashRegisterPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route
                path="gcash-transactions"
                element={<GcashTransactionsPage />}
              />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="activities" element={<ActivitiesPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin/users" element={<UsersPage />} />
              <Route path="admin/categories" element={<CategoriesPage />} />
              <Route path="admin/tags" element={<TagsPage />} />
              <Route path="admin/void-code" element={<VoidCodePage />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </FilterContext.Provider>
    </UserContext.Provider>
  );
}
