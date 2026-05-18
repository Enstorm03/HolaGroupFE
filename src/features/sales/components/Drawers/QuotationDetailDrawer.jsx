import React, { useEffect } from 'react';
import { Drawer, Box, IconButton, Divider } from '@mui/material';

const formatCurrency = (val) => {
  if (val === undefined || val === null) return "0 VND";
  const formatted = new Intl.NumberFormat('vi-VN').format(val);
  return (
    <span className="flex items-baseline gap-1">
      <span className="font-black text-slate-900">{formatted}</span>
      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">VND</span>
    </span>
  );
};

const QuotationDetailDrawer = ({ open, onClose, quotation }) => {
  // Prevent focus-trapping DevTools warning by blurring any focused descendant when drawer is closed
  useEffect(() => {
    if (!open) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [open]);

  if (!quotation) return null;

  const steps = [
    { label: 'Khởi tạo', date: '20/05/2024 09:15', status: 'completed' },
    { label: 'Gửi khách hàng', date: '21/05/2024 14:30', status: 'completed' },
    { label: 'Khách hàng phản hồi', date: '22/05/2024 10:20', status: 'active' },
    { label: 'Chốt đơn hàng', date: '---', status: 'pending' },
  ];

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { 
            width: { xs: '100%', sm: 550 }, 
            borderLeft: '1px solid #e2e8f0', 
            boxShadow: '-20px 0 50px rgba(0,0,0,0.05)',
            borderRadius: { xs: 0, sm: '2.5rem 0 0 2.5rem' },
            overflow: 'hidden'
          }
        }
      }}
    >
      <Box className="h-full flex flex-col bg-slate-50 font-inter">
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">
              Chi tiết báo giá <span className="text-[#00288E]">.</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              ID: {quotation.id} • {quotation.date}
            </p>
          </div>
          <IconButton onClick={onClose} className="bg-slate-50 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* Status Banner */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Trạng thái hiện tại</p>
                <h3 className="text-xl font-black uppercase tracking-tight">{quotation.status}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-3xl">assignment</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-300">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person</span> Thông tin đối tác
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                {quotation.avatar}
              </div>
              <div>
                <h5 className="font-black text-slate-900 uppercase tracking-tight">{quotation.name}</h5>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{quotation.email}</p>
                <div className="mt-2 inline-block px-2 py-1 rounded-lg bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {quotation.group}
                </div>
              </div>
            </div>
            <Divider className="opacity-50" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Mã số thuế</p>
                <p className="text-xs font-bold text-slate-700">0102345678-001</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Số điện thoại</p>
                <p className="text-xs font-bold text-slate-700">0982 • 334 • 999</p>
              </div>
            </div>
          </div>

          {/* Timeline / Progress */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-300">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">history</span> Lịch sử xử lý
            </h4>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 
                    step.status === 'active' ? 'bg-blue-600 shadow-lg shadow-blue-100 scale-110' : 'bg-slate-200'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {step.status === 'completed' ? 'check' : step.status === 'active' ? 'more_horiz' : 'schedule'}
                    </span>
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-dashed border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị dự kiến</span>
              {formatCurrency(quotation.value)}
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thuế GTGT (10%)</span>
              {formatCurrency(quotation.value * 0.1)}
            </div>
            <Divider className="my-4" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng cộng (VAT)</p>
                <div className="text-2xl font-black text-slate-900 tracking-tighter">
                  {formatCurrency(quotation.value * 1.1)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">Có hiệu lực 30 ngày</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/95 backdrop-blur-md border-t border-slate-200 flex gap-4 z-10 font-inter">
          <button className="flex-1 group flex items-center justify-center gap-2 bg-[#00288E] hover:bg-white text-white hover:text-[#00288E] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/10 border-2 border-[#00288E] active:scale-95">
            <span className="material-symbols-outlined text-sm">print</span> In báo giá
          </button>
          <button className="flex-1 group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 border-slate-300 active:scale-95">
            <span className="material-symbols-outlined text-sm">send</span> Gửi lại Email
          </button>
        </div>
      </Box>
    </Drawer>
  );
};

export default QuotationDetailDrawer;
