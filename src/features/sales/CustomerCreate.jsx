import React, { useState } from 'react';

const CustomerCreate = ({ onBack }) => {
  // State quản lý UI form
  const [customerType, setCustomerType] = useState('Cá nhân');
  const [membership, setMembership] = useState('VIP');

  return (
    <div className="w-full font-sans text-[#191c1e] bg-[#f8fafc] min-h-screen pb-10">
      
      {/* 1. Header & Breadcrumb */}
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase flex gap-2">
            <span>DANH MỤC</span> <span>›</span> <span>KHÁCH HÀNG</span>
          </div>
          <h1 className="text-3xl font-manrope font-bold text-[#00288E]">Thêm mới khách hàng</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            Hủy bỏ
          </button>
          <button className="bg-[#00288E] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors">
            Lưu thông tin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (Nội dung chính) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Box Thông tin định danh */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">👤</span> Thông tin định danh
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">HỌ VÀ TÊN</label>
                <input type="text" placeholder="Nhập họ và tên đầy đủ" className="w-full bg-gray-100 border-none rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">SỐ ĐIỆN THOẠI</label>
                <input type="text" placeholder="090 123 4567" className="w-full bg-gray-100 border-none rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">ĐỊA CHỈ EMAIL</label>
              <input type="email" placeholder="example@hola.group" className="w-full bg-gray-100 border-none rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700" />
            </div>
          </div>

          {/* Box Địa chỉ liên lạc */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">📍</span> Địa chỉ liên lạc
            </h3>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">ĐỊA CHỈ THƯỜNG TRÚ</label>
              <textarea 
                rows="3" 
                placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện..." 
                className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700 resize-none"
              ></textarea>
            </div>

            {/* Giả lập Bản đồ */}
            <div className="w-full h-48 bg-slate-600 rounded-2xl mt-6 relative overflow-hidden flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60" 
                style={{backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop")'}}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              <button className="relative z-10 bg-white text-[#00288E] px-6 py-2.5 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                Gắn vị trí bản đồ
              </button>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (Phân loại & Ghi chú) */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Box Phân loại đối tượng */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">🏷️</span> Phân loại đối tượng
            </h3>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">LOẠI KHÁCH HÀNG</label>
              <div className="flex bg-gray-100 rounded-xl p-1.5">
                <button 
                  onClick={() => setCustomerType('Cá nhân')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${customerType === 'Cá nhân' ? 'bg-white text-[#00288E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cá nhân
                </button>
                <button 
                  onClick={() => setCustomerType('Doanh nghiệp')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${customerType === 'Doanh nghiệp' ? 'bg-white text-[#00288E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Doanh nghiệp
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">HẠNG THÀNH VIÊN</label>
              <div className="flex flex-col gap-3">
                {/* VIP */}
                <div 
                  onClick={() => setMembership('VIP')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${membership === 'VIP' ? 'border-[#00288E] bg-blue-50/30' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${membership === 'VIP' ? 'border-[#00288E]' : 'border-gray-300'}`}>
                      {membership === 'VIP' && <div className="w-2 h-2 bg-[#00288E] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">VIP Member</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">ƯU TIÊN PHỤC VỤ HẠNG A</p>
                    </div>
                  </div>
                  <span className="text-orange-500 text-lg">🥇</span>
                </div>

                {/* GOLD */}
                <div 
                  onClick={() => setMembership('GOLD')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${membership === 'GOLD' ? 'border-[#00288E] bg-blue-50/30' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${membership === 'GOLD' ? 'border-[#00288E]' : 'border-gray-300'}`}>
                      {membership === 'GOLD' && <div className="w-2 h-2 bg-[#00288E] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">Gold Member</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">KHÁCH HÀNG THÂN THIẾT</p>
                    </div>
                  </div>
                </div>

                {/* SILVER */}
                <div 
                  onClick={() => setMembership('SILVER')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${membership === 'SILVER' ? 'border-[#00288E] bg-blue-50/30' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${membership === 'SILVER' ? 'border-[#00288E]' : 'border-gray-300'}`}>
                      {membership === 'SILVER' && <div className="w-2 h-2 bg-[#00288E] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">Silver Member</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">KHÁCH HÀNG MỚI/PHỔ THÔNG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box Ghi chú */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">📝</span> Ghi chú nội bộ
            </h3>
            <textarea 
              rows="4" 
              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt từ khách hàng..." 
              className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700 resize-none mb-2"
            ></textarea>
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>Tối đa 500 ký tự</span>
              <span>Đã nhập: 0</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">✓</div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">XÁC THỰC</p>
            <p className="text-sm font-bold text-[#0f172a]">Tự động qua eKYC</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">🛡️</div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">BẢO MẬT</p>
            <p className="text-sm font-bold text-[#0f172a]">Mã hóa AES-256</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">⚡</div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">ĐỒNG BỘ</p>
            <p className="text-sm font-bold text-[#0f172a]">Real-time CRM</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CustomerCreate;