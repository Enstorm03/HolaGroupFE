import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/Layout/MainLayout';

// Sales & Admin (Từ GitHub - Đã Pull về)
import CustomerList from './features/sales/CustomerList';
import OrderManager from './features/admin/pages/OrderManagement';

// Kế toán (Accounting Module - Phát triển cục bộ)
import AccountingDashboard from './features/accounting/dashboard/index.jsx';
import InvoiceList from './features/accounting/invoices/index.jsx';
import InvoiceDetail from './features/accounting/invoices/invoice_details.jsx';
import DebtTracker from './features/accounting/debts/index.jsx';
import PaymentList from './features/accounting/payments/index.jsx';
import PaymentDetail from './features/accounting/payments/detail.jsx';
import AccountingReport from './features/accounting/reports/accounting/index.jsx';
import AccountingLayout from './features/accounting/components/Layout/AccountingLayout';
import TransactionDetail from './features/accounting/dashboard/TransactionDetail.jsx';
import StaffManagement from './features/staffs/StaffManagement.jsx';

// Kho hàng (Warehouse Module)
import WarehouseLayout from './features/warehouse/components/Layout/WarehouseLayout';
import WarehouseDashboard from './features/warehouse/pages/WarehouseDashboard';
import DeliveryOrders from './features/warehouse/pages/DeliveryOrders';
import DeliveryDetail from './features/warehouse/pages/DeliveryDetail';
import StockImport from './features/warehouse/pages/StockImport';
import InventoryReport from './features/warehouse/pages/InventoryReport';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Tuyến đường Sales & Admin sử dụng MainLayout (Cấu trúc mới từ GitHub) */}
      <Route path="/home" element={<MainLayout />}>
        {/* Đường dẫn mặc định khi vào /home */}
        <Route index element={<div className="p-4">Đây là trang Dashboard tổng quan</div>} />
        
        {/* Tuyến đường con: /home/customers và /home/orders */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="staffs" element={<StaffManagement />} />
      </Route>
      
      {/* Tuyến đường Kế toán sử dụng AccountingLayout (Phát triển cục bộ) */}
      <Route path="/accounting" element={<AccountingLayout />}>
        <Route index element={<AccountingDashboard />} />
        <Route path="sales-invoices" element={<InvoiceList />} />
        <Route path="sales-invoices/detail" element={<InvoiceDetail />} />
        <Route path="debts" element={<DebtTracker />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="payments/detail" element={<PaymentDetail />} />
        <Route path="reports" element={<AccountingReport />} />
        <Route path="transaction/:id" element={<TransactionDetail />} />
      </Route>

      {/* Tuyến đường Kho hàng sử dụng WarehouseLayout */}
      <Route path="/warehouse" element={<WarehouseLayout />}>
        <Route index element={<WarehouseDashboard />} />
        <Route path="delivery" element={<DeliveryOrders />} />
        <Route path="delivery/:id" element={<DeliveryDetail />} />
        <Route path="stock-import" element={<StockImport />} />
        <Route path="inventory" element={<InventoryReport />} />
      </Route>
    </Routes>
  );
}

export default App;