import React from 'react';

const DebtTable = ({ debts, loading, onReminder }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 w-full bg-slate-50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate" style={{ borderSpacing: '0 var(--space-sm)' }}>
        <thead>
          <tr>
            <th className="text-label-xs text-acc-text-light" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Khách Hàng</th>
            <th className="text-label-xs text-acc-text-light" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Đơn Hàng</th>
            <th className="text-label-xs text-acc-text-light text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Số Tiền Nợ</th>
            <th className="text-label-xs text-acc-text-light text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((item, index) => (
            <tr key={index} className="bg-white hover:bg-slate-50 border border-slate-100 shadow-sm rounded-2xl group transition-all">
              <td className="first:rounded-l-2xl" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-acc-primary flex items-center justify-center font-black text-label-xs border border-blue-100/50">
                    {item.customerID?.substring(0, 2)}
                  </div>
                  <span className="text-body-sm font-bold text-acc-text-main">{item.customerID}</span>
                </div>
              </td>
              <td style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <span className="text-label-xs text-acc-text-light bg-slate-100/50 border border-slate-100 px-3 py-1.5 rounded-lg font-black">
                  {item.orderID}
                </span>
              </td>
              <td className="text-right text-body-sm font-black text-acc-text-main" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                {item.remainingAmount?.toLocaleString()}₫
              </td>
              <td className="text-right last:rounded-r-2xl" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                <button 
                  onClick={() => onReminder(item)}
                  className="acc-btn-secondary px-6 py-2.5 rounded-xl text-label-xs font-black transition-all hover:shadow-md"
                >
                  Nhắc nợ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DebtTable;
