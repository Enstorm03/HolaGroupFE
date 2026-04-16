import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import CustomerList from './features/sales/CustomerList';

function App() {
  return (
    // <Routes>
    //   {/* Trang Đăng nhập */}
    //   <Route path="/" element={<LoginPage />} />

    //   {/* Trang chủ (có thể để trống hoặc làm một trang Dashboard riêng sau) */}
    //   <Route 
    //     path="/home" 
    //     element={
    //       <MainLayout>
    //         <div className="p-4">Đây là trang Dashboard tổng quan</div>
    //       </MainLayout>
          
    //     } 
    //   />

    //   {/* THÊM DÒNG NÀY: Khai báo đường dẫn cho trang Khách hàng */}
    //   <Route 
    //     path="/home/customers" 
    //     element={
    //       <MainLayout>
    //         <CustomerList />
    //       </MainLayout>
    //     } 
    //   />
    // </Routes>
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Tuyến đường cha: /home. Bất cứ đường dẫn nào bắt đầu bằng /home đều sẽ có MainLayout */}
      <Route path="/home" element={<MainLayout />}>
        
        {/* Đường dẫn mặc định khi vào /home (thường gọi là index) */}
        <Route index element={<div className="p-4">Đây là trang Dashboard tổng quan</div>} />
        
        {/* Tuyến đường con: /home/customers */}
        <Route path="customers" element={<CustomerList />} />

      </Route>
    </Routes>
  );
}

export default App;