import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/warehouse', label: 'Tổng quan Kho', icon: 'dashboard', exact: true },
  { path: '/warehouse/delivery', label: 'Lệnh giao hàng', icon: 'local_shipping' },
  { path: '/warehouse/stock-import', label: 'Nhập kho', icon: 'inventory_2' },
  { path: '/warehouse/inventory', label: 'Báo cáo tồn kho', icon: 'assessment' },
];

const WarehouseSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="wh-sidebar-overlay xl:hidden" onClick={onClose} />
      )}

      <aside className={`wh-sidebar flex flex-col shrink-0 ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-6">
          <h1 className="text-lg font-extrabold tracking-widest uppercase text-white">
            HOLA <span className="text-emerald-300">KHO</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/30 px-3 pt-2 pb-3">
            Quản lý kho hàng
          </p>

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`wh-nav-item ${isActive(item) ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-white/10 my-4" />

          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/30 px-3 pt-1 pb-3">
            Điều hướng
          </p>

          <Link to="/home" onClick={onClose} className="wh-nav-item">
            <span className="material-symbols-outlined text-xl">home</span>
            Trang chủ
          </Link>

          <Link to="/accounting" onClick={onClose} className="wh-nav-item">
            <span className="material-symbols-outlined text-xl">account_balance</span>
            Kế toán
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-sm font-bold">
              K
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">Nhân viên Kho</p>
              <p className="text-[10px] text-white/40 mt-0.5">warehouse@hola.vn</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default WarehouseSidebar;
