import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import accountingService from '../services/accountingService';
import PrintableInvoiceTemplate from '../components/Print/PrintableInvoiceTemplate';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [extendedData, setExtendedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [basicInfo, detailInfo] = await Promise.all([
          accountingService.getNotificationDetail(id),
          accountingService.getExtendedNotificationDetail(id)
        ]);

        if (basicInfo) {
          setDetail(basicInfo);
          setExtendedData(detailInfo);
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
    setIsModalOpen(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-acc-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black text-acc-text-muted animate-pulse uppercase tracking-widest">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-10">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
           <span className="material-symbols-outlined text-5xl">error</span>
        </div>
        <h2 className="text-2xl font-black text-acc-text-main mb-2">Không tìm thấy giao dịch</h2>
        <p className="text-acc-text-muted mb-8">Dữ liệu có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
        <button 
          onClick={() => navigate('/accounting')}
          className="px-8 py-3 bg-acc-primary text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
        >
          Quay lại Dashboard
        </button>
      </div>
    );
  }

  const getDynamicTitle = () => {
    if (!detail.message) return "";
    if (detail.count !== undefined) {
      return detail.message.replace(/{count}|(?<=Có )\d+/, detail.count);
    }
    return detail.message;
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50 overflow-hidden relative">
      {/* FULL DETAIL MODAL (Popup Layer) */}
      {isModalOpen && extendedData && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
           <div 
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
             onClick={() => setIsModalOpen(false)}
           ></div>
           
           <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl shadow-black/20 flex flex-col overflow-hidden animate-zoom-in max-h-full border border-white/20">
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-acc-primary text-white flex items-center justify-center">
                       <span className="material-symbols-outlined text-2xl">receipt_long</span>
                    </div>
                    <div className="flex flex-col">
                       <h3 className="text-lg font-black text-acc-text-main uppercase tracking-tight">Chi tiết chứng từ điện tử</h3>
                       <p className="text-[10px] text-acc-text-light font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Hệ thống đã xác minh toàn vẹn dữ liệu
                       </p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all"
                 >
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-thin scrollbar-thumb-slate-200">
                 {/* Top Figure */}
                 <div className="flex flex-col items-center text-center gap-2 pb-10 border-b border-slate-50">
                    <span className="text-xs font-black text-acc-primary uppercase tracking-[0.2em]">Giá trị giao dịch gốc</span>
                    <div className="text-6xl font-black text-acc-text-main tracking-tighter">
                       {extendedData.data?.amount || extendedData.data?.value || "0"}
                       <span className="text-2xl text-acc-text-light font-normal ml-3">VNĐ</span>
                    </div>
                 </div>

                 {/* Detailed Grid - With Vietnamese Labels */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(extendedData.data || {}).map(([key, val], idx) => {
                       if (key === 'amount' || key === 'value') return null;
                       
                       // Mapping labels to Vietnamese
                       const labelMap = {
                          orderId: 'Mã đơn hàng',
                          customer: 'Khách hàng',
                          method: 'Phương thức',
                          bank: 'Ngân hàng',
                          date: 'Ngày thực hiện',
                          approval: 'Người phê duyệt',
                          location: 'Vị trí',
                          status: 'Trạng thái',
                          description: 'Diễn giải',
                          tax: 'Tiền thuế',
                          revenue: 'Doanh thu',
                          profit: 'Lợi nhuận',
                          items: 'Số mặt hàng',
                          stock_val: 'Giá trị kho',
                          alert_level: 'Mức cảnh báo',
                          ref_code: 'Mã tham chiếu'
                       };

                       const displayLabel = labelMap[key] || key.toUpperCase();

                       return (
                          <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-1 hover:border-acc-primary/30 transition-all group">
                             <span className="text-[10px] font-black text-acc-text-light uppercase tracking-widest opacity-60 group-hover:text-acc-primary transition-colors">{displayLabel}</span>
                             <span className="text-sm font-black text-acc-text-main break-words">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                             </span>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0">
                 <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-acc-text-main font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Tải file PDF
                 </button>
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="px-10 py-3 bg-acc-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
                 >
                    Xác nhận & Đóng
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100 shrink-0">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/accounting')}
              className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-acc-text-muted transition-all group"
            >
               <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </button>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-acc-primary uppercase tracking-widest leading-none mb-1">Accounting Suite</span>
               <span className="text-xs font-bold text-acc-text-main leading-none">Chi tiết giao dịch & Nghiệp vụ</span>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
               onClick={handlePrint}
               className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-acc-text-main font-black text-[11px] transition-all hover:bg-slate-50 shadow-sm active:scale-95"
            >
               <span className="material-symbols-outlined text-[18px]">print</span>
               In chứng từ
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col p-6 sm:p-10 relative overflow-hidden flex-1 min-h-0">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-acc-primary"></div>
             
             <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-6 shrink-0">
                <div className="space-y-3 w-full">
                   <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 text-[9px] font-black text-acc-text-light rounded-lg uppercase tracking-widest border border-slate-200">
                        ID: {detail.id}
                      </span>
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-acc-text-light uppercase opacity-50">
                        <span className="material-symbols-outlined text-xs">history</span>
                        {detail.time || 'Thời gian thực'}
                      </span>
                   </div>
                   <h1 className="text-xl font-black text-acc-text-main max-w-5xl leading-tight tracking-tight break-words">
                      {getDynamicTitle()}
                   </h1>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[9px] font-black flex items-center gap-2 border-2 shrink-0 ${
                  detail.type === 'warning' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                   <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                   {detail.type === 'warning' ? 'CẦN KIỂM TRA' : 'ĐÃ GHI NHẬN'}
                </div>
             </div>

             <div className="py-4 border-t border-slate-50 flex-1 flex flex-col min-h-0">
                {extendedData ? (
                  <>
                    {extendedData.type === 'multi_entity' && (
                      <div className="animate-fade-up flex-1 flex flex-col min-h-0">
                         <div className="flex items-center gap-4 mb-6 shrink-0 text-acc-primary">
                            <span className="material-symbols-outlined text-3xl font-light">list_alt</span>
                            <div className="flex flex-col">
                               <span className="text-xs font-black uppercase tracking-widest">Bảng kê chi tiết thực thể</span>
                               <span className="text-[10px] opacity-60">Dữ liệu truy vấn trực tiếp từ cơ sở dữ liệu kế toán</span>
                            </div>
                         </div>
                         
                         <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border border-slate-100 bg-slate-50/20 scrollbar-thin scrollbar-thumb-slate-200">
                            <table className="w-full text-left border-collapse">
                               <thead className="sticky top-0 bg-white shadow-sm z-20">
                                  <tr className="border-b border-slate-100">
                                     <th className="px-6 py-4 text-[10px] font-black text-acc-text-muted uppercase tracking-widest">Đối tác</th>
                                     <th className="px-6 py-4 text-[10px] font-black text-acc-text-muted uppercase tracking-widest text-right">Giá trị</th>
                                     <th className="px-6 py-4 text-[10px] font-black text-acc-text-muted uppercase tracking-widest text-center">Thời gian</th>
                                     <th className="px-6 py-4 text-[10px] font-black text-acc-text-muted uppercase tracking-widest text-right">Trạng thái</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-50">
                                  {extendedData.data?.map((item, idx) => (
                                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                           <div className="flex flex-col">
                                              <span className="text-sm font-black text-acc-text-main group-hover:text-acc-primary transition-colors">{item.name}</span>
                                              <span className="text-[10px] text-acc-text-light font-medium">{item.id}</span>
                                           </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                           <span className="text-sm font-black text-acc-text-main">{item.amount} <span className="text-[9px] font-medium text-acc-text-light">VNĐ</span></span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                           <span className="text-[11px] font-bold text-acc-text-muted">{item.start} - {item.end}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                           <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                                              item.status === 'high' || item.status === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                           }`}>
                                              +{item.days} ngày
                                           </span>
                                        </td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                    )}

                    {(extendedData.type === 'single_payment' || extendedData.type === 'single_entity' || extendedData.type === 'voucher') && (
                      <div className="animate-fade-up h-full flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden">
                         <div className="w-full max-w-4xl bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 p-10 lg:p-14 relative overflow-hidden flex flex-col items-center justify-center min-h-[480px]">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full -mr-40 -mt-40"></div>
                            <div className="relative z-10 flex flex-col items-center text-center gap-10 w-full">
                               <div className="flex flex-col items-center gap-4">
                                  <div className="w-16 h-16 rounded-2xl bg-acc-primary/10 text-acc-primary flex items-center justify-center">
                                     <span className="material-symbols-outlined text-3xl">verified_user</span>
                                  </div>
                                  <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">Chứng từ hợp lệ</div>
                               </div>

                               <div className="space-y-1">
                                  <span className="text-[10px] font-black text-acc-text-muted uppercase tracking-[0.2em]">Giá trị giao dịch</span>
                                  <h2 className="text-5xl font-black text-acc-text-main tracking-tighter leading-none">
                                     {extendedData.data?.amount || extendedData.data?.value || "0.00"}
                                     <span className="text-xl text-acc-text-light font-medium ml-2">VNĐ</span>
                                  </h2>
                               </div>

                               <div className="w-full grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50/80 p-5 rounded-[1.5rem] flex flex-col items-start gap-1 border border-transparent hover:border-slate-200 transition-all">
                                     <span className="text-[9px] font-black text-acc-text-light uppercase tracking-widest opacity-60">Mã đơn hàng/Đối tác</span>
                                     <span className="text-xs font-bold text-acc-text-main truncate w-full text-left">{extendedData.data?.orderId || extendedData.data?.customer || "CHƯA XÁC ĐỊNH"}</span>
                                  </div>
                                  <div className="bg-slate-50/80 p-5 rounded-[1.5rem] flex flex-col items-start gap-1 border border-transparent hover:border-slate-200 transition-all">
                                     <span className="text-[9px] font-black text-acc-text-light uppercase tracking-widest opacity-60">Thời điểm ghi sổ</span>
                                     <span className="text-xs font-bold text-acc-text-main truncate w-full text-left">{detail.time || "Thời gian thực"}</span>
                                  </div>
                               </div>

                               <button 
                                 onClick={() => setIsModalOpen(true)}
                                 className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200 mt-2 flex items-center justify-center gap-3 active:scale-[0.98]"
                               >
                                  <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                                  Xem toàn bộ chi tiết chứng từ
                               </button>

                               <div className="pt-4 opacity-30 grayscale rotate-[-3deg]">
                                  <div className="px-6 py-2 border-2 border-dashed border-emerald-500 rounded-lg flex flex-col items-center">
                                     <span className="text-[10px] font-black text-emerald-600">HOLA ERP VERIFIED</span>
                                  </div>
                                </div>
                            </div>
                         </div>
                      </div>
                    )}

                    {(extendedData.type === 'report' || extendedData.type === 'system_info') && (
                      <div className="animate-fade-up h-full flex flex-col min-h-0">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
                            {extendedData.data?.summary?.map((item, idx) => (
                               <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-2 shadow-sm">
                                  <span className="text-[10px] font-black text-acc-text-muted uppercase tracking-widest">{item.label}</span>
                                  <div className="flex items-end justify-between">
                                     <span className="text-xl font-black text-acc-text-main">{item.value} <span className="text-[9px] font-medium text-acc-text-light ml-0.5">VNĐ</span></span>
                                     <span className={`w-2.5 h-2.5 rounded-full ring-4 ring-white ${item.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col gap-6 shadow-sm overflow-hidden">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-xl">analytics</span></div>
                                  <h4 className="text-base font-black text-acc-text-main">Phân tích chi tiết</h4>
                               </div>
                               <div className="space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                  {extendedData.data?.breakdown?.map((item, idx) => (
                                     <div key={idx} className="flex flex-col gap-3 group">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                           <span className="text-acc-text-muted group-hover:text-acc-primary transition-colors">{item.label}</span>
                                           <span className="text-acc-text-main text-sm font-black">{item.value} VNĐ</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                           <div className="h-full bg-acc-primary rounded-full transition-all duration-1000 group-hover:bg-blue-600" style={{ width: `${85 - (idx * 20)}%` }}></div>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>

                            <div className="bg-slate-50/40 rounded-[2rem] border border-slate-100/50 p-8 flex flex-col gap-6 overflow-hidden">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><span className="material-symbols-outlined text-xl">account_tree</span></div>
                                  <h4 className="text-base font-black text-acc-text-main">Tiến trình nghiệp vụ</h4>
                               </div>
                               <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200/60 before:rounded-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                  {extendedData.data?.timeline?.map((step, idx) => (
                                     <div key={idx} className="relative">
                                        <div className={`absolute -left-[2.15rem] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all ${
                                           step.done ? 'bg-emerald-500 scale-110' : 'bg-slate-200'
                                        }`}>
                                           {step.done ? <span className="material-symbols-outlined text-[12px] text-white font-black">check</span> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                           <span className={`text-xs font-black ${step.done ? 'text-acc-text-main' : 'text-acc-text-light opacity-50'}`}>{step.step}</span>
                                           <div className="flex items-center gap-3 text-[10px] text-acc-text-muted font-bold">
                                              <span>{step.time}</span>
                                              <span className="opacity-30">•</span>
                                              <span className="text-acc-primary/80 font-black">{step.by}</span>
                                           </div>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <span className="material-symbols-outlined text-6xl mb-4">data_info_alert</span>
                    <p className="text-label-xs font-black uppercase tracking-widest text-acc-text-muted">Chưa có dữ liệu chi tiết cho mục này</p>
                  </div>
                )}
             </div>

             <div className="mt-4 p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-100 italic shrink-0">
                <p className="text-[9px] font-black text-acc-text-light uppercase mb-1.5 flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">info</span> Ghi chú nghiệp vụ
                </p>
                <p className="text-xs text-acc-text-muted leading-relaxed">
                   {extendedData?.note || "Thông tin được cập nhật tự động từ hệ thống lõi. Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ kỹ thuật ERP."}
                </p>
             </div>

              {/* Hidden Printable Area - Rendered via Portal directly to body for clean print isolation */}
              {createPortal(
                 <PrintableInvoiceTemplate 
                    detail={detail} 
                    extendedData={extendedData} 
                 />,
                 document.body
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
