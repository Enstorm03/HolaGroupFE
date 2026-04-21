import React from 'react';

/**
 * Mẫu in Dashboard kế toán chuyên nghiệp
 * Được thiết kế để xuất PDF với cấu trúc phân tầng: Header, Stats, Tables, Footer
 */
const PrintableDashboardTemplate = ({ stats, timeframeLabels, timeframe, dynamicLabel }) => {
  if (!stats) return null;

  const formatDisplayValue = (val) => {
    if (val === undefined || val === null) return '0';
    if (typeof val === 'string') {
      // Xóa các ký hiệu tiền tệ cũ nếu có trong chuỗi dữ liệu
      return val.replace(/[đ₫VNĐ]/g, '').trim();
    }
    return val.toLocaleString('vi-VN');
  };

  return (
    <div 
      id="printable-accounting-report" 
      style={{ 
        display: 'none', // Ẩn mặc định
        width: '100%',
        maxWidth: '297mm', // Landscape A4
        backgroundColor: '#FFFFFF',
        color: '#1e293b',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        boxSizing: 'border-box'
      }}
    >
      {/* HEADER CÔNG TY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '0.125rem solid #00288E', paddingBottom: '0.625rem', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#00288E', fontSize: '1.75rem', fontWeight: '900' }}>HOLAGROUP</h1>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Hệ thống Quản trị Tài chính Tập trung</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700' }}>BÁO CÁO TÓM TẮT TÀI CHÍNH</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Kỳ báo cáo: {timeframeLabels[timeframe]} | Ngày xuất: {new Date().toLocaleDateString('vi-VN')} | Thời gian: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* DÒNG PHÂN TÍCH DỮ LIỆU */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '0.875rem', 
          fontWeight: '800', 
          color: '#0f172a', 
          borderLeft: '0.25rem solid #00288E', 
          paddingLeft: '0.625rem',
          textTransform: 'uppercase',
          letterSpacing: '0.03125rem'
        }}>
          Phân tích dữ liệu: <span style={{ color: '#00288E' }}>{dynamicLabel}</span>
        </h3>
      </div>

      {/* TÓM TẮT CHỈ SỐ (STATS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.9375rem', marginBottom: '1.875rem' }}>
        {[
          { label: 'TỔNG DOANH THU', value: stats.totalRevenue, color: '#2563eb', unit: ' VNĐ' },
          { label: 'TỔNG CÔNG NỢ', value: stats.totalDebt, color: '#d97706', unit: ' VNĐ' },
          { label: 'HÓA ĐƠN CHỜ', value: stats.pendingInvoices, color: '#4f46e5', unit: '' },
          { label: 'TỒN QUỸ HIỆN TẠI', value: stats.cashBalance, color: '#059669', unit: ' VNĐ' }
        ].map((item, idx) => (
          <div key={idx} style={{ padding: '0.9375rem', border: '0.0625rem solid #e2e8f0', borderRadius: '0.75rem' }}>
            <p style={{ margin: '0 0 0.625rem 0', fontSize: '0.625rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.0625rem' }}>{item.label}</p>
            <p style={{ 
              margin: 0, 
              fontSize: '1.15rem', 
              fontWeight: '900', 
              color: item.color,
              whiteSpace: 'nowrap'
            }}>
              {formatDisplayValue(item.value)}{item.unit}
            </p>
          </div>
        ))}
      </div>

      {/* BẢNG GIAO DỊCH GẦN ĐÂY */}
      <div style={{ marginBottom: '1.875rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.9375rem', borderLeft: '0.25rem solid #00288E', paddingLeft: '0.625rem' }}>
          CHI TIẾT GIAO DỊCH VÀ THÔNG BÁO MỚI NHẤT
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', textAlign: 'left' }}>STT</th>
              <th style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', textAlign: 'left' }}>Thời gian</th>
              <th style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', textAlign: 'left' }}>Loại giao dịch</th>
              <th style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', textAlign: 'left' }}>Nội dung chi tiết</th>
              <th style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', textAlign: 'center' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {(stats.notifications || []).map((note, index) => (
              <tr key={note.id || index}>
                <td style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem' }}>{index + 1}</td>
                <td style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem' }}>{note.time || 'Vừa xong'}</td>
                <td style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', fontWeight: '700' }}>{note.type?.toUpperCase() || 'THÔNG BÁO'}</td>
                <td style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem' }}>{note.message}</td>
                <td style={{ border: '0.0625rem solid #e2e8f0', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#f1f5f9', 
                    color: '#475569',
                    borderRadius: '0.375rem', 
                    fontSize: '0.625rem',
                    fontWeight: '700',
                    border: '0.0625rem solid #e2e8f0'
                  }}>
                    Hoàn tất
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CHỮ KÝ */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3.125rem', gap: '6.25rem', textAlign: 'center' }}>
        <div style={{ minWidth: '9.375rem' }}>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '0.75rem' }}>Người lập biểu</p>
          <p style={{ margin: '3.75rem 0 0 0', fontSize: '0.75rem' }}>(Ký và ghi rõ họ tên)</p>
        </div>
        <div style={{ minWidth: '9.375rem' }}>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '0.75rem' }}>Kế toán trưởng</p>
          <p style={{ margin: '3.75rem 0 0 0', fontSize: '0.75rem' }}>(Ký và đóng dấu)</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', borderTop: '0.0625rem solid #e2e8f0', paddingTop: '0.625rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#94a3b8' }}>
        <span>Tài liệu lưu hành nội bộ - HOLAGROUP ERP System</span>
        <span>Trang 1 / 1</span>
      </div>
    </div>
  );
};

export default PrintableDashboardTemplate;
