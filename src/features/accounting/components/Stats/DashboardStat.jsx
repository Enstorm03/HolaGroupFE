import React from 'react';

const DashboardStat = ({ label, value, trend, isPositive, icon: Icon, color, loading }) => {
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

  return (
    <div className="acc-card group relative overflow-hidden cursor-pointer p-4 lg:p-5">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-16 h-16 bg-acc-primary/5 rounded-full transition-transform duration-500 group-hover:scale-150 z-0"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-2 lg:mb-4">
          <div 
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-acc-primary group-hover:text-white ${color}`}
            style={{ backgroundColor: `color-mix(in srgb, currentColor, transparent 92%)` }}
          >
            {Icon && <Icon className="text-sm sm:text-base" />}
          </div>
          <div className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[0.5rem] sm:text-[0.625rem] font-black flex items-center gap-0.5 transition-transform group-hover:scale-105 sm:group-hover:scale-110 ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <span className="material-symbols-outlined text-[0.6rem] sm:text-[0.7rem] leading-none">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {trend}
          </div>
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <p className="text-[8px] sm:text-[9px] text-acc-text-light font-bold truncate uppercase tracking-widest leading-none">{label}</p>
          <h2 
            className="text-sm sm:text-base md:text-lg xl:text-xl font-black text-acc-text-main tracking-tight group-hover:text-acc-primary transition-colors overflow-hidden text-ellipsis leading-tight"
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
