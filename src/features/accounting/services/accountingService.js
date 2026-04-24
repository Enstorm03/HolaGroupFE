import axios from 'axios';
import dbData from '../../../../db.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── UTILITIES ──────────────────────────────────────────────────────────────

/**
 * Định dạng ID số sang mã hiển thị (INV-001, PAY-001, v.v.)
 */
const formatDisplayCode = (id, prefix = 'INV') => {
  if (!id) return 'N/A';
  if (isNaN(id)) return id;
  return `${prefix}-${id.toString().padStart(3, '0')}`;
};

/**
 * Parse YYYY-MM-DD or DD/MM/YYYY reliably
 */
const parseDate = (dStr) => {
  if (!dStr) return null;
  if (dStr instanceof Date) return { y: dStr.getFullYear(), m: dStr.getMonth() + 1, d: dStr.getDate() };
  
  const s = String(dStr).trim();
  let parts = s.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) { // YYYY-MM-DD
      const [y, m, d] = parts.map(Number);
      return { y, m, d: d || 1 };
    } else if (parts[2].length === 4) { // DD-MM-YYYY
      const [d, m, y] = parts.map(Number);
      return { y, m, d };
    }
  }
  return null;
};

/**
 * Chuẩn hóa trạng thái hóa đơn (VN <-> EN)
 */
const safeNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const cleanStr = String(val).replace(/\./g, '').replace(/,/g, '');
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const normalizeInvoiceStatus = (status) => {
  if (!status) return 'pending';
  const s = status.toLowerCase();
  if (s === 'đã thanh toán' || s === 'paid' || s === 'completed') return 'paid';
  if (s === 'thanh toán một phần' || s === 'partial') return 'partial';
  if (s === 'chờ thanh toán' || s === 'pending') return 'pending';
  if (s === 'quá hạn' || s === 'overdue') return 'overdue';
  return s;
};

const getStatusLabelVN = (status) => {
  const s = normalizeInvoiceStatus(status);
  if (s === 'paid') return 'Đã thanh toán';
  if (s === 'partial') return 'T.Toán một phần';
  if (s === 'overdue') return 'Quá hạn';
  return 'Chờ thanh toán';
};

/**
 * Tính thời gian tương đối (vd: "2 giờ trước")
 */
const getRelativeTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  // Nếu đã quá 24 giờ, hiển thị rõ ngày tháng
  if (diffHours >= 24) {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  if (diffHours > 0) return `${diffHours} giờ trước`;
  if (diffMins > 0) return `${diffMins} phút trước`;
  return 'Vừa xong';
};

/**
 * Tìm thông tin khách hàng từ ID
 */
const getCustomerDetails = (customerID) => {
  if (!customerID) return { customerName: 'Khách hàng lẻ', email: null, phoneNumber: null, address: null };
  
  const customer = dbData.customers?.find(c => c.customerID === Number(customerID));
  if (customer) {
    return {
      ...customer,
      customerName: customer.companyName || `${customer.lastName} ${customer.firstName}` || 'Khách hàng chưa rõ'
    };
  }
  
  return {
    customerName: isNaN(Number(customerID)) ? String(customerID) : 'Khách hàng lẻ',
    email: null, phoneNumber: null, address: null
  };
};

/**
 * Chuyển Date hoặc chuỗi về YYYY-MM-DD để so sánh chuẩn
 */
const toISODate = (d) => {
  if (!d) return null;
  const dateObj = (d instanceof Date) ? d : parseDateToObj(d);
  if (!dateObj) return null;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateToObj = (s) => {
  if (!s) return null;
  // Bỏ đi phần thời gian (vd: T15:57:16Z) để tránh lỗi NaN khi parse
  const datePart = s.split('T')[0]; 
  const parts = datePart.split(/[-/]/).map(Number);
  if (parts.length >= 3) {
    if (parts[0] > 1000) return new Date(parts[0], parts[1] - 1, parts[2] || 1);
    return new Date(parts[2], parts[1] - 1, parts[0] || 1);
  }
  return null;
};

const getISOWeek = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 0;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// ─── LOCAL STORAGE HELPERS ───────────────────────────────────────────────────

const getLocalInvoices = () => {
  try {
    const raw = localStorage.getItem('added_invoices');
    if (!raw) return [];
    const list = JSON.parse(raw);
    const cleanList = list.filter(inv => !isNaN(inv.invoiceID));
    if (cleanList.length !== list.length) {
      localStorage.setItem('added_invoices', JSON.stringify(cleanList));
    }
    return cleanList;
  } catch (e) { return []; }
};

const getLocalPayments = () => {
  try {
    const raw = localStorage.getItem('added_payments');
    if (!raw) return [];
    const list = JSON.parse(raw);
    const cleanList = list.filter(p => !isNaN(p.paymentID));
    if (cleanList.length !== list.length) {
      localStorage.setItem('added_payments', JSON.stringify(cleanList));
    }
    return cleanList;
  } catch (e) { return []; }
};

const getLocalOrderItems = () => {
  try {
    const raw = localStorage.getItem('added_order_items');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
};

/**
 * Lấy tất cả hóa đơn hiện tại (merged từ localStorage + db.json)
 */
const getAllCurrentInvoices = () => {
  const localInvoices = getLocalInvoices();
  const apiInvoices = dbData.invoices || [];
  const overrides = JSON.parse(localStorage.getItem('invoice_overrides') || '[]');
  return [
    ...localInvoices,
    ...apiInvoices.filter(api => !overrides.some(ov => ov.invoiceID === api.invoiceID)),
    ...overrides
  ];
};

/**
 * Lấy tất cả thanh toán hiện tại (merged từ localStorage + db.json)
 */
const getAllCurrentPayments = () => {
  const localPayments = getLocalPayments();
  const apiPayments = dbData.payments || [];
  // Tránh trùng lặp: ưu tiên local payments
  const localIds = new Set(localPayments.map(p => p.paymentID));
  return [
    ...localPayments,
    ...apiPayments.filter(p => !localIds.has(p.paymentID))
  ];
};

// ─── NOTIFICATION ENGINE ─────────────────────────────────────────────────────

/**
 * Tự động sinh danh sách notifications từ dữ liệu thực.
 * Mỗi notification có cấu trúc:
 * {
 *   id: string,         -- unique key (e.g. "overdue", "PAY-1", "RPT-1")
 *   transactionType: 'List' | 'Voucher' | 'Report',
 *   uiType: 'warning' | 'info' | 'report',  -- for icon/color
 *   message: string,    -- tiêu đề hiển thị
 *   time: string,       -- thời gian tương đối
 *   count: number?,     -- số lượng (cho loại List)
 * }
 */
/**
 * Tự động sinh danh sách notifications từ dữ liệu thực, có lọc theo thời gian.
 */
const buildNotifications = (timeframe = 'monthly', options = {}) => {
  const allInvoices = getAllCurrentInvoices();
  const allPayments = getAllCurrentPayments();
  const reports = dbData.quarterly_reports || [];
  const notifications = [];

  const now = new Date();
  const isDaily = timeframe === 'daily';
  const selectedDayNum = options.selectedDay ? parseInt(options.selectedDay, 10) : null;
  const filterY = parseInt((options.filterDate || "").split('-')[0]) || now.getFullYear();
  const filterM = parseInt((options.filterDate || "").split('-')[1]) || (now.getMonth() + 1);



  // 1. Phân loại và Lọc dữ liệu bằng một Helper hợp nhất
  const matchesTimeframe = (dateStr) => {
    const pd = parseDateToObj(dateStr);
    if (!pd) return false;

    if (timeframe === 'daily') {
      const selectedDayNum = options.selectedDay ? parseInt(options.selectedDay, 10) : now.getDate();
      const filterY = parseInt((options.filterDate || "").split('-')[0]) || now.getFullYear();
      const filterM = parseInt((options.filterDate || "").split('-')[1]) || (now.getMonth() + 1);
      return pd.getFullYear() === filterY && (pd.getMonth() + 1) === filterM && pd.getDate() === selectedDayNum;
      
    } else if (timeframe === 'weekly') {
      const [yStr, wStr] = (options.filterWeek || "").split('-W');
      const targetY = parseInt(yStr) || now.getFullYear();
      const targetW = parseInt(wStr) || getISOWeek(now);
      return pd.getFullYear() === targetY && getISOWeek(pd) === targetW;
      
    } else if (timeframe === 'monthly') {
      // Tab "Tháng" hiển thị 12 tháng của năm, nên ta lọc theo Năm (filterYear)
      const targetY = parseInt(options.filterYear) || (options.filterDate ? parseInt(options.filterDate.split('-')[0]) : now.getFullYear());
      return pd.getFullYear() === targetY;
      
    } else {
      // Tab "Năm" (yearly) hiển thị N năm
      const yearsCount = parseInt(options.filterYearsCount) || 5;
      const endY = now.getFullYear();
      const startY = endY - yearsCount + 1;
      const y = pd.getFullYear();
      return y >= startY && y <= endY;
    }
  };

  const filteredPayments = allPayments.filter(p => matchesTimeframe(p.paymentDate));
  const filteredReports = reports.filter(r => matchesTimeframe(r.createdAt));

  // ── A. LIST (Công nợ - Luôn lọc theo matchesTimeframe) ──
  // 1. Quá hạn
  const overdueInvoices = allInvoices.filter(inv => {
    const s = normalizeInvoiceStatus(inv.status);
    const isOverdue = s === 'overdue' || (s !== 'paid' && inv.dueDate && new Date(inv.dueDate) < new Date());
    return isOverdue && matchesTimeframe(inv.dueDate);
  });

  if (overdueInvoices.length > 0) {
    notifications.push({
      id: 'notif-overdue',
      type: 'List',
      uiType: 'warning',
      message: `Hệ thống ghi nhận ${overdueInvoices.length} hóa đơn quá hạn cần xử lý.`,
      timestamp: overdueInvoices[0].dueDate,
      status: 'Cần xử lý',
      count: overdueInvoices.length,
    });
  }

  // 2. Thanh toán một phần
  const partialInvoices = allInvoices.filter(inv => {
    const isPartial = normalizeInvoiceStatus(inv.status) === 'partial';
    return isPartial && matchesTimeframe(inv.invoiceDate || inv.createAt);
  });

  if (partialInvoices.length > 0) {
    notifications.push({
      id: 'notif-partial',
      type: 'List',
      uiType: 'info',
      message: `Hệ thống ghi nhận ${partialInvoices.length} hóa đơn thanh toán một phần cần theo dõi.`,
      timestamp: partialInvoices[0].invoiceDate || partialInvoices[0].createAt,
      status: 'Đang theo dõi',
      count: partialInvoices.length,
    });
  }

  // ── B. VOUCHER (Phiếu thu - Đã được lọc bởi filteredPayments) ──
  const allOrders = dbData.orders || [];
  filteredPayments.forEach(pay => {
    const invoice = allInvoices.find(i => i.invoiceID === pay.invoiceID);
    const order = allOrders.find(o => o.orderID === invoice?.orderID);
    const customer = getCustomerDetails(invoice?.customerID || order?.customerID);
    const voucherCode = pay.voucherCode || formatDisplayCode(pay.paymentID, 'VCHR');
    
    notifications.push({
      id: `notif-pay-${pay.paymentID}`,
      type: 'Voucher',
      uiType: 'info',
      message: `Phiếu thu ${voucherCode} — ${customer.customerName} đã được duyệt.`,
      timestamp: pay.paymentDate,
      status: 'Hoàn thành',
      paymentID: pay.paymentID,
    });
  });

  // ── C. REPORT (Báo cáo - Đã được lọc bởi filteredReports) ──
  filteredReports.forEach(rpt => {
    notifications.push({
      id: `notif-rpt-${rpt.reportID}`,
      type: 'Report',
      uiType: 'report',
      message: `${rpt.title} đã sẵn sàng phê duyệt.`,
      timestamp: rpt.createdAt,
      status: rpt.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt',
      reportID: rpt.reportID,
    });
  });

  // Sắp xếp theo thời gian mới nhất
  return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Trả về extended detail cho từng notification ID.
 * ID có dạng:  notif-overdue | notif-partial | notif-pay-{paymentID} | notif-rpt-{reportID}
 */
const buildExtendedDetail = (notifId) => {
  const allInvoices = getAllCurrentInvoices();
  const allPayments = getAllCurrentPayments();

  // ── LIST: Khách hàng quá hạn ─────────────────────────────────────────────
  const allOrders = dbData.orders || [];
  if (notifId === 'notif-overdue') {
    const overdueInvoices = allInvoices.filter(inv => {
      const s = normalizeInvoiceStatus(inv.status);
      return s === 'overdue' || (s !== 'paid' && inv.dueDate && new Date(inv.dueDate) < new Date());
    });
    const rows = overdueInvoices.map(inv => {
      const order = allOrders.find(o => o.orderID === inv.orderID);
      const customer = getCustomerDetails(inv.customerID || order?.customerID);
      const due = new Date(inv.dueDate);
      const diffDays = Math.ceil((new Date() - due) / (1000 * 60 * 60 * 24));
      const remaining = (Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0);
      return {
        id: formatDisplayCode(inv.invoiceID, 'INV'),
        name: customer.customerName,
        amount: remaining.toLocaleString('vi-VN'),
        days: diffDays > 0 ? diffDays : 0,
        status: remaining > 100000000 ? 'high' : 'medium',
      };
    });
    return {
      type: 'multi_entity',
      data: rows,
      note: `Hệ thống tự động quét công nợ ngày ${new Date().toLocaleDateString('vi-VN')}. Vui lòng liên hệ khách hàng để đôn đốc thanh toán.`,
    };
  }

  // ── LIST: Hóa đơn partial ─────────────────────────────────────────────────
  if (notifId === 'notif-partial') {
    const partialInvoices = allInvoices.filter(inv => normalizeInvoiceStatus(inv.status) === 'partial');
    const rows = partialInvoices.map(inv => {
      const order = allOrders.find(o => o.orderID === inv.orderID);
      const customer = getCustomerDetails(inv.customerID || order?.customerID);
      const remaining = (Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0);
      return {
        id: formatDisplayCode(inv.invoiceID, 'INV'),
        name: customer.customerName,
        amount: remaining.toLocaleString('vi-VN'),
        days: inv.dueDate ? Math.ceil((new Date() - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24)) : 0,
        status: remaining > 50000000 ? 'high' : 'medium',
      };
    });
    return {
      type: 'multi_entity',
      data: rows,
      note: `Các hóa đơn thanh toán một phần cần được theo dõi định kỳ để đảm bảo thu đủ công nợ.`,
    };
  }

  // ── VOUCHER: Phiếu thu thanh toán ────────────────────────────────────────
  if (notifId.startsWith('notif-pay-')) {
    const paymentID = Number(notifId.replace('notif-pay-', ''));
    const pay = allPayments.find(p => p.paymentID === paymentID);
    if (!pay) return { type: 'generic', data: {} };

    const inv = allInvoices.find(i => i.invoiceID === pay.invoiceID);
    const order = allOrders.find(o => o.orderID === inv?.orderID);
    const customer = getCustomerDetails(inv?.customerID || order?.customerID);
    const invoiceCode = formatDisplayCode(pay.invoiceID, 'INV');
    const orderCode = inv?.orderID ? formatDisplayCode(inv.orderID, 'ORD') : 'N/A';
    const voucherCode = pay.voucherCode || formatDisplayCode(pay.paymentID, 'VCHR');

    return {
      type: 'voucher',
      data: {
        customer: customer.customerName,
        order_ref: orderCode,
        amount: Number(pay.amount).toLocaleString('vi-VN'),
        method: pay.paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : pay.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ / POS',
        ref_code: `${voucherCode} → ${invoiceCode}`,
        date: pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString('vi-VN') : 'N/A',
        approval: pay.recordedBy || 'Kế toán trưởng',
        description: pay.note || `Thanh toán cho hóa đơn ${invoiceCode}`,
        status: pay.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý',
      },
      note: `Phiếu thu ${voucherCode} được tạo tự động từ hệ thống thủ quỹ ERP. Có giá trị pháp lý nội bộ.`,
    };
  }

  // ── REPORT: Báo cáo quý ──────────────────────────────────────────────────
  if (notifId.startsWith('notif-rpt-')) {
    const reportID = Number(notifId.replace('notif-rpt-', ''));
    const rpt = (dbData.quarterly_reports || []).find(r => r.reportID === reportID);
    if (!rpt) return { type: 'generic', data: {} };

    return {
      type: 'report',
      data: {
        summary: [
          { label: 'Tổng doanh thu quý', value: rpt.totalRevenue.toLocaleString('vi-VN'), status: 'approved' },
          { label: 'Thuế GTGT đầu ra', value: rpt.vatOut.toLocaleString('vi-VN'), status: 'approved' },
          { label: 'Thuế được khấu trừ', value: rpt.vatDeductible.toLocaleString('vi-VN'), status: rpt.status === 'APPROVED' ? 'approved' : 'pending' },
        ],
        breakdown: rpt.breakdown || [],
        timeline: rpt.timeline || [],
      },
      note: rpt.note || `Báo cáo ${rpt.title} được tổng hợp bởi phòng Kế toán.`,
    };
  }

  return { type: 'generic', data: {} };
};

// ─── MOCK FUNCTIONS ──────────────────────────────────────────────────────────

const mockDashboardStats = (timeframe = 'monthly', options = {}) => {
  const allInvoices = getAllCurrentInvoices();
  const allPayments = getAllCurrentPayments();
  const now = new Date();

  // Helper: Parse date YYYY-MM-DD
  const pDate = (s) => {
    if (!s) return null;
    const parts = s.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2] || 1);
  };

  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  
  let filteredInvoices = allInvoices;
  let filteredPayments = allPayments;

  if (timeframe === 'daily') {
    // If timeframe is daily, we check for a specific selectedDay or default to today
    const [y, m] = (options.filterDate || "").split('-').map(Number);
    const targetY = y || now.getFullYear();
    const targetM = m || (now.getMonth() + 1);
    const targetD = options.selectedDay || now.getDate();
    const targetISO = `${targetY}-${String(targetM).padStart(2, '0')}-${String(targetD).padStart(2, '0')}`;

    filteredInvoices = allInvoices.filter(inv => toISODate(inv.invoiceDate) === targetISO);
    filteredPayments = allPayments.filter(p => toISODate(p.paymentDate) === targetISO);
  } else if (timeframe === 'weekly') {
    const [y, w] = (options.filterWeek || "").split('-W').map(Number);
    // Rough week matching logic: check if the date falls in that week
    const getISOWeek = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    };

    filteredInvoices = allInvoices.filter(inv => {
      const d = pDate(inv.invoiceDate);
      return d && d.getFullYear() === y && getISOWeek(d) === w;
    });
    filteredPayments = allPayments.filter(p => {
      const d = pDate(p.paymentDate);
      return d && d.getFullYear() === y && getISOWeek(d) === w;
    });
  } else if (timeframe === 'monthly') {
    const targetY = parseInt(options.filterYear) || (options.filterDate ? parseInt(options.filterDate.split('-')[0]) : now.getFullYear());
    filteredInvoices = allInvoices.filter(inv => {
      const d = pDate(inv.invoiceDate);
      return d && d.getFullYear() === targetY;
    });
    filteredPayments = allPayments.filter(p => {
      const d = pDate(p.paymentDate);
      return d && d.getFullYear() === targetY;
    });
  } else if (timeframe === 'yearly') {
    const yearsCount = parseInt(options.filterYearsCount) || 5;
    const endY = now.getFullYear();
    const startY = endY - yearsCount + 1;
    
    filteredInvoices = allInvoices.filter(inv => {
      const y = pDate(inv.invoiceDate)?.getFullYear();
      return y && y >= startY && y <= endY;
    });
    filteredPayments = allPayments.filter(p => {
      const y = pDate(p.paymentDate)?.getFullYear();
      return y && y >= startY && y <= endY;
    });
  }

  const totalRev = filteredInvoices.reduce((sum, inv) => sum + safeNumber(inv.totalAmount), 0);
  const totalDebt = filteredInvoices.reduce((sum, inv) => {
    const s = normalizeInvoiceStatus(inv.status);
    return s !== 'paid' ? sum + (safeNumber(inv.totalAmount) - safeNumber(inv.paidAmount)) : sum;
  }, 0);
  const totalCollected = filteredPayments.reduce((sum, p) => sum + safeNumber(p.amount), 0);

  return {
    totalRevenue: totalRev,
    totalDebt: totalDebt,
    totalCollected: totalCollected,
    pendingInvoices: filteredInvoices.length.toString(),
    cashBalance: dbData.stats.totalBalance || '1.250.000.000',
    notifications: buildNotifications(timeframe, options),
  };
};

const mockInvoices = () => {
  const allPayments = getAllCurrentPayments();
  const allOrders = dbData.orders || [];
  const allOrderItems = [...(dbData.orderItems || []), ...getLocalOrderItems()];
  const allProducts = dbData.products || [];

  return getAllCurrentInvoices().map(inv => {
    const order = allOrders.find(o => o.orderID === inv.orderID);
    const customer = getCustomerDetails(inv.customerID || order?.customerID);
    
    // Join items from OrderItems and Products
    const items = allOrderItems
      .filter(oi => oi.orderID === inv.orderID)
      .map(oi => {
        const product = allProducts.find(p => p.productID === oi.productID);
        return {
          ...oi,
          productName: product?.productName || 'Sản phẩm không xác định',
          unit: product?.unit || 'đv'
        };
      });

    // Fallback: If no order items found but invoice has embedded items (legacy/local)
    const finalItems = items.length > 0 ? items : (inv.items || []);

    const normalizedStatus = normalizeInvoiceStatus(inv.status);
    const payments = allPayments.filter(p => p.invoiceID === inv.invoiceID && (p.status === 'completed' || normalizeInvoiceStatus(p.status) === 'paid'));
    let paidAt = null;
    
    if (normalizedStatus === 'paid') {
      if (payments.length > 0) {
        const lastPayment = [...payments].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];
        const datePart = lastPayment.paymentDate || inv.invoiceDate || new Date().toISOString().split('T')[0];
        paidAt = `${new Date(datePart).toLocaleDateString('vi-VN')} - 14:30:00`;
      } else {
        const datePart = inv.invoiceDate || new Date().toISOString().split('T')[0];
        paidAt = `${new Date(datePart).toLocaleDateString('vi-VN')} - 09:00:00`;
      }
    }

    return {
      ...inv,
      displayID: formatDisplayCode(inv.invoiceID, 'INV'),
      displayOrderID: (inv.orderID && !isNaN(inv.orderID))
        ? formatDisplayCode(inv.orderID, 'ORD')
        : (inv.orderID || 'N/A'),
      ...customer,
      orderStatus: getStatusLabelVN(inv.status),
      date: inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('vi-VN') : 'N/A',
      items: finalItems,
      paidAt: paidAt
    };
  });
};

const mockPayments = () => {
  const allPayments = getAllCurrentPayments();
  const currentInvoices = mockInvoices();

  return allPayments.map(pay => {
    const invoice = currentInvoices.find(i => i.invoiceID === pay.invoiceID);
    const customerName = invoice ? invoice.customerName : 'Không xác định';
    return {
      ...pay,
      displayID: pay.voucherCode || formatDisplayCode(pay.paymentID, 'PAY'),
      displayInvoiceID: formatDisplayCode(pay.invoiceID, 'INV'),
      customerName,
      paymentMethodLabel: pay.paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : pay.paymentMethod === 'CASH' ? 'Tiền mặt' : pay.paymentMethod === 'CARD' ? 'Thẻ / POS' : (pay.paymentMethod || 'Khác'),
      date: pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString('vi-VN') : 'N/A',
    };
  });
};

const mockDebtReport = () => {
  const allInvoices = getAllCurrentInvoices();
  const today = new Date();

  const allOrders = dbData.orders || [];
  // Chỉ lấy hóa đơn chưa thanh toán xong (pending, partial, overdue)
  const debtItems = allInvoices
    .filter(inv => normalizeInvoiceStatus(inv.status) !== 'paid')
    .map(inv => {
      const order = allOrders.find(o => o.orderID === inv.orderID);
      const customer = getCustomerDetails(inv.customerID || order?.customerID);
      const total = Number(inv.totalAmount) || 0;
      const paid = Number(inv.paidAmount) || 0;
      const remaining = total - paid;
      
      const due = new Date(inv.dueDate);
      const diffTime = today - due;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const overdueDays = diffTime > 0 ? diffDays : 0;

      // Logic xác định mức độ rủi ro (Risk Level)
      let risk = 'medium';
      if (overdueDays > 30 || remaining > 100000000) risk = 'critical';
      else if (overdueDays > 15 || remaining > 50000000) risk = 'high';

      return {
        invoiceID: inv.invoiceID,
        displayID: formatDisplayCode(inv.invoiceID, 'INV'),
        ...customer,
        totalAmount: total,
        remainingAmount: remaining,
        daysOverdue: overdueDays,
        riskLevel: risk,
        autoRemind: remaining > 10000000, // Tự động nếu nợ lớn
        lastReminderDate: overdueDays > 7 ? "20/04/2026" : null, // Mock dữ liệu lần nhắc cuối
      };
    });

  // Tính toán số liệu tổng hợp cho Summary Cards
  const totalDebtVal = debtItems.reduce((sum, d) => sum + d.remainingAmount, 0);
  const overdueDebtVal = debtItems
    .filter(d => d.daysOverdue > 0)
    .reduce((sum, d) => sum + d.remainingAmount, 0);
  const uniqueCustomers = new Set(debtItems.map(d => d.customerID)).size;

  return {
    data: debtItems,
    summary: {
      totalDebt: totalDebtVal.toLocaleString('vi-VN') + " VNĐ",
      overdueDebt: overdueDebtVal.toLocaleString('vi-VN') + " VNĐ",
      customerCount: uniqueCustomers.toString()
    }
  };
};

/**
 * Generate chart data dynamically using standard accounting logic.
 * @param {string} timeframe - 'daily', 'weekly', 'monthly', 'yearly'
 * @param {Array} invoices - All mapped invoices
 * @param {Array} payments - All mapped payments
 */
const computeChartData = (timeframe, invoices, payments, options = {}) => {
  const data = [];
  const now = new Date();
  
  const selectedYear = options.filterYear ? parseInt(options.filterYear, 10) : now.getFullYear();
  const selectedYearsCount = options.filterYearsCount ? parseInt(options.filterYearsCount, 10) : 5;
  const filterWeekStr = options.filterWeek || `${now.getFullYear()}-W01`;

  // Removed local parseDate definition to use hoisted version

  const toDate = (dStr) => {
    const pd = parseDate(dStr);
    if (!pd) return null;
    return new Date(pd.y, pd.m - 1, pd.d);
  };

  const getDebtAtSnapshot = (targetDate) => {
    const targetTime = targetDate.getTime();
    return invoices.reduce((sum, inv) => {
      const dStr = inv.invoiceDate || inv.createAt || inv.createdAt;
      const invDate = toDate(dStr);
      if (!invDate || invDate.getTime() > targetTime) return sum;

      const total = safeNumber(inv.totalAmount);
      if (total <= 0) return sum;

      const paidBySnapshot = payments
        .filter(p => {
          if (String(p.invoiceID) !== String(inv.invoiceID)) return false;
          const pd = toDate(p.paymentDate || p.createAt || p.createdAt);
          return pd && pd.getTime() <= targetTime;
        })
        .reduce((s, p) => s + safeNumber(p.amount), 0);

      return sum + Math.max(0, total - paidBySnapshot);
    }, 0);
  };

  if (timeframe === 'monthly') {
    for (let m = 1; m <= 12; m++) {
      if (selectedYear === now.getFullYear() && m > now.getMonth() + 1) continue;
      
      const matches = invoices.filter(i => {
        const pd = parseDate(i.invoiceDate || i.createAt || i.createdAt);
        return pd && pd.m === m && pd.y === selectedYear;
      });
      const revenue = matches.reduce((sum, i) => sum + safeNumber(i.totalAmount), 0);
      const invoiceCount = matches.length;
        
      const collected = payments
        .filter(p => {
          const pd = parseDate(p.paymentDate || p.createAt || p.createdAt);
          return pd && pd.m === m && pd.y === selectedYear;
        })
        .reduce((sum, p) => sum + safeNumber(p.amount), 0);
        
      let endOfMonth = new Date(selectedYear, m, 0, 23, 59, 59);
      if (selectedYear === now.getFullYear() && m === now.getMonth() + 1) endOfMonth = now;
      const debt = getDebtAtSnapshot(endOfMonth);
      
      data.push({ 
        label: `T${m}`, 
        revenue, 
        collected, 
        expense: debt,
        invoiceCount,
        prevRevenue: data.length > 0 ? data[data.length - 1].revenue : null,
        prevExpense: data.length > 0 ? data[data.length - 1].expense : null
      });
    }
  } else if (timeframe === 'yearly' || timeframe === 'all') {
    const endYear = options.filterYear ? parseInt(options.filterYear, 10) : now.getFullYear();
    const startYear = endYear - selectedYearsCount + 1;
    
    for (let y = startYear; y <= endYear; y++) {
      const matches = invoices.filter(i => {
        const pd = parseDate(i.invoiceDate || i.createAt || i.createdAt);
        return pd && pd.y === y;
      });
      const revenue = matches.reduce((sum, i) => sum + safeNumber(i.totalAmount), 0);
      const invoiceCount = matches.length;
        
      const collected = payments
        .filter(p => {
          const pd = parseDate(p.paymentDate || p.createAt || p.createdAt);
          return pd && pd.y === y;
        })
        .reduce((sum, p) => sum + safeNumber(p.amount), 0);
        
      const endOfYear = new Date(y, 11, 31, 23, 59, 59);
      const snapshotDate = (y === now.getFullYear()) ? now : endOfYear;
      const debt = getDebtAtSnapshot(snapshotDate);
      
      data.push({ 
        label: `${y}`, 
        revenue, 
        collected, 
        expense: debt,
        invoiceCount,
        prevRevenue: data.length > 0 ? data[data.length - 1].revenue : null,
        prevExpense: data.length > 0 ? data[data.length - 1].expense : null
      });
    }
  } else if (timeframe === 'weekly') {
    const [yStr, wStr] = filterWeekStr.split('-W');
    const y = parseInt(yStr, 10);
    const w = parseInt(wStr, 10);
    
    const simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
    const dow = simple.getUTCDay();
    let mondayUTC = new Date(simple);
    if (dow <= 4) mondayUTC.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
    else mondayUTC.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
    
    const monday = new Date(mondayUTC.getUTCFullYear(), mondayUTC.getUTCMonth(), mondayUTC.getUTCDate());
    monday.setHours(0, 0, 0, 0);

    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const matchesDate = (dateStr) => {
        const pd = parseDate(dateStr);
        return pd && pd.d === d.getDate() && pd.m === d.getMonth() + 1 && pd.y === d.getFullYear();
      };

      const matches = invoices.filter(inv => matchesDate(inv.invoiceDate || inv.createAt || inv.createdAt));
      const revenue = matches.reduce((sum, inv) => sum + safeNumber(inv.totalAmount), 0);
      const collected = payments.filter(p => matchesDate(p.paymentDate || p.createAt || p.createdAt)).reduce((sum, p) => sum + safeNumber(p.amount), 0);
      
      let endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) endOfDay = now;
      
      const debt = getDebtAtSnapshot(endOfDay);
      data.push({ 
        label: dayNames[i], 
        revenue, 
        collected, 
        expense: debt,
        invoiceCount: matches.length,
        prevRevenue: data.length > 0 ? data[data.length - 1].revenue : null,
        prevExpense: data.length > 0 ? data[data.length - 1].expense : null
      });
    }
  } else if (timeframe === 'daily') {
    // Legacy support for DailyActivityGrid if needed via index.jsx options
    const [fy, fm] = (options.filterDate || "").split('-').map(Number);
    const y = fy || now.getFullYear();
    const m = fm || (now.getMonth() + 1);
    const daysInMonth = new Date(y, m, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const matchesDate = (dateStr) => {
        const pd = parseDate(dateStr);
        return pd && pd.d === day && pd.m === m && pd.y === y;
      };

      const matches = invoices.filter(inv => matchesDate(inv.invoiceDate || inv.createAt || inv.createdAt));
      const revenue = matches.reduce((sum, inv) => sum + safeNumber(inv.totalAmount), 0);
      
      const dayPayments = payments.filter(p => matchesDate(p.paymentDate || p.createAt || p.createdAt));
      const collected = dayPayments.reduce((sum, p) => sum + safeNumber(p.amount), 0);
      
      const dayReports = (dbData.quarterly_reports || []).filter(r => matchesDate(r.createdAt));
      
      let endOfDay = new Date(y, m - 1, day, 23, 59, 59);
      if (day === now.getDate() && m === (now.getMonth() + 1) && y === now.getFullYear()) endOfDay = now;
      
      const debt = getDebtAtSnapshot(endOfDay);
      const actual = revenue - debt;
      
      const rawIntensity = revenue / 50000000;
      const intensity = revenue > 0 ? Math.min(1, Math.pow(rawIntensity, 0.5) * 0.8 + 0.2) : 0; 
      
      data.push({ 
        day, 
        label: `${day}/${m}`, 
        revenue, 
        collected, 
        expense: debt, 
        debt,          
        actual,
        intensity,
        invoiceCount: matches.length,
        paymentCount: dayPayments.length,
        reportCount: dayReports.length
      });
    }
  }
  return data;
};

// ─── EXPORTED SERVICE ────────────────────────────────────────────────────────

const accountingService = {

  getDashboardStats: async (timeframe, options = {}) => {
    if (USE_MOCK) return mockDashboardStats(timeframe, options);
    const response = await apiClient.get('/api/reports/revenue/stats', { params: { timeframe, ...options } });
    return response.data;
  },

  getRevenueData: async (timeframe, options = {}) => {
    if (USE_MOCK) {
      const allInvoices = getAllCurrentInvoices();
      const allPayments = getAllCurrentPayments();
      // Chuyển đổi timeframe sang startDate/endDate chuẩn để giả lập API thật
      // Nếu có startDate/endDate từ options thì dùng luôn
      const data = computeChartData(timeframe, allInvoices, allPayments, options);
      return data;
    }
    // Chuẩn hóa params theo b.md: ?startDate=...&endDate=...&groupBy=...
    const params = {
      startDate: options.startDate || '2026-01-01',
      endDate: options.endDate || '2026-12-31',
      groupBy: timeframe === 'monthly' ? 'month' : timeframe === 'daily' ? 'day' : timeframe === 'weekly' ? 'week' : 'year'
    };
    const response = await apiClient.get('/api/reports/revenue', { params });
    return response.data;
  },

  getInvoices: async () => {
    if (USE_MOCK) return mockInvoices();
    const response = await apiClient.get('/api/invoices');
    return response.data;
  },

  getCategoryRevenueReport: async (timeframe = 'monthly', options = {}) => {
    if (USE_MOCK) {
      const allInvoices = getAllCurrentInvoices();
      const categories = dbData.categories || [];
      const products = dbData.products || [];

      const filteredInvoices = allInvoices.filter(inv => {
        const pd = parseDate(inv.invoiceDate || inv.createAt);
        if (!pd) return false;
        const now = new Date();
        const selectedYear = options.filterYear || now.getFullYear();
        if (timeframe === 'monthly') return pd.y === selectedYear;
        if (timeframe === 'yearly') {
          const count = options.filterYearsCount || 5;
          return pd.y >= (selectedYear - count + 1) && pd.y <= selectedYear;
        }
        if (timeframe === 'weekly') {
          const [y, w] = (options.filterWeek || "").split('-W').map(Number);
          if (!y || !w) return pd.y === now.getFullYear();
          const d = new Date(pd.y, pd.m - 1, pd.d);
          const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
          const dayNum = target.getUTCDay() || 7;
          target.setUTCDate(target.getUTCDate() + 4 - dayNum);
          const yearStart = new Date(Date.UTC(target.getUTCFullYear(),0,1));
          const weekNo = Math.ceil((((target - yearStart) / 86400000) + 1)/7);
          return target.getUTCFullYear() === y && weekNo === w;
        }
        if (timeframe === 'daily') {
          const [y, m] = (options.filterDate || "").split('-').map(Number);
          return pd.y === y && pd.m === m;
        }
        return true;
      });

      const results = {};
      categories.forEach(cat => {
        results[cat.categoryName] = 0;
      });

      const allOrderItems = dbData.orderItems || [];

      filteredInvoices.forEach(inv => {
        // Lấy items từ orderItems thay vì inv.items
        const items = allOrderItems.filter(oi => oi.orderID === inv.orderID);
        items.forEach(item => {
          const product = products.find(p => p.productID === item.productID);
          if (product) {
            const category = categories.find(c => c.categoryID === product.categoryID);
            if (category) {
              results[category.categoryName] += safeNumber(item.unitPrice) * (item.quantity || 1);
            }
          }
        });
      });

      return Object.entries(results).map(([name, value]) => ({ name, value }));
    }
    const response = await apiClient.get('/api/reports/categories', { params: { timeframe, ...options } });
    return response.data;
  },

  getSalesPerformanceReport: async (timeframe = 'monthly', options = {}) => {
    if (USE_MOCK) {
      const allInvoices = getAllCurrentInvoices();
      const orders = dbData.orders || [];
      const salesUsers = (dbData.users || []).filter(u => u.roleID === 2);

      const filteredInvoices = allInvoices.filter(inv => {
        const pd = parseDate(inv.invoiceDate || inv.createAt);
        if (!pd) return false;

        const now = new Date();
        const selectedYear = options.filterYear || now.getFullYear();

        if (timeframe === 'monthly') {
          return pd.y === selectedYear;
        } else if (timeframe === 'yearly') {
          const count = options.filterYearsCount || 5;
          return pd.y >= (selectedYear - count + 1) && pd.y <= selectedYear;
        } else if (timeframe === 'weekly') {
          const [y, w] = (options.filterWeek || "").split('-W').map(Number);
          if (!y || !w) return pd.y === now.getFullYear();
          
          const d = new Date(pd.y, pd.m - 1, pd.d);
          const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
          const dayNum = target.getUTCDay() || 7;
          target.setUTCDate(target.getUTCDate() + 4 - dayNum);
          const yearStart = new Date(Date.UTC(target.getUTCFullYear(),0,1));
          const weekNo = Math.ceil((((target - yearStart) / 86400000) + 1)/7);
          return target.getUTCFullYear() === y && weekNo === w;
        } else if (timeframe === 'daily') {
          const [y, m] = (options.filterDate || "").split('-').map(Number);
          return pd.y === y && pd.m === m;
        }
        return true;
      });

      return salesUsers.map(user => {
        // Sử dụng cấu trúc SQL-aligned: firstName, lastName
        const fullName = `${user.lastName} ${user.firstName}`;
        const userOrders = orders.filter(o => o.userID === user.userID);
        const userOrderIds = new Set(userOrders.map(o => o.orderID));
        
        // Cải tiến: Kiểm tra cả ID đơn hàng lẫn ID nhân viên trực tiếp trên hóa đơn
        const userInvoices = filteredInvoices.filter(inv => 
          userOrderIds.has(inv.orderID) || Number(inv.userID) === user.userID
        );
        
        const revenue = userInvoices.reduce((sum, inv) => sum + safeNumber(inv.totalAmount), 0);
        const orderCount = userInvoices.length;
        
        let target = 500000000;
        if (timeframe === 'yearly') target = 5000000000;
        if (timeframe === 'weekly') target = 120000000;
        if (timeframe === 'daily') target = 250000000;

        const achievement = (revenue / target) * 100;
        const commissionRate = achievement > 100 ? 0.05 : 0.03;

        return {
          id: user.userID,
          name: fullName,
          revenue,
          orderCount,
          target,
          achievement,
          commission: revenue * commissionRate
        };
      });
    }
    const response = await apiClient.get('/api/reports/sales-performance', { params: { timeframe, ...options } });
    return response.data;
  },

  createInvoice: async (data) => {
    if (USE_MOCK) {
      const local = getLocalInvoices();
      const all = [...local, ...dbData.invoices];
      const maxId = all.reduce((max, inv) => Math.max(max, Number(inv.invoiceID) || 0), 0);
      
      const orderID = data.orderID || (200 + maxId); // Mock orderID
      
      const newInvoice = {
        ...data,
        invoiceID: maxId + 1,
        orderID: orderID,
        paidAmount: data.paidAmount || 0,
        status: data.status || 'pending',
        createAt: new Date().toISOString().split('T')[0]
      };
      
      // Store items in localOrderItems if present
      if (data.items && data.items.length > 0) {
        const localItems = getLocalOrderItems();
        const itemsToStore = data.items.map(it => ({
          orderID: orderID,
          productID: it.productID,
          quantity: it.quantity,
          unitPrice: it.unitPrice || it.price,
          discount: it.discount || 0
        }));
        localStorage.setItem('added_order_items', JSON.stringify([...itemsToStore, ...localItems]));
      }

      localStorage.setItem('added_invoices', JSON.stringify([newInvoice, ...local]));

      const customer = getCustomerDetails(newInvoice.customerID);
      return {
        ...newInvoice,
        displayID: formatDisplayCode(newInvoice.invoiceID, 'INV'),
        displayOrderID: formatDisplayCode(orderID, 'ORD'),
        ...customer,
        orderStatus: getStatusLabelVN(newInvoice.status),
        date: newInvoice.invoiceDate ? new Date(newInvoice.invoiceDate).toLocaleDateString('vi-VN') : 'N/A',
      };
    }
    const response = await apiClient.post('/api/invoices', data);
    return response.data;
  },

  updateInvoiceStatus: async (id, status) => {
    if (USE_MOCK) {
      const local = getLocalInvoices();
      const updated = local.map(inv =>
        inv.invoiceID === id ? { ...inv, status: normalizeInvoiceStatus(status) } : inv
      );
      localStorage.setItem('added_invoices', JSON.stringify(updated));
      return true;
    }
    const response = await apiClient.put(`/api/invoices/${id}/status`, { status });
    return response.data;
  },

  updateInvoiceCosts: async (id, totalAmount) => {
    if (USE_MOCK) {
      const local = getLocalInvoices();
      const updated = local.map(inv =>
        inv.invoiceID === id ? { ...inv, totalAmount } : inv
      );
      localStorage.setItem('added_invoices', JSON.stringify(updated));
      return true;
    }
    const response = await apiClient.put(`/api/invoices/${id}/costs`, { totalAmount });
    return response.data;
  },

  getPayments: async () => {
    if (USE_MOCK) return mockPayments();
    const response = await apiClient.get('/api/payments');
    return response.data;
  },

  recordPayment: async (invoiceID, paymentDetails) => {
    if (USE_MOCK) {
      // 1. Cập nhật trạng thái hóa đơn
      const localInvoices = getLocalInvoices();
      const apiInvoices = dbData.invoices || [];
      const allInvoices = [...localInvoices, ...apiInvoices];

      const inv = allInvoices.find(i => i.invoiceID === Number(invoiceID));
      if (inv) {
        inv.paidAmount = (Number(inv.paidAmount) || 0) + (Number(paymentDetails.amount) || 0);
        inv.status = inv.paidAmount >= inv.totalAmount ? 'paid' : 'partial';

        const isLocal = localInvoices.some(i => i.invoiceID === inv.invoiceID);
        if (isLocal) {
          const updatedLocal = localInvoices.map(i => i.invoiceID === inv.invoiceID ? inv : i);
          localStorage.setItem('added_invoices', JSON.stringify(updatedLocal));
        } else {
          const overrides = JSON.parse(localStorage.getItem('invoice_overrides') || '[]');
          const updatedOverrides = [...overrides.filter(i => i.invoiceID !== inv.invoiceID), inv];
          localStorage.setItem('invoice_overrides', JSON.stringify(updatedOverrides));
        }
      }

      // 2. Tạo phiếu thu mới với mã VCHR
      const localPayments = getLocalPayments();
      const allPaymentsForId = [...localPayments, ...(dbData.payments || [])];
      const maxId = allPaymentsForId.reduce((max, p) => Math.max(max, Number(p.paymentID) || 0), 0);
      const newPaymentID = maxId + 1;
      const newPayment = {
        paymentID: newPaymentID,
        invoiceID: Number(invoiceID),
        amount: Number(paymentDetails.amount),
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentDetails.method === 'Cash' ? 'Tiền mặt' : 'Chuyển khoản',
        voucherCode: formatDisplayCode(newPaymentID, 'VCHR'),
        recordedBy: 'Kế toán trưởng',
        status: 'completed',
        note: paymentDetails.note || `Thanh toán cho hóa đơn ${formatDisplayCode(Number(invoiceID), 'INV')}`,
      };

      localStorage.setItem('added_payments', JSON.stringify([newPayment, ...localPayments]));
      return true;
    }
    const response = await apiClient.post('/api/payments', { invoiceID, ...paymentDetails });
    return response.data;
  },

  // ── NOTIFICATION DETAIL (dùng ID dạng string như "notif-pay-1") ────────────
  getNotificationDetail: async (id) => {
    if (USE_MOCK) {
      const allNotifs = buildNotifications();
      return allNotifs.find(n => n.id === id) || null;
    }
    const response = await apiClient.get(`/api/notifications/${id}`);
    return response.data;
  },

  getExtendedNotificationDetail: async (id) => {
    if (USE_MOCK) {
      return buildExtendedDetail(id);
    }
    const response = await apiClient.get(`/api/notifications/${id}/extended`);
    return response.data;
  },

  getDebtReport: async () => {
    if (USE_MOCK) return mockDebtReport();
    const response = await apiClient.get('/api/reports/debt');
    return response.data;
  },

  // ── REMINDERS (Email triggers) ──────────────────────────────────────────
  sendDebtReminder: async (invoiceID) => {
    if (USE_MOCK) {
      // Giả lập độ trễ mạng để UI có cảm giác thực tế
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, message: "Mock: Gửi mail thành công" };
    }
    const response = await apiClient.post('/api/reminders/send', { invoiceID });
    return response.data;
  },

  sendBatchReminders: async (invoiceIDs) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, count: invoiceIDs.length };
    }
    const response = await apiClient.post('/api/reminders/batch-send', { invoiceIDs });
    return response.data;
  },

  getProducts: async () => {
    if (USE_MOCK) return dbData.products || [];
    const response = await apiClient.get('/api/products');
    return response.data;
  },

  getCategories: async () => {
    if (USE_MOCK) return dbData.categories || [];
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  getRelativeTime,
};

export default accountingService;
export { normalizeInvoiceStatus, formatDisplayCode };
