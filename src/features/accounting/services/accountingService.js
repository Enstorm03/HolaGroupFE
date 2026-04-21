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
 * Chuẩn hóa trạng thái hóa đơn (VN <-> EN)
 */
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
  if (s === 'partial') return 'Thanh toán một phần';
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
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffDays > 30) return date.toLocaleDateString('vi-VN');
  if (diffDays > 0) return diffDays === 1 ? 'Hôm qua' : `${diffDays} ngày trước`;
  if (diffHours > 0) return `${diffHours} giờ trước`;
  if (diffMins > 0) return `${diffMins} phút trước`;
  return 'Vừa xong';
};

/**
 * Tìm thông tin khách hàng từ ID
 */
const getCustomerDetails = (customerID) => {
  const customer = dbData.customers?.find(c => c.customerID === Number(customerID));
  return customer || {
    customerName: isNaN(customerID) ? customerID : 'Khách hàng lẻ',
    email: null, phoneNumber: null, address: null
  };
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
const buildNotifications = () => {
  const now = new Date();
  
  // Lưu mốc thời gian "khởi tạo" vào localStorage để giữ tính ổn định khi F5
  let sessionStart = localStorage.getItem('accounting_session_start');
  if (!sessionStart) {
    sessionStart = new Date().toISOString();
    localStorage.setItem('accounting_session_start', sessionStart);
  }
  const sessionStartDate = new Date(sessionStart);

  const allInvoices = getAllCurrentInvoices();
  const allPayments = getAllCurrentPayments();
  const notifications = [];

  // ── 1. LIST: Khách hàng quá hạn ──────────────────────────────────────────
  const overdueInvoices = allInvoices.filter(inv => {
    const s = normalizeInvoiceStatus(inv.status);
    return s === 'overdue' || (s !== 'paid' && inv.dueDate && new Date(inv.dueDate) < new Date());
  });
  if (overdueInvoices.length > 0) {
    notifications.push({
      id: 'notif-overdue',
      transactionType: 'List',
      uiType: 'warning',
      message: `Có ${overdueInvoices.length} khách hàng quá hạn thanh toán trên 30 ngày.`,
      timestamp: new Date(sessionStartDate.getTime() - 10 * 60000).toISOString(),
      count: overdueInvoices.length,
    });
  }

  // ── 2. LIST: Hóa đơn chưa thanh toán (partial) ───────────────────────────
  const partialInvoices = allInvoices.filter(inv => normalizeInvoiceStatus(inv.status) === 'partial');
  if (partialInvoices.length > 0) {
    notifications.push({
      id: 'notif-partial',
      transactionType: 'List',
      uiType: 'warning',
      message: `${partialInvoices.length} hóa đơn thanh toán chưa đủ, cần theo dõi.`,
      timestamp: new Date(sessionStartDate.getTime() - 30 * 60000).toISOString(),
      count: partialInvoices.length,
    });
  }

  // ── 3. VOUCHER: Mỗi lần thanh toán thành công → 1 card Voucher ───────────
  allPayments.forEach(pay => {
    const voucherCode = pay.voucherCode || formatDisplayCode(pay.paymentID, 'VCHR');
    const invoiceCode = formatDisplayCode(pay.invoiceID, 'INV');
    const customer = getCustomerDetails(
      allInvoices.find(i => i.invoiceID === pay.invoiceID)?.customerID
    );
    notifications.push({
      id: `notif-pay-${pay.paymentID}`,
      transactionType: 'Voucher',
      uiType: 'info',
      message: `Phiếu thu ${voucherCode} — ${invoiceCode} — ${customer.customerName} đã được ký duyệt.`,
      timestamp: pay.paymentDate,
      paymentID: pay.paymentID,
      invoiceID: pay.invoiceID,
      voucherCode,
    });
  });

  // ── 4. REPORT: Mỗi báo cáo quý → 1 card Report ──────────────────────────
  const reports = dbData.quarterly_reports || [];
  reports.forEach(rpt => {
    const statusLabel = rpt.status === 'pending_approval'
      ? 'đã sẵn sàng phê duyệt'
      : rpt.status === 'approved'
      ? 'đã được phê duyệt'
      : 'đang xử lý';
    notifications.push({
      id: `notif-rpt-${rpt.reportID}`,
      transactionType: 'Report',
      uiType: 'report',
      message: `${rpt.title} ${statusLabel}.`,
      timestamp: rpt.createdAt,
      reportID: rpt.reportID,
    });
  });

  return notifications;
};

/**
 * Trả về extended detail cho từng notification ID.
 * ID có dạng:  notif-overdue | notif-partial | notif-pay-{paymentID} | notif-rpt-{reportID}
 */
const buildExtendedDetail = (notifId) => {
  const allInvoices = getAllCurrentInvoices();
  const allPayments = getAllCurrentPayments();

  // ── LIST: Khách hàng quá hạn ─────────────────────────────────────────────
  if (notifId === 'notif-overdue') {
    const overdueInvoices = allInvoices.filter(inv => {
      const s = normalizeInvoiceStatus(inv.status);
      return s === 'overdue' || (s !== 'paid' && inv.dueDate && new Date(inv.dueDate) < new Date());
    });
    const rows = overdueInvoices.map(inv => {
      const customer = getCustomerDetails(inv.customerID);
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
      const customer = getCustomerDetails(inv.customerID);
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
    const customer = getCustomerDetails(inv?.customerID);
    const invoiceCode = formatDisplayCode(pay.invoiceID, 'INV');
    const orderCode = inv?.orderID ? formatDisplayCode(inv.orderID, 'ORD') : 'N/A';
    const voucherCode = pay.voucherCode || formatDisplayCode(pay.paymentID, 'VCHR');

    return {
      type: 'voucher',
      data: {
        customer: customer.customerName,
        order_ref: orderCode,
        amount: Number(pay.amount).toLocaleString('vi-VN'),
        method: pay.paymentMethod || 'Chuyển khoản',
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
          { label: 'Thuế được khấu trừ', value: rpt.vatDeductible.toLocaleString('vi-VN'), status: rpt.status === 'approved' ? 'approved' : 'pending' },
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
    const targetDate = new Date(targetY, targetM - 1, targetD);

    filteredInvoices = allInvoices.filter(inv => {
      const d = pDate(inv.invoiceDate);
      return d && isSameDay(d, targetDate);
    });
    filteredPayments = allPayments.filter(p => {
      const d = pDate(p.paymentDate);
      return d && isSameDay(d, targetDate);
    });
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

  const totalRev = filteredInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const totalDebt = filteredInvoices.reduce((sum, inv) => {
    const s = normalizeInvoiceStatus(inv.status);
    return s !== 'paid' ? sum + ((Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0)) : sum;
  }, 0);
  const totalCollected = filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return {
    totalRevenue: totalRev,
    totalDebt: totalDebt,
    totalCollected: totalCollected,
    pendingInvoices: filteredInvoices.length.toString(),
    cashBalance: dbData.stats.totalBalance || '1.250.000.000',
    notifications: buildNotifications(), // Keep whole set for feed unless filtered feed requested
  };
};

const mockInvoices = () => {
  return getAllCurrentInvoices().map(inv => {
    const customer = getCustomerDetails(inv.customerID);
    return {
      ...inv,
      displayID: formatDisplayCode(inv.invoiceID, 'INV'),
      displayOrderID: (inv.orderID && !isNaN(inv.orderID))
        ? formatDisplayCode(inv.orderID, 'ORD')
        : (inv.orderID || 'N/A'),
      ...customer,
      orderStatus: getStatusLabelVN(inv.status),
      date: inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('vi-VN') : 'N/A',
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
      date: pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString('vi-VN') : 'N/A',
    };
  });
};

const mockDebtReport = () => {
  return getAllCurrentInvoices()
    .filter(inv => normalizeInvoiceStatus(inv.status) !== 'paid')
    .map(inv => {
      const customer = getCustomerDetails(inv.customerID);
      const remaining = (Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0);
      const due = new Date(inv.dueDate);
      const today = new Date();
      const diffDays = Math.ceil(Math.abs(today - due) / (1000 * 60 * 60 * 24));
      return {
        invoiceID: inv.invoiceID,
        displayID: formatDisplayCode(inv.invoiceID, 'INV'),
        ...customer,
        totalAmount: inv.totalAmount,
        remainingAmount: remaining,
        daysOverdue: today > due ? diffDays : 0,
        status: remaining > 100000000 ? 'critical' : remaining > 50000000 ? 'high' : 'medium',
      };
    });
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

  // Parse YYYY-MM-DD reliably
  const parseDate = (dStr) => {
    if (!dStr) return null;
    const [y, m, d] = dStr.split('-').map(Number);
    return { y, m, d };
  };

  const getDebtAtDate = (targetDate) => {
    return invoices.reduce((sum, inv) => {
      const invDate = parseDate(inv.invoiceDate);
      if (!invDate) return sum;
      const target = new Date(targetDate);
      const invoiceJSDate = new Date(invDate.y, invDate.m - 1, invDate.d);
      
      if (invoiceJSDate > target) return sum;
      
      const s = normalizeInvoiceStatus(inv.status);
      if (s !== 'paid') {
        const remaining = (Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0);
        return sum + remaining;
      }
      return sum;
    }, 0);
  };

  if (timeframe === 'monthly') {
    for (let m = 1; m <= 12; m++) {
      if (selectedYear === now.getFullYear() && m > now.getMonth() + 1) continue;
      
      const revenue = invoices
        .filter(i => {
          const pd = parseDate(i.invoiceDate);
          return pd && pd.m === m && pd.y === selectedYear;
        })
        .reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
        
      const collected = payments
        .filter(p => {
          const pd = parseDate(p.paymentDate);
          return pd && pd.m === m && pd.y === selectedYear;
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        
      let endOfMonth = new Date(selectedYear, m, 0, 23, 59, 59);
      if (selectedYear === now.getFullYear() && m === now.getMonth() + 1) endOfMonth = now;
      const debt = getDebtAtDate(endOfMonth);
      
      data.push({ label: `T${m}`, revenue, collected, expense: debt });
    }
  } else if (timeframe === 'yearly' || timeframe === 'all') {
    const currentYear = now.getFullYear();
    const startYear = currentYear - selectedYearsCount + 1;
    for (let y = startYear; y <= currentYear; y++) {
      const revenue = invoices
        .filter(i => {
          const pd = parseDate(i.invoiceDate);
          return pd && pd.y === y;
        })
        .reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
        
      const collected = payments
        .filter(p => {
          const pd = parseDate(p.paymentDate);
          return pd && pd.y === y;
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        
      let endOfYear = new Date(y, 11, 31, 23, 59, 59);
      if (y === currentYear) endOfYear = now;
      const debt = getDebtAtDate(endOfYear);
      
      data.push({ label: `${y}`, revenue, collected, expense: debt });
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

      const revenue = invoices.filter(inv => matchesDate(inv.invoiceDate)).reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
      const collected = payments.filter(p => matchesDate(p.paymentDate)).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      let endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) endOfDay = now;
      
      const debt = getDebtAtDate(endOfDay);
      data.push({ label: dayNames[i], revenue, collected, expense: debt });
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

      const revenue = invoices.filter(inv => matchesDate(inv.invoiceDate)).reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
      const collected = payments.filter(p => matchesDate(p.paymentDate)).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      let endOfDay = new Date(y, m - 1, day, 23, 59, 59);
      if (day === now.getDate() && m === (now.getMonth() + 1) && y === now.getFullYear()) endOfDay = now;
      
      const debt = getDebtAtDate(endOfDay);
      const actual = revenue - debt;
      
      // Make heat intensity more sensitive so small amounts still pop (using square root scaling)
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
        intensity
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
      // Ensure we pass the options (filterYear, filterWeek, etc.)
      const data = computeChartData(timeframe, allInvoices, allPayments, options);
      return data;
    }
    const response = await apiClient.get(`/api/reports/revenue?timeframe=${timeframe}`);
    return response.data;
  },

  getInvoices: async () => {
    if (USE_MOCK) return mockInvoices();
    const response = await apiClient.get('/api/invoices');
    return response.data;
  },

  createInvoice: async (data) => {
    if (USE_MOCK) {
      const local = getLocalInvoices();
      const all = [...local, ...dbData.invoices];
      const maxId = all.reduce((max, inv) => Math.max(max, Number(inv.invoiceID) || 0), 0);
      const newInvoice = {
        ...data,
        invoiceID: maxId + 1,
        paidAmount: data.paidAmount || 0,
        status: data.status || 'pending',
      };
      localStorage.setItem('added_invoices', JSON.stringify([newInvoice, ...local]));

      const customer = getCustomerDetails(newInvoice.customerID);
      return {
        ...newInvoice,
        displayID: formatDisplayCode(newInvoice.invoiceID, 'INV'),
        displayOrderID: isNaN(newInvoice.orderID) ? newInvoice.orderID : formatDisplayCode(newInvoice.orderID, 'ORD'),
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

  getRelativeTime,
};

export default accountingService;
export { normalizeInvoiceStatus, formatDisplayCode };
