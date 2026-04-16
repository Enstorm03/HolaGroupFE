import React from 'react';
// import msIcon from '../../assets/ms-icon.png';
// import googleIcon from '../../assets/google-icon.png';

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full font-sans bg-[#f7f9fb]">
      {/* Nửa bên trái - Thông tin giới thiệu */}
      {/* Đổi màu nền thành Gradient Hồng - Cam - Vàng theo Logo */}
      <div className="flex-1 bg-gradient-to-br from-[#E31E63] via-[#F26722] to-[#F4B324] flex items-center justify-center p-10 bg-[url('../../assets/background-left.png')] bg-cover bg-center bg-blend-overlay">
        <div className="max-w-[500px] text-white">
          <h1 className="font-manrope text-[48px] font-bold leading-[1.2] mb-4">
            Giải pháp tối ưu cho<br />Doanh nghiệp.
          </h1>
          <p className="text-[18px] opacity-90 mb-10">
            Hệ thống quản trị tài nguyên tập trung dành cho các bộ phận chuyên trách của Hola Group.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Tăng độ tương phản cho các box bên trong nền màu sáng */}
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="w-10 h-10 bg-white/30 rounded mb-3"></div> {/* Icon placeholder */}
              <h3 className="font-manrope text-base font-semibold mb-1">Admin</h3>
              <p className="text-xs opacity-80">Quản trị hệ thống & Bảo mật</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="w-10 h-10 bg-white/30 rounded mb-3"></div>
              <h3 className="font-manrope text-base font-semibold mb-1">Sales</h3>
              <p className="text-xs opacity-80">Kinh doanh & Khách hàng</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="w-10 h-10 bg-white/30 rounded mb-3"></div>
              <h3 className="font-manrope text-base font-semibold mb-1">Warehouse</h3>
              <p className="text-xs opacity-80">Kho vận & Logistic</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="w-10 h-10 bg-white/30 rounded mb-3"></div>
              <h3 className="font-manrope text-base font-semibold mb-1">Accounting</h3>
              <p className="text-xs opacity-80">Kế toán & Tài chính</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nửa bên phải - Form đăng nhập */}
      <div className="flex-1 flex flex-col justify-center items-center relative bg-[#f7f9fb]">
        <div className="bg-white p-12 rounded-[32px] shadow-[0_20px_40px_rgba(25,28,30,0.06)] w-full max-w-[496px]">
          <h2 className="font-manrope text-[30px] text-[#191c1e] mb-2 font-bold">
            Chào mừng trở lại!
          </h2>
          <p className="text-[14px] text-[#444653] mb-8">
            Vui lòng nhập thông tin để truy cập hệ thống.
          </p>

          <form>
            <div className="mb-6">
              <label className="block text-xs text-[#444653] mb-2 font-medium">EMAIL</label>
              <input 
                type="email" 
                placeholder="name@holagroup.vn" 
                // Đổi viền khi focus sang màu Cam của logo
                className="w-full p-4 bg-[#e6e8ea] border border-transparent rounded-lg text-base text-[#191c1e] outline-none transition-all duration-300 focus:border-[#F26722] focus:bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs text-[#444653] mb-2 font-medium">MẬT KHẨU</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                // Đổi viền khi focus sang màu Cam của logo
                className="w-full p-4 bg-[#e6e8ea] border border-transparent rounded-lg text-base text-[#191c1e] outline-none transition-all duration-300 focus:border-[#F26722] focus:bg-white"
              />
            </div>

            <div className="flex justify-between items-center mb-8 text-sm">
              <label className="text-[#444653] flex items-center gap-2 cursor-pointer select-none">
                {/* Thêm accent color cho checkbox */}
                <input type="checkbox" className="w-4 h-4 cursor-pointer accent-[#F26722]" /> 
                Ghi nhớ đăng nhập
              </label>
              {/* Đổi màu chữ link sang màu Cam */}
              <a href="#" className="text-[#F26722] no-underline font-medium hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button 
              type="button" 
              // Gradient nút bấm theo dải màu của logo
              className="w-full p-4 bg-gradient-to-r from-[#E31E63] via-[#F26722] to-[#F4B324] text-white border-none rounded-lg text-[18px] font-semibold cursor-pointer transition-all duration-300 hover:opacity-90 shadow-lg shadow-orange-500/30"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;