import React from 'react';
import MainLayout from '../../../components/Layout/MainLayout';

const InvoiceList = () => {
  return (
    <MainLayout>
      <div className="accounting-page-content w-full h-full">
        {/* Content Area */}
<div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
{/* Header Section with Asymmetry */}
<section className="flex justify-between items-end">
<div className="max-w-xl">
<h1 className="text-4xl font-extrabold font-manrope text-on-surface tracking-tight mb-2">Quản lý hóa đơn bán hàng</h1>
<p className="text-secondary font-body leading-relaxed">Theo dõi và quản lý toàn bộ luồng doanh thu từ các đơn đặt hàng đến khi hoàn tất thanh toán.</p>
</div>
<div>
<button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all border border-primary/10">
<span className="material-symbols-outlined text-xl" data-icon="add_shopping_cart">add_shopping_cart</span>
                        Tạo hóa đơn từ đơn hàng
                    </button>
</div>
</section>
{/* Metrics Bento Grid */}
<section className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="bg-surface-container-lowest p-6 rounded-xl border-none flex flex-col justify-between h-32">
<span className="text-xs font-semibold uppercase tracking-widest text-secondary">Tổng doanh thu</span>
<div className="flex items-baseline gap-1">
<span className="text-2xl font-bold font-manrope">4.28B</span>
<span className="text-xs text-slate-400">VND</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl border-none flex flex-col justify-between h-32">
<span className="text-xs font-semibold uppercase tracking-widest text-secondary">Chờ thanh toán</span>
<div className="flex items-baseline gap-1">
<span className="text-2xl font-bold font-manrope">842M</span>
<span className="text-xs text-slate-400 font-inter">VND</span>
</div>
</div>
<div className="bg-tertiary-container/30 p-6 rounded-xl border-none flex flex-col justify-between h-32">
<span className="text-xs font-semibold uppercase tracking-widest text-on-tertiary-container">Tăng trưởng tháng</span>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
<span className="text-2xl font-bold font-manrope">12.4%</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl border-none flex flex-col justify-between h-32">
<span className="text-xs font-semibold uppercase tracking-widest text-secondary">Hóa đơn quá hạn</span>
<div className="flex items-baseline gap-1 text-error">
<span className="text-2xl font-bold font-manrope">14</span>
<span className="text-xs font-inter">phiếu</span>
</div>
</div>
</section>
{/* Filters Bar */}
<section className="flex flex-wrap items-center gap-4 p-2 bg-surface-container-low rounded-xl">
<div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg border-none shadow-sm">
<span className="material-symbols-outlined text-slate-400 text-lg" data-icon="calendar_today">calendar_today</span>
<span className="text-sm font-medium text-slate-600">Khoảng ngày: 01/10/2023 - 31/10/2023</span>
</div>
<div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg border-none shadow-sm">
<span className="material-symbols-outlined text-slate-400 text-lg" data-icon="filter_list">filter_list</span>
<select aria-label="Trạng thái hóa đơn" className="bg-transparent border-none text-sm font-medium text-slate-600 focus:ring-0 py-0 pr-8" title="Trạng thái hóa đơn">
<option>Trạng thái: Tất cả</option>
<option>Đã thanh toán</option>
<option>Chờ xử lý</option>
<option>Quá hạn</option>
<option>Bản nháp</option>
</select>
</div>
<div className="flex-1"></div>
<button aria-label="Tải xuống" className="p-2 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="download">download</span>
</button>
<button aria-label="In" className="p-2 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="print">print</span>
</button>
</section>
{/* Data Table (The Invisible Grid) */}
<section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-high/50">
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500">Mã Hóa Đơn</th>
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500">Ngày lập</th>
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500">Khách hàng</th>
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500">Tổng tiền</th>
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500 text-center">Trạng thái</th>
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500">Hạn thanh toán</th>
<th className="px-8 py-4 text-[11px] font-semibold tracking-wider uppercase text-slate-500 text-right">Hành động</th>
</tr>
</thead>
<tbody className="divide-y-0">
<tr className="hover:bg-surface-container-high transition-colors group">
<td className="px-8 py-4 text-sm font-bold text-primary">INV-2023-001</td>
<td className="px-8 py-4 text-sm text-secondary">24 Oct, 2023</td>
<td className="px-8 py-4">
<div className="flex flex-col">
<span className="text-sm font-semibold text-on-surface">Công ty TNHH Minh Anh</span>
<span className="text-[10px] text-slate-400">MST: 0314567890</span>
</div>
</td>
<td className="px-8 py-4 text-sm font-bold text-on-surface">125,500,000 ₫</td>
<td className="px-8 py-4 text-center">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">Paid</span>
</td>
<td className="px-8 py-4 text-sm text-secondary">01 Nov, 2023</td>
<td className="px-8 py-4 text-right">
<button aria-label="Thêm tùy chọn" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors group">
<td className="px-8 py-4 text-sm font-bold text-primary">INV-2023-002</td>
<td className="px-8 py-4 text-sm text-secondary">25 Oct, 2023</td>
<td className="px-8 py-4 text-sm font-semibold text-on-surface">Tập đoàn Viễn thông Alpha</td>
<td className="px-8 py-4 text-sm font-bold text-on-surface">48,200,000 ₫</td>
<td className="px-8 py-4 text-center">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container">Issued</span>
</td>
<td className="px-8 py-4 text-sm text-secondary">05 Nov, 2023</td>
<td className="px-8 py-4 text-right">
<button aria-label="Thêm tùy chọn" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors group">
<td className="px-8 py-4 text-sm font-bold text-primary">INV-2023-003</td>
<td className="px-8 py-4 text-sm text-secondary">26 Oct, 2023</td>
<td className="px-8 py-4 text-sm font-semibold text-on-surface">Nguyễn Văn Nam (Cá nhân)</td>
<td className="px-8 py-4 text-sm font-bold text-on-surface">15,000,000 ₫</td>
<td className="px-8 py-4 text-center">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">Overdue</span>
</td>
<td className="px-8 py-4 text-sm text-error font-medium">20 Oct, 2023</td>
<td className="px-8 py-4 text-right">
<button aria-label="Thêm tùy chọn" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors group">
<td className="px-8 py-4 text-sm font-bold text-primary">INV-2023-004</td>
<td className="px-8 py-4 text-sm text-secondary">27 Oct, 2023</td>
<td className="px-8 py-4 text-sm font-semibold text-on-surface">Logistics Toàn Cầu</td>
<td className="px-8 py-4 text-sm font-bold text-on-surface">210,000,000 ₫</td>
<td className="px-8 py-4 text-center">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-highest text-slate-600">Draft</span>
</td>
<td className="px-8 py-4 text-sm text-secondary">10 Nov, 2023</td>
<td className="px-8 py-4 text-right">
<button aria-label="Thêm tùy chọn" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-high transition-colors group">
<td className="px-8 py-4 text-sm font-bold text-primary">INV-2023-005</td>
<td className="px-8 py-4 text-sm text-secondary">28 Oct, 2023</td>
<td className="px-8 py-4 text-sm font-semibold text-on-surface">Hệ thống Siêu thị Co.op</td>
<td className="px-8 py-4 text-sm font-bold text-on-surface">76,450,000 ₫</td>
<td className="px-8 py-4 text-center">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">Paid</span>
</td>
<td className="px-8 py-4 text-sm text-secondary">02 Nov, 2023</td>
<td className="px-8 py-4 text-right">
<button aria-label="Thêm tùy chọn" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
<div className="px-8 py-4 bg-surface-container-low flex items-center justify-between border-t border-slate-100">
<span className="text-xs text-secondary font-medium italic">Hiển thị 5 trên tổng số 142 hóa đơn</span>
<div className="flex items-center gap-2">
<button aria-label="Trang trước" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-primary transition-all">
<span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-xs font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white">3</button>
<button aria-label="Trang sau" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-primary transition-all">
<span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</section>
</div>
      </div>
    </MainLayout>
  );
};

export default InvoiceList;
