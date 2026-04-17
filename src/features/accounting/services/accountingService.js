import axios from 'axios';

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
    // Sử dụng route thông qua prefix /api
    const response = await apiClient.get('/api/reports/revenue');
    return response.data;
  },

  // Lấy dữ liệu biểu đồ theo thời gian
  getRevenueData: async (timeframe = 'monthly') => {
    // Route này sẽ khớp với khai báo trong routes.json
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
  }
};

export default accountingService;
