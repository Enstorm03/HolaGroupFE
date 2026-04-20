import React from 'react';

const PaymentHistoryTable = ({ payments, loading }) => {
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

  return (
    <div className="w-full overflow-x-auto">
      <table className="acc-responsive-table w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-label-xs text-acc-text-light uppercase tracking-widest">
            <th className="px-6 py-4 text-left font-black">Phiếu thu</th>
            <th className="px-6 py-4 text-left font-black">Ngày thu</th>
            <th className="px-6 py-4 text-left font-black">Khách hàng / Hóa đơn</th>
            <th className="px-6 py-4 text-right font-black">Số tiền</th>
            <th className="px-6 py-4 text-center font-black">Phương thức</th>
            <th className="px-6 py-4 text-center font-black">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr 
              key={payment.id} 
              className="acc-table-row group bg-white hover:bg-blue-50/30 transition-all cursor-pointer"
            >
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex flex-col">
                  <span className="text-body-sm font-black text-acc-text-main">#{payment.id || `PT-${payment.id?.toString().padStart(5, '0')}`}</span>
                  <span className="text-[10px] text-acc-text-muted font-bold">Xác nhận: {payment.recordedBy || 'Hệ thống'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-body-sm font-bold text-acc-text-main">
                  {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-body-sm font-black text-acc-primary">#{payment.invoiceId}</span>
                  <span className="text-[10px] text-acc-text-muted font-medium">{payment.customerName || 'Khách hàng lẻ'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-body-sm font-black text-acc-text-main">
                  {payment.amount?.toLocaleString()} ₫
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`acc-badge text-[10px] font-black border ${
                  payment.method === 'Cash' ? 'bg-green-50 text-green-600 border-green-100' :
                  payment.method === 'Transfer' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-purple-50 text-purple-600 border-purple-100'
                }`}>
                  {payment.method === 'Cash' ? 'TIỀN MẶT' : 
                   payment.method === 'Transfer' ? 'CHUYỂN KHOẢN' : 'THẺ / POS'}
                </span>
              </td>
              <td className="px-6 py-4 rounded-r-2xl text-center">
                 <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-acc-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">print</span>
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
