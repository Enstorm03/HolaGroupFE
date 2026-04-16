import React from 'react';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <>
      {/* Tạm ẩn trang Login */}
      {/* <LoginPage /> */}

      {/* Hiển thị Layout chính */}
      <MainLayout>
        {/* Bất cứ thứ gì bạn viết ở đây sẽ chui vào vùng trắng giữa màn hình (phần {children}) */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Xin chào Admin!</h1>
          <p className="text-gray-600">Đây là khu vực nội dung chính. Sau này các biểu đồ, danh sách sản phẩm, table sẽ được đặt ở đây.</p>
        </div>
      </MainLayout>
    </>
  )
}

export default App;