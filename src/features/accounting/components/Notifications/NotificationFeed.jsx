import React from 'react';
import { WarningIcon, SuccessIcon, NotificationIcon } from '../Icons/AccountingIcons';

const NotificationFeed = ({ notifications, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center space-y-4 opacity-50 flex flex-col items-center justify-center h-full py-10">
        <NotificationIcon className="text-4xl" />
        <p className="text-[10px] font-black uppercase tracking-widest text-acc-text-muted">Danh sách trống</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {notifications.map((notif) => (
        <div 
          key={notif.id} 
          className="rounded-2.5xl bg-slate-50/50 hover:bg-white hover:shadow-float transition-all duration-300 border border-transparent hover:border-slate-100 group cursor-pointer"
          style={{ padding: 'var(--space-base)' }}
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
              <p className="text-body-sm text-acc-text-muted group-hover:text-acc-text-main leading-snug">
                {notif.message}
              </p>
              <p className="text-label-xs text-acc-text-light opacity-60">Vừa xong</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationFeed;
