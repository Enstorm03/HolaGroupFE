import React, { useState, useEffect } from 'react';
import { useToast } from '../components/AccountingToast';
import accountingService from '../services/accountingService';
import DebtTable from '../components/Tables/DebtTable';
import '../styles/accounting.css';

const DebtTracker = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await accountingService.getDebtReport();
        setDebts(data.data || []);
        setSummary(data.summary);
      } catch (err) {
        console.error("Debt API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReminder = (item) => {
    showToast(`Đã gửi nhắc nợ tới KH: ${item.customerID}`, "success");
  };

  return (
    <div className="space-y-6 animate-fade-up" style={{ paddingBottom: 'var(--space-xl)' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-display-sm text-acc-text-main">Quản lý Công nợ</h1>
          <p className="text-body-sm text-acc-text-muted">Theo dõi và nhắc nhở khách hàng về các khoản nợ quá hạn.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-lg)' }}>
        <div className="acc-card group shadow-float" style={{ padding: 'var(--space-lg)' }}>
          <p className="text-label-xs text-acc-text-light" style={{ marginBottom: 'var(--space-base)' }}>Tổng nợ phải thu</p>
          <div className="flex items-center justify-between">
            <h3 className="text-display-sm text-acc-text-main">{loading ? "---" : summary?.totalDebt}</h3>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-acc-primary flex items-center justify-center border border-blue-100/50 shadow-inner group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
          </div>
        </div>
        
        <div className="acc-card group shadow-float" style={{ padding: 'var(--space-lg)' }}>
          <p className="text-label-xs text-acc-error" style={{ marginBottom: 'var(--space-base)' }}>Nợ quá hạn</p>
          <div className="flex items-center justify-between">
            <h3 className="text-display-sm text-acc-error">{loading ? "---" : summary?.overdueDebt}</h3>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-acc-error flex items-center justify-center border border-red-100 shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">error_outline</span>
            </div>
          </div>
        </div>

        <div className="acc-card group shadow-float border-acc-accent/10" style={{ padding: 'var(--space-lg)' }}>
          <p className="text-label-xs text-acc-text-light" style={{ marginBottom: 'var(--space-base)' }}>Số lượng khách hàng</p>
          <div className="flex items-center justify-between">
            <h3 className="text-display-sm text-acc-text-main">{loading ? "---" : summary?.customerCount}</h3>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="acc-card min-h-[400px]" style={{ padding: 'var(--space-lg)' }}>
        <h3 className="text-label-xs text-acc-text-main" style={{ marginBottom: 'var(--space-lg)' }}>Chi tiết nợ từng khách hàng</h3>
        <DebtTable 
          debts={debts}
          loading={loading}
          onReminder={handleReminder}
        />
      </div>
    </div>
  );
};

export default DebtTracker;
