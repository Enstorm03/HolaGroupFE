import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WarningIcon, SuccessIcon, NotificationIcon } from '../Icons/AccountingIcons';

const NotificationFeed = ({ notifications, loading }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 w-full bg-slate-50 animate-pulse rounded-2xl"></div>
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
    navigate(`/accounting/transaction/${notif.id}`, { state: { transaction: notif } });
  };

  const resolveMessage = (notif) => {
    if (!notif.message) return "";
    if (notif.count !== undefined) {
      return notif.message.replace(/{count}|(?<=Có )\d+/, notif.count);
    }
    return notif.message;
  };

  return (
    <div className="flex flex-col h-full bg-white transition-all select-none">
      {/* Items Container - Optimized for perfect fit without overflow */}
      <div className="flex-1 flex flex-col gap-2.5 sm:gap-3 overflow-hidden">
        {currentItems.map((notif) => (
          <div 
            key={notif.id} 
            onClick={() => handleDetail(notif)}
            className="rounded-2.5xl bg-slate-50/50 hover:bg-white hover:shadow-float active:scale-[0.99] transition-all duration-300 border border-slate-200 hover:border-slate-300 group cursor-pointer p-3.5 lg:p-[var(--space-base,14px)]"
          >
            <div className="flex gap-4 items-start">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-white group-hover:shadow-md ${
                  notif.type === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                }`}
                style={{ backgroundColor: `color-mix(in srgb, currentColor, transparent 94%)` }}
              >
                  {notif.type === 'warning' ? <WarningIcon className="text-sm" /> : <SuccessIcon className="text-sm" />}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[13px] sm:text-body-sm text-acc-text-muted group-hover:text-acc-text-main leading-snug font-bold line-clamp-2">
                  {resolveMessage(notif)}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                   <p className="text-[9px] sm:text-label-xs text-acc-text-light/70 font-black uppercase tracking-tighter">{notif.time || 'Vừa xong'}</p>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <p className="text-[9px] sm:text-label-xs text-acc-primary font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">CHI TIẾT →</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Synchronized Pagination Footer - Refined spacing */}
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all flex items-center justify-center border border-transparent active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
             <input 
               type="text" 
               value={currentPage}
               onChange={handleJumpPage}
               className="w-5 h-5 border-none bg-transparent p-0 text-center text-label-xs font-black text-acc-primary focus:ring-0"
             />
             <span className="text-label-xs font-black text-acc-text-light/40 tracking-widest">/ {totalPages}</span>
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all flex items-center justify-center border border-transparent active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-sm">
           <div className="text-right">
             <p className="text-[10px] font-black text-acc-text-main tabular-nums leading-none">
               {startIndex + 1} - {Math.min(startIndex + itemsPerPage, notifications.length)}
             </p>
             <p className="text-[8px] font-bold text-acc-text-light/60 uppercase tracking-widest mt-0.5">GIAO DỊCH</p>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-acc-primary/10 flex items-center justify-center">
             <div className="w-1 h-1 rounded-full bg-acc-primary animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;
