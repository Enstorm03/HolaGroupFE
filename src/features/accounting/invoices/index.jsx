import React, { useState, useEffect } from 'react';
import '../styles/accounting.css';
import accountingService from '../services/accountingService';

const InvoiceList = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await accountingService.getInvoices();
        setInvoices(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.error("Invoices Fetch Error:", err);
        setError("Lỗi kết nối API lấy danh sách hóa đơn.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-up" style={{ gap: 'var(--space-lg)' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0 px-1">
        <div className="space-y-1">
          <h1 className="text-acc-text-main leading-tight font-black" style={{ fontSize: '2rem' }}>Hóa đơn Bán hàng</h1>
          <p className="text-base text-acc-text-muted font-medium">Quản lý và theo dõi danh sách hóa đơn từ đơn hàng</p>
        </div>
        <button className="acc-btn-primary group shadow-lg shadow-blue-800/10 text-label-xs py-2.5">
          <span className="material-symbols-outlined text-lg">add</span>
          Tạo hóa đơn
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-acc-error rounded-2xl flex items-center gap-4 transition-all" style={{ padding: 'var(--space-base) var(--space-lg)' }}>
          <span className="material-symbols-outlined text-xl">error</span>
          <p className="text-body-sm font-bold">{error}</p>
        </div>
      )}

      {/* Invoices Table */}
      <div className="acc-card flex-1 min-h-0 flex flex-col overflow-hidden border-none shadow-float">
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="text-label-xs text-acc-text-muted" style={{ padding: 'var(--space-md) var(--space-xl)' }}>Mã Đơn hàng/HĐ</th>
                <th className="text-label-xs text-acc-text-muted" style={{ padding: 'var(--space-md) var(--space-xl)' }}>Khách hàng</th>
                <th className="text-label-xs text-acc-text-muted text-right" style={{ padding: 'var(--space-md) var(--space-xl)' }}>Tổng tiền</th>
                <th className="text-label-xs text-acc-text-muted text-center" style={{ padding: 'var(--space-md) var(--space-xl)' }}>Trạng thái</th>
                <th className="text-label-xs text-acc-text-muted text-right" style={{ padding: 'var(--space-md) var(--space-xl)' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                      <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <td className="text-body-sm font-bold text-acc-primary" style={{ padding: 'var(--space-base) var(--space-xl)' }}>
                      {inv.orderID || inv.id}
                    </td>
                    <td className="text-body-sm font-medium text-acc-text-main" style={{ padding: 'var(--space-base) var(--space-xl)' }}>
                      {inv.customerID || "Chưa xác định"}
                    </td>
                    <td className="text-body-sm font-black text-acc-text-main text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>
                      {inv.totalAmount?.toLocaleString() || 0}₫
                    </td>
                    <td className="text-center" style={{ padding: 'var(--space-base) var(--space-xl)' }}>
                      <span className="acc-badge bg-white shadow-sm text-acc-text-muted border border-slate-100">
                        {inv.orderStatus || "Pending"}
                      </span>
                    </td>
                    <td className="text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>
                      <button className="text-label-xs text-acc-accent font-black hover:bg-acc-accent hover:text-white px-4 py-2 rounded-xl transition-all">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: 'var(--space-xxl) 0' }}>
                    <div className="flex flex-col items-center gap-4 opacity-20">
                       <span className="material-symbols-outlined text-6xl">inventory_2</span>
                       <p className="text-label-xs text-acc-text-muted">Không có dữ liệu hóa đơn</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
