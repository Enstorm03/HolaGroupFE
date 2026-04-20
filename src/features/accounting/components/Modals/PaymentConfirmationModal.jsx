import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const PaymentConfirmationModal = ({ isOpen, onClose, invoice, onConfirm, loading }) => {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('Transfer'); // Cash, Transfer, Card
  const [note, setNote] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.totalAmount - (invoice.paidAmount || 0));
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const remainingBefore = invoice.totalAmount - (invoice.paidAmount || 0);
  const remainingAfter = Math.max(0, remainingBefore - parseFloat(amount || 0));
  const isPartial = remainingAfter > 0;

  const paymentMethods = [
    { id: 'Cash', label: 'Tiền mặt', icon: 'payments', color: '#10b981' },
    { id: 'Transfer', label: 'Chuyển khoản', icon: 'account_balance', color: '#3b82f6' },
    { id: 'Card', label: 'Thẻ / POS', icon: 'credit_card', color: '#8b5cf6' },
  ];

  const handleConfirm = () => {
    onConfirm({
      amount: parseFloat(amount),
      method,
      note,
      nextPaymentDate: isPartial ? nextPaymentDate : null,
      paymentDate: new Date().toISOString()
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-display-xs text-acc-text-main">Xác nhận thu tiền</h2>
              <p className="text-body-sm text-acc-text-muted">Đơn hàng {invoice.id} • {invoice.customerName || invoice.customerID}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-acc-text-muted">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section: Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-label-xs text-acc-text-light uppercase tracking-wider">Số tiền thu thực tế</label>
                <div className="relative group">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-acc-primary focus:bg-white rounded-2xl px-5 py-4 text-heading-md text-acc-text-main transition-all outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <button 
                      onClick={() => setAmount(remainingBefore)}
                      className="px-3 py-1.5 text-[10px] font-black bg-white border border-slate-200 rounded-lg shadow-sm hover:border-acc-primary transition-all uppercase"
                    >
                      Trả hết
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditional Field: Next Payment Date for Partial Payment */}
              {isPartial && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <label className="text-label-xs text-acc-error font-black uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">event_repeat</span>
                    Hẹn ngày thanh toán đợt sau
                  </label>
                  <input 
                    type="date"
                    value={nextPaymentDate}
                    onChange={(e) => setNextPaymentDate(e.target.value)}
                    className="w-full bg-red-50/50 border-2 border-red-100 focus:border-acc-error focus:bg-white rounded-2xl px-5 py-3 text-body-sm text-acc-error font-bold transition-all outline-none"
                  />
                  <p className="text-[10px] text-red-400 font-medium italic">* Khách hàng còn nợ {remainingAfter.toLocaleString()} ₫</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-label-xs text-acc-text-light uppercase tracking-wider">Phương thức</label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 ${
                        method === m.id 
                        ? 'border-acc-primary bg-blue-50/50 shadow-sm' 
                        : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ color: method === m.id ? 'var(--acc-primary)' : m.color }}>{m.icon}</span>
                      <span className={`text-[10px] font-bold ${method === m.id ? 'text-acc-primary' : 'text-acc-text-muted'}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-label-xs text-acc-text-light uppercase tracking-wider">Ghi chú</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nội dung phiếu thu..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-acc-primary focus:bg-white rounded-2xl px-5 py-3 text-body-sm text-acc-text-main transition-all outline-none resize-none h-16"
                />
              </div>
            </div>

            {/* Right Section: Summary */}
            <div className="bg-slate-50 rounded-[2rem] p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-label-xs text-acc-text-light uppercase tracking-widest text-center border-bottom pb-4 border-slate-200">Tóm tắt quyết toán</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-acc-text-muted">Tổng nợ hiện tại:</span>
                    <span className="font-bold text-acc-text-main">{remainingBefore.toLocaleString()} ₫</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-acc-text-muted">Số tiền thu mới:</span>
                    <span className="font-bold text-acc-primary">-{parseFloat(amount || 0).toLocaleString()} ₫</span>
                  </div>
                  <div className="pt-4 border-t border-dashed border-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-label-xs text-acc-text-light uppercase">Nợ còn lại:</span>
                      <span className={`text-heading-sm font-black ${remainingAfter === 0 ? 'text-green-600' : 'text-acc-error'}`}>
                        {remainingAfter.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  disabled={loading || amount <= 0}
                  onClick={handleConfirm}
                  className="w-full acc-btn-primary py-4 rounded-2xl text-label-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 transition-all text-white"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">verified_user</span>
                      Hoàn tất thu tiền
                    </>
                  )}
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-label-xs font-black text-acc-text-muted hover:text-acc-text-main transition-all"
                >
                  Hủy thao tác
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentConfirmationModal;
