import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountingSidebar from './AccountingSidebar';
import { ToastProvider } from './AccountingToast';
import '../styles/accounting.css';

const AccountingLayout = () => {
  return (
    <ToastProvider>
      <div className="accounting-module-wrapper flex overflow-hidden bg-acc-surface">
        <AccountingSidebar />
        <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
          <div className="mx-auto" style={{ padding: 'var(--space-xl)', maxWidth: '100rem' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
};

export default AccountingLayout;
