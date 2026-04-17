import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DashboardIcon, InvoiceIcon, RevenueIcon, DebtIcon, 
  ChartIcon, SettingsIcon, LogoutIcon 
} from './Icons/AccountingIcons';

const AccountingSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { name: 'Hóa đơn Sales', path: '/sales-invoices', icon: InvoiceIcon },
    { name: 'Thanh toán khách', path: '/payments', icon: RevenueIcon },
    { name: 'Quản lý Công nợ', path: '/debts', icon: DebtIcon },
    { name: 'Báo cáo Tài chính', path: '/reports', icon: ChartIcon },
  ];

  return (
    <aside className="w-80 acc-sidebar-bg h-screen sticky top-0 flex flex-col shadow-2xl z-20 overflow-hidden">
      {/* Brand area */}
      <div className="relative overflow-hidden" style={{ padding: 'var(--space-xxl) var(--space-lg)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <ChartIcon className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl tracking-tighter leading-none mb-1">HOLAGROUP</h2>
            <p className="text-blue-200/60 text-label-xs">Accounting Module</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2" style={{ padding: '0 var(--space-lg)' }}>
        <p className="text-label-xs text-blue-300/40" style={{ padding: '0 var(--space-base)', marginBottom: 'var(--space-base)' }}>Danh mục quản lý</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center gap-4 rounded-2xl transition-all duration-300 relative overflow-hidden
              ${isActive 
                ? 'bg-white text-acc-primary shadow-xl shadow-blue-900/40' 
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'}
            `}
            style={{ padding: 'var(--space-base) var(--space-lg)' }}
          >
            <item.icon className={`text-xl transition-transform duration-500 group-hover:scale-110`} />
            <span className="text-body-base font-bold">{item.name}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </NavLink>
        ))}
      </nav>

      {/* User & Action area */}
      <div style={{ padding: 'var(--space-lg)' }}>
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 relative overflow-hidden group" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-lg border border-white/20">
              HV
            </div>
            <div>
              <p className="text-white font-black text-body-sm tracking-tight text-acc-text-light">Huy Võ</p>
              <p className="text-blue-200/50 text-label-xs">Kế toán trưởng</p>
            </div>
          </div>
          
          <button className="w-full bg-white/10 hover:bg-white text-blue-100 hover:text-acc-primary py-3 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 group/btn border border-white/5 active:scale-95">
            <LogoutIcon className="text-lg rotate-180 group-hover/btn:translate-x-1 transition-transform" />
            <span className="text-label-xs font-black">Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AccountingSidebar;
