import React from 'react';

const InvoiceTable = ({ invoices, onSelect, selectedId, loading, isCompleted = false }) => {
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

  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hóa đơn</th>
            <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Khách hàng</th>
            <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
              {isCompleted ? 'Tổng hóa đơn' : 'Giá trị còn lại'}
            </th>
            <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
            <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const isSelected = selectedId === invoice.id;
            const remaining = (invoice.totalAmount || 0) - (invoice.paidAmount || 0);
            const displayValue = isCompleted ? invoice.totalAmount : remaining;

            return (
              <tr 
                key={invoice.id} 
                onClick={() => onSelect(invoice)}
                className={`group transition-all duration-500 cursor-pointer ${
                  isSelected 
                  ? 'bg-acc-primary ring-1 ring-acc-primary/10 shadow-[0_20px_40px_rgba(37,99,235,0.2)] scale-[1.01] -translate-y-1' 
                  : 'bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <td className={`px-8 py-5 first:rounded-l-[1.5rem] ${isSelected ? 'text-white' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tight">{invoice.id}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{invoice.orderID || 'Hợp đồng lẻ'}</span>
                  </div>
                </td>
                <td className={`px-8 py-5 text-right ${isSelected ? 'text-white' : ''}`}>
                   <div className="flex flex-col items-end">
                    <span className="text-sm font-black whitespace-nowrap">{invoice.customerName || invoice.customerID}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{invoice.date}</span>
                  </div>
                </td>
                <td className={`px-8 py-5 text-right tabular-nums ${isSelected ? 'text-white' : ''}`}>
                  <span className="text-sm font-black tracking-tight">{(displayValue || 0).toLocaleString()} <small className="text-[10px] opacity-70">VNĐ</small></span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm transition-colors ${
                    invoice.orderStatus === 'Đã thanh toán' 
                    ? 'bg-emerald-500 text-white' 
                    : (isSelected ? 'bg-white/20 text-white ring-1 ring-white/20' : 'bg-amber-100 text-amber-600')
                  }`}>
                    {invoice.orderStatus || 'Chờ thu'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right last:rounded-r-[1.5rem]">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ml-auto ${
                    isSelected ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-acc-primary bg-blue-50/50 group-hover:bg-acc-primary group-hover:text-white group-hover:shadow-lg shadow-acc-primary/20'
                  }`}>
                    <span className="material-symbols-outlined text-lg font-bold">
                      {isSelected ? 'check_circle' : 'payments'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
