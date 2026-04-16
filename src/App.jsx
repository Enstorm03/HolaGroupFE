import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/Layout/MainLayout';

// Kế toán (Accounting Module)
import AccountingDashboard from './features/accounting/dashboard/index.jsx';
import InvoiceList from './features/accounting/invoices/index.jsx';
import InvoiceDetail from './features/accounting/invoices/invoice_details.jsx';
import DebtTracker from './features/accounting/debts/index.jsx';
import PaymentList from './features/accounting/payments/index.jsx';
import PaymentDetail from './features/accounting/payments/detail.jsx';
import AccountingReport from './features/accounting/reports/accounting/index.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<MainLayout />} />
      
      {/* Routes Kế toán */}
      <Route path="/dashboard" element={<AccountingDashboard />} />
      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/invoices/detail" element={<InvoiceDetail />} />
      <Route path="/debts" element={<DebtTracker />} />
      <Route path="/payments" element={<PaymentList />} />
      <Route path="/payments/detail" element={<PaymentDetail />} />
      <Route path="/reports/accounting" element={<AccountingReport />} />
    </Routes>
  );
}

export default App;