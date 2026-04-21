import React, { useState, useMemo } from 'react';

const InvoiceTable = ({ invoices, onSelect, selectedId, loading, isCompleted = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = useMemo(() => {
    if (!invoices) return [];
    let sortableItems = [...invoices];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === 'value') {
          const aRemaining = (a.totalAmount || 0) - (a.paidAmount || 0);
          const bRemaining = (b.totalAmount || 0) - (b.paidAmount || 0);
          aValue = isCompleted ? (a.totalAmount || 0) : aRemaining;
          bValue = isCompleted ? (b.totalAmount || 0) : bRemaining;
        } else {
          aValue = a[sortConfig.key] || '';
          bValue = b[sortConfig.key] || '';
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
  }, [invoices, sortConfig, isCompleted]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 w-full bg-slate-50/50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100/50">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-slate-200">inventory_2</span>
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Không có hóa đơn nào chờ thu</p>
        <p className="text-xs text-slate-300 mt-2 font-medium">Tất cả công nợ đã được quyết toán sạch sẽ!</p>
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
    <div className="overflow-x-auto no-scrollbar">
      {/* 
          NOTE KỸ THUẬT: KHÔNG ĐƯỢC CHỈNH SỬA CODE PLATFORM DESKTOP. 
          Table này sử dụng class chuyên dụng .acc-responsive-table 
          đã được cấu hình Card View trong accounting.css cho Mobile.
      */}
      <table className="acc-responsive-table w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th 
              className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap cursor-pointer hover:bg-slate-50/50 transition-colors group/th"
              onClick={() => handleSort('id')}
            >
              <div className="flex items-center">Hóa đơn {renderSortIcon('id')}</div>
            </th>
            <th 
              className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap cursor-pointer hover:bg-slate-50/50 transition-colors group/th"
              onClick={() => handleSort('customerName')}
            >
              <div className="flex items-center justify-end">Khách hàng {renderSortIcon('customerName')}</div>
            </th>
            <th 
              className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap cursor-pointer hover:bg-slate-50/50 transition-colors group/th"
              onClick={() => handleSort('value')}
            >
              <div className="flex items-center justify-end">
                {isCompleted ? 'Tổng hóa đơn' : 'Giá trị còn lại'} {renderSortIcon('value')}
              </div>
            </th>
            <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center whitespace-nowrap">Trạng thái</th>
            {!isCompleted && <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {sortedInvoices.map((invoice) => {
            const isSelected = selectedId === invoice.invoiceID;
            const remaining = (invoice.totalAmount || 0) - (invoice.paidAmount || 0);
            const displayValue = isCompleted ? invoice.totalAmount : remaining;

            return (
              <tr 
                key={invoice.invoiceID} 
                onClick={() => onSelect(invoice)}
                className={`group transition duration-300 cursor-pointer ${
                  isSelected 
                  ? 'bg-acc-primary ring-1 ring-acc-primary/10 shadow-[0_20px_40px_rgba(37,99,235,0.2)] lg:scale-[1.01] lg:-translate-y-1' 
                  : 'bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md lg:hover:-translate-y-0.5'
                }`}
              >
                <td className={`px-8 py-5 ${isSelected ? 'text-white' : ''}`} data-label="Mã GD">
                  <div className="flex flex-col">
                    <p className="text-sm font-black tracking-tight m-0">{invoice.displayID}</p>
                    <p className={`text-[10px] font-bold m-0 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{invoice.displayOrderID || 'Hợp đồng lẻ'}</p>
                  </div>
                </td>
                <td className={`px-8 py-5 md:text-right text-left ${isSelected ? 'text-white' : ''}`} data-label="Khách hàng">
                   <div className="flex flex-col md:items-end items-start">
                    <p className="text-sm font-black whitespace-nowrap m-0">{invoice.customerName || invoice.customerID}</p>
                    <p className={`text-[10px] font-bold m-0 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{invoice.date}</p>
                  </div>
                </td>
                <td className={`px-8 py-5 text-right tabular-nums whitespace-nowrap ${isSelected ? 'text-white' : ''}`} data-label="Giá trị">
                  <span className="text-sm font-black tracking-tighter">{(displayValue || 0).toLocaleString('vi-VN')} <small className="text-[10px] opacity-70 font-bold">VNĐ</small></span>
                </td>
                <td className={`px-8 py-5 text-center`} data-label="Trạng thái">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm transition-colors whitespace-nowrap ${
                    invoice.orderStatus === 'Đã thanh toán' 
                    ? 'bg-emerald-500 text-white' 
                    : (isSelected ? 'bg-white/20 text-white ring-1 ring-white/20' : 'bg-amber-100 text-amber-600')
                  }`}>
                    {invoice.orderStatus || 'Chờ thu'}
                  </span>
                </td>
                {!isCompleted && (
                  <td className="px-8 py-5 text-right" data-label="Thao tác">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ml-auto ${
                      isSelected ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-acc-primary bg-blue-50/50 group-hover:bg-acc-primary group-hover:text-white group-hover:shadow-lg shadow-acc-primary/20'
                    }`}>
                      <span className="material-symbols-outlined text-lg font-bold" aria-hidden="true">
                        {isSelected ? 'check_circle' : 'payments'}
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
