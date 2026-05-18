import React, { useEffect } from 'react';
import { Drawer, Box, IconButton, Typography, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const OrderDetailDrawer = ({ open, onClose, order }) => {
  // Prevent focus-trapping DevTools warning by blurring any focused descendant when drawer is closed
  useEffect(() => {
    if (!open) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [open]);

  if (!order) return null;

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "0 VND";
    const num = typeof val === 'number' ? val : Number(val.toString().replace(/[đ₫\sVND.]/g, ''));
    return new Intl.NumberFormat('vi-VN').format(num) + " VND";
  };

  const getStatusChip = (status) => {
    const statusMap = {
      'PENDING': { label: 'Chờ xác nhận', color: 'warning' },
      'CONFIRMED': { label: 'Đã xác nhận', color: 'info' },
      'SHIPPING': { label: 'Đang giao', color: 'primary' },
      'DELIVERED': { label: 'Hoàn thành', color: 'success' },
      'CANCELLED': { label: 'Đã hủy', color: 'error' }
    };
    const config = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 'bold', borderRadius: '8px' }} />;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { 
            width: { xs: '100%', sm: 550 }, 
            borderRadius: { xs: 0, sm: '2.5rem 0 0 2.5rem' }, 
            overflow: 'hidden',
            borderLeft: '1px solid #e2e8f0', 
            boxShadow: '-20px 0 50px rgba(0,0,0,0.05)'
          }
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }} className="font-inter">
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">
              Chi tiết đơn hàng <span className="text-[#00288E]"># {order.id}</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Ngày đặt: {order.date}
            </p>
          </div>
          <IconButton onClick={onClose} className="bg-slate-50 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </IconButton>
        </div>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <div className="flex flex-col gap-6">
            
            {/* Customer Info Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                  {order.avatar}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">{order.customer}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.phone}</p>
                </div>
                <div className="ml-auto">
                  {getStatusChip(order.rawStatus || 'PENDING')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phương thức thanh toán</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">Chuyển khoản ngân hàng</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ trách</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">Hệ thống</p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-300">
              <h4 className="font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">inventory_2</span>
                Danh sách sản phẩm
              </h4>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shrink-0">
                        {item.icon || '📦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 break-words whitespace-normal">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-slate-900 shrink-0 ml-4 whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center opacity-70">
                  <span className="text-xs font-bold uppercase tracking-widest">Tạm tính</span>
                  <span className="text-sm font-bold">{formatCurrency(order.total / 1.1)}</span>
                </div>
                <div className="flex justify-between items-center opacity-70">
                  <span className="text-xs font-bold uppercase tracking-widest">Thuế (10%)</span>
                  <span className="text-sm font-bold">{formatCurrency(order.total - (order.total / 1.1))}</span>
                </div>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">Tổng cộng</span>
                  <span className="text-2xl font-black text-blue-400">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Timeline / Activity */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-300">
              <h4 className="font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">history</span>
                Lịch sử xử lý
              </h4>
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Vừa xong</p>
                  <p className="text-sm font-bold text-slate-800">Đơn hàng được khởi tạo thành công</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống</p>
                  <p className="text-sm font-bold text-slate-500">Chờ xác nhận từ bộ phận kho</p>
                </div>
              </div>
            </div>

          </div>
        </Box>

        {/* Footer Actions */}
        <div className="p-6 bg-white/95 backdrop-blur-md border-t border-slate-200 flex gap-4 z-10 font-inter">
          <button className="flex-1 group flex items-center justify-center gap-2 bg-[#00288E] hover:bg-white text-white hover:text-[#00288E] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/10 border-2 border-[#00288E] active:scale-95">
            Xác nhận đơn
          </button>
          <button className="flex-1 group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 border-slate-300 active:scale-95">
            Hủy đơn hàng
          </button>
        </div>
      </Box>
    </Drawer>
  );
};

export default OrderDetailDrawer;
