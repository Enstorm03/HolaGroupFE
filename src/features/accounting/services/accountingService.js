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
        if (mIdx >= 0 && mIdx < 12) monthlyData[mIdx].revenue += (inv.totalAmount || 0);
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
        yearlyMap[year] = (yearlyMap[year] || 0) + (inv.totalAmount || 0);
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
        // Mock phân bổ vào thứ trong tuần dựa trên ngày (chỉ để demo vì JS date parsing string VN hơi cực)
        const dIdx = parseInt(parts[0]) % 7; 
        weeklyData[dIdx].revenue += (inv.totalAmount || 0);
      }
    });
    return weeklyData;
  }

  // Fallback to static for daily (since invoices don't have hours)
  const key = `revenue_${timeframe}`;
  return dbData[key] || dbData.revenue_monthly || [];
};

const mockInvoices = () => dbData.invoices || [];

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
      // Logic tạo ID theo kiểu API: INV-006, INV-007...
      const localInvoices = JSON.parse(localStorage.getItem('added_invoices') || '[]');
      const currentInvoices = [...localInvoices, ...(dbData.invoices || [])];
      
      const lastNum = currentInvoices.reduce((max, inv) => {
        const num = parseInt(inv.id?.split('-')[1]) || 0;
        return num > max ? num : max;
      }, 0);
      
      const newId = `INV-${String(lastNum + 1).padStart(3, '0')}`;
      return { ...invoiceData, id: newId, orderStatus: 'Chờ thanh toán' };
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

  /** Ghi nhận thanh toán (luôn cần backend thật) */
  recordPayment: async (invoiceId, paymentData) => {
    const { data } = await apiClient.post('/api/payments', { invoiceId, ...paymentData });
    return data;
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
};

export default accountingService;
