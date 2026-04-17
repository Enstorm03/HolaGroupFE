import React from 'react';

const DashboardStat = ({ label, value, trend, isPositive, icon: Icon, color, loading }) => {
  if (loading) {
    return (
      <div className="acc-card animate-pulse shadow-none border-slate-100" style={{ padding: 'var(--space-xl)' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
          <div className="w-16 h-6 bg-slate-50 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-2 w-20 bg-slate-100 rounded"></div>
          <div className="h-8 w-32 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="acc-card group relative overflow-hidden cursor-pointer p-4 sm:p-5 lg:p-6 xl:p-[var(--space-xl)]">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 bg-acc-primary/5 rounded-full transition-transform duration-500 group-hover:scale-150 z-0"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 lg:mb-[var(--space-lg)]">
          <div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-acc-primary group-hover:text-white ${color}`}
            style={{ backgroundColor: `color-mix(in srgb, currentColor, transparent 92%)` }}
          >
            {Icon && <Icon className="text-lg sm:text-xl" />}
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[0.625rem] font-black flex items-center gap-1 transition-transform group-hover:scale-110 ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <span className="material-symbols-outlined text-[0.75rem] leading-none">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {trend}
          </div>
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <p className="text-[10px] sm:text-label-xs text-acc-text-light">{label}</p>
          <h2 
            className="text-base sm:text-lg md:text-xl xl:text-[1.625rem] font-black whitespace-nowrap text-acc-text-main tracking-tight group-hover:text-acc-primary transition-colors overflow-hidden text-ellipsis"
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
