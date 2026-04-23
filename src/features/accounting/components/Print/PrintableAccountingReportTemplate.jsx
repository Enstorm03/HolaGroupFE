import React from 'react';

/**
 * Mẫu in Báo cáo Kế toán chuyên nghiệp (Report Module)
 * Thiết kế chuẩn A4 Landscape cho báo cáo phân tích tài chính
 */
const PrintableAccountingReportTemplate = ({ 
  performanceData, 
  categoryData, 
  revenueData,
  timeframeText,
  summaryStats 
}) => {
  if (!performanceData) return null;

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div 
      id="printable-accounting-report" 
      style={{ 
        display: 'none', 
        width: '100%',
        maxWidth: '297mm', 
        backgroundColor: '#FFFFFF',
        color: '#0f172a',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: '15mm',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* 1. HEADER CHUẨN DOANH NGHIỆP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #00288E', paddingBottom: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: '#00288E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '24px' }}>H</div>
          <div>
            <h1 style={{ margin: 0, color: '#00288E', fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>HOLA GROUP</h1>
            <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Hệ thống Quản trị Bán hàng & Tài chính</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>BÁO CÁO PHÂN TÍCH HIỆU SUẤT</h2>
          <p style={{ margin: 0, fontSize: '11px', color: '#00288E', fontWeight: 'bold' }}>Kỳ báo cáo: {timeframeText}</p>
          <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#94a3b8' }}>Ngày xuất: {new Date().toLocaleDateString('vi-VN')} | {new Date().toLocaleTimeString('vi-VN')}</p>
        </div>
      </div>

      {/* 2. SUMMARY DASHBOARD (STATS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
        {[
          { label: 'TỔNG DOANH THU', value: formatCurrency(summaryStats.totalRevenue), color: '#00288E' },
          { label: 'SỐ ĐƠN HÀNG', value: summaryStats.totalOrders, color: '#00288E' },
          { label: 'NHÂN VIÊN XUẤT SẮC', value: summaryStats.topSalesperson, color: '#00288E' },
          { label: 'TỶ LỆ TĂNG TRƯỞNG', value: (summaryStats.growthRate || 0) + '%', color: '#00288E' }
        ].map((stat, i) => (
          <div key={i} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '8px', fontWeight: '800', color: '#64748b', letterSpacing: '1px' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 2.1 BẢNG TỔNG HỢP XU HƯỚNG (MỤC MỚI) */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '3px', height: '12px', backgroundColor: '#00288E', display: 'inline-block' }}></span>
          Tổng hợp biến động doanh thu & công nợ theo thời gian
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #00288E' }}>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Thời gian</th>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Doanh thu</th>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Công nợ</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Hóa đơn</th>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Thực thu</th>
            </tr>
          </thead>
          <tbody>
            {revenueData && revenueData.length > 0 ? (
              revenueData.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? 'transparent' : '#fcfdfe' }}>
                  <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#0f172a', textAlign: 'center' }}>{item.label}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 'bold', color: '#0f172a' }}>{formatCurrency(item.revenue)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 'bold', color: '#0f172a' }}>{formatCurrency(item.expense)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 'bold' }}>{item.invoiceCount || 0}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 'bold', color: '#0f172a' }}>{formatCurrency(item.collected)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Không có dữ liệu xu hướng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* 3. REVENUE TABLE */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ width: '3px', height: '12px', backgroundColor: '#00288E', display: 'inline-block' }}></span>
             Phân tích doanh thu theo danh mục
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#00288E', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Danh mục</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Doanh thu</th>
                <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 8px 0 0' }}>Tỷ trọng</th>
              </tr>
            </thead>
            <tbody>
              {categoryData
                .filter(cat => cat.value > 0)
                .sort((a, b) => b.value - a.value) // Sắp xếp theo tỷ trọng giảm dần
                .map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{cat.name}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(cat.value)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{summaryStats.totalRevenue > 0 ? ((cat.value / summaryStats.totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
                  </tr>
                ))}
              {categoryData.filter(cat => cat.value > 0).length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    Không có doanh thu phát sinh trong kỳ này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. CATEGORY PIE CHART (Donut style matching UI) */}
        <div style={{ border: '1px solid #f1f5f9', borderRadius: '15px', padding: '15px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
           <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', width: '100%', textAlign: 'left' }}>Tỷ trọng sản phẩm</h3>
           <div style={{ width: '100%', height: '180px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  {categoryData.filter(c => c.value > 0).length > 0 ? (
                    (() => {
                      let cumulativePercent = 0;
                      const filtered = categoryData.filter(c => c.value > 0);
                      const total = filtered.reduce((s, c) => s + c.value, 0);
                      const COLORS = ['#00288E', '#f59e0b', '#10b981', '#6366f1', '#f43f5e', '#8b5cf6'];
                      
                      // Nếu chỉ có 1 danh mục, vẽ một vòng tròn đầy đủ
                      if (filtered.length === 1) {
                        return (
                          <path 
                            d="M 50 5 A 45 45 0 1 1 49.99 5 L 49.99 20 A 30 30 0 1 0 50 20 Z" 
                            fill={COLORS[0]} 
                          />
                        );
                      }

                      return filtered.map((cat, i) => {
                        const percent = (cat.value / total);
                        const startX = Math.cos(2 * Math.PI * cumulativePercent);
                        const startY = Math.sin(2 * Math.PI * cumulativePercent);
                        cumulativePercent += percent;
                        const endX = Math.cos(2 * Math.PI * cumulativePercent);
                        const endY = Math.sin(2 * Math.PI * cumulativePercent);
                        const largeArcFlag = percent > 0.5 ? 1 : 0;
                        
                        // Outer points for Donut (Radius 45)
                        const x1 = 50 + 45 * startX;
                        const y1 = 50 + 45 * startY;
                        const x2 = 50 + 45 * endX;
                        const y2 = 50 + 45 * endY;
                        
                        // Inner points for Donut (Radius 30)
                        const x3 = 50 + 30 * endX;
                        const y3 = 50 + 30 * endY;
                        const x4 = 50 + 30 * startX;
                        const y4 = 50 + 30 * startY;

                        const pathData = [
                          `M ${x1} ${y1}`,
                          `A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `L ${x3} ${y3}`,
                          `A 30 30 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                          `Z`
                        ].join(' ');

                        return (
                          <path key={i} d={pathData} fill={COLORS[i % COLORS.length]} />
                        );
                      });
                    })()
                  ) : (
                    <circle cx="50" cy="50" r="37.5" fill="none" stroke="#f1f5f9" strokeWidth="15" />
                  )}
                </svg>
                {/* Center label matching UI */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: '#00288E' }}>
                    {categoryData.filter(c => c.value > 0).length > 0 ? '100%' : '0%'}
                  </p>
                </div>
              </div>
              
              {/* Vertical Legend matching UI style */}
              <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                 {categoryData.filter(c => c.value > 0).sort((a,b) => b.value - a.value).slice(0, 5).map((cat, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ['#00288E', '#f59e0b', '#10b981', '#6366f1', '#f43f5e'][i % 5] }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '8px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase' }}>{cat.name}</span>
                        <span style={{ fontSize: '7px', color: '#64748b' }}>{((cat.value / summaryStats.totalRevenue) * 100).toFixed(1)}%</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 5. SALES PERFORMANCE TABLE */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '3px', height: '12px', backgroundColor: '#00288E', display: 'inline-block' }}></span>
          Hiệu suất chi tiết nhân viên kinh doanh
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #00288E' }}>
              <th style={{ padding: '12px 10px', textAlign: 'left' }}>Họ và tên</th>
              <th style={{ padding: '12px 10px', textAlign: 'left' }}>Doanh thu đạt được</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>Đơn hàng</th>
              <th style={{ padding: '12px 10px', textAlign: 'left' }}>Tiến độ mục tiêu</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>% Hoàn thành</th>
              <th style={{ padding: '12px 10px', textAlign: 'left' }}>Hoa hồng dự kiến</th>
            </tr>
          </thead>
          <tbody>
            {performanceData
              .filter(p => p.revenue > 0)
              .sort((a, b) => b.commission - a.commission) // Sắp xếp theo hoa hồng giảm dần
              .map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '800', color: '#0f172a', textAlign: 'left' }}>{p.name.toUpperCase()}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold' }}>{formatCurrency(p.revenue)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 'bold' }}>{p.orderCount}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'left', color: '#0f172a', fontSize: '9px', fontWeight: 'bold' }}>
                    {(p.revenue || 0).toLocaleString('vi-VN')} / {formatCurrency(p.target)}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                     <span style={{ padding: '3px 8px', backgroundColor: '#eff6ff', color: '#00288E', borderRadius: '5px', fontWeight: 'bold' }}>
                      {p.achievement.toFixed(1)}%
                     </span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold', color: '#0f172a' }}>{formatCurrency(p.commission)}</td>
                </tr>
              ))}
            {performanceData.filter(p => p.revenue > 0).length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                  Không có dữ liệu hiệu suất nhân viên trong kỳ này
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 6. SIGNATURE SECTION */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px', gap: '80px', textAlign: 'center' }}>
        <div style={{ minWidth: '150px' }}>
          <p style={{ margin: 0, fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Người lập biểu</p>
          <p style={{ margin: '5px 0 60px 0', fontSize: '9px', fontStyle: 'italic', color: '#64748b' }}>(Ký và ghi rõ họ tên)</p>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>{localStorage.getItem('userName') || 'Phòng Kế toán'}</p>
        </div>
        <div style={{ minWidth: '150px' }}>
          <p style={{ margin: 0, fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Kế toán trưởng</p>
          <p style={{ margin: '5px 0 60px 0', fontSize: '9px', fontStyle: 'italic', color: '#64748b' }}>(Ký và đóng dấu)</p>
        </div>
      </div>

      {/* 7. FOOTER - Để luồng tự nhiên ở cuối trang */}
      <div style={{ marginTop: '60px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#94a3b8' }}>
        <span>Tài liệu mật - Chỉ lưu hành nội bộ Hola Group ERP</span>
        <span>Mã báo cáo: RPT-ACC-{new Date().getTime().toString().slice(-6)}</span>
        <span>Trang 1 / 1</span>
      </div>
    </div>
  );
};

export default PrintableAccountingReportTemplate;
