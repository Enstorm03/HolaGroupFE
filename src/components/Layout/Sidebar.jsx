import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#00288E] text-white flex flex-col h-screen shrink-0 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 font-manrope font-bold text-2xl tracking-wider">
        HOLA GROUP
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <a href="#" className="block px-4 py-3 rounded-lg bg-white/15 text-white font-medium transition-colors">
          📊 Bảng điều khiển
        </a>
        <a href="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          🛡️ Admin
        </a>
        <a href="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          💼 Sales
        </a>
        <a href="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          📦 Warehouse
        </a>
        <a href="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          💰 Accounting
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;