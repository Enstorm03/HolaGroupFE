import React from 'react';

const InvoiceTable = ({ invoices, onSelect, selectedId, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 w-full bg-slate-50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">inventory_2</span>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Không có hóa đơn nào chờ thu</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate" style={{ borderSpacing: '0 var(--space-sm)' }}>
        <thead>
          <tr>
            <th className="text-label-xs text-acc-text-light" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Mã Hóa Đơn</th>
            <th className="text-label-xs text-acc-text-light text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Tổng Tiền</th>
            <th className="text-label-xs text-acc-text-light text-center" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Trạng Thái Th.Toán</th>
            <th className="text-label-xs text-acc-text-light text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr 
              key={invoice.id} 
              onClick={() => onSelect(invoice)}
              className={`group transition-all cursor-pointer ${
                selectedId === invoice.id 
                ? 'bg-acc-primary shadow-float-lg scale-[1.01]' 
                : 'bg-white hover:bg-slate-50 border border-slate-100 shadow-sm'
              }`}
            >
              <td className={`text-body-sm font-bold first:rounded-l-2xl ${selectedId === invoice.id ? 'text-white' : 'text-acc-primary'}`} style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                {invoice.id}
              </td>
              <td className={`text-body-sm font-black text-right ${selectedId === invoice.id ? 'text-white' : 'text-acc-text-main'}`} style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                {invoice.totalAmount?.toLocaleString()}₫
              </td>
              <td className="text-center" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <span className={`px-4 py-1.5 rounded-full text-label-xs shadow-sm ${
                  invoice.paymentStatus === 'Paid' 
                  ? 'bg-emerald-500 text-white' 
                  : (selectedId === invoice.id ? 'bg-white/20 text-white border border-white/20' : 'bg-amber-100 text-amber-600')
                }`}>
                  {invoice.paymentStatus === 'Paid' ? 'Đã thu' : 'Chờ thu'}
                </span>
              </td>
              <td className="text-right last:rounded-r-2xl" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ml-auto ${
                  selectedId === invoice.id ? 'bg-white/20 text-white' : 'text-acc-primary bg-blue-50/50 group-hover:bg-acc-primary group-hover:text-white'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {selectedId === invoice.id ? 'check_circle' : 'chevron_right'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
