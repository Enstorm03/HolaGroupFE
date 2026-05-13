import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const WarehouseSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Tổng quan Kho', path: '/warehouse', icon: 'dashboard', exact: true },
    { name: 'Lệnh giao hàng', path: '/warehouse/delivery', icon: 'local_shipping' },
    { name: 'Nhập kho', path: '/warehouse/stock-import', icon: 'inventory_2' },
    { name: 'Báo cáo tồn kho', path: '/warehouse/inventory', icon: 'assessment' },
  ];

  const user = JSON.parse(localStorage.getItem('user')) || {
    firstName: 'User',
    lastName: 'Demo',
    email: 'user@example.com',
    roleName: 'Quản lý kho'
  };

  const fullName = `${user.lastName} ${user.firstName}`;
  const initials = `${user.lastName?.charAt(0) || ''}${user.firstName?.charAt(0) || ''}`.toUpperCase();

  return (
    <>
      {/* Backdrop for mobile & tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] xl:hidden animate-fade-in"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed xl:sticky top-0 left-0 h-screen w-72 wh-sidebar-bg flex flex-col shadow-2xl z-[110] xl:z-20 overflow-hidden transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        {/* Brand area */}
        <div className="relative overflow-hidden shrink-0" style={{ padding: 'var(--space-xxl) var(--space-lg)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <span className="material-symbols-outlined text-white text-2xl">inventory_2</span>
              </div>
              <div>
                <h2 className="text-white font-black text-xl tracking-tighter leading-none mb-1">HOLAGROUP</h2>
                <p className="text-blue-200/60 text-label-xs">Warehouse Module</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-none" style={{ padding: '0 var(--space-lg)' }}>
          <p className="text-label-xs text-blue-300/40" style={{ padding: '0 var(--space-base)', marginBottom: 'var(--space-base)' }}>Danh mục quản lý</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.exact}
              className={({ isActive }) => `
                group flex items-center gap-4 rounded-2xl transition-all duration-300 relative overflow-hidden
                ${isActive
                  ? 'bg-white text-slate-900 shadow-xl shadow-blue-900/40'
                  : 'text-blue-100/70 hover:bg-white/10 hover:text-white'}
              `}
              style={{ padding: 'var(--space-base) var(--space-lg)' }}
            >
              <span className="material-symbols-outlined text-xl transition-transform duration-500 group-hover:scale-110">{item.icon}</span>
              <span className="text-body-base font-bold">{item.name}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </NavLink>
          ))}

          {/* Nút quay lại hệ thống chính */}
          <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '0.0625rem solid rgba(255,255,255,0.1)' }}>
            <NavLink
              to="/home"
              className="group flex items-center gap-4 rounded-2xl transition-all duration-300 relative overflow-hidden text-blue-100/70 hover:bg-amber-400 hover:text-black"
              style={{ padding: 'var(--space-base) var(--space-lg)' }}
            >
              <span className="material-symbols-outlined text-xl transition-transform duration-500 group-hover:scale-110">home</span>
              <span className="text-body-base font-bold">Quay lại hệ thống</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-amber-400/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </NavLink>
          </div>
        </nav>

        {/* User profile section */}
        <div className="shrink-0 border-t border-white/10" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{fullName}</p>
              <p className="text-blue-200/60 text-xs truncate">{user.roleName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center text-blue-200/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default WarehouseSidebar;
