import React from 'react';

const DashboardStat = ({ label, value, trend, isPositive, icon: Icon, color, loading, growth }) => {
  if (loading) {
    return (
      <div className="acc-card animate-pulse shadow-none border-slate-100 p-4 lg:p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-xl"></div>
          <div className="w-10 h-4 bg-slate-50 rounded-full"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-12 bg-slate-100 rounded"></div>
          <div className="h-5 w-20 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Standardized Growth Badge with Tooltip
  const GrowthBadge = ({ data }) => {
    if (!data) return (
      <div className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[0.5rem] sm:text-[0.625rem] font-black flex items-center gap-0.5 transition-transform group-hover:scale-105 sm:group-hover:scale-110 ${
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        <span className="material-symbols-outlined text-[0.6rem] sm:text-[0.7rem] leading-none">
          {isPositive ? 'trending_up' : 'trending_down'}
        </span>
        {trend}
      </div>
    );

    const { percent, isUp, prevValue, label: comparisonLabel } = data;
    const formatTooltipValue = (val) => {
      if (typeof val === 'number') return val.toLocaleString('vi-VN');
      return val;
    };

    return (
      <div className="relative group/growth">
        <div className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[0.5rem] sm:text-[0.625rem] font-black flex items-center gap-0.5 transition-all cursor-help ${
          isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <span className="material-symbols-outlined text-[0.6rem] sm:text-[0.7rem] leading-none">
            {isUp ? 'trending_up' : 'trending_down'}
          </span>
          {percent}%
        </div>

        {/* Professional Standardized Tooltip - Positioned to the left (right-full) to avoid clipping */}
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 z-[100] opacity-0 invisible group-hover/growth:opacity-100 group-hover/growth:visible transition-all duration-300 translate-x-[-8px] group-hover/growth:translate-x-0">
          <div className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl p-3.5 min-w-[180px] relative overflow-hidden origin-right">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{comparisonLabel}</span>
                <span className={`text-[10px] font-black flex items-center gap-0.5 ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {isUp ? '+' : '-'}{percent}%
                </span>
              </div>
              
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Giá trị trước đó</p>
                <p className="text-xs font-black text-slate-700 font-mono">
                  {formatTooltipValue(prevValue)} {label.includes('Hóa đơn') ? '' : 'VND'}
                </p>
              </div>

              <div className={`pt-2 border-t border-slate-100 flex items-center gap-2 ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                <span className="material-symbols-outlined text-sm">{isUp ? 'check_circle' : 'info'}</span>
                <span className="text-[9px] font-bold uppercase tracking-tight">
                  {isUp ? 'Tăng trưởng tốt' : 'Cần lưu ý'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="acc-card group relative overflow-visible cursor-pointer p-4 lg:p-5">
      {/* Decorative background element - Wrapped in overflow-hidden to prevent spilling while keeping card visible */}
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-16 h-16 bg-acc-primary/5 rounded-full transition-transform duration-500 group-hover:scale-150 z-0"></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-2 lg:mb-4">
          <div 
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-acc-primary group-hover:text-white ${color}`}
            style={{ backgroundColor: `color-mix(in srgb, currentColor, transparent 92%)` }}
          >
            {Icon && <Icon className="text-sm sm:text-base" />}
          </div>
          
          <GrowthBadge data={growth} />
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <p className="text-[8px] sm:text-[9px] text-acc-text-light font-bold truncate uppercase tracking-widest leading-none">{label}</p>
          <h2 
            className="acc-summary-value text-sm sm:text-base md:text-lg xl:text-xl font-black text-acc-text-main tracking-tight group-hover:text-acc-primary transition-colors overflow-hidden text-ellipsis leading-tight"
            title={value}
          >
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardStat;
