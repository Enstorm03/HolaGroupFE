import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/Layout/MainLayout';

// Sales & Admin (Tạm thời comment để không lỗi cho đến khi bạn Git Pull xong)
// import CustomerList from './features/sales/CustomerList';
// import OrderManager from './features/admin/pages/OrderManagement';

// Kế toán (Accounting Module - Phát triển cục bộ)
import AccountingDashboard from './features/accounting/dashboard/index.jsx';
import InvoiceList from './features/accounting/invoices/index.jsx';
import InvoiceDetail from './features/accounting/invoices/invoice_details.jsx';
import DebtTracker from './features/accounting/debts/index.jsx';
import PaymentList from './features/accounting/payments/index.jsx';
import PaymentDetail from './features/accounting/payments/detail.jsx';
import AccountingReport from './features/accounting/reports/accounting/index.jsx';
import AccountingLayout from './features/accounting/components/AccountingLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Tuyến đường Sales & Admin (Tạm thời dùng Placeholder) */}
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<div className="p-4">Đây là trang Dashboard tổng quan</div>} />
        <Route path="customers" element={<div className="p-4 text-acc-text-muted italic">Đang chờ Pull dữ liệu Sales từ GitHub...</div>} />
        <Route path="orders" element={<div className="p-4 text-acc-text-muted italic">Đang chờ Pull dữ liệu Admin từ GitHub...</div>} />
      </Route>
      
      {/* Tuyến đường Kế toán sử dụng AccountingLayout (Phát triển cục bộ) */}
      <Route element={<AccountingLayout />}>
        <Route path="/dashboard" element={<AccountingDashboard />} />
        <Route path="/sales-invoices" element={<InvoiceList />} />
        <Route path="/sales-invoices/detail" element={<InvoiceDetail />} />
        <Route path="/debts" element={<DebtTracker />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payments/detail" element={<PaymentDetail />} />
        <Route path="/reports" element={<AccountingReport />} />
      </Route>
    </Routes>
  );
}

export default App;