import React from 'react';
import MainLayout from '../../../components/Layout/MainLayout';

const PaymentList = () => {
  return (
    <MainLayout>
      <div className="accounting-page-content w-full h-full">
        {/* Main Content Canvas */}
<main className="ml-64 pt-24 p-8 min-h-screen">
<div className="max-w-7xl mx-auto">
<div className="mb-8">
<h2 className="text-3xl font-extrabold font-headline text-on-background tracking-tight">Xác nhận Thanh toán</h2>
<p className="text-secondary mt-1 font-body">Quản lý và ghi nhận dòng tiền cho các dự án kiến trúc.</p>
</div>
<div className="flex flex-col lg:flex-row gap-8">
{/* Pending Invoices Section (60%) */}
<div className="lg:w-[60%] space-y-6">
<div className="bg-surface-container-low rounded-xl p-1">
<div className="bg-surface-container-lowest rounded-lg overflow-hidden">
<div className="p-6 border-b border-surface-container-low flex justify-between items-center">
<h3 className="font-headline font-bold text-lg">Hóa đơn chờ thanh toán</h3>
<div className="flex space-x-2">
<span className="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-bold rounded-full">12 Chờ xử lý</span>
</div>
</div>
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low">
<tr>
<th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest font-label">Mã Hóa đơn</th>
<th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest font-label">Khách hàng</th>
<th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest font-label text-right">Tổng tiền</th>
<th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest font-label text-right">Dư nợ</th>
<th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest font-label">Trạng thái</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-low">
<tr className="hover:bg-surface-container-high transition-colors cursor-pointer group">
<td className="px-6 py-5 font-medium text-sm text-primary">INV-2024-001</td>
<td className="px-6 py-5">
<p className="text-sm font-semibold text-on-background">CTY Bất động sản BlueSky</p>
<p className="text-xs text-secondary">Hạn: 25/10/2024</p>
</td>
<td className="px-6 py-5 text-right text-sm font-semibold">150.000.000 đ</td>
<td className="px-6 py-5 text-right text-sm font-bold text-error">45.000.000 đ</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container">Thanh toán một phần</span>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors cursor-pointer bg-primary/5">
<td className="px-6 py-5 font-medium text-sm text-primary">INV-2024-042</td>
<td className="px-6 py-5">
<p className="text-sm font-semibold text-on-background">Biệt thự Horizon - Anh Nam</p>
<p className="text-xs text-secondary">Hạn: 30/10/2024</p>
</td>
<td className="px-6 py-5 text-right text-sm font-semibold">820.000.000 đ</td>
<td className="px-6 py-5 text-right text-sm font-bold text-error">820.000.000 đ</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">Chưa thanh toán</span>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors cursor-pointer">
<td className="px-6 py-5 font-medium text-sm text-primary">INV-2024-089</td>
<td className="px-6 py-5">
<p className="text-sm font-semibold text-on-background">Tòa nhà VP Central Park</p>
<p className="text-xs text-secondary">Hạn: 15/11/2024</p>
</td>
<td className="px-6 py-5 text-right text-sm font-semibold">2.450.000.000 đ</td>
<td className="px-6 py-5 text-right text-sm font-bold text-error">1.200.000.000 đ</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container">Thanh toán một phần</span>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors cursor-pointer">
<td className="px-6 py-5 font-medium text-sm text-primary">INV-2024-112</td>
<td className="px-6 py-5">
<p className="text-sm font-semibold text-on-background">Cafe Minimalist Quận 3</p>
<p className="text-xs text-secondary">Hạn: 20/11/2024</p>
</td>
<td className="px-6 py-5 text-right text-sm font-semibold">45.000.000 đ</td>
<td className="px-6 py-5 text-right text-sm font-bold text-error">45.000.000 đ</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">Chưa thanh toán</span>
</td>
</tr>
</tbody>
</table>
<div className="p-4 bg-surface-container-low text-center">
<button className="text-sm font-bold text-primary hover:underline">Xem thêm 8 hóa đơn khác</button>
</div>
</div>
</div>
{/* Asymmetric Summary Card */}
<div className="grid grid-cols-2 gap-4">
<div className="bg-tertiary-container/30 p-6 rounded-xl border border-tertiary-container/20">
<span className="material-symbols-outlined text-tertiary text-3xl mb-2" data-icon="account_balance_wallet">account_balance_wallet</span>
<h4 className="text-sm font-bold text-tertiary uppercase tracking-wider mb-1">Tổng nợ phải thu</h4>
<p className="text-2xl font-black font-headline text-on-tertiary-fixed">2.110.000.000 đ</p>
</div>
<div className="bg-primary-container/30 p-6 rounded-xl border border-primary-container/20">
<span className="material-symbols-outlined text-primary text-3xl mb-2" data-icon="event_repeat">event_repeat</span>
<h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Dự kiến thu tuần này</h4>
<p className="text-2xl font-black font-headline text-on-primary-fixed">865.000.000 đ</p>
</div>
</div>
</div>
{/* Record Payment Section (40%) */}
<div className="lg:w-[40%]">
<div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(43,52,55,0.06)] overflow-hidden border border-surface-container-low">
<div className="bg-primary p-6">
<div className="flex justify-between items-start text-on-primary">
<div>
<h3 className="text-xl font-bold font-headline">Ghi nhận Thanh toán</h3>
<p className="text-xs opacity-80 mt-1">Giao dịch #TXN-99821</p>
</div>
<span className="material-symbols-outlined text-3xl icon-fill-1" data-icon="verified_user">verified_user</span>
</div>
</div>
<div className="p-8 space-y-6">
{/* Invoice Selection */}
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Chọn Hóa đơn</label>
<div className="relative">
<div className="w-full bg-surface-container-highest p-4 rounded-lg flex items-center justify-between border-b-2 border-primary/20">
<div className="flex flex-col">
<span className="text-sm font-bold text-on-background">INV-2024-042</span>
<span className="text-xs text-secondary">Biệt thự Horizon - Anh Nam</span>
</div>
<span className="material-symbols-outlined text-secondary" data-icon="expand_more">expand_more</span>
</div>
</div>
</div>
{/* Amount to Pay */}
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Số tiền thanh toán</label>
<div className="relative group">
<input aria-label="Số tiền thanh toán" className="w-full bg-surface-container-highest border-none text-2xl font-black text-on-background p-4 rounded-lg focus:ring-0" title="Số tiền thanh toán" type="text" value="400.000.000"/>
<span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-secondary">VNĐ</span>
<div className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-focus-within:w-full transition-all duration-300"></div>
</div>
</div>
{/* Method Toggle */}
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Phương thức</label>
<div className="grid grid-cols-2 gap-2">
<button className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-surface-container-highest text-secondary font-bold text-xs hover:bg-primary-container hover:text-primary transition-all">
<span className="material-symbols-outlined text-lg" data-icon="payments">payments</span>
<span>Tiền mặt</span>
</button>
<button className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-md">
<span className="material-symbols-outlined text-lg icon-fill-1" data-icon="account_balance">account_balance</span>
<span>Chuyển khoản</span>
</button>
</div>
</div>
{/* Calculation Display */}
<div className="bg-surface-container-low rounded-xl p-4 space-y-3">
<div className="flex justify-between text-xs">
<span className="text-secondary">Nợ hiện tại</span>
<span className="font-bold text-on-background">820.000.000 đ</span>
</div>
<div className="flex justify-between text-xs">
<span className="text-secondary">Thanh toán</span>
<span className="font-bold text-primary">- 400.000.000 đ</span>
</div>
<div className="pt-3 border-t border-surface-container-high flex justify-between">
<span className="text-sm font-bold text-on-background">Dư nợ sau thanh toán</span>
<span className="text-sm font-black text-error">420.000.000 đ</span>
</div>
<div className="flex justify-end">
<span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-black rounded-full uppercase tracking-tighter">Thanh toán một phần</span>
</div>
</div>
{/* Notes Area */}
<div className="space-y-2">
<label className="text-[11px] font-bold text-secondary uppercase tracking-widest">Ghi chú</label>
<textarea aria-label="Ghi chú thanh toán" className="w-full bg-surface-container-highest border-none p-4 rounded-lg text-sm text-on-background focus:ring-0 resize-none h-24" placeholder="Nhập ghi chú thanh toán hoặc số tham chiếu ngân hàng..." title="Ghi chú thanh toán"></textarea>
</div>
{/* Action CTA */}
<button className="w-full bg-primary py-4 rounded-lg text-on-primary font-black font-headline text-lg shadow-lg hover:bg-primary-dim transition-all active:scale-[0.98] flex items-center justify-center space-x-3">
<span>Xác nhận Thanh toán</span>
<span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
<p className="text-center text-[10px] text-secondary">
                                Hành động này sẽ cập nhật sổ cái và thông báo cho khách hàng qua Email/SMS.
                            </p>
</div>
</div>
</div>
</div>
</div>
</main>
      </div>
    </MainLayout>
  );
};

export default PaymentList;
