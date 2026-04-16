import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import CustomerList from './features/sales/CustomerList';

function App() {
  return (
    <Routes>
      {/* Trang Đăng nhập */}
      <Route path="/" element={<LoginPage />} />

      {/* Trang chủ (có thể để trống hoặc làm một trang Dashboard riêng sau) */}
      <Route 
        path="/home" 
        element={
          <MainLayout>
            <div className="p-4">Đây là trang Dashboard tổng quan</div>
          </MainLayout>
        } 
      />

      {/* THÊM DÒNG NÀY: Khai báo đường dẫn cho trang Khách hàng */}
      <Route 
        path="/customers" 
        element={
          <MainLayout>
            <CustomerList />
          </MainLayout>
        } 
      />
    </Routes>
  );
}

export default App;