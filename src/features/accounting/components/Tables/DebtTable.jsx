import React from 'react';

// ─── Display helpers (SQL-aligned) ───────────────────────────────────────────
const RISK_CONFIG = {
  critical: { bg: 'bg-red-50',    text: 'text-red-600',      label: 'Rất nguy cấp', icon: 'priority_high' },
  high:     { bg: 'bg-orange-50', text: 'text-orange-600',   label: 'Cảnh báo cao', icon: 'warning'       },
  medium:   { bg: 'bg-blue-50',   text: 'text-acc-primary',  label: 'Cần theo dõi', icon: 'info'          },
};

const DebtTable = ({ debts, loading, onReminder }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 w-full bg-slate-50 rounded-[2rem]"></div>
        ))}
      </div>
    );
  }

  if (!debts || debts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-acc-text-light opacity-50 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-6xl mb-4" aria-hidden="true">sentiment_satisfied</span>
        <p className="font-black text-label-xs uppercase tracking-widest">Không tìm thấy khoản nợ phù hợp</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left border-separate acc-responsive-table" style={{ borderSpacing: '0 0.75rem' }}>
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            <th className="text-label-xs text-acc-text-light px-8 py-4">Khách Hàng</th>
            <th className="text-label-xs text-acc-text-light px-8 py-4">Chứng từ / Quá hạn</th>
            <th className="text-label-xs text-acc-text-light text-right px-8 py-4">Số Tiền Nợ</th>
            <th className="text-label-xs text-acc-text-light text-center px-8 py-4">Lần nhắc cuối</th>
            <th className="text-label-xs text-acc-text-light text-center px-8 py-4">Tự động</th>
            <th className="text-label-xs text-acc-text-light text-right px-8 py-4">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((item, index) => {
            // riskLevel: SQL-aligned English enum (critical / high / medium)
            const config = RISK_CONFIG[item.riskLevel] || RISK_CONFIG.medium;
            // Kiểm tra email hợp lệ để quyết định trạng thái nút
            const hasEmail = !!item.email;

            return (
              <tr key={index} className="group bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md rounded-[2rem] transition duration-300">

                {/* Customers: customerName, email, phoneNumber */}
                <td className="px-8 py-5 first:rounded-l-[2rem]" data-label="Đối tác">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-acc-primary border border-slate-100 group-hover:scale-110 transition duration-300 shadow-inner shrink-0">
                      {item.customerName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-body-base font-black text-acc-text-main line-clamp-1">{item.customerName}</span>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {/* email — SQL: Customers.email (nullable) */}
                        {item.email ? (
                          <span className="text-[10px] font-bold text-acc-text-light flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" aria-hidden="true">mail</span>
                            {item.email}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" aria-hidden="true">mail_off</span>
                            Chưa có email
                          </span>
                        )}
                        {/* phoneNumber — SQL: Customers.phoneNumber (nullable) */}
                        {item.phoneNumber ? (
                          <span className="text-[10px] font-bold text-acc-text-light flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" aria-hidden="true">call</span>
                            {item.phoneNumber}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" aria-hidden="true">phone_disabled</span>
                            Chưa có SĐT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Invoices.invoiceID + daysOverdue */}
                <td className="px-8 py-5" data-label="Chứng từ">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-xs text-acc-primary bg-blue-50 px-3 py-1 rounded-lg font-black w-fit whitespace-nowrap">
                      {item.displayID}
                    </span>
                    <span className="text-[11px] font-bold text-acc-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">event_busy</span>
                      Quá hạn {item.daysOverdue} ngày
                    </span>
                  </div>
                </td>

                {/* remainingAmount (computed: totalAmount - paidAmount) */}
                <td className="px-8 py-5 text-right text-body-base font-black text-acc-primary whitespace-nowrap" data-label="SỐ TIỀN CÒN NỢ">
                  {item.remainingAmount?.toLocaleString('vi-VN')} ₫
                </td>

                {/* lastReminderDate */}
                <td className="px-8 py-5 text-center" data-label="Lần nhắc cuối">
                  {item.lastReminderDate ? (
                    <div className="flex flex-col items-center">
                      <span className="text-body-sm font-bold text-acc-text-main">{item.lastReminderDate}</span>
                      <span className="text-[10px] text-acc-text-light font-bold uppercase tracking-tighter">Qua Email</span>
                    </div>
                  ) : (
                    <span className="text-body-xs text-slate-300 font-bold italic">Chưa nhắc</span>
                  )}
                </td>

                {/* autoRemind toggle */}
                <td className="px-8 py-5" data-label="Trạng thái">
                  <div className="flex justify-center">
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.autoRemind ? 'bg-acc-primary' : 'bg-slate-200'}`}
                      title={item.autoRemind ? 'Đang tự động' : 'Thủ công'}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.autoRemind ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-8 py-5 text-right last:rounded-r-[2rem]" data-label="Thao tác">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${config.bg} ${config.text} text-[9px] font-black uppercase tracking-wider border border-current/10 hidden md:flex`}>
                      {config.label}
                    </span>
                    <button
                      onClick={() => onReminder(item)}
                      disabled={!hasEmail}
                      className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition active:scale-95 shadow-lg
                        ${hasEmail
                          ? 'bg-acc-primary text-white hover:bg-acc-accent shadow-blue-900/10 hover:shadow-blue-900/20'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                      aria-label={hasEmail ? `Gửi nhắc nợ cho ${item.customerName}` : `${item.customerName} chưa có email`}
                      title={!hasEmail ? 'Khách hàng chưa có email' : undefined}
                    >
                      Gửi
                    </button>
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

export default DebtTable;
