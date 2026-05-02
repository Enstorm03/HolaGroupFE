import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

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

        {/* THÊM MENU NHÂN SỰ VÀO ĐÂY */}
        <Link 
          to="/home/staffs" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/home/staff') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          👥 Nhân sự (Staff)
        </Link>
        
        <Link 
          to="/home/customers" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/home/customers') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          💼 Sales (Khách hàng)
        </Link>

        <Link to="/home/orders"
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/home/order') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          🛡️ Order
        </Link>

        <Link to="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          📦 Warehouse
        </Link>

        <Link 
          to="/accounting" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/accounting') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          💰 Accounting
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;