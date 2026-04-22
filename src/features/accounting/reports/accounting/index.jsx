import React, { useState, useEffect } from 'react';
import accountingService from '../../services/accountingService';
import { exportToPDF } from '../../utils/exportUtils';
import { useToast } from '../../components/Common/AccountingToast';

const AccountingReport = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      showToast("Đang kết xuất báo cáo phân tích...", "info");
      await exportToPDF('accounting-report-vignette', 'Bao_cao_phan_tich_tai_chinh.pdf');
      showToast("Xuất báo cáo PDF thành công!", "success");
    } catch (err) {
      showToast("Không thể xuất báo cáo", "error");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await accountingService.getDashboardStats();
        setReportData(response);
      } catch (err) {
        console.error("Report Fetch Error:", err);
        setError("Không thể tải báo cáo từ API.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-up" style={{ gap: 'var(--space-lg)' }} id="accounting-report-vignette">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0 px-1">
        <div className="space-y-1">
          <h1 className="text-acc-text-main leading-tight font-black text-3xl sm:text-4xl lg:text-[2rem] uppercase tracking-tight">PHÂN TÍCH & BÁO CÁO</h1>
          <p className="text-base text-acc-text-muted font-medium">Báo cáo hiệu suất kinh doanh thời gian thực kết nối Backend.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="acc-btn-primary flex items-center gap-3 shadow-lg shadow-blue-800/10 text-label-xs group py-2.5 disabled:opacity-50 shrink-0"
        >
          <span className={`material-symbols-outlined text-lg ${isExporting ? 'animate-spin' : ''}`}>
            {isExporting ? 'sync' : 'picture_as_pdf'}
          </span>
          {isExporting ? 'Đang kết xuất...' : 'XUẤT PDF BÁO CÁO'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-acc-error rounded-2xl flex items-center gap-4 transition-all" style={{ padding: 'var(--space-base) var(--space-lg)' }}>
          <span className="material-symbols-outlined text-xl">error_outline</span>
          <p className="text-body-sm font-bold">{error}</p>
        </div>
      )}

      {/* Report Sections - Scrollable grid if content exceeds */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="grid grid-cols-12" style={{ gap: 'var(--space-lg)' }}>
          <div className="col-span-12 lg:col-span-6">
            <div className="acc-card min-h-[250px] flex flex-col items-center justify-center text-center shadow-float" style={{ padding: 'var(--space-xl)', gap: 'var(--space-base)' }}>
              {loading ? (
                  <div className="w-10 h-10 border-4 border-acc-primary border-t-transparent rounded-full animate-spin"></div>
               ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-3xl text-slate-200">pie_chart</span>
                    </div>
                    <p className="text-label-xs text-acc-text-muted opacity-40">Biểu đồ Tỷ trọng Doanh thu</p>
                    <p className="text-body-sm text-slate-400 italic">Đang cập nhật...</p>
                  </>
               )}
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-6">
            <div className="acc-card min-h-[250px] flex flex-col items-center justify-center text-center shadow-float" style={{ padding: 'var(--space-xl)', gap: 'var(--space-base)' }}>
              {loading ? (
                  <div className="w-10 h-10 border-4 border-acc-primary border-t-transparent rounded-full animate-spin"></div>
               ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-4xl text-slate-200">leaderboard</span>
                    </div>
                    <p className="text-label-xs text-acc-text-muted opacity-40">Biểu đồ Tăng trưởng</p>
                    <p className="text-body-sm text-slate-400 italic">Đang phân tích xu hướng...</p>
                  </>
               )}
            </div>
          </div>

          <div className="col-span-12">
            <div className="acc-card min-h-[250px] flex flex-col items-center justify-center border-dashed border-2 border-slate-100 bg-slate-50/30" style={{ padding: 'var(--space-xl)' }}>
               <div className="flex flex-col items-center gap-4 opacity-40">
                  <span className="material-symbols-outlined text-5xl">table_view</span>
                  <p className="text-body-sm font-medium text-acc-text-muted text-center max-w-md">
                    Bảng Hiệu suất Nhân viên và Chi tiết giao dịch sẽ hiển thị tự động khi có luồng dữ liệu thực tế từ Port 5000.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingReport;
