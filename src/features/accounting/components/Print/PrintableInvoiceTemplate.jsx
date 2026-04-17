import React from 'react';

/**
 * Mẫu in KẾ TOÁN PRO-MAX V3
 * Thiết kế siêu trung thực cho 3 chế độ: LIST, VOUCHER, REPORT
 */
const PrintableInvoiceTemplate = ({ detail, extendedData = null }) => {
  if (!detail || !extendedData) return null;

  const type = extendedData.type;
  const isList = type === 'multi_entity';
  const isReport = type === 'report' || type === 'system_info';
  const isVoucher = type === 'voucher' || type === 'single_payment' || type === 'single_entity';
  
  const approverName = extendedData?.data?.approval || extendedData?.data?.approvedBy || "Admin - Hệ thống Hola ERP";
  const mainValue = extendedData.data?.amount || extendedData.data?.value || "0";

  // Từ điển nhãn tiếng Việt
  const labelMap = {
    orderId: 'Mã đơn hàng',
    customer: 'Khách hàng',
    method: 'Phương thức thanh toán',
    bank: 'Ngân hàng thụ hưởng',
    date: 'Ngày thực hiện',
    approval: 'Người phê duyệt',
    location: 'Chi nhánh/Vị trí',
    status: 'Trạng thái',
    description: 'Diễn giải nội dung',
    tax: 'Tiền thuế (VAT)',
    revenue: 'Doanh thu ghi nhận',
    profit: 'Lợi nhuận gộp',
    items: 'Số lượng mặt hàng',
    stock_val: 'Giá trị tồn kho',
    alert_level: 'Mức độ cảnh báo',
    ref_code: 'Mã tham chiếu hệ thống'
  };

  return (
    <div 
      id="printable-area" 
      style={{ 
        display: 'none',
        backgroundColor: '#FFFFFF',
        color: '#0f172a',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        boxSizing: 'border-box'
      }}
    >
      <style>
        {`
          @media print {
            /* 1. Reset toàn bộ trang và ẩn UI chính của App */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact !important;
            }
            
            #root {
              display: none !important;
            }
            
            /* 2. Hiển thị khu vực in với lề tối ưu 1 trang */
            #printable-area {
              display: block !important;
              width: 100% !important;
              max-width: 210mm !important;
              min-height: 297mm !important;
              padding: 10mm !important;
              margin: 0 auto !important;
              background: white !important;
              visibility: visible !important;
              position: relative !important;
              page-break-inside: avoid;
            }

            /* 3. Đảm bảo mọi thứ bên trong đều hiển thị */
            #printable-area * {
              visibility: visible !important;
              box-shadow: none !important;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
          }
        `}
      </style>

      {/* HEADER: Gọn gàng hơn */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #00288E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <div style={{ width: '3rem', height: '3rem', backgroundColor: '#00288E', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.5rem' }}>H</div>
           <div>
              <h1 style={{ margin: 0, color: '#00288E', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>HOLAGROUP</h1>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Tài chính Toàn cầu</p>
           </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>
            {isList ? 'Bảng kê chi tiết' : isReport ? 'Báo cáo quản trị' : 'Chứng từ điện tử'}
          </h2>
          <div style={{ color: '#64748b', fontWeight: '600', fontSize: '0.8rem' }}>
             Mã: <span style={{ color: '#0f172a' }}>#{detail.id}</span> | 
             Ngày: <span style={{ color: '#0f172a' }}>{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CHUNG: Giảm khoảng cách */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
         <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Đơn vị phát hành</p>
            <p style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a', margin: '0' }}>CÔNG TY CP TẬP ĐOÀN HOLAGROUP</p>
            <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>Quận 1, TP. Hồ Chí Minh | Website: holagroup.vn</p>
         </div>
         <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
             <p style={{ fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Xác nhận nghiệp vụ</p>
             <p style={{ fontWeight: '700', fontSize: '0.8rem', color: '#0f172a', margin: 0 }}>Ban quản lý nội bộ</p>
             <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: '#ecfdf5', color: '#059669', fontSize: '0.65rem', fontWeight: '900', borderRadius: '1rem', marginTop: '0.5rem' }}>
                ĐÃ XÁC THỰC
             </div>
         </div>
      </div>

      {/* PHẦN NỘI DUNG CHÍNH */}
      <div style={{ minHeight: 'auto' }}>
         {isList && (
            <div>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ borderBottom: '2px solid #0f172a' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '900' }}>HẠNG MỤC</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontSize: '0.7rem', fontWeight: '900' }}>GIÁ TRỊ (VNĐ)</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontSize: '0.7rem', fontWeight: '900' }}>TRẠNG THÁI</th>
                     </tr>
                  </thead>
                  <tbody>
                     {extendedData.data?.filter((_, i) => i < 15).map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                           <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>{item.name}</td>
                           <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: '900', fontSize: '0.85rem', color: '#00288E' }}>{item.amount}</td>
                           <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800' }}>{item.status}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {isVoucher && (
            <div style={{ backgroundColor: '#fcfcfc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
               <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '0.5rem' }}>Số tiền ghi nhận</p>
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.4rem' }}>
                     <span style={{ fontSize: '3.25rem', fontWeight: '900', color: '#00288E', letterSpacing: '-0.05em' }}>{mainValue}</span>
                     <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#94a3b8' }}>VNĐ</span>
                  </div>
                  <div style={{ width: '60px', height: '3px', backgroundColor: '#00288E', margin: '0.5rem auto' }}></div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {Object.entries(extendedData.data || {}).map(([key, val], idx) => {
                     if (key === 'amount' || key === 'value') return null;
                     const displayLabel = labelMap[key] || key.toUpperCase();
                     return (
                        <div key={idx} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                           <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{displayLabel}</p>
                           <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{String(val)}</p>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}

         {isReport && (
            <div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  {extendedData.data?.summary?.map((item, idx) => (
                     <div key={idx} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}>{item.label}</p>
                        <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>{item.value}</p>
                     </div>
                  ))}
               </div>
               <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
                  <tbody style={{ fontSize: '0.8rem' }}>
                     {extendedData.data?.breakdown?.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                           <td style={{ padding: '0.75rem', fontWeight: '700' }}>{item.label}</td>
                           <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '900', color: '#00288E' }}>{item.value}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

      {/* FOOTER: Nén chặt lại */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center' }}>
         <div style={{ width: '30%' }}>
            <p style={{ margin: 0, fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase' }}>Người lập biểu</p>
            <div style={{ height: '3.5rem' }}></div>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '0.85rem', color: '#475569' }}>ERP SYSTEM</p>
         </div>
         <div style={{ width: '30%' }}>
            <p style={{ margin: 0, fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase' }}>Người phê duyệt</p>
            <div style={{ height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {/* Chữ ký trống */}
            </div>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '0.85rem' }}>{approverName}</p>
         </div>
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center' }}>
         Tài liệu nghiệp vụ nội bộ HolaGroup | Xuất lúc {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
      </div>
    </div>
  );
};

export default PrintableInvoiceTemplate;
