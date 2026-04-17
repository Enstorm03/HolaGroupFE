import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Common/AccountingToast';
import accountingService from '../services/accountingService';
import InvoiceTable from '../components/Tables/InvoiceTable';
import '../styles/accounting.css';

const PaymentManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountingService.getInvoices();
      setInvoices(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error("Payment API Error:", err);
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handlePayment = async () => {
    if (!selectedInvoice) return;
    try {
      setLoading(true);
      await accountingService.recordPayment(selectedInvoice.id, {
        paymentDate: new Date().toISOString(),
        amount: selectedInvoice.totalAmount,
        status: 'Completed'
      });
      showToast(`Đã quyết toán thành công Đơn hàng: ${selectedInvoice.id}`, "success");
      setSelectedInvoice(null);
      await fetchPending();
    } catch (err) {
      showToast("Lỗi khi ghi nhận thanh toán!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-up" style={{ gap: 'var(--space-lg)' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0 px-1">
        <div className="space-y-1">
          <h1 className="text-acc-text-main leading-tight font-black" style={{ fontSize: '2rem' }}>Thanh toán Khách hàng</h1>
          <p className="text-base text-acc-text-muted font-medium">Xác nhận các khoản thu từ hóa đơn bán hàng.</p>
        </div>
        
        {selectedInvoice && (
          <button 
            onClick={handlePayment}
            disabled={loading}
            className="acc-btn-primary px-8 py-3 flex items-center gap-3 shadow-2xl shadow-blue-800/20 active:scale-95 transition-all text-label-xs shrink-0"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Xác nhận Thu tiền ({selectedInvoice.id})
          </button>
        )}
      </div>

      <div className="acc-card flex-1 min-h-0 flex flex-col overflow-hidden" style={{ padding: 'var(--space-lg)' }}>
        <div className="flex justify-between items-center shrink-0" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 className="text-label-xs text-acc-text-main">Danh sách hóa đơn chờ xử lý</h3>
          {error && <span className="text-[10px] font-black text-acc-error bg-red-50 px-4 py-2 rounded-xl">{error}</span>}
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
          <InvoiceTable 
            invoices={invoices}
            loading={loading}
            selectedId={selectedInvoice?.id}
            onSelect={setSelectedInvoice}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
