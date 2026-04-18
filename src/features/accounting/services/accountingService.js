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

  return {
    // flat: component dùng stats.totalRevenue, stats.totalDebt, ...
    ...sourceStats,
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
      const { data } = await apiClient.get('/api/invoices');
      return data;
    } catch (err) {
      console.warn('[Dev Fallback] getInvoices → db.json', err.message);
      return mockInvoices();
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
