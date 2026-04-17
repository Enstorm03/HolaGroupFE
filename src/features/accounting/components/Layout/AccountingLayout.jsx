import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountingSidebar from './AccountingSidebar';
import Header from '../../../../components/Layout/Header';
import { ToastProvider } from '../Common/AccountingToast';
import '../../styles/accounting.css';

const AccountingLayout = () => {
  return (
    <ToastProvider>
      <div className="accounting-module-wrapper flex h-screen overflow-hidden bg-acc-surface">
        <AccountingSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden relative"> 
            <div className="absolute inset-0 flex flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:max-w-[120rem] mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AccountingLayout;
