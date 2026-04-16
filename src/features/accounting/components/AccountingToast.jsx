import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in-down">
          <div className={`
            flex items-center gap-4 px-6 py-4 rounded-3xl shadow-2xl border backdrop-blur-xl
            ${toast.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
              : 'bg-red-500/10 border-red-500/20 text-red-600'}
          `}>
            <div className={`
              w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg
              ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}
            `}>
              <span className="material-symbols-outlined text-xl">
                {toast.type === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-0.5">Hệ thống thông báo</p>
              <p className="text-sm font-bold text-acc-text-main">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
