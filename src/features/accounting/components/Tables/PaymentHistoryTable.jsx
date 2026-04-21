import React, { useState, useMemo } from 'react';

const PaymentHistoryTable = ({ payments, loading, onPrint }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = useMemo(() => {
    if (!payments) return [];
    let sortableItems = [...payments];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [payments, sortConfig]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
        </div>
        <h3 className="text-acc-text-main font-black text-lg">Chưa có lịch sử thu tiền</h3>
        <p className="text-acc-text-muted text-sm max-w-xs mt-1">Các giao dịch thu tiền sau khi xác nhận sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <span className="material-symbols-outlined text-[12px] ml-1 opacity-0 group-hover/th:opacity-100 transition-opacity" aria-hidden="true">unfold_more</span>;
    return (
      <span className="material-symbols-outlined text-[14px] ml-1 text-acc-primary font-bold" aria-hidden="true">
        {sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <table className="acc-responsive-table w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-label-xs text-acc-text-light uppercase tracking-widest">
            <th 
              className="px-6 py-4 text-left font-black whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors group/th"
              onClick={() => handleSort('id')}
            >
              <div className="flex items-center">Phiếu thu {renderSortIcon('id')}</div>
            </th>
            <th className="px-6 py-4 text-left font-black whitespace-nowrap">Ngày thu</th>
            <th 
              className="px-6 py-4 text-left font-black capitalize whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors group/th"
              onClick={() => handleSort('customerName')}
            >
              <div className="flex items-center">Khách hàng / Hóa đơn {renderSortIcon('customerName')}</div>
            </th>
            <th 
              className="px-6 py-4 text-right font-black whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors group/th"
              onClick={() => handleSort('amount')}
            >
              <div className="flex items-center justify-end">Số tiền {renderSortIcon('amount')}</div>
            </th>
            <th className="px-6 py-4 text-center font-black whitespace-nowrap">Phương thức</th>
            <th className="px-6 py-4 text-center font-black whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedPayments.map((payment) => (
            <tr 
              key={payment.paymentID} 
              className="acc-table-row group bg-white hover:bg-blue-50/30 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4" data-label="Phiếu thu">
                <div className="flex flex-col">
                  <span className="text-body-sm font-black text-acc-text-main">{payment.displayID}</span>
                  <span className="text-[10px] text-acc-text-muted font-bold">Xác nhận: {payment.recordedBy || 'Hệ thống'}</span>
                </div>
              </td>
              <td className="px-6 py-4" data-label="Ngày thu">
                <span className="text-body-sm font-bold text-acc-text-main">
                  {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                </span>
              </td>
              <td className="px-6 py-4" data-label="Khách hàng / Hóa đơn">
                <div className="flex flex-col items-start md:items-start">
                  <span className="text-body-sm font-black text-acc-primary">{payment.displayInvoiceID}</span>
                  <span className="text-[10px] text-acc-text-muted font-medium">{payment.customerName || 'Khách hàng lẻ'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap" data-label="Số tiền">
                <span className="text-body-sm font-black text-acc-text-main">
                  {payment.amount?.toLocaleString('vi-VN')} <small className="text-[10px] opacity-70 font-bold">₫</small>
                </span>
              </td>
              <td className="px-6 py-4 text-center" data-label="Phương thức">
                <span className={`acc-badge text-[10px] font-black border whitespace-nowrap ${
                  payment.paymentMethod === 'Tiền mặt' ? 'bg-green-50 text-green-600 border-green-100' :
                  payment.paymentMethod === 'Chuyển khoản' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-purple-50 text-purple-600 border-purple-100'
                }`}>
                  {payment.paymentMethod === 'Tiền mặt' ? 'TIỀN MẶT' : 
                   payment.paymentMethod === 'Chuyển khoản' ? 'CHUYỂN KHOẢN' : 'THẺ / POS'}
                </span>
              </td>
              <td className="px-6 py-4 text-center" data-label="Thao tác">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrint(payment);
                  }}
                  aria-label="In phiếu thu"
                  className="w-8 h-8 rounded-lg bg-blue-50 text-acc-primary hover:bg-acc-primary hover:text-white transition shadow-sm flex items-center justify-center mx-auto"
                 >
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">print</span>
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryTable;
