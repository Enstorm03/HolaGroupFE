import React, { useState, useMemo } from 'react';

const PaymentHistoryTable = ({ payments, loading, onPrint }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'paymentDate', direction: 'desc' });

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
        let aValue, bValue;

        if (sortConfig.key === 'displayID') {
          aValue = Number(a.paymentID) || 0;
          bValue = Number(b.paymentID) || 0;
        } else if (sortConfig.key === 'displayInvoiceID') {
          aValue = Number(a.invoiceID) || 0;
          bValue = Number(b.invoiceID) || 0;
        } else if (sortConfig.key === 'paymentDate') {
          aValue = new Date(a.paymentDate).getTime();
          bValue = new Date(b.paymentDate).getTime();
        } else {
          aValue = a[sortConfig.key] || '';
          bValue = b[sortConfig.key] || '';
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

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
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 w-full bg-slate-50/50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100/50">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-slate-200">history</span>
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Chưa có lịch sử giao dịch</p>
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
    <div className="bg-white rounded-[2rem] flex flex-col overflow-hidden animate-fade-up">
      <div className="flex-1 overflow-auto no-scrollbar">
        <table className="w-full text-left border-collapse relative acc-responsive-table">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-20">
            <tr>
              <th 
                className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-100 group/th transition-colors"
                onClick={() => handleSort('displayID')}
              >
                <div className="flex items-center">Phiếu thu {renderSortIcon('displayID')}</div>
              </th>
              <th 
                className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-100 group/th transition-colors"
                onClick={() => handleSort('paymentDate')}
              >
                <div className="flex items-center">Ngày thu {renderSortIcon('paymentDate')}</div>
              </th>
              <th 
                className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-100 group/th transition-colors"
                onClick={() => handleSort('displayInvoiceID')}
              >
                <div className="flex items-center">Khách hàng / Mã hóa đơn {renderSortIcon('displayInvoiceID')}</div>
              </th>
              <th 
                className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left cursor-pointer hover:bg-slate-100 group/th transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">Số tiền {renderSortIcon('amount')}</div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Phương thức</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedPayments.map((payment) => (
              <tr 
                key={payment.paymentID} 
                className="group bg-white hover:bg-slate-50/80 even:bg-slate-50/50 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <td className="px-8 py-5" data-label="Phiếu thu">
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tight m-0">{payment.displayID}</span>
                    <span className="text-[10px] text-slate-400 font-bold m-0">Xác nhận: {payment.recordedBy || 'Hệ thống'}</span>
                  </div>
                </td>
                <td className="px-8 py-5" data-label="Ngày thu">
                  <span className="text-sm font-bold text-acc-text-main m-0">
                    {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                  </span>
                </td>
                <td className="px-8 py-5" data-label="Khách hàng / Mã hóa đơn">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black text-acc-primary m-0">{payment.displayInvoiceID}</span>
                    <div className="flex flex-col">
                      <span className="text-body-base text-slate-400 font-bold m-0">{payment.customerName || 'Khách hàng lẻ'}</span>
                      <span className="text-[10px] text-slate-400 font-bold md:hidden m-0">{new Date(payment.paymentDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-left tabular-nums whitespace-nowrap" data-label="Số tiền">
                  <span className="text-sm font-black tracking-tighter m-0">
                    {payment.amount?.toLocaleString('vi-VN')} <small className="text-[10px] opacity-70 font-bold">VNĐ</small>
                  </span>
                </td>
                <td className="px-8 py-5 text-center" data-label="Phương thức">
                  <span className={`acc-badge text-[10px] font-black border whitespace-nowrap px-3 py-1 rounded-full ${
                    payment.paymentMethod === 'CASH' ? 'bg-green-50 text-green-600 border-green-100' :
                    payment.paymentMethod === 'TRANSFER' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {payment.paymentMethod === 'CASH' ? 'TIỀN MẶT' : 
                     payment.paymentMethod === 'TRANSFER' ? 'CHUYỂN KHOẢN' : 'THẺ / POS'}
                  </span>
                </td>
                <td className="px-8 py-5 text-center" data-label="Thao tác">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrint(payment);
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-acc-primary hover:text-white hover:shadow-lg transition-all mx-auto"
                    title="In phiếu thu"
                  >
                    <span className="material-symbols-outlined text-lg font-bold">print</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
