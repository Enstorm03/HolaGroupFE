import React, { useState, useEffect } from 'react';
import accountingService from '../services/accountingService';
import { useToast } from '../components/AccountingToast';
import { exportToPDF } from '../utils/exportUtils';

// Import components
import DashboardStat from '../components/Stats/DashboardStat';
import RevenueAreaChart from '../components/Charts/RevenueAreaChart';
import NotificationFeed from '../components/Notifications/NotificationFeed';
import { 
  RevenueIcon, DebtIcon, InvoiceIcon, WalletIcon, DownloadIcon 
} from '../components/Icons/AccountingIcons';

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
      const result = await accountingService.getRevenueData(tf);
      setChartData(result?.chartData || []);
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi tải dữ liệu biểu đồ", "error");
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchChart(timeframe);
  }, [timeframe]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!stats) return;
    try {
      setIsExporting(true);
      showToast("Đang khởi tạo bản in Pro Max...", "info");
      await exportToPDF('accounting-dashboard-content', `Bao_cao_tai_chinh_${timeframe}.pdf`);
      showToast("Xuất báo cáo thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi tạo PDF", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const timeframeLabels = {
    weekly: 'Tuần này',
    monthly: 'Tháng này',
    yearly: 'Năm nay'
  };

  return (
    <div className="space-y-6" style={{ paddingBottom: 'var(--space-xl)' }} id="accounting-dashboard-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up">
        <div className="space-y-1">
          <h1 className="text-display-sm text-acc-text-main">Trung tâm Tài chính</h1>
          <p className="text-body-sm text-acc-text-muted flex items-center gap-2">
            Phân tích dữ liệu theo <span className="text-acc-primary font-bold"> {timeframeLabels[timeframe].toLowerCase()}</span>
          </p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="acc-btn-primary px-6 py-2.5 flex items-center gap-3 shadow-2xl shadow-blue-800/10 active:scale-95 transition-all text-label-xs disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-lg ${isExporting ? 'animate-spin' : ''}`}>
            {isExporting ? 'sync' : 'picture_as_pdf'}
          </span>
          {isExporting ? 'Đang chuẩn bị...' : `XUẤT BÁO CÁO ${timeframeLabels[timeframe].toUpperCase()}`}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--space-lg)' }}>
        <DashboardStat label="Tổng Doanh thu" value={stats?.totalRevenue} trend="+14.2%" isPositive={true} icon={RevenueIcon} color="text-blue-600" loading={loading} />
        <DashboardStat label="Tổng Công nợ" value={stats?.totalDebt} trend="+2.4%" isPositive={false} icon={DebtIcon} color="text-amber-500" loading={loading} />
        <DashboardStat label="Hóa đơn chờ" value={stats?.pendingInvoices} trend="-4" isPositive={true} icon={InvoiceIcon} color="text-indigo-500" loading={loading} />
        <DashboardStat label="Tồn quỹ" value={stats?.cashBalance} trend="+5.12%" isPositive={true} icon={WalletIcon} color="text-emerald-500" loading={loading} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12" style={{ gap: 'var(--space-lg)' }}>
        <div className="col-span-12 lg:col-span-8">
          <div className="acc-card flex flex-col relative" style={{ padding: 'var(--space-xl)', height: '32rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-xl)' }}>
              <div className="space-y-1">
                <h3 className="text-heading-sm text-acc-text-main">Phân tích Doanh thu</h3>
                <p className="text-label-xs text-acc-text-light">Dữ liệu doanh thu thực tế</p>
              </div>
              
              {/* Timeframe Switcher UI Pro Max */}
              <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                {['weekly', 'monthly', 'yearly'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      timeframe === tf 
                      ? 'bg-white text-acc-primary shadow-sm' 
                      : 'text-slate-400 hover:text-acc-text-main'
                    }`}
                  >
                    {tf === 'weekly' ? 'Tuần' : tf === 'monthly' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              <RevenueAreaChart data={chartData} loading={chartLoading} />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="acc-card h-full flex flex-col overflow-hidden bg-white">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-label-xs text-acc-text-main">Giao dịch gần đây</h4>
              <span className="w-6 h-6 bg-acc-primary text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                {stats?.notifications?.length || 0}
              </span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <NotificationFeed notifications={stats?.notifications} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;
