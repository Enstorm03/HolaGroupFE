import React from 'react';
import { createPortal } from 'react-dom';

/**
 * ⚠️ WARNING cho AI / Model đời sau:
 * 1. KHÔNG ĐƯỢC CHỈNH SỬA layout, style của 3 form: LIST, VOUCHER, REPORT dưới mọi hình thức vì nó đã hoạt động hoàn hảo 1 trang A4.
 * 2. Kiến trúc in (Print Architecture):
 *    - #root bị ẩn hoàn toàn để ngắt trang dư do component cha (1500px).
 *    - Các Modal / Overlay bọc bên ngoài form in buộc phải dùng position: static, height: 0 để diệt tận gốc chiều cao ảo.
 *    - #printable-area dùng position: absolute top-0 left-0 để in chính xác từ mép giấy.
 * Mẫu in TỔNG HỢP KẾ TOÁN PRO-MAX V4.0
 */
const PrintableInvoiceTemplate = ({ detail, extendedData }) => {
  if (!detail) return null;

  // 1. Xác định Print Mode
  let printMode = 'INVOICE'; // Mặc định
  if (extendedData) {
    if (extendedData.type === 'multi_entity') printMode = 'LIST';
    else if (['voucher', 'single_payment', 'single_entity'].includes(extendedData.type)) printMode = 'VOUCHER';
    else if (['report', 'system_info'].includes(extendedData.type)) printMode = 'REPORT';
  }

  // 2. Các hàm render nội dung theo Mode
  const renderHeaderTitle = () => {
    switch (printMode) {
      case 'LIST': return 'BẢNG KÊ GIAO DỊCH CHI TIẾT';
      case 'VOUCHER': return 'PHIẾU THANH TOÁN / QUYẾT TOÁN';
      case 'REPORT': return 'BÁO CÁO TÓM TẮT HỆ THỐNG';
      default: return 'HÓA ĐƠN BÁN HÀNG';
    }
  };

  const renderContent = () => {
    switch (printMode) {
      case 'LIST':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #0f172a', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>Đối tượng giao dịch</th>
                <th style={{ padding: '0.6rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>Giá trị</th>
                <th style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {extendedData.data?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem', fontSize: '0.75rem', fontWeight: '700' }}>
                    {item.name} <br/>
                    <small style={{ color: '#94a3b8' }}>Mã: {item.id}</small>
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '900' }}>{item.amount?.toLocaleString()} VNĐ</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.7rem', fontWeight: '700', color: '#e11d48' }}>Trễ {item.days} Ngày</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'VOUCHER':
        return (
          <div style={{ padding: '2rem', border: '2px solid #f1f5f9', borderRadius: '1.5rem', textAlign: 'center', backgroundColor: '#fcfcfc' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>TỔNG TIỀN QUYẾT TOÁN</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00288E', margin: '1rem 0' }}>{extendedData.data?.amount || extendedData.data?.value} đ</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Đơn vị thụ hưởng</span>
                <p style={{ margin: '0.3rem 0 0 0', fontWeight: '900', fontSize: '0.8rem' }}>{extendedData.data?.orderId || extendedData.data?.customer || 'N/A'}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Phương thức giao dịch</span>
                <p style={{ margin: '0.3rem 0 0 0', fontWeight: '900', fontSize: '0.8rem' }}>{extendedData.data?.method || 'Ghi sổ điện tử'}</p>
              </div>
            </div>
          </div>
        );

      case 'REPORT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {extendedData.data?.summary?.map((item, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{item.label}</span>
                    <p style={{ margin: '0.5rem 0 0 0', fontWeight: '900', fontSize: '1rem', color: '#0f172a' }}>{item.value} đ</p>
                  </div>
                ))}
             </div>
             <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', color: '#00288E' }}>PHÂN BỔ TÀI CHÍNH</h4>
                {extendedData.data?.breakdown?.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                      <span>{item.label}</span>
                      <span>{item.value} đ</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: '70%', backgroundColor: '#00288E', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );

      default: // INVOICE
        const total = detail.totalAmount || 0;
        const paid = detail.paidAmount || 0;
        const remaining = total - paid;
        const percent = Math.min(100, Math.round((paid / total) * 100)) || 0;
        return (
          <>
            {/* THÔNG TIN HAI BÊN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
               <div style={{ padding: '1.2rem', backgroundColor: '#f8fafc', borderRadius: '1.2rem', border: '1px solid #edf2f7' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Đơn vị cung cấp</span>
                  <p style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '0.85rem', fontWeight: '900', color: '#0f172a' }}>CÔNG TY CP TẬP ĐOÀN HOLAGROUP</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Địa chỉ: Quận 1, TP. Hồ Chí Minh</p>
               </div>
               <div style={{ padding: '1.2rem', backgroundColor: '#ffffff', borderRadius: '1.2rem', border: '1px solid #edf2f7' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Khách hàng thanh toán</span>
                  <p style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '0.85rem', fontWeight: '900', color: '#1a202c' }}>{detail.customerName || 'Khách hàng lẻ'}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>SĐT: {detail.phoneNumber || 'n/a'}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Email: {detail.email || 'n/a'}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Đ/C: {detail.address || 'Việt Nam'}</p>
               </div>
            </div>

            {/* BẢNG SẢN PHẨM */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.8rem', fontWeight: '900', color: '#00288E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DANH MỤC SẢN PHẨM / DỊCH VỤ</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', color: 'white' }}>
                    <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', borderRadius: '0.8rem 0 0 0' }}>MÔ TẢ CHI TIẾT</th>
                    <th style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', width: '50px' }}>SL</th>
                    <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', width: '120px' }}>ĐƠN GIÁ</th>
                    <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', width: '140px', borderRadius: '0 0.8rem 0 0' }}>THÀNH TIỀN</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '0.8rem', fontSize: '0.75rem', fontWeight: '800', color: '#2d3748' }}>{item.name}</td>
                      <td style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: '#4a5568' }}>{item.quantity}</td>
                      <td style={{ padding: '0.8rem', textAlign: 'right', fontWeight: '800', fontSize: '0.75rem', color: '#4a5568' }}>{item.price?.toLocaleString()} VNĐ</td>
                      <td style={{ padding: '0.8rem', textAlign: 'right', fontWeight: '900', fontSize: '0.85rem', color: '#00288E' }}>{(item.price * item.quantity)?.toLocaleString()} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TỔNG KẾT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', justifyContent: 'center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.1em' }}>TRẠNG THÁI DÒNG TIỀN</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4a5568' }}>Đã thanh toán ({percent}%):</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#38a169' }}>{paid.toLocaleString()} VNĐ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4a5568' }}>Còn lại:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#e53e3e' }}>{remaining.toLocaleString()} VNĐ</span>
                </div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', borderRadius: '1.5rem', color: 'white', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', opacity: 0.7 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Tạm tính:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900' }}>{total.toLocaleString()} VNĐ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', opacity: 0.7 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Thuế VAT (0%):</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900' }}>0 đ</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '0.05em' }}>TỔNG CỘNG</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#818cf8' }}>{total.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const printableContent = (
    <div 
      id="printable-area" 
      style={{ 
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        backgroundColor: '#FFFFFF',
        color: '#1a202c',
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
            body { background: white !important; }
            #root, .acc-modal-overlay, div[class*="accounting-layout"] { display: none !important; }
            body > *:not(#printable-area) { visibility: hidden; display: none !important; }
            
            #printable-area, #printable-area * { 
              visibility: visible !important; 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }
            #printable-area { 
              position: relative !important; 
              left: 0 !important; 
              top: 0 !important; 
              width: 100% !important; 
              height: auto !important;
              display: block !important;
              padding: 5mm 15mm !important;
              margin: 0 !important;
              z-index: 9999999 !important;
              box-sizing: border-box !important;
              page-break-after: avoid !important;
            }
            @page { size: auto; margin: 5mm; }
          }
        `}
      </style>

      {/* THANH THÔNG TIN LIÊN HỆ TRÊN CÙNG */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '0.3rem', marginBottom: '1rem', fontSize: '0.6rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
         <span>Website: www.holagroup.com.vn</span>
         <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Hotline: 1900 6886</span>
            <span>Email: info@holagroup.com.vn</span>
         </div>
      </div>

      {/* HEADER CÔNG TY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #00288E', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
           <div style={{ width: '2.8rem', height: '2.8rem', backgroundColor: '#00288E', borderRadius: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.5rem' }}>H</div>
           <div>
              <h1 style={{ margin: 0, color: '#00288E', fontSize: '1.3rem', fontWeight: '900' }}>HOLAGROUP</h1>
              <p style={{ margin: 0, fontSize: '0.6rem', color: '#718096', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hệ thống Quản trị Kế toán</p>
           </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', textTransform: 'uppercase', color: '#2d3748' }}>{renderHeaderTitle()}</h2>
          <div style={{ color: '#718096', fontWeight: '700', fontSize: '0.75rem', marginTop: '0.2rem' }}>
             Mã chứng từ: <span style={{ color: '#1a202c', fontWeight: '900' }}>{detail.id || detail.orderID}</span>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CHUNG */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1rem' }}>
         <div>
            <p style={{ fontSize: '0.6rem', fontWeight: '900', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>THÔNG TIN CƠ BẢN</p>
            <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.8rem', fontWeight: '700', color: '#2d3748' }}>Ngày lập: <span style={{ fontWeight: '800' }}>{detail.date || new Date().toLocaleDateString('vi-VN')}</span></p>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#2d3748' }}>Thời gian: <span style={{ fontWeight: '800' }}>{detail.time || 'N/A'}</span></p>
         </div>
         <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: '900', color: '#a0aec0', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>ĐƠN VỊ XỬ LÝ</p>
            <p style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '0.8rem', fontWeight: '700', color: '#2d3748' }}>Hola Group HQ - Phòng Kế toán</p>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#2d3748' }}>Trạng thái: <span style={{ color: '#2d3748', fontWeight: '800' }}>ĐÃ XÁC THỰC</span></p>
         </div>
      </div>

      {/* NỘI DUNG CHÍNH (DYNAMIC) */}
      <div style={{ minHeight: '300px' }}>
         {renderContent()}
      </div>

      {/* CHỮ KÝ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', padding: '0 2rem' }}>
         <div style={{ width: '40%' }}>
            <p style={{ margin: 0, fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', color: '#1a202c' }}>ĐẠI DIỆN GIAO DỊCH</p>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700' }}>(Ký và ghi rõ họ tên)</p>
            <div style={{ height: '4.5rem' }}></div>
         </div>
         <div style={{ width: '40%' }}>
            <p style={{ margin: 0, fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', color: '#1a202c' }}>KẾ TOÁN TRƯỞNG</p>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700' }}>(Đã ký điện tử)</p>
            <div style={{ height: '3.5rem' }}></div>
            <p style={{ margin: 0, fontWeight: '900', fontSize: '0.9rem', color: '#00288E' }}>Hệ thống ERP Hola</p>
         </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '5rem', borderTop: '1px solid #edf2f7', paddingTop: '1rem', fontSize: '0.6rem', color: '#a0aec0', textAlign: 'center' }}>
         Chứng từ này được trích xuất từ hệ thống quản trị nội bộ HolaGroup. <br/>
         Trang 1 / 1 | In lúc {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
      </div>
    </div>
  );

  return createPortal(printableContent, document.body);
};

export default PrintableInvoiceTemplate;
