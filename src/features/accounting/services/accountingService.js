import axios from 'axios';
import dbData from '../../../../db.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// ─── Kiểm tra có backend thật không ──────────────────────────────────────────
// Đặt VITE_USE_MOCK=true trong .env.local để dùng db.json (không cần backend)
// Khi backend thật sẵn sàng: xóa file .env.local hoặc đặt VITE_USE_MOCK=false
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Helper: đọc từ db.json khi ở chế độ mock ────────────────────────────────
const mockDashboardStats = () => {
  const sourceStats  = dbData.revenue_report?.stats  || dbData.stats  || {};
  const sourceNotifs = dbData.revenue_report?.notifications || dbData.notifications || [];

  // ─── Đồng bộ dữ liệu thực tế từ Invoice List ───
  const localInvoices = JSON.parse(localStorage.getItem('added_invoices') || '[]');
  const allInvoices = [...localInvoices, ...(dbData.invoices || [])];

  // 1. Tính Tổng Doanh thu (Tổng tất cả giá trị hóa đơn)
  const totalRev = allInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  
  // 2. Tính Tổng Công nợ (Các hóa đơn chưa 'Đã thanh toán')
  const totalDebt = allInvoices
    .filter(inv => inv.orderStatus !== 'Đã thanh toán')
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    
  // 3. Đếm số hóa đơn chờ xử lý
  const pendingCount = allInvoices.filter(inv => 
    inv.orderStatus === 'Chờ thanh toán' || 
    inv.orderStatus === 'Thanh toán một phần' || 
    inv.orderStatus === 'Quá hạn'
  ).length;

  return {
    ...sourceStats,
    // Ghi đè các chỉ số bằng dữ liệu tính toán thực tế
    totalRevenue: totalRev.toLocaleString('vi-VN'),
    revenue: totalRev.toLocaleString('vi-VN'), // Cho cả các key variant khác
    totalDebt: totalDebt.toLocaleString('vi-VN'),
    pendingInvoices: pendingCount.toString(),
    
    notifications: sourceNotifs.map(notif => {
      const detail = dbData.notification_details?.find(d => d.id === parseInt(notif.id));
      if (detail && detail.type === 'multi_entity' && Array.isArray(detail.data)) {
        return { ...notif, count: detail.data.length };
      }
      return notif;
    }),
  };
};

const mockRevenueData = (timeframe) => {
  const localInvoices = JSON.parse(localStorage.getItem('added_invoices') || '[]');
  const allInvoices = [...localInvoices, ...(dbData.invoices || [])];

  // Chỉ lấy hóa đơn Đã thanh toán hoặc Thanh toán một phần
  const validInvoices = allInvoices.filter(inv => 
    inv.orderStatus === 'Đã thanh toán' || inv.orderStatus === 'Thanh toán một phần'
  );

  if (timeframe === 'monthly') {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = months.map(m => ({ month: m, revenue: 0, expense: dbData.revenue_monthly?.find(d => d.month === m)?.expense || 0 }));
    
    validInvoices.forEach(inv => {
      const parts = (inv.dueDate || inv.date || "").split('/');
      if (parts.length === 3) {
        const mIdx = parseInt(parts[1]) - 1;
        if (mIdx >= 0 && mIdx < 12) {
          // Nếu đã thanh toán hết thì lấy total, nếu một phần thì lấy paidAmount
          const revenueToAdd = inv.orderStatus === 'Đã thanh toán' ? (inv.totalAmount || 0) : (inv.paidAmount || 0);
          monthlyData[mIdx].revenue += revenueToAdd;
        }
      }
    });
    return monthlyData;
  }

  if (timeframe === 'yearly') {
    const yearlyMap = {};
    validInvoices.forEach(inv => {
      const parts = (inv.dueDate || inv.date || "").split('/');
      if (parts.length === 3) {
        const year = parts[2];
        const revenueToAdd = inv.orderStatus === 'Đã thanh toán' ? (inv.totalAmount || 0) : (inv.paidAmount || 0);
        yearlyMap[year] = (yearlyMap[year] || 0) + revenueToAdd;
      }
    });
    // Trộn với data mẫu để biểu đồ có nhiều điểm
    const baseYears = ["2020", "2021", "2022", "2023", "2024", "2025"];
    return baseYears.map(y => ({ 
      month: y, 
      revenue: yearlyMap[y] || 0, 
      expense: dbData.revenue_yearly?.find(d => d.month === y)?.expense || 0 
    }));
  }

  if (timeframe === 'weekly') {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const weeklyData = days.map(d => ({ month: d, revenue: 0, expense: dbData.revenue_weekly?.find(w => w.month === d)?.expense || 0 }));
    
    validInvoices.forEach(inv => {
      const parts = (inv.dueDate || inv.date || "").split('/');
      if (parts.length === 3) {
        const dIdx = parseInt(parts[0]) % 7; 
        const revenueToAdd = inv.orderStatus === 'Đã thanh toán' ? (inv.totalAmount || 0) : (inv.paidAmount || 0);
        weeklyData[dIdx].revenue += revenueToAdd;
      }
    });
    return weeklyData;
  }

  // Fallback to static for daily (since invoices don't have hours)
  const key = `revenue_${timeframe}`;
  return dbData[key] || dbData.revenue_monthly || [];
};

const mockInvoices = () => {
  const localInvoices = JSON.parse(localStorage.getItem('added_invoices') || '[]');
  const dbInvoices = dbData.invoices || [];
  
  // Gộp dữ liệu: ưu tiên dữ liệu local theo ID
  const merged = [...localInvoices];
  dbInvoices.forEach(dbInv => {
    if (!merged.find(m => m.id === dbInv.id)) {
      merged.push(dbInv);
    }
  });
  return merged;
};

const mockPayments = () => {
  const localPayments = JSON.parse(localStorage.getItem('added_payments') || '[]');
  return [...localPayments, ...(dbData.payments || [])];
};

const mockDebtReport = () =>
  dbData.debt_report_full || {
    data:    dbData.debt_report || [],
    summary: dbData.debt_summary || null,
  };

const mockNotificationDetail = (id) => {
  const notifications = dbData.revenue_report?.notifications || dbData.notifications || [];
  const details       = dbData.notification_details || [];

  const synced = notifications.map(notif => {
    const detail = details.find(d => d.id === parseInt(notif.id));
    if (detail && detail.type === 'multi_entity' && Array.isArray(detail.data)) {
      return { ...notif, count: detail.data.length };
    }
    return notif;
  });

  return synced.find(n => n.id === parseInt(id));
};

// ─── Service ──────────────────────────────────────────────────────────────────
const accountingService = {
  /** Lấy chỉ số tổng quát */
  getDashboardStats: async () => {
    if (USE_MOCK) return mockDashboardStats();
    try {
      const { data } = await apiClient.get('/api/reports/revenue');
      if (data.notifications) {
        data.notifications = data.notifications.map(notif => {
          const detail = dbData.notification_details?.find(d => d.id === parseInt(notif.id));
          if (detail && detail.type === 'multi_entity' && Array.isArray(detail.data)) {
            return { ...notif, count: detail.data.length };
          }
          return notif;
        });
      }
      return data;
    } catch (err) {
      console.warn('[Dev Fallback] getDashboardStats → db.json', err.message);
      return mockDashboardStats();
    }
  },

  /** Lấy dữ liệu biểu đồ theo timeframe (daily/weekly/monthly/yearly) */
  getRevenueData: async (timeframe = 'monthly') => {
    if (USE_MOCK) return mockRevenueData(timeframe);
    try {
      const { data } = await apiClient.get(`/api/reports/${timeframe}`);
      // Backend c ó thể trả { chartData: [] } hoặc array thẳng
      return Array.isArray(data) ? data : (data?.chartData || []);
    } catch (err) {
      console.warn('[Dev Fallback] getRevenueData → db.json', err.message);
      return mockRevenueData(timeframe);
    }
  },

  /** Lấy danh sách hóa đơn */
  getInvoices: async () => {
    if (USE_MOCK) return mockInvoices();
    try {
      const { data } = await apiClient.get('/invoices'); // Giả sử endpoint là /invoices
      return data;
    } catch (err) {
      console.warn('[Dev Fallback] getInvoices → db.json', err.message);
      return mockInvoices();
    }
  },

  /** Tạo hóa đơn mới */
  createInvoice: async (invoiceData) => {
    if (USE_MOCK) {
      // 1. Lấy danh sách đầy đủ (Merge giữa db.json và localStorage)
      const allInvoices = mockInvoices();
      
      // 2. Tìm ID lớn nhất có định dạng INV-XXX
      const lastNum = allInvoices.reduce((max, inv) => {
        if (inv.id && inv.id.startsWith('INV-')) {
          const num = parseInt(inv.id.split('-')[1]) || 0;
          return num > max ? num : max;
        }
        return max;
      }, 0);
      
      const newId = `INV-${String(lastNum + 1).padStart(3, '0')}`;
      const newInvoice = { 
        ...invoiceData, 
        id: newId, 
        orderStatus: invoiceData.orderStatus || 'Chờ thanh toán',
        date: invoiceData.date || new Date().toLocaleDateString('vi-VN'),
        createdAt: new Date().toISOString()
      };

      // 3. LƯU NGAY vào localStorage để các lần gọi sau không bị trùng ID
      const localInvoices = JSON.parse(localStorage.getItem('added_invoices') || '[]');
      localStorage.setItem('added_invoices', JSON.stringify([newInvoice, ...localInvoices]));

      return newInvoice;
    }
    try {
      const { data } = await apiClient.post('/invoices', invoiceData);
      return data;
    } catch (err) {
      console.error('Error creating invoice:', err);
      throw err;
    }
  },

  /** Cập nhật trạng thái hóa đơn */
  updateInvoiceStatus: async (id, status) => {
    if (USE_MOCK) return { id, orderStatus: status };
    try {
      const { data } = await apiClient.patch(`/invoices/${id}`, { orderStatus: status });
      return data;
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  },

  /** Cập nhật chi phí phát sinh */
  updateInvoiceCosts: async (id, totalAmount) => {
    if (USE_MOCK) return { id, totalAmount };
    try {
      const { data } = await apiClient.patch(`/invoices/${id}`, { totalAmount });
      return data;
    } catch (err) {
      console.error('Error updating costs:', err);
      throw err;
    }
  },

  /** Lấy báo cáo công nợ */
  getDebtReport: async () => {
    if (USE_MOCK) return mockDebtReport();
    try {
      const { data } = await apiClient.get('/api/debts');
      return data;
    } catch (err) {
      console.warn('[Dev Fallback] getDebtReport → db.json', err.message);
      return mockDebtReport();
    }
  },

  /** Ghi nhận thanh toán */
  recordPayment: async (invoiceId, paymentData) => {
    if (USE_MOCK) {
      // ─── Giả lập lưu thanh toán vào localStorage ───
      const localPayments = JSON.parse(localStorage.getItem('added_payments') || '[]');
      const newPayment = {
        id: `PT-${Date.now().toString().slice(-5)}`,
        invoiceId,
        ...paymentData,
        recordedBy: 'Admin (Mock)'
      };
      
      const updatedPayments = [newPayment, ...localPayments];
      localStorage.setItem('added_payments', JSON.stringify(updatedPayments));

      // ─── Cập nhật trạng thái hóa đơn tương ứng ───
      const allInvoices = mockInvoices();
      
      const updatedInvoices = allInvoices.map(inv => {
        if (inv.id === invoiceId) {
          const newPaidAmount = (inv.paidAmount || 0) + paymentData.amount;
          const isFullyPaid = newPaidAmount >= (inv.totalAmount || 0);
          return {
            ...inv,
            paidAmount: newPaidAmount,
            orderStatus: isFullyPaid ? 'Đã thanh toán' : 'Thanh toán một phần',
            nextPaymentDate: paymentData.nextPaymentDate || inv.nextPaymentDate
          };
        }
        return inv;
      });
      
      localStorage.setItem('added_invoices', JSON.stringify(updatedInvoices));
      
      return { success: true, data: newPayment };
    }

    try {
      const { data } = await apiClient.post('/api/payments', { invoiceId, ...paymentData });
      return data;
    } catch (err) {
      console.error('Error recording payment:', err);
      throw err;
    }
  },

  /** Lấy thông tin cơ bản của một thông báo theo id */
  getNotificationDetail: async (id) => {
    if (USE_MOCK) return mockNotificationDetail(id);
    try {
      const { data: dashboard } = await apiClient.get('/api/reports/revenue');
      const details = dbData.notification_details || [];
      const synced  = dashboard.notifications.map(notif => {
        const detail = details.find(d => d.id === parseInt(notif.id));
        if (detail && detail.type === 'multi_entity' && Array.isArray(detail.data)) {
          return { ...notif, count: detail.data.length };
        }
        return notif;
      });
      return synced.find(n => n.id === parseInt(id));
    } catch (err) {
      console.warn('[Dev Fallback] getNotificationDetail → db.json', err.message);
      return mockNotificationDetail(id);
    }
  },

  /** Lấy chi tiết đầy đủ của một thông báo (luôn đọc từ db.json) */
  getExtendedNotificationDetail: async (id) => {
    const numericId = parseInt(id);
    return dbData.notification_details?.find(item => item.id === numericId) || null;
  },

  /** Lấy lịch sử thu tiền */
  getPayments: async () => {
    if (USE_MOCK) return mockPayments();
    try {
      const { data } = await apiClient.get('/api/payments');
      return data;
    } catch (err) {
      console.warn('[Dev Fallback] getPayments → db.json', err.message);
      return mockPayments();
    }
  },
};

export default accountingService;
