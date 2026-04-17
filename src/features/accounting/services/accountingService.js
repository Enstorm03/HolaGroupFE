import axios from 'axios';
import dbData from '../../../../db.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const accountingService = {
  // Lấy chỉ số tổng quát
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/reports/revenue');
    const data = response.data;
    
    // Create Semantic Link: Cross-reference notifications with detailed data counts
    if (data.notifications && Array.isArray(data.notifications)) {
      data.notifications = data.notifications.map(notif => {
        const detail = dbData.notification_details?.find(d => d.id === parseInt(notif.id));
        if (detail && detail.type === 'multi_entity' && Array.isArray(detail.data)) {
          // Inject real-time count from source data
          return { ...notif, count: detail.data.length };
        }
        return notif;
      });
    }
    
    return data;
  },

  // Lấy dữ liệu biểu đồ theo thời gian
  getRevenueData: async (timeframe = 'monthly') => {
    const endpoint = `/api/reports/${timeframe}`;
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getInvoices: async () => {
    const response = await apiClient.get('/api/invoices');
    return response.data;
  },

  getDebtReport: async () => {
    const response = await apiClient.get('/api/debts');
    return response.data;
  },

  recordPayment: async (invoiceId, paymentData) => {
    const response = await apiClient.post(`/api/payments`, {
      invoiceId,
      ...paymentData
    });
    return response.data;
  },

  // Lấy chi tiết một thông báo/giao dịch cụ thể
  getNotificationDetail: async (id) => {
    const response = await apiClient.get('/api/reports/revenue');
    const dashboard = response.data;
    const details = dbData.notification_details || [];
    
    // Đồng bộ hóa con số thực tế cho các thông báo dạng danh sách (Smart Link)
    const syncedNotifications = dashboard.notifications.map(notif => {
      // Tìm dữ liệu chi tiết tương ứng trong file JSON (hoặc pool dữ liệu)
      const detail = details.find(d => d.id === parseInt(notif.id));
      
      if (detail && detail.type === 'multi_entity' && Array.isArray(detail.data)) {
        // Tự động đếm và gán count để UI render tiêu đề động
        return { ...notif, count: detail.data.length };
      }
      return notif;
    });

    const notification = syncedNotifications.find(n => n.id === parseInt(id));
    return notification;
  },

  getExtendedNotificationDetail: async (id) => {
    const numericId = parseInt(id);
    // Trỏ đúng vào mảng notification_details trong db.json
    const found = dbData.notification_details?.find(item => item.id === numericId);
    return found || null;
  }
};

export default accountingService;
