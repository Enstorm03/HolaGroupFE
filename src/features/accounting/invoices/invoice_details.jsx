import React from 'react';
import '../styles/accounting.css';

const InvoiceDetail = () => {
  return (
    <div className="space-y-6 animate-fade-up" style={{ paddingBottom: 'var(--space-xl)' }}>
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-label-xs text-acc-text-light">
            Hóa đơn Bán hàng <span className="mx-2 opacity-30">/</span> <span className="text-acc-primary font-bold">Chi tiết</span>
          </p>
          <h1 className="text-display-sm text-acc-text-main">Hóa đơn #IV-99201</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="acc-badge bg-amber-50 text-amber-600 border border-amber-100">
            Thanh toán một phần
          </span>
          <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-acc-text-muted hover:text-acc-primary transition-all">
            <span className="material-symbols-outlined text-xl">print</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-acc-text-muted hover:text-acc-primary transition-all">
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-12" style={{ gap: 'var(--space-lg)' }}>
        {/* Left Side: Detail & Table */}
        <div className="col-span-12 lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Info Card */}
          <div className="acc-card shadow-float" style={{ padding: 'var(--space-lg)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-xl)' }}>
              <div className="space-y-2">
                <p className="text-label-xs text-acc-text-light">Khách hàng</p>
                <div className="space-y-1">
                  <p className="text-body-sm font-black text-acc-text-main">Cty CP Kiến Trúc Việt</p>
                  <p className="text-label-xs text-acc-text-muted">MST: 0102030405</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-label-xs text-acc-text-light">Ngày lập</p>
                <div className="space-y-1">
                  <p className="text-body-sm font-black text-acc-text-main">24 Tháng 05, 2024</p>
                  <p className="text-label-xs text-acc-error font-bold tracking-tight">Hạn: 10/06/2024</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-label-xs text-acc-text-light">Người phụ trách</p>
                <div className="space-y-1">
                  <p className="text-body-sm font-black text-acc-text-main">Lê Minh Tuấn</p>
                  <p className="text-label-xs text-acc-text-muted">Phòng Kế toán</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="acc-card overflow-hidden shadow-float border-none">
            <div className="border-b border-slate-50" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
              <h3 className="text-heading-xs text-acc-text-main">Danh mục hàng hóa</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="text-label-xs text-acc-text-muted" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Mô tả</th>
                    <th className="text-label-xs text-acc-text-muted text-right" style={{ padding: 'var(--space-base) var(--space-md)' }}>Số lượng</th>
                    <th className="text-label-xs text-acc-text-muted text-right" style={{ padding: 'var(--space-base) var(--space-md)' }}>Đơn giá</th>
                    <th className="text-label-xs text-acc-text-muted text-right" style={{ padding: 'var(--space-base) var(--space-xl)' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { desc: "Gạch men cao cấp 60x60", id: "GMC-60-WH", qty: "450 m²", price: "320.000 ₫", total: "144.000.000 ₫" },
                    { desc: "Xi măng Holcim đa dụng", id: "Bao 50kg, Loại I", qty: "120 Bao", price: "95.000 ₫", total: "11.400.000 ₫" },
                    { desc: "Sơn nước Dulux nội thất", id: "Thùng 18L, Màu Trắng", qty: "15 Thùng", price: "1.850.000 ₫", total: "27.750.000 ₫" }
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all">
                      <td style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                        <p className="text-body-sm font-bold text-acc-text-main">{item.desc}</p>
                        <p className="text-label-xs text-acc-text-light opacity-60">{item.id}</p>
                      </td>
                      <td className="text-right text-body-sm font-medium" style={{ padding: 'var(--space-lg) var(--space-md)' }}>{item.qty}</td>
                      <td className="text-right text-body-sm font-medium" style={{ padding: 'var(--space-lg) var(--space-md)' }}>{item.price}</td>
                      <td className="text-right text-body-sm font-black text-acc-text-main" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Summary */}
            <div className="bg-slate-50/50 border-t border-slate-100" style={{ padding: 'var(--space-xl)' }}>
              <div className="flex flex-col items-end" style={{ gap: 'var(--space-sm)' }}>
                <div className="flex justify-between w-64">
                  <span className="text-label-xs text-acc-text-light">Tạm tính:</span>
                  <span className="text-body-sm font-bold">183.150.000 ₫</span>
                </div>
                <div className="flex justify-between w-64">
                  <span className="text-label-xs text-acc-text-light">Thuế VAT (10%):</span>
                  <span className="text-body-sm font-bold">18.315.000 ₫</span>
                </div>
                <div className="flex justify-between w-72 border-t border-slate-200" style={{ paddingTop: 'var(--space-base)', marginTop: 'var(--space-xs)' }}>
                  <span className="text-body-sm font-black text-acc-text-main">Tổng cộng:</span>
                  <span className="text-heading-sm text-acc-primary">203.965.000 ₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="col-span-12 lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Debt Status Card */}
          <div className="bg-acc-primary text-white rounded-3xl shadow-float relative overflow-hidden" style={{ padding: 'var(--space-xl)' }}>
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <span className="material-symbols-outlined text-[10rem]">account_balance_wallet</span>
            </div>
            <p className="text-label-xs font-bold uppercase tracking-widest opacity-70" style={{ marginBottom: 'var(--space-xs)' }}>Dư nợ hiện tại</p>
            <h3 className="text-display-sm mb-4">53.965.000 ₫</h3>
            <div className="flex items-center gap-2 text-label-xs bg-white/10 w-fit px-3 py-1.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-sm">history</span>
              Đã thanh toán: 150.000.000 ₫
            </div>
          </div>

          {/* Entry Form */}
          <div className="acc-card shadow-float" style={{ padding: 'var(--space-xl)' }}>
            <h3 className="text-heading-xs text-acc-text-main" style={{ marginBottom: 'var(--space-xl)' }}>Ghi nhận thanh toán</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div className="space-y-2">
                <label className="text-label-xs text-acc-text-light">Số tiền nhận (₫)</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-body-sm font-black text-acc-primary focus:ring-2 focus:ring-acc-primary/20 outline-none transition-all" type="text" defaultValue="53.965.000" />
              </div>
              <div className="space-y-2">
                <label className="text-label-xs text-acc-text-light">Phương thức</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-acc-primary rounded-xl font-bold text-label-xs border-2 border-acc-primary shadow-sm" type="button">
                    <span className="material-symbols-outlined text-lg">account_balance</span> Bank
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-acc-text-light rounded-xl font-bold text-label-xs border-2 border-slate-100 opacity-60 hover:opacity-100 transition-all" type="button">
                    <span className="material-symbols-outlined text-lg">payments</span> Tiền mặt
                  </button>
                </div>
              </div>
              <button className="acc-btn-primary w-full py-4 text-label-xs shadow-xl shadow-blue-800/10 mt-2" type="submit">
                Xác nhận thanh toán hóa đơn
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2" style={{ gap: 'var(--space-base)' }}>
            <button className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-acc-primary">mail</span>
              <span className="text-label-xs font-bold text-acc-text-muted uppercase">Gửi Email</span>
            </button>
            <button className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-acc-primary">download</span>
              <span className="text-label-xs font-bold text-acc-text-muted uppercase">Tải PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;




