import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link và useLocation

const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại để làm sáng menu đang chọn

  return (
    <aside className="w-64 bg-[#00288E] text-white flex flex-col h-screen shrink-0 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 font-manrope font-bold text-2xl tracking-wider">
        HOLA GROUP
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <Link 
          to="/home" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname === '/home' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          📊 Bảng điều khiển
        </Link>
        
        {/* Nút bấm chuyển sang trang Khách hàng (Sales) */}
        <Link 
          to="/home/customers" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname === '/home/customers' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          💼 Sales (Khách hàng)
        </Link>

        {/* Các menu khác tạm thời trỏ về # hoặc các route bạn sẽ tạo sau */}
        <Link to="/home/orders"
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname === '/home/order' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          🛡️ order
        </Link>
        <Link to="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          📦 Warehouse
        </Link>
        <Link to="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          💰 Accounting
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;