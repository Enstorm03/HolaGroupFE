import React from 'react';

/**
 * Mẫu in KẾ TOÁN PRO-MAX V3.3
 * Tích hợp React Portal & Chống Loading vô hạn
 */
const PrintableInvoiceTemplate = ({ detail }) => {
  if (!detail) return null;

  const total = detail.totalAmount || 0;
  const paid = detail.paidAmount || 0;
  const remaining = total - paid;
  const percent = Math.min(100, Math.round((paid / total) * 100)) || 0;

  return (
    <div 
      id="printable-area" 
      style={{ 
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        backgroundColor: '#FFFFFF',
        color: '#0f172a',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        boxSizing: 'border-box',
        width: '190mm',
        margin: '0 auto',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    >
      <style>
        {`
          @media print {
            /* Ẩn mọi thứ khác trên trang trừ vùng in */
            body > *:not(#printable-area) {
              display: none !important;
            }
            
            body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            #printable-area {
              display: block !important;
              visibility: visible !important;
              position: relative !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 5mm !important;
              zIndex: 9999 !important;
              pointer-events: auto !important;
            }

            @page {
              size: A4;
              margin: 0;
            }
          }
        `}
      </style>

      {/* HEADER: Thương hiệu & Loại chứng từ */}
      <div style={{ padding: '0 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #00288E', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#00288E', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.8rem' }}>H</div>
             <div style={{ textAlign: 'left' }}>
                <h1 style={{ margin: 0, color: '#00288E', fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.02em' }}>HOLAGROUP</h1>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Hệ thống Quản trị Tài chính</p>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>Hóa đơn bán hàng</h2>
            <div style={{ color: '#64748b', fontWeight: '700', fontSize: '0.85rem', marginTop: '0.25rem' }}>
               Số GD: <span style={{ color: '#0f172a' }}>{detail.orderID || detail.id}</span>
            </div>
          </div>
        </div>

        {/* THÔNG TIN HAI BÊN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', marginBottom: '1.5rem' }}>
           <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Đơn vị cung cấp</p>
              <p style={{ fontWeight: '900', fontSize: '0.85rem', color: '#0f172a', margin: '0 0 0.2rem 0' }}>CÔNG TY CP TẬP ĐOÀN HOLAGROUP</p>
              <p style={{ fontSize: '0.7rem', color: '#475569', margin: '0 0 0.1rem 0' }}>Địa chỉ: Quận 1, TP. Hồ Chí Minh</p>
              <p style={{ fontSize: '0.7rem', color: '#475569', margin: '0' }}>Email: contact@holagroup.vn | Hotline: 1900 xxxx</p>
           </div>
           <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Khách hàng thanh toán</p>
              <p style={{ fontWeight: '900', fontSize: '0.85rem', color: '#0f172a', margin: '0 0 0.2rem 0' }}>{detail.customerID || 'Khách hàng lẻ'}</p>
              <p style={{ fontSize: '0.7rem', color: '#475569', margin: '0 0 0.1rem 0' }}>Mã đơn hàng: {detail.orderID}</p>
              <p style={{ fontSize: '0.7rem', color: '#475569', margin: 0 }}>Ngày lập: {detail.date}</p>
           </div>
        </div>

        {/* BẢNG CHI TIẾT SẢN PHẨM */}
        <div style={{ marginBottom: '1.5rem' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                 <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #0f172a', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.6rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>Mô tả sản phẩm / Dịch vụ</th>
                    <th style={{ padding: '0.6rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', width: '50px' }}>SL</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', width: '110px' }}>Đơn giá</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', width: '140px' }}>Thành tiền</th>
                 </tr>
              </thead>
              <tbody>
                 {detail.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                       <td style={{ padding: '0.6rem', fontSize: '0.75rem', fontWeight: '700', textAlign: 'left', color: '#1e293b' }}>{item.name}</td>
                       <td style={{ padding: '0.6rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>{item.quantity}</td>
                       <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: '700', fontSize: '0.75rem', color: '#475569' }}>{item.price?.toLocaleString()}</td>
                       <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: '900', fontSize: '0.8rem', color: '#00288E' }}>{(item.price * item.quantity)?.toLocaleString()} đ</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* TỔNG HỢP THANH TOÁN & TIẾN ĐỘ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
           <div style={{ border: '1px dashed #cbd5e1', padding: '1rem', borderRadius: '1rem', backgroundColor: '#fcfcfc' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Tiến độ dòng tiền</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                 <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Đã thanh toán ({percent}%):</span>
                 <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#059669' }}>{paid.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                 <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Còn nợ:</span>
                 <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#e11d48' }}>{remaining.toLocaleString()} đ</span>
              </div>
           </div>
           <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Tạm tính:</span>
                 <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>{total.toLocaleString()} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Thuế (0%):</span>
                 <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>0 đ</span>
              </div>
              <div style={{ borderTop: '2px solid #00288E', paddingTop: '0.4rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#0f172a' }}>TỔNG CỘNG:</span>
                 <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#00288E' }}>{total.toLocaleString()} đ</span>
              </div>
           </div>
        </div>

        {/* CHỮ KÝ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center' }}>
           <div style={{ width: '40%' }}>
              <p style={{ margin: 0, fontWeight: '900', fontSize: '0.7rem', textTransform: 'uppercase' }}>Đại diện khách hàng</p>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.55rem', color: '#94a3b8' }}>(Ký và ghi rõ họ tên)</p>
              <div style={{ height: '3rem' }}></div>
           </div>
           <div style={{ width: '40%' }}>
              <p style={{ margin: 0, fontWeight: '900', fontSize: '0.7rem', textTransform: 'uppercase' }}>Người lập hóa đơn</p>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.55rem', color: '#94a3b8' }}>(Đã ký điện tử)</p>
              <div style={{ height: '3rem' }}></div>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '0.75rem' }}>Hệ thống Tài chính Hola</p>
           </div>
        </div>

        <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center' }}>
           Mọi thắc mắc về hóa đơn, vui lòng liên hệ bộ phận Kế toán HolaGroup. <br/>
           Trang 1 / 1 | Xuất lúc {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoiceTemplate;
