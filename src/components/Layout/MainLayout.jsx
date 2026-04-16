import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#f7f9fb] font-sans overflow-hidden">
      {/* Bên trái: Sidebar cố định */}
      <Sidebar />

      {/* Bên phải: Nội dung chính */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header cố định trên cùng */}
        <Header />

        {/* Vùng chứa nội dung có thể cuộn (Scrollable Area) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 flex flex-col">
          <Breadcrumb />
          
          {/* Khu vực render nội dung của từng trang riêng biệt (children) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            {children}
            
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;