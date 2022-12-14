import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import CashRegisterPage from './pages/cashRegister';
import ProductsPage from './pages/products';
import SalesPage from './pages/sales';
import ReportingPage from './pages/reporting';

export default function App() {
  return (
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
  );
}
