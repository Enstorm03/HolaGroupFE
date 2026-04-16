import React from 'react';
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/Layout/MainLayout';
const CustomerList = () => {
  // Dữ liệu mẫu (Mock Data) dựa trên thiết kế Figma của bạn
  const customers = [
    {
      id: 'NN',
      name: 'Nguyễn Nam Anh',
      phone: '0902 123 456',
      email: 'namanh.ng@company.vn',
      group: ['VIP', 'PLATINUM'],
      groupColor: 'bg-[#ffdbce] text-[#802a00]',
      revenue: '450,200,000 đ',
      status: 'Hoạt động',
      isActive: true,
      avatarBg: 'bg-blue-100 text-[#00288E]',
    },
    {
      id: 'PT',
      name: 'Phạm Thị Thanh',
      phone: '0915 789 012',
      email: 'thanh.pham@gmail.com',
      group: ['DOANH', 'NGHIỆP'],
      groupColor: 'bg-blue-100 text-blue-800',
      revenue: '125,000,000 đ',
      status: 'Hoạt động',
      isActive: true,
      avatarBg: 'bg-gray-200 text-gray-800',
    },
    {
      id: 'LH',
      name: 'Lê Hoàng Nam',
      phone: '0888 666 999',
      email: 'hoangnam.le@outlook.com',
      group: ['VIP', 'GOLD'],
      groupColor: 'bg-[#ffdbce] text-[#802a00]',
      revenue: '82,450,000 đ',
      status: 'Ngoại tuyến',
      isActive: false,
      avatarBg: 'bg-blue-100 text-[#00288E]',
    },
    {
      id: 'TM',
      name: 'Trần Minh Quân',
      phone: '0977 444 222',
      email: 'quan.tm@edu.vn',
      group: ['TIÊU', 'CHUẨN'],
      groupColor: 'bg-gray-200 text-gray-700',
      revenue: '12,900,000 đ',
      status: 'Hoạt động',
      isActive: true,
      avatarBg: 'bg-gray-200 text-gray-800',
    },
  ];

  return (
    <div className="w-full font-sans text-[#191c1e]">
      {/* 1. Tiêu đề trang & Nút Thêm mới */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-[#00288E] mb-1">Hồ sơ Khách hàng</h1>
          <p className="text-[#444653] text-sm">Quản lý và theo dõi thông tin chi tiết các đối tác chiến lược.</p>
        </div>
        <button className="bg-gradient-to-r from-[#00288E] to-[#1e40af] text-white px-6 py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm mới khách hàng
        </button>
      </div>

      {/* 2. Các thẻ Thống kê (Overview Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Thẻ 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-[#444653] font-semibold mb-2">TỔNG KHÁCH HÀNG</p>
          <h2 className="text-3xl font-manrope font-bold text-[#00288E] mb-2">1,284</h2>
          <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> +12% tháng này
          </p>
        </div>
        {/* Thẻ 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-[#444653] font-semibold mb-2">KHÁCH HÀNG VIP</p>
          <h2 className="text-3xl font-manrope font-bold text-[#00288E] mb-2">142</h2>
          <p className="text-xs text-blue-600 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span> Top 10% doanh thu
          </p>
        </div>
        {/* Thẻ 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-[#444653] font-semibold mb-2">DOANH THU TRUNG BÌNH</p>
          <h2 className="text-3xl font-manrope font-bold text-[#00288E] mb-2">14.2M</h2>
          <p className="text-xs text-[#444653] font-medium">VNĐ / Mỗi khách hàng</p>
        </div>
        {/* Thẻ 4 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-[#444653] font-semibold mb-2">TỶ LỆ GIỮ CHÂN</p>
          <h2 className="text-3xl font-manrope font-bold text-[#00288E] mb-4">92%</h2>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00288E] w-[92%] h-full"></div>
          </div>
        </div>
      </div>

      {/* 3. Bảng dữ liệu (Data Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar của bảng */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-50 text-[#00288E] text-sm font-medium rounded-lg">Tất cả</button>
            <button className="px-4 py-2 text-[#444653] hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors">Khách hàng VIP</button>
            <button className="px-4 py-2 text-[#444653] hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors">Khách hàng Mới</button>
          </div>
          <div className="flex gap-2">
            {/* Các nút công cụ phụ (Filter, Export) */}
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            </button>
          </div>
        </div>

        {/* Bảng chính */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-xs text-[#444653] font-medium uppercase tracking-wider">
                <th className="p-4 pl-6">Tên Khách Hàng</th>
                <th className="p-4">SĐT</th>
                <th className="p-4">Email</th>
                <th className="p-4">Nhóm Khách Hàng</th>
                <th className="p-4">Doanh Thu Tích Lũy</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm ${customer.avatarBg}`}>
                      {customer.id}
                    </div>
                    <span className="font-medium text-[#191c1e]">{customer.name}</span>
                  </td>
                  <td className="p-4 text-sm text-[#444653]">{customer.phone}</td>
                  <td className="p-4 text-sm text-[#444653]">{customer.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${customer.groupColor}`}>
                      {customer.group[0]} <span className="opacity-70">{customer.group[1]}</span>
                    </span>
                  </td>
                  <td className="p-4 font-manrope font-bold text-[#00288E]">{customer.revenue}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${customer.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span className="text-sm text-[#191c1e]">{customer.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-[#00288E]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang (Pagination) */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-[#444653]">
          <span>Hiển thị 1 - 4 của 1,284 khách hàng</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00288E] text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;