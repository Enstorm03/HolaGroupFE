import React from 'react';
// import msIcon from '../../assets/ms-icon.png';
// import googleIcon from '../../assets/google-icon.png';

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full font-sans bg-[#f7f9fb]">
      {/* Nửa bên trái - Thông tin giới thiệu */}
      <div className="flex-1 bg-[#00288E] flex items-center justify-center p-10 bg-[url('../../assets/background-left.png')] bg-cover bg-center">
        <div className="max-w-[500px] text-white">
          <h1 className="font-manrope text-[48px] font-bold leading-[1.2] mb-4">
            Giải pháp tối ưu cho<br />Doanh nghiệp.
          </h1>
          <p className="text-[18px] opacity-80 mb-10">
            Hệ thống quản trị tài nguyên tập trung dành cho các bộ phận chuyên trách của Hola Group.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f2f4f6]/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded mb-3"></div> {/* Icon placeholder */}
              <h3 className="font-manrope text-base font-semibold mb-1">Admin</h3>
              <p className="text-xs opacity-70">Quản trị hệ thống & Bảo mật</p>
            </div>
            <div className="bg-[#f2f4f6]/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded mb-3"></div>
              <h3 className="font-manrope text-base font-semibold mb-1">Sales</h3>
              <p className="text-xs opacity-70">Kinh doanh & Khách hàng</p>
            </div>
            <div className="bg-[#f2f4f6]/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded mb-3"></div>
              <h3 className="font-manrope text-base font-semibold mb-1">Warehouse</h3>
              <p className="text-xs opacity-70">Kho vận & Logistic</p>
            </div>
            <div className="bg-[#f2f4f6]/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded mb-3"></div>
              <h3 className="font-manrope text-base font-semibold mb-1">Accounting</h3>
              <p className="text-xs opacity-70">Kế toán & Tài chính</p>
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
                className="w-full p-4 bg-[#e6e8ea] border border-transparent rounded-lg text-base text-[#191c1e] outline-none transition-all duration-300 focus:border-[#00288E] focus:bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs text-[#444653] mb-2 font-medium">MẬT KHẨU</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-[#e6e8ea] border border-transparent rounded-lg text-base text-[#191c1e] outline-none transition-all duration-300 focus:border-[#00288E] focus:bg-white"
              />
            </div>

            <div className="flex justify-between items-center mb-8 text-sm">
              <label className="text-[#444653] flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 cursor-pointer" /> 
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-[#00288E] no-underline font-medium hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button 
              type="button" 
              className="w-full p-4 bg-gradient-to-r from-[#00288E] to-[#1e40af] text-white border-none rounded-lg text-[18px] font-semibold cursor-pointer transition-opacity duration-300 hover:opacity-90"
            >
              Đăng nhập
            </button>
          </form>

         
        </div>

        {/* Footer của form */}
        
      </div>
    </div>
  );
};

export default LoginPage;