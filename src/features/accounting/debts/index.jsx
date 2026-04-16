import React from 'react';
import MainLayout from '../../../components/Layout/MainLayout';

const DebtTracker = () => {
  return (
    <MainLayout>
      <div className="accounting-page-content w-full h-full">
        {/* Content Canvas */}
<div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
{/* Header Section */}
<div className="flex justify-between items-end">
<div className="space-y-1">
<p className="label-sm font-semibold tracking-widest text-secondary uppercase">Quản lý tài chính</p>
<h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Tổng quan Công nợ</h2>
</div>
<div className="bg-surface-container-low p-2 rounded-xl flex gap-2">
<button className="bg-surface-container-lowest shadow-sm px-4 py-2 rounded-lg text-sm font-semibold text-primary">Theo tháng</button>
<button className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-surface-container-high transition-colors">Theo quý</button>
</div>
</div>
{/* Bento Metrics Grid */}
<div className="grid grid-cols-12 gap-6">
<div className="col-span-5 bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary">
<div className="flex justify-between items-start mb-6">
<span className="label-sm font-bold uppercase tracking-widest text-secondary">Tổng công nợ</span>
<div className="p-2 bg-primary-container/30 rounded-lg">
<span className="material-symbols-outlined text-primary icon-fill-1">account_balance</span>
</div>
</div>
<div className="space-y-1">
<h3 className="text-5xl font-extrabold text-on-surface tracking-tighter">2.480,5M</h3>
<p className="text-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-error text-sm">arrow_upward</span>
<span className="text-error font-medium">+12.4%</span> so với tháng trước
                        </p>
</div>
</div>
<div className="col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
<div className="flex justify-between items-start mb-6">
<span className="label-sm font-bold uppercase tracking-widest text-secondary">Nợ quá hạn</span>
<div className="p-2 bg-error-container/20 rounded-lg">
<span className="material-symbols-outlined text-error icon-fill-1">warning</span>
</div>
</div>
<div className="space-y-1">
<h3 className="text-5xl font-extrabold text-on-surface tracking-tighter">842,2M</h3>
<p className="text-sm text-on-surface-variant">Chiếm 34% tổng nợ</p>
</div>
</div>
<div className="col-span-3 bg-tertiary-container/20 p-8 rounded-xl border border-tertiary-container/50">
<div className="flex justify-between items-start mb-6">
<span className="label-sm font-bold uppercase tracking-widest text-on-tertiary-container">Khách nợ</span>
<div className="p-2 bg-surface-container-lowest rounded-lg">
<span className="material-symbols-outlined text-tertiary icon-fill-1">group</span>
</div>
</div>
<div className="space-y-1">
<h3 className="text-5xl font-extrabold text-on-surface tracking-tighter">124</h3>
<p className="text-sm text-on-tertiary-container">Khách hàng hiện tại</p>
</div>
</div>
</div>
{/* Main Content Area: Table & Settings */}
<div className="grid grid-cols-12 gap-8 items-start">
{/* Debtors Table */}
<div className="col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div className="p-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/50">
<h3 className="font-bold text-lg text-on-surface">Danh sách khách nợ</h3>
<div className="flex gap-2">
<button aria-label="Lọc" className="p-2 text-secondary hover:bg-surface-container-high rounded-lg transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
<button aria-label="Tải xuống" className="p-2 text-secondary hover:bg-surface-container-high rounded-lg transition-colors">
<span className="material-symbols-outlined">download</span>
</button>
</div>
</div>
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-low/30">
<th className="py-4 px-6 label-sm text-secondary font-bold tracking-widest uppercase">Khách hàng</th>
<th className="py-4 px-6 label-sm text-secondary font-bold tracking-widest uppercase">Lần mua cuối</th>
<th className="py-4 px-6 label-sm text-secondary font-bold tracking-widest uppercase">Tổng nợ</th>
<th className="py-4 px-6 label-sm text-secondary font-bold tracking-widest uppercase text-right">Tuổi nợ (Ngày)</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container/50">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="py-5 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">AT</div>
<div>
<p className="font-bold text-on-surface text-sm">Cty TNHH An Thái</p>
<p className="text-[10px] text-secondary">MST: 0102345678</p>
</div>
</div>
</td>
<td className="py-5 px-6 text-sm text-on-surface-variant">12/05/2024</td>
<td className="py-5 px-6 font-bold text-on-surface">156.000.000₫</td>
<td className="py-5 px-6 text-right">
<span className="px-2 py-1 rounded-full bg-error-container/10 text-on-error-container text-[10px] font-bold">90+</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-5 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">BM</div>
<div>
<p className="font-bold text-on-surface text-sm">Bách Hóa Minh Khôi</p>
<p className="text-[10px] text-secondary">MST: 0305678901</p>
</div>
</div>
</td>
<td className="py-5 px-6 text-sm text-on-surface-variant">28/05/2024</td>
<td className="py-5 px-6 font-bold text-on-surface">42.500.000₫</td>
<td className="py-5 px-6 text-right">
<span className="px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">30</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-5 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">HP</div>
<div>
<p className="font-bold text-on-surface text-sm">Hưng Phát Logistics</p>
<p className="text-[10px] text-secondary">MST: 0801122334</p>
</div>
</div>
</td>
<td className="py-5 px-6 text-sm text-on-surface-variant">05/06/2024</td>
<td className="py-5 px-6 font-bold text-on-surface">89.200.000₫</td>
<td className="py-5 px-6 text-right">
<span className="px-2 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold">60</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-5 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">VN</div>
<div>
<p className="font-bold text-on-surface text-sm">Việt Nhật Construction</p>
<p className="text-[10px] text-secondary">MST: 0109876543</p>
</div>
</div>
</td>
<td className="py-5 px-6 text-sm text-on-surface-variant">14/06/2024</td>
<td className="py-5 px-6 font-bold text-on-surface">210.000.000₫</td>
<td className="py-5 px-6 text-right">
<span className="px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">15</span>
</td>
</tr>
</tbody>
</table>
<div className="p-6 text-center border-t border-surface-container">
<button className="text-primary font-bold text-sm hover:underline">Xem tất cả 124 khách hàng</button>
</div>
</div>
{/* Action & Reminder Settings */}
<div className="col-span-4 space-y-6">
<div className="bg-primary p-8 rounded-xl shadow-lg relative overflow-hidden group">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
<div className="relative z-10 space-y-4">
<span className="material-symbols-outlined text-white text-4xl">outgoing_mail</span>
<h3 className="text-xl font-bold text-white">Nhắc nhở thanh toán</h3>
<p className="text-primary-fixed text-sm opacity-90 leading-relaxed">Gửi thông báo yêu cầu thanh toán hàng loạt cho các đối tác có nợ quá hạn trên 30 ngày.</p>
<button className="w-full bg-white text-primary py-4 rounded-lg font-bold shadow-md hover:shadow-xl transition-all active:scale-95">
                                Send Payment Reminder
                            </button>
</div>
</div>
<div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/20">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-secondary">settings_suggest</span>
<h3 className="font-bold text-on-surface">Cài đặt tự động</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<label className="text-sm font-medium text-on-surface">Email tự động</label>
<div className="w-12 h-6 bg-primary rounded-full relative p-1">
<div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
</div>
</div>
<div className="space-y-3">
<label className="text-xs font-bold text-secondary uppercase tracking-widest">Thời gian gửi (Ngày)</label>
<div className="grid grid-cols-3 gap-2">
<input aria-label="Nhắc nhở lần 1 (ngày)" className="bg-surface-container-lowest border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" title="Nhắc nhở lần 1 (ngày)" type="text" value="3"/>
<input aria-label="Nhắc nhở lần 2 (ngày)" className="bg-surface-container-lowest border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" title="Nhắc nhở lần 2 (ngày)" type="text" value="7"/>
<input aria-label="Nhắc nhở lần 3 (ngày)" className="bg-surface-container-lowest border-none rounded-lg text-center font-bold text-primary focus:ring-2 focus:ring-primary/20" title="Nhắc nhở lần 3 (ngày)" type="text" value="15"/>
</div>
<p className="text-[10px] text-on-surface-variant italic">Hệ thống sẽ gửi email nhắc nhở sau X ngày kể từ ngày đáo hạn.</p>
</div>
<div className="pt-4 border-t border-outline-variant/20">
<button className="w-full text-secondary text-sm font-semibold hover:text-primary transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">edit_note</span>
                                    Chỉnh sửa mẫu Email
                                </button>
</div>
</div>
</div>
</div>
</div>
{/* Dynamic Background Element */}
<div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
<img alt="Financial Analytics Overlay" className="w-full h-full object-cover grayscale opacity-20 contrast-125" data-alt="High-end professional office space with large windows overlooking a modern city skyline at dusk, cool blue and grey tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6yqCsD44JWSTFt66qUQBvCCOzUXOTVyLBpL_vkQ77oeHRHft9q2QqCXpPYxKuegb5uWR3ZFerzpZgtaIsiLdqtFl5qr1P3o4SUSoddXZDysVFnHowtsCky65I29NG_e7VT-ZX_GuxiEu9gVPiANEuBme6l-HOvLcl4euj-IL3GAgKdMvoCq4hlQ8qxZEieCnDI7uXD31caEinDG-4ceC2F7K0WW9oNnVnSJfQnmUEvfgF7MTOpqSH5-mZCzysTwuY11IaDskiCXJb"/>
<div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center px-12">
<div className="max-w-md text-white space-y-2">
<h4 className="text-2xl font-bold">Phân tích dòng tiền</h4>
<p className="text-sm text-primary-fixed opacity-90">Tỷ lệ thu hồi nợ của bạn đã tăng 15% so với quý trước nhờ hệ thống nhắc nhở tự động mới.</p>
</div>
</div>
</div>
</div>
      </div>
    </MainLayout>
  );
};

export default DebtTracker;
