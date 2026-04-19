import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import accountingService from '../services/accountingService';
import { useToast } from '../components/Common/AccountingToast';
import { exportToPDF } from '../utils/exportUtils';

// Import components
import DashboardStat from '../components/Stats/DashboardStat';
import RevenueAreaChart from '../components/Charts/RevenueAreaChart';
import DailyActivityGrid from '../components/Charts/DailyActivityGrid';
import NotificationFeed from '../components/Notifications/NotificationFeed';
import { 
  RevenueIcon, DebtIcon, InvoiceIcon, WalletIcon, DownloadIcon 
} from '../components/Icons/AccountingIcons';
import PrintableDashboardTemplate from '../components/Print/PrintableDashboardTemplate';

const AccountingDashboard = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('monthly');
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await accountingService.getDashboardStats();
      setStats(result);
    } catch (err) {
      setError("Dữ liệu hệ thống chưa sẵn sàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async (tf) => {
    try {
      setChartLoading(true);
      const result = await accountingService.getRevenueData(tf);
      setChartData(Array.isArray(result) ? result : (result?.chartData || []));
    } catch (err) {
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setChartData([]);
    fetchChart(timeframe);
  }, [timeframe]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!stats) return;
    try {
      setIsExporting(true);
      showToast("Đang chuẩn bị báo cáo tài chính…", "info");
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; width: 297mm !important; height: 210mm !important; background: white !important; }
          #root { display: none !important; }
          #printable-accounting-report { display: block !important; width: 297mm !important; padding: 15mm !important; margin: 0 auto !important; background: white !important; visibility: visible !important; }
          * { -webkit-print-color-adjust: exact !important; }
          @page { size: landscape; margin: 0; }
        }
      `;
      document.head.appendChild(style);
      setTimeout(() => {
        window.print();
        document.head.removeChild(style);
        setIsExporting(false);
        showToast("Xuất báo cáo thành công!", "success");
      }, 500);
    } catch (err) {
      showToast("Lỗi khi tạo PDF", "error");
      setIsExporting(false);
    }
  };

  const timeframeLabels = {
    daily: 'Hôm nay',
    weekly: 'Tuần này',
    monthly: 'Tháng này',
    yearly: 'Năm nay'
  };

   const formatCurrency = (val) => {
    if (val === undefined || val === null) return "0 VNĐ";
    if (typeof val === 'string') return val.replace(/[đ₫]/g, ' VNĐ');
    return val.toLocaleString('vi-VN') + ' VNĐ';
  };

  if (loading && !stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-[400px]">
        <div className="w-12 h-12 border-4 border-acc-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-acc-text-muted uppercase tracking-[0.2em] animate-pulse">Đang tải dữ liệu…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 sm:gap-6 lg:gap-5" id="accounting-dashboard-content">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 px-1 shrink-0">
        <div className="space-y-2">
          <h1 className="text-acc-text-main leading-tight font-black text-3xl sm:text-4xl lg:text-[2rem] uppercase tracking-tight">Trung tâm Tài chính</h1>
          <p className="text-sm sm:text-base text-acc-text-muted flex items-center gap-2 font-medium">
            Phân tích dữ liệu <span className="text-acc-primary font-bold bg-blue-50 px-2 py-0.5 rounded-lg"> {timeframeLabels[timeframe].toLowerCase()}</span>
          </p>
        </div>
        <button 
          onClick={handleExport} 
          disabled={isExporting} 
          className="acc-btn-primary px-5 py-4 lg:py-2.5 flex items-center justify-center gap-3 shadow-xl shadow-blue-800/10 active:scale-95 transition-[transform,opacity,background-color,box-shadow] duration-300 text-[11px] sm:text-label-xs disabled:opacity-50 w-full lg:w-auto rounded-2xl lg:rounded-xl"
          aria-label="Xuất báo cáo tài chính sang PDF"
        >
          <span className={`material-symbols-outlined text-lg ${isExporting ? 'animate-spin' : ''}`} aria-hidden="true">
            {isExporting ? 'sync' : 'picture_as_pdf'}
          </span>
          {isExporting ? 'Đang chuẩn bị…' : `XUẤT BÁO CÁO ${timeframeLabels[timeframe].toUpperCase()}`}
        </button>
      </div>

      {/* Stats Section */}
      <section className="space-y-3">
        <h4 className="px-1 text-[9px] font-black text-acc-text-light uppercase tracking-[0.2em]">Chỉ số quan trọng</h4>
        <div 
        className="grid grid-cols-2 lg:grid-cols-4 shrink-0 gap-3 sm:gap-4" 
      >
    <DashboardStat label="Tổng Doanh thu" value={formatCurrency(stats?.totalRevenue)} trend="+14.2%" isPositive={true} icon={RevenueIcon} color="text-blue-600" loading={loading} />
          <DashboardStat label="Tổng Công nợ" value={formatCurrency(stats?.totalDebt)} trend="+2.4%" isPositive={false} icon={DebtIcon} color="text-amber-500" loading={loading} />
          <DashboardStat label="Hóa đơn" value={stats?.pendingInvoices} trend="-4" isPositive={true} icon={InvoiceIcon} color="text-indigo-500" loading={loading} />
          <DashboardStat label="Tồn quỹ" value={formatCurrency(stats?.cashBalance)} trend="+5.12%" isPositive={true} icon={WalletIcon} color="text-emerald-500" loading={loading} />
        </div>
      </section>

      {/* Analysis Section */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 lg:gap-5 lg:overflow-y-auto xl:overflow-visible scrollbar-thin scrollbar-thumb-slate-200 pr-1 pt-4 pb-4 xl:-mt-6">
        <div className="col-span-12 xl:col-span-8 flex flex-col min-h-[400px] lg:min-h-0">
          <div className="acc-card flex-1 flex flex-col p-4 sm:p-5 lg:p-6 pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-acc-text-main uppercase tracking-tight">Phân tích Doanh thu</h3>
                <p className="text-xs text-acc-text-light font-bold">Biểu đồ biến động thực tế</p>
              </div>
              
              <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                 <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50 shadow-inner w-max" role="tablist" aria-label="Lựa chọn khung thời gian">
                    {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
                      <button 
                        key={tf} 
                        onClick={() => setTimeframe(tf)} 
                        role="tab"
                        aria-selected={timeframe === tf}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-[transform,background-color,color,box-shadow] duration-300 whitespace-nowrap ${timeframe === tf ? 'bg-white text-acc-primary shadow-md scale-105' : 'text-slate-500 hover:text-acc-text-main'}`}>
                        {tf === 'daily' ? 'Ngày' : tf === 'weekly' ? 'Tuần' : tf === 'monthly' ? 'Tháng' : 'Năm'}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[350px] lg:min-h-0">
              {timeframe === 'daily' ? (
                <DailyActivityGrid loading={chartLoading} apiData={chartData} />
              ) : (
                <RevenueAreaChart data={chartData} loading={chartLoading} />
              )}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="col-span-12 xl:col-span-4 flex flex-col min-h-[400px] lg:min-h-0 mb-6 lg:mb-0">
          <div className="acc-card flex-1 flex flex-col overflow-hidden bg-white p-4 sm:p-5 lg:p-6">
            <div className="flex justify-between items-center shrink-0 mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-acc-text-main uppercase tracking-tight">Giao dịch mới</h3>
                <p className="text-xs text-acc-text-light font-bold">Thông báo nghiệp vụ</p>
              </div>
              <span className="w-10 h-10 bg-slate-900 text-white text-[12px] font-black rounded-xl flex items-center justify-center shadow-lg">
                {stats?.notifications?.length || 0}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              <NotificationFeed notifications={stats?.notifications} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <PrintableDashboardTemplate stats={stats} timeframeLabels={timeframeLabels} timeframe={timeframe} />,
        document.body
      )}
    </div>
  );
};

export default AccountingDashboard;
