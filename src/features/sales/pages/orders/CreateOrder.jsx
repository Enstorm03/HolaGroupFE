import React, { useState } from 'react';

const formatCurrency = (val, isSmall = false, colorClass = "text-slate-800") => {
  if (val === undefined || val === null) return "0 VND";
  const num = typeof val === 'number' ? val : Number(val.toString().replace(/[đ₫\sVND.]/g, ''));
  const formatted = new Intl.NumberFormat('vi-VN').format(num);
  return (
    <span className="flex items-baseline gap-1">
      <span className={isSmall ? `font-bold ${colorClass}` : `font-black ${colorClass}`}>{formatted}</span>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${colorClass === "text-white" ? "text-white/70" : "text-slate-400"}`}>VND</span>
    </span>
  );
};

const CreateOrder = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer] = useState({
    id: 'KH-00129',
    name: 'Nguyễn Văn Thành',
    phone: '0982 • 123 • 456',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. HCM',
    membership: 'GOLD MEMBER',
    avatar: 'NT'
  });

  const [cart, setCart] = useState([
    { id: 1, sku: 'SW8-WH-44', name: 'SmartWatch Series 8 Pro', icon: '⌚', price: 8450000, quantity: 2 },
    { id: 2, sku: 'BTS-PRO-BK', name: 'Beats Studio Pro - Onyx', icon: '🎧', price: 4200000, quantity: 1 }
  ]);

  const updateQuantity = (id, delta) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subTotal * 0.1;
  const discount = 1775000;
  const finalTotal = subTotal + tax - discount;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Đơn hàng đã được khởi tạo thành công!");
      onBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-8 pb-10">
      
      {/* 1. Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 shrink-0 px-2 md:px-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="w-14 h-14 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">arrow_back</span>
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Khởi tạo đơn hàng</h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 font-medium">
              Mã đơn: ORD-2024-8892 
              <span className="text-[#00288E] font-bold bg-blue-50 px-2.5 py-1 rounded-lg animate-fade-in">
                Bản nháp hệ thống
              </span>
            </p>
          </div>
        </div>

        {/* Multi-step Visual */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] border-2 border-slate-300">
          <StepItem active={step >= 1} number="1" label="Khách hàng" />
          <div className={`w-8 h-[2px] ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
          <StepItem active={step >= 2} number="2" label="Sản phẩm" />
          <div className={`w-8 h-[2px] ${step >= 3 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
          <StepItem active={step >= 3} number="3" label="Thanh toán" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pt-4">
        <div className="flex flex-col xl:flex-row gap-8 mx-2 md:mx-0">
          
          {/* CỘT TRÁI */}
          <div className="xl:flex-[2] flex flex-col gap-8">
          
            {/* Box 1: Khách hàng */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-10 shadow-sm border border-slate-300 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">person_search</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Đối tượng giao dịch</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Xác định khách hàng thụ hưởng</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tìm kiếm khách hàng</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Tên, SĐT hoặc Mã khách hàng..." 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-100 focus:bg-white transition-all text-slate-700" 
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                  </div>
                </div>

                {selectedCustomer && (
                  <div className="bg-slate-900 rounded-xl p-6 text-white flex items-center gap-4 animate-in zoom-in duration-300 shadow-xl shadow-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center font-black text-lg">
                      {selectedCustomer.avatar}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-tight break-words whitespace-normal lg:truncate lg:whitespace-nowrap">{selectedCustomer.name}</h4>
                        <span className="bg-blue-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shrink-0">
                          {selectedCustomer.membership}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 break-all whitespace-normal lg:truncate lg:whitespace-nowrap">{selectedCustomer.phone}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5 break-words whitespace-normal lg:truncate lg:whitespace-nowrap">{selectedCustomer.address}</p>
                    </div>
                    <button className="text-white/20 hover:text-white transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Giỏ hàng */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-10 shadow-sm border border-slate-300 hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600">shopping_cart</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Giỏ hàng</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chi tiết các hạng mục sản phẩm</p>
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                  <span className="material-symbols-outlined text-sm">add</span> Thêm SP
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Đơn giá</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Số lượng</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {cart.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{item.name}</p>
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">SKU: {item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          {formatCurrency(item.price, true)}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center justify-center gap-4 bg-slate-50 p-1 rounded-2xl w-fit mx-auto border-2 border-transparent hover:border-blue-50 transition-all">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition-all active:scale-90"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="font-black text-slate-900 w-8 text-center text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl shadow-lg shadow-slate-200 text-white hover:bg-blue-600 transition-all active:scale-90"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex flex-col items-end gap-1">
                            {formatCurrency(item.price * item.quantity, true, "text-blue-600")}
                            <button onClick={() => removeItem(item.id)} className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">Gỡ bỏ</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Summary */}
          <div className="xl:flex-[1] flex flex-col gap-8">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-10 text-white shadow-2xl shadow-slate-200/50 sticky top-4 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Thanh toán <span className="text-blue-500">.</span></h3>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Tổng kết giá trị đơn hàng</p>
                  </div>
                  <span className="material-symbols-outlined text-blue-500 text-3xl font-black">payments</span>
                </div>

                <div className="space-y-6">
                  <SummaryLine label={`Tạm tính (${totalItems} sp)`} value={formatCurrency(subTotal, true, "text-white")} />
                  <SummaryLine label="Thuế GTGT (10%)" value={formatCurrency(tax, true, "text-white")} />
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Chiết khấu thành viên</span>
                      <span className="text-orange-400 font-black text-xs">-{formatCurrency(discount, true, "text-orange-400")}</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Nhập mã ưu đãi..." 
                        className="w-full bg-white/10 border-2 border-transparent rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 text-white" 
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Áp dụng</button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                      <div className="text-3xl font-black text-white tracking-tighter leading-none">
                        {formatCurrency(finalTotal, false, "text-white")}
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Bảo mật
                    </span>
                  </div>

                  <div className="pt-8 flex flex-col gap-4">
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>Xác nhận đặt hàng <span className="material-symbols-outlined text-lg">chevron_right</span></>
                      )}
                    </button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white/60 py-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                      Lưu bản nháp
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">🛡️ Secured by Hola Ledger Engine</span>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-10 shadow-sm border border-slate-300">
               <h4 className="font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">description</span> Ghi chú
              </h4>
              <textarea 
                rows="4" 
                placeholder="Lưu ý về giao nhận, hóa đơn..." 
                className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-5 text-sm font-bold outline-none focus:border-blue-100 focus:bg-white transition-all text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryLine = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</span>
    <span className="font-black text-sm">{value}</span>
  </div>
);

const StepItem = ({ active, number, label }) => (
  <div className="flex items-center gap-2 px-4 py-2">
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-300'}`}>
      {number}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'text-slate-900' : 'text-slate-300'}`}>
      {label}
    </span>
  </div>
);

export default CreateOrder;