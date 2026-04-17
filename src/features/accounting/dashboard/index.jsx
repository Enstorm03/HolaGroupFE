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

  // Fetch dữ liệu tổng quát (chỉ gọi 1 lần khi load trang)
  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await accountingService.getDashboardStats();
      setStats(result);
    } catch (err) {
      console.error(err);
      setError("Dữ liệu hệ thống chưa sẵn sàng");
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu biểu đồ (gọi lại mỗi khi timeframe đổi)
  const fetchChart = async (tf) => {
    try {
      setChartLoading(true);
      setError(null);
      const result = await accountingService.getRevenueData(tf);
      setChartData(result?.chartData || []);
    } catch (err) {
      console.warn(`Endpoint /api/reports/${tf} not found or server error. Using internal mock fallback.`);
      // Nếu lỗi 404 (endpoint chưa có), ta để chartData rỗng 
      // để Component con (DailyActivityGrid) tự render dữ liệu giả lập
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    // Clear old chart data immediately to prevent schema mismatch between components
    setChartData([]);
    fetchChart(timeframe);
  }, [timeframe]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!stats) return;
    try {
      setIsExporting(true);
      showToast("Đang chuẩn bị báo cáo tài chính...", "info");
      
      // Tạo style in ấn tối ưu cho Dashboard (A4 Landscape)
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          /* Reset tuyệt đối */
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 297mm !important;
            height: 210mm !important;
            background: white !important;
          }

          /* Ẩn root App */
          #root { 
            display: none !important; 
          }
          
          /* Hiển thị vùng in lấy từ Portal */
          #printable-accounting-report { 
            display: block !important;
            position: relative !important; 
            width: 297mm !important;
            padding: 15mm !important;
            margin: 0 auto !important;
            background: white !important;
            box-sizing: border-box !important;
            visibility: visible !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page { 
            size: landscape; 
            margin: 0; 
          }
        }
      `;
      document.head.appendChild(style);
      
      // Đợi UI render template (nếu cần)
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

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full gap-2 sm:gap-3 lg:gap-4" id="accounting-dashboard-content">
      {/* Header - Scalable responsive sizing */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0 px-1">
        <div className="space-y-1">
          <h1 className="text-acc-text-main leading-tight font-black" style={{ fontSize: '2rem' }}>Trung tâm Tài chính</h1>
          <p className="text-base text-acc-text-muted flex items-center gap-2 font-medium">
            Phân tích dữ liệu theo <span className="text-acc-primary font-bold"> {timeframeLabels[timeframe].toLowerCase()}</span>
          </p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="acc-btn-primary px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-blue-800/10 active:scale-95 transition-all text-[10px] sm:text-label-xs disabled:opacity-50 w-full md:w-auto"
        >
          <span className={`material-symbols-outlined text-base sm:text-lg ${isExporting ? 'animate-spin' : ''}`}>
            {isExporting ? 'sync' : 'picture_as_pdf'}
          </span>
          {isExporting ? 'Đang chuẩn bị...' : `XUẤT BÁO CÁO ${timeframeLabels[timeframe].toUpperCase()}`}
        </button>
      </div>

      {/* Stats Grid - Fluid responsive columns */}
      <div 
        className="grid grid-cols-2 lg:grid-cols-4 shrink-0 gap-2 sm:gap-3 lg:gap-4" 
      >
        <DashboardStat label="Tổng Doanh thu" value={formatCurrency(stats?.totalRevenue)} trend="+14.2%" isPositive={true} icon={RevenueIcon} color="text-blue-600" loading={loading} />
        <DashboardStat label="Tổng Công nợ" value={formatCurrency(stats?.totalDebt)} trend="+2.4%" isPositive={false} icon={DebtIcon} color="text-amber-500" loading={loading} />
        <DashboardStat label="Hóa đơn" value={stats?.pendingInvoices} trend="-4" isPositive={true} icon={InvoiceIcon} color="text-indigo-500" loading={loading} />
        <DashboardStat label="Tồn quỹ" value={formatCurrency(stats?.cashBalance)} trend="+5.12%" isPositive={true} icon={WalletIcon} color="text-emerald-500" loading={loading} />
      </div>

      {/* Main Content Grid - Expanding to fill available height */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0">
          <div className={`acc-card flex-1 flex flex-col relative p-4 sm:p-5 ${timeframe === 'daily' ? 'pb-0 sm:pb-0' : ''}`}>
            <div className="flex justify-between items-center mb-4 lg:mb-5">
              <div className="space-y-1">
                <h3 className="text-heading-sm text-acc-text-main">Phân tích Doanh thu</h3>
                <p className="text-label-xs text-acc-text-light">Dữ liệu doanh thu thực tế</p>
              </div>
              
              {/* Timeframe Switcher UI Pro Max */}
              <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 sm:px-6 py-2 rounded-xl text-[0.625rem] font-black uppercase tracking-widest transition-all ${
                      timeframe === tf 
                      ? 'bg-white text-acc-primary shadow-sm' 
                      : 'text-slate-400 hover:text-acc-text-main'
                    }`}
                  >
                    {tf === 'daily' ? 'Ngày' : tf === 'weekly' ? 'Tuần' : tf === 'monthly' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              {timeframe === 'daily' ? (
                <DailyActivityGrid loading={chartLoading} apiData={chartData} />
              ) : (
                <RevenueAreaChart data={chartData} loading={chartLoading} />
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0">
          <div className="acc-card flex-1 flex flex-col overflow-hidden bg-white p-4 sm:p-5">
            <div className="flex justify-between items-center shrink-0 mb-4 lg:mb-5">
              <div className="space-y-1">
                <h3 className="text-heading-sm text-acc-text-main">Giao dịch gần đây</h3>
                <p className="text-label-xs text-acc-text-light">Thông báo hệ thống mới nhất</p>
              </div>
              <span className="w-8 h-8 bg-acc-primary/10 text-acc-primary text-[11px] font-black rounded-xl flex items-center justify-center border border-acc-primary/20">
                {stats?.notifications?.length || 0}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              <NotificationFeed notifications={stats?.notifications} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Printable Template rendered at body level via Portal */}
      {createPortal(
        <PrintableDashboardTemplate 
          stats={stats} 
          timeframeLabels={timeframeLabels} 
          timeframe={timeframe} 
        />,
        document.body
      )}
    </div>
  );
};

export default AccountingDashboard;
