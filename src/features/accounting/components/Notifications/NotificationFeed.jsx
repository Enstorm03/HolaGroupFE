import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WarningIcon, SuccessIcon, NotificationIcon } from '../Icons/AccountingIcons';

const NotificationFeed = ({ notifications, loading }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center space-y-4 opacity-50 flex flex-col items-center justify-center h-full py-10">
        <NotificationIcon className="text-4xl" />
        <p className="text-[0.625rem] font-black uppercase tracking-widest text-acc-text-muted">Danh sách trống</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = notifications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleJumpPage = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      handlePageChange(value);
    }
  };

  const handleDetail = (notif) => {
    // Navigate to detail page with notification data
    navigate(`/accounting/transaction/${notif.id}`, { state: { transaction: notif } });
  };

  // Hàm xử lý thông báo thông minh (Smart Link)
  const resolveMessage = (notif) => {
    if (!notif.message) return "";
    if (notif.count !== undefined) {
      // Thay thế {count} hoặc con số bất kỳ sau chữ "Có " bằng số lượng thực tế
      return notif.message.replace(/{count}|(?<=Có )\d+/, notif.count);
    }
    return notif.message;
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {currentItems.map((notif) => (
          <div 
            key={notif.id} 
            onClick={() => handleDetail(notif)}
            className="rounded-2.5xl bg-slate-50/50 hover:bg-white hover:shadow-float transition-all duration-300 border border-transparent hover:border-slate-100 group cursor-pointer p-3 sm:p-4 lg:p-[var(--space-base)]"
          >
            <div className="flex gap-4 items-start">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                  notif.type === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                }`}
                style={{ backgroundColor: `color-mix(in srgb, currentColor, transparent 92%)` }}
              >
                  {notif.type === 'warning' ? <WarningIcon className="text-lg" /> : <SuccessIcon className="text-lg" />}
              </div>
              <div className="space-y-1 pt-1">
                <p className="text-body-sm text-acc-text-muted group-hover:text-acc-text-main leading-snug line-clamp-2">
                  {resolveMessage(notif)}
                </p>
                <div className="flex items-center gap-2">
                   <p className="text-label-xs text-acc-text-light opacity-60">{notif.time || 'Vừa xong'}</p>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <p className="text-label-xs text-acc-primary font-bold">Chi tiết →</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Slimmer on small screens */}
      <div className="mt-2 sm:mt-6 pt-2 sm:pt-4 border-t border-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 sm:p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">chevron_left</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3">
             <input 
               type="text" 
               value={currentPage}
               onChange={handleJumpPage}
               className="w-8 h-6 sm:w-10 sm:h-8 border border-slate-200 rounded-lg text-center text-[10px] sm:text-label-xs font-black text-acc-primary"
             />
             <span className="text-[10px] sm:text-label-xs text-acc-text-light">/ {totalPages}</span>
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 sm:p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">chevron_right</span>
          </button>
        </div>
        
        <p className="text-[9px] sm:text-[0.625rem] font-bold text-acc-text-light uppercase tracking-tighter">
          {startIndex + 1}-{Math.min(startIndex + itemsPerPage, notifications.length)} / {notifications.length}
        </p>
      </div>
    </div>
  );
};

export default NotificationFeed;
