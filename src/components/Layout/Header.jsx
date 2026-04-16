import React from 'react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Bên trái Header: Nút menu mobile & Tìm kiếm */}
      
      <div className="flex items-center gap-4">
        
        {/* <button className="text-gray-500 hover:text-[#00288E] p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button> */}
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Tìm kếm..." 
            className="pl-10 pr-4 py-2 w-64 bg-[#f2f4f6] border border-transparent rounded-lg text-sm text-[#191c1e] focus:border-[#00288E] focus:bg-white outline-none transition-all"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Bên phải Header: Thông báo & Profile */}
      <div className="flex items-center gap-5">
        <button className="relative text-gray-500 hover:text-[#00288E] transition-colors">
          🔔
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#00288E] text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#191c1e] leading-none">Admin User</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-none">Quản trị viên</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;