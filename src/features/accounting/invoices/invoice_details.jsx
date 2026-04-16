import React from 'react';
import MainLayout from '../../../components/Layout/MainLayout';

const InvoiceDetail = () => {
  return (
    <MainLayout>
      <div className="accounting-page-content w-full h-full">
        {/* Main Canvas Content */}
<div className="p-12 space-y-8 max-w-7xl mx-auto w-full">
{/* Breadcrumbs & Status */}
<div className="flex justify-between items-end">
<div className="space-y-1">
<p className="text-secondary text-sm font-medium">Hóa đơn bán hàng / Chi tiết</p>
<h2 className="text-3xl font-manrope font-extrabold text-on-surface">Hóa đơn #IV-99201</h2>
</div>
<div className="flex items-center gap-3">
<span className="px-4 py-1.5 bg-error-container text-on-error-container text-xs font-bold rounded-full uppercase tracking-wider">Thanh toán một phần</span>
<button aria-label="In" className="p-2 bg-surface-container-high rounded-lg text-secondary hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[20px]">print</span>
</button>
<button aria-label="Chia sẻ" className="p-2 bg-surface-container-high rounded-lg text-secondary hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[20px]">share</span>
</button>
</div>
</div>
{/* Bento Grid Layout */}
<div className="grid grid-cols-12 gap-8">
{/* Left Section: Invoice Detail */}
<div className="col-span-12 lg:col-span-8 space-y-8">
{/* Invoice Info Card */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
<div className="grid grid-cols-3 gap-8">
<div className="space-y-1">
<p className="text-xs font-semibold text-secondary uppercase tracking-widest">Khách hàng</p>
<p className="font-manrope font-bold text-lg">Cty CP Kiến Trúc Việt</p>
<p className="text-sm text-secondary">MST: 0102030405</p>
</div>
<div className="space-y-1">
<p className="text-xs font-semibold text-secondary uppercase tracking-widest">Ngày lập</p>
<p className="font-manrope font-bold text-lg">24 Tháng 05, 2024</p>
<p className="text-sm text-secondary">Hạn thanh toán: 10/06/2024</p>
</div>
<div className="space-y-1">
<p className="text-xs font-semibold text-secondary uppercase tracking-widest">Người phụ trách</p>
<p className="font-manrope font-bold text-lg">Lê Minh Tuấn</p>
<p className="text-sm text-secondary">Phòng Kế toán</p>
</div>
</div>
</div>
{/* Itemized List */}
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
<div className="px-8 py-6 border-b border-surface-container">
<h3 className="font-manrope font-bold text-on-surface">Danh mục hàng hóa</h3>
</div>
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-low">
<th className="px-8 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Mô tả</th>
<th className="px-4 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Số lượng</th>
<th className="px-4 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Đơn giá</th>
<th className="px-8 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Thành tiền</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-5">
<p className="font-semibold text-sm">Gạch men cao cấp 60x60</p>
<p className="text-xs text-secondary">Mã sản phẩm: GMC-60-WH</p>
</td>
<td className="px-4 py-5 text-right text-sm">450 m²</td>
<td className="px-4 py-5 text-right text-sm">320.000 ₫</td>
<td className="px-8 py-5 text-right text-sm font-bold">144.000.000 ₫</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-5">
<p className="font-semibold text-sm">Xi măng Holcim đa dụng</p>
<p className="text-xs text-secondary">Bao 50kg, Loại I</p>
</td>
<td className="px-4 py-5 text-right text-sm">120 Bao</td>
<td className="px-4 py-5 text-right text-sm">95.000 ₫</td>
<td className="px-8 py-5 text-right text-sm font-bold">11.400.000 ₫</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-5">
<p className="font-semibold text-sm">Sơn nước nội thất Dulux</p>
<p className="text-xs text-secondary">Thùng 18L, Màu Trắng</p>
</td>
<td className="px-4 py-5 text-right text-sm">15 Thùng</td>
<td className="px-4 py-5 text-right text-sm">1.850.000 ₫</td>
<td className="px-8 py-5 text-right text-sm font-bold">27.750.000 ₫</td>
</tr>
</tbody>
</table>
{/* Financial Breakdown */}
<div className="p-8 bg-surface-container-low/30 border-t border-surface-container">
<div className="flex flex-col items-end space-y-3">
<div className="flex justify-between w-64 text-sm">
<span className="text-secondary">Tạm tính:</span>
<span className="font-semibold">183.150.000 ₫</span>
</div>
<div className="flex justify-between w-64 text-sm">
<span className="text-secondary">Phí vận chuyển:</span>
<span className="font-semibold text-error">2.500.000 ₫</span>
</div>
<div className="flex justify-between w-64 text-sm">
<span className="text-secondary">Thuế VAT (10%):</span>
<span className="font-semibold">18.315.000 ₫</span>
</div>
<div className="pt-4 border-t border-surface-container w-64 flex justify-between items-center">
<span className="font-manrope font-bold text-on-surface">Tổng cộng:</span>
<span className="font-manrope font-extrabold text-xl text-primary">203.965.000 ₫</span>
</div>
</div>
</div>
</div>
</div>
{/* Right Section: Payment Entry & Debt */}
<div className="col-span-12 lg:col-span-4 space-y-8">
{/* Debt Summary Card */}
<div className="bg-primary text-on-primary rounded-xl p-8 relative overflow-hidden">
<div className="absolute -right-4 -bottom-4 opacity-10">
<span className="material-symbols-outlined text-[120px] icon-fill-1">account_balance_wallet</span>
</div>
<p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Dư nợ hiện tại</p>
<h3 className="font-manrope font-extrabold text-4xl mb-6">53.965.000 ₫</h3>
<div className="flex items-center gap-2 text-xs font-medium bg-on-primary/10 w-fit px-3 py-1 rounded-full">
<span className="material-symbols-outlined text-sm">history</span>
                                Đã thanh toán: 150.000.000 ₫
                            </div>
</div>
{/* Payment Entry Form */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
<h3 className="font-manrope font-bold text-on-surface mb-6">Ghi nhận thanh toán</h3>
<form className="space-y-6">
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Số tiền nhận</label>
<div className="relative">
<input aria-label="Số tiền nhận" className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 font-manrope font-bold text-primary focus:ring-2 focus:ring-primary/40 transition-all" title="Số tiền nhận" type="text" value="53.965.000"/>
<span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-bold text-sm">VND</span>
</div>
</div>
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Phương thức</label>
<div className="grid grid-cols-2 gap-3">
<button className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-semibold text-sm border-2 border-primary transition-all" type="button">
<span className="material-symbols-outlined text-[18px]">account_balance</span> Chuyển khoản
                                        </button>
<button className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-low text-secondary rounded-lg font-semibold text-sm border-2 border-transparent hover:border-surface-container-highest transition-all" type="button">
<span className="material-symbols-outlined text-[18px]">payments</span> Tiền mặt
                                        </button>
</div>
</div>
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Ngày giao dịch</label>
<div className="relative">
<input aria-label="Ngày giao dịch" className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/40" title="Ngày giao dịch" type="date" value="2024-05-28"/>
</div>
</div>
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Ghi chú</label>
<textarea aria-label="Ghi chú thanh toán" className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/40" placeholder="Ví dụ: Thanh toán đợt cuối..." rows="3" title="Ghi chú thanh toán"></textarea>
</div>
<div className="pt-4 space-y-3">
<div className="flex justify-between items-center px-4 py-3 bg-tertiary-container/30 rounded-lg">
<span className="text-xs font-semibold text-on-tertiary-container">Dư nợ sau thanh toán:</span>
<span className="font-manrope font-bold text-on-tertiary-container">0 ₫</span>
</div>
<button className="w-full bg-primary hover:bg-primary-dim text-on-primary py-4 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit">
<span className="material-symbols-outlined">check_circle</span>
                                        Xác nhận thanh toán
                                    </button>
</div>
</form>
</div>
{/* Quick Actions */}
<div className="grid grid-cols-2 gap-4">
<button className="bg-surface-container-high hover:bg-surface-container-highest p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
<span className="material-symbols-outlined text-primary">mail</span>
<span className="text-xs font-bold uppercase tracking-wider">Gửi Email</span>
</button>
<button className="bg-surface-container-high hover:bg-surface-container-highest p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
<span className="material-symbols-outlined text-primary">download</span>
<span className="text-xs font-bold uppercase tracking-wider">Tải PDF</span>
</button>
</div>
</div>
</div>
</div>
      </div>
    </MainLayout>
  );
};

export default InvoiceDetail;
