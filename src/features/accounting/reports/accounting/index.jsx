import React from 'react';
import MainLayout from '../../../../components/Layout/MainLayout';

const AccountingReport = () => {
  return (
    <MainLayout>
      <div className="accounting-page-content w-full h-full">
        {/* Dashboard Canvas */}
<div className="p-12 space-y-12">
{/* Page Header & Filters */}
<div className="flex justify-between items-end">
<div>
<h1 className="text-display-lg font-manrope font-extrabold text-on-background tracking-tight">Báo Cáo Doanh Thu</h1>
<p className="text-secondary font-body mt-2">Phân tích chuyên sâu về hiệu suất tài chính doanh nghiệp.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex bg-surface-container-low p-1 rounded-xl">
<button aria-label="Tháng" className="px-4 py-2 rounded-lg text-sm font-semibold bg-surface-container-lowest text-primary shadow-sm">Tháng</button>
<button aria-label="Quý" className="px-4 py-2 rounded-lg text-sm font-semibold text-secondary hover:text-on-background">Quý</button>
<button aria-label="Năm" className="px-4 py-2 rounded-lg text-sm font-semibold text-secondary hover:text-on-background">Năm</button>
</div>
<div className="relative">
<select aria-label="Lọc theo phòng ban" className="appearance-none bg-surface-container-low border-none rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-on-background focus:ring-2 focus:ring-primary/40" title="Lọc theo phòng ban">
<option>Tất cả phòng ban</option>
<option>Kinh doanh 01</option>
<option>Kinh doanh 02</option>
<option>Dịch vụ khách hàng</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-3 text-secondary pointer-events-none" data-icon="expand_more">expand_more</span>
</div>
<button aria-label="Export Excel" className="flex items-center gap-2 bg-surface-container-highest text-on-surface px-5 py-3 rounded-xl text-sm font-bold hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                        Export Excel
                    </button>
<button aria-label="Xuất PDF" className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-3 rounded-xl text-sm font-bold hover:bg-secondary-dim transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="picture_as_pdf">picture_as_pdf</span>
                        Export PDF
                    </button>
</div>
</div>
{/* Bento Grid Metrics */}
<div className="grid grid-cols-12 gap-6">
{/* Main Revenue Trend */}
<div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl">
<div className="flex justify-between items-center mb-12">
<h3 className="text-headline-md font-manrope font-bold">Biểu đồ doanh thu theo thời gian</h3>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-xs font-semibold text-secondary">Tháng này</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
<span className="text-xs font-semibold text-secondary">Tháng trước</span>
</div>
</div>
</div>
{/* Visual Placeholder for Line Chart */}
<div className="h-64 relative flex items-end justify-between gap-4 px-2">
<div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
<div className="border-b border-on-surface"></div>
<div className="border-b border-on-surface"></div>
<div className="border-b border-on-surface"></div>
<div className="border-b border-on-surface"></div>
</div>
{/* Mock Bars/Lines */}
<div className="w-full bg-surface-container-highest h-32 rounded-t-lg relative group">
<div className="absolute bottom-0 left-0 w-full bg-primary h-40 rounded-t-lg transition-all group-hover:h-44"></div>
</div>
<div className="w-full bg-surface-container-highest h-24 rounded-t-lg relative group">
<div className="absolute bottom-0 left-0 w-full bg-primary h-36 rounded-t-lg transition-all group-hover:h-40"></div>
</div>
<div className="w-full bg-surface-container-highest h-40 rounded-t-lg relative group">
<div className="absolute bottom-0 left-0 w-full bg-primary h-52 rounded-t-lg transition-all group-hover:h-56"></div>
</div>
<div className="w-full bg-surface-container-highest h-28 rounded-t-lg relative group">
<div className="absolute bottom-0 left-0 w-full bg-primary h-32 rounded-t-lg transition-all group-hover:h-36"></div>
</div>
<div className="w-full bg-surface-container-highest h-36 rounded-t-lg relative group">
<div className="absolute bottom-0 left-0 w-full bg-primary h-48 rounded-t-lg transition-all group-hover:h-52"></div>
</div>
<div className="w-full bg-surface-container-highest h-44 rounded-t-lg relative group">
<div className="absolute bottom-0 left-0 w-full bg-primary h-56 rounded-t-lg transition-all group-hover:h-60"></div>
</div>
</div>
<div className="flex justify-between mt-6 text-[11px] font-bold text-secondary uppercase tracking-widest px-2">
<span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
</div>
</div>
{/* Product Distribution (Donut) */}
<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
<h3 className="text-headline-md font-manrope font-bold mb-8">Danh mục sản phẩm</h3>
<div className="relative w-48 h-48 mx-auto">
<svg className="w-full h-full transform -rotate-90">
<circle className="text-surface-container-low" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="24"></circle>
<circle className="text-primary" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="150" strokeWidth="24"></circle>
<circle className="text-secondary" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="400" strokeWidth="24"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-display-sm font-manrope font-bold">72%</span>
<span className="text-xs font-semibold text-secondary">Tăng trưởng</span>
</div>
</div>
<div className="mt-8 space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-sm font-medium">Phần mềm SaaS</span>
</div>
<span className="text-sm font-bold">45%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-sm font-medium">Tư vấn tài chính</span>
</div>
<span className="text-sm font-bold">30%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
<span className="text-sm font-medium">Bảo trì hệ thống</span>
</div>
<span className="text-sm font-bold">25%</span>
</div>
</div>
</div>
{/* Representative Performance Ranking */}
<div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl">
<div className="flex justify-between items-center mb-8">
<h3 className="text-headline-md font-manrope font-bold">Xếp hạng Nhân viên xuất sắc</h3>
<span className="text-xs font-bold text-primary px-3 py-1 bg-primary-container rounded-full">Top Performers</span>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
<div className="flex items-center gap-4">
<span className="text-lg font-bold text-primary w-6">01</span>
<img alt="Rep 1" className="w-10 h-10 rounded-full" data-alt="Portrait of a confident businessman in a tailored suit smiling in a bright high-end office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqQ9iBlU3wccxAjpQ-VGZaBka7ZdTKVxATAeVTcmrUYtYol2Fd_jzLNrXHGGNSV1BrT-jRcQY2qQXeOM1elh7sr_8yK_G0j85zIvIGG8UCqpGoEcptA3eSwYgzHaQKG38yREd0K6kIEwT1YVil1G2padshswlp78AyJvs6-TlGU9eMeIJmHKYn6YvsC1w9zCsxEIEzysy2pDqFkQAZvyLpP-IpIHj8BjdCeLNcSh2ZfJA29heCHNAKFP5kfSR7lpHFqjMhQr5FbzWw"/>
<div>
<div className="text-sm font-bold">Nguyễn Minh Hoàng</div>
<div className="text-[10px] text-secondary font-bold uppercase tracking-wider">Phòng Kinh doanh 01</div>
</div>
</div>
<div className="text-right">
<div className="text-sm font-bold">₫450,000,000</div>
<div className="text-[10px] text-primary font-bold uppercase">98% Mục tiêu</div>
</div>
</div>
<div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-xl">
<div className="flex items-center gap-4">
<span className="text-lg font-bold text-secondary w-6">02</span>
<img alt="Rep 2" className="w-10 h-10 rounded-full" data-alt="Professional woman wearing modern glasses and smart casual attire in a creative studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwhJYdEEjeb3owtzMUXrXf0E2mDlR7LXIARUJ5RuWt02nFYHaaajEB7eIqDXVfcTS9Wm4B81QeiYhYLMKd-dl-up-COoV_P2ZbJwV_RMlGPmCPU1bkb3TTD8yo9VcxJMMJWDWAY_XqMGCa0rffgOnUns7t4KBkgqjzQoXL_ph5nTvGzGx5I3nj5gNaUVyNH_9O4y2zWx1Q_Melup69lXV4H1lYPxQ6GXLTu6dvWWb7msxwqR0knUDN-DAI8pv11Bk4L8vry4SwYYbO"/>
<div>
<div className="text-sm font-bold">Trần Thị Mai Anh</div>
<div className="text-[10px] text-secondary font-bold uppercase tracking-wider">Phòng Kinh doanh 02</div>
</div>
</div>
<div className="text-right">
<div className="text-sm font-bold">₫412,500,000</div>
<div className="text-[10px] text-primary font-bold uppercase">92% Mục tiêu</div>
</div>
</div>
<div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-xl">
<div className="flex items-center gap-4">
<span className="text-lg font-bold text-secondary w-6">03</span>
<img alt="Rep 3" className="w-10 h-10 rounded-full" data-alt="Young professional man in a navy polo shirt standing in a modern architectural building hallway" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc2VRYoPbr75TqjclqO4j8iUpw9V8dAkG9k7wonJuiGo1biWB4ocVPGtUDJ-EcwS0xPVuHt9u8ItOnK4e8JqzRK6EVBZbZbxMOAzh_vvgtx-5I_EZK7O1JllUsWKT-7ol3LbSXBJMVDC7BR9CUdE9AL3QJOiUa-jODPNKfdaKPE5sK9gm0TR3ypD-bKWijP7zbPj-YxN35wDzSu-qBt558ZeRAPUvneaBzJX_zw6PzXsC9Yo0UzL3AZlaVFx8w9OxUqViYy0J6pXhI"/>
<div>
<div className="text-sm font-bold">Lê Văn Tuấn</div>
<div className="text-[10px] text-secondary font-bold uppercase tracking-wider">Phòng Kinh doanh 01</div>
</div>
</div>
<div className="text-right">
<div className="text-sm font-bold">₫389,000,000</div>
<div className="text-[10px] text-primary font-bold uppercase">88% Mục tiêu</div>
</div>
</div>
</div>
</div>
{/* Quick Insights / AI Summary */}
<div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
<div className="bg-primary p-8 rounded-xl text-on-primary shadow-lg shadow-primary/20 relative overflow-hidden">
<div className="relative z-10">
<h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">Tổng doanh thu quý này</h4>
<div className="text-4xl font-manrope font-extrabold mb-4">₫12.850.000.000</div>
<div className="flex items-center gap-2 text-sm font-semibold bg-white/20 w-fit px-3 py-1 rounded-full">
<span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                                +12.4% so với quý trước
                            </div>
</div>
{/* Abstract Background Decoration */}
<div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
<div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-dim/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
</div>
<div className="bg-tertiary-container p-8 rounded-xl flex-1 flex flex-col justify-center">
<div className="flex items-start gap-4">
<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-tertiary shadow-sm">
<span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
</div>
<div>
<h4 className="text-sm font-bold text-on-tertiary-container mb-2">Thông tin AI kiến nghị</h4>
<p className="text-sm text-on-tertiary-container leading-relaxed">
                                    Doanh thu từ mảng <span className="font-bold">Phần mềm SaaS</span> đang có xu hướng tăng mạnh ở khu vực miền Nam. Cân nhắc điều chuyển thêm 2 nhân sự từ phòng Kinh doanh 02 để tối ưu hóa cơ hội này.
                                </p>
</div>
</div>
</div>
</div>
</div>
{/* Detailed Transactions / Records */}
<div className="bg-surface-container-low rounded-2xl p-2">
<div className="bg-surface-container-lowest rounded-xl p-8">
<div className="flex justify-between items-center mb-8">
<h3 className="text-headline-md font-manrope font-bold">Chi tiết giao dịch gần đây</h3>
<button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
</div>
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="text-left">
<th className="pb-6 text-[11px] font-bold text-secondary uppercase tracking-widest">Mã hóa đơn</th>
<th className="pb-6 text-[11px] font-bold text-secondary uppercase tracking-widest">Khách hàng</th>
<th className="pb-6 text-[11px] font-bold text-secondary uppercase tracking-widest">Ngày</th>
<th className="pb-6 text-[11px] font-bold text-secondary uppercase tracking-widest">Trạng thái</th>
<th className="pb-6 text-[11px] font-bold text-secondary uppercase tracking-widest text-right">Số tiền</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">
<tr className="group hover:bg-surface-container-high transition-colors">
<td className="py-5 text-sm font-bold text-on-background">INV-2024-001</td>
<td className="py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">TC</div>
<span className="text-sm font-medium">Tập đoàn Công nghệ ABC</span>
</div>
</td>
<td className="py-5 text-sm text-secondary">24 Th05, 2024</td>
<td className="py-5">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">Đã thanh toán</span>
</td>
<td className="py-5 text-sm font-bold text-right">₫120,000,000</td>
</tr>
<tr className="group hover:bg-surface-container-high transition-colors">
<td className="py-5 text-sm font-bold text-on-background">INV-2024-002</td>
<td className="py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">LM</div>
<span className="text-sm font-medium">Logistics Minh Long</span>
</div>
</td>
<td className="py-5 text-sm text-secondary">22 Th05, 2024</td>
<td className="py-5">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">Quá hạn</span>
</td>
<td className="py-5 text-sm font-bold text-right">₫85,500,000</td>
</tr>
<tr className="group hover:bg-surface-container-high transition-colors">
<td className="py-5 text-sm font-bold text-on-background">INV-2024-003</td>
<td className="py-5">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">VD</div>
<span className="text-sm font-medium">Vina Design Studio</span>
</div>
</td>
<td className="py-5 text-sm text-secondary">18 Th05, 2024</td>
<td className="py-5">
<span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">Đã thanh toán</span>
</td>
<td className="py-5 text-sm font-bold text-right">₫45,000,000</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
<footer className="mt-auto p-12 border-t border-outline-variant/10">
<div className="flex justify-between items-center text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
<span>© 2024 Ledger Pro Vietnam. Toàn bộ bản quyền được bảo lưu.</span>
<div className="flex gap-6">
<a className="hover:text-primary" href="#">Chính sách bảo mật</a>
<a className="hover:text-primary" href="#">Điều khoản dịch vụ</a>
<a className="hover:text-primary" href="#">Liên hệ hỗ trợ</a>
</div>
</div>
</footer>
      </div>
    </MainLayout>
  );
};

export default AccountingReport;
