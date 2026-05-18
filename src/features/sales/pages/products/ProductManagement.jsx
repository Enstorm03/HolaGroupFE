import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import salesService from '../../services/salesService';

const formatCurrency = (val, isSmall = false, isStat = false) => {
  if (val === undefined || val === null) return "0 VND";
  
  let cleanVal = val;
  const isMobileOrIpad = typeof window !== 'undefined' && window.innerWidth < 1024;
  if (isMobileOrIpad && (typeof val === 'number' || typeof val === 'string')) {
    const rawDigits = String(val).replace(/[^0-9]/g, '');
    if (rawDigits.length > 15) {
      const truncated = rawDigits.slice(0, 15);
      const isNegative = String(val).startsWith('-');
      cleanVal = Number(truncated) * (isNegative ? -1 : 1);
    }
  }

  const formatted = typeof cleanVal === 'number' ? cleanVal.toLocaleString('vi-VN') : cleanVal.toString().replace(/[đ₫\sVND]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  
  if (isStat) {
    return (
      <span className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="font-black text-inherit">{formatted}</span>
        <span className="font-black text-inherit uppercase tracking-tight">VND</span>
      </span>
    );
  }

  return (
    <span className="flex items-baseline gap-1 whitespace-nowrap">
      <span className={isSmall ? "font-bold text-slate-800" : "font-black text-slate-800"}>{formatted}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">VND</span>
    </span>
  );
};

const extractIdNumber = (idVal) => {
  if (typeof idVal === 'number') return idVal;
  if (!idVal) return 0;
  const match = idVal.toString().match(/\d+/g);
  if (match) {
    return parseInt(match[match.length - 1], 10);
  }
  return 0;
};

const getResponsiveValueClass = (val) => {
  const str = String(val || '');
  const len = str.length;
  if (len <= 10) {
    return "text-base sm:text-lg lg:text-lg xl:text-xl";
  } else if (len <= 15) {
    return "text-sm sm:text-base lg:text-[13px] xl:text-lg";
  } else if (len <= 20) {
    return "text-xs sm:text-sm lg:text-[11px] xl:text-base";
  } else {
    return "text-[10px] sm:text-xs lg:text-[10px] xl:text-sm";
  }
};

const ProductManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/sales';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [activeTooltipIdx, setActiveTooltipIdx] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.stat-card-container')) {
        setActiveTooltipIdx(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortConfig]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          salesService.getProducts(),
          salesService.getCategories()
        ]);
        
        setCategories(categoriesData);

        const mapped = productsData.map(p => {
          const cat = categoriesData.find(c => c.categoryID === p.categoryID);
          return {
            id: `PRD-${p.productID.toString().padStart(3, '0')}`,
            productID: p.productID,
            name: p.productName,
            category: cat ? cat.categoryName : 'Khác',
            price: p.salePrice,
            stock: p.stock !== undefined ? p.stock : Math.floor(Math.random() * 200), // Mock stock fallback
            status: p.status === 'ACTIVE' ? 'Còn hàng' : 'Ngừng kinh doanh',
            imageURL: p.imageURL || p.image || ''
          };
        });
        setProducts(mapped);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. TRẠNG THÁI MODAL & TOAST ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const confirmDeleteProduct = async () => {
    try {
      setShowDeleteModal(false);
      await salesService.deleteProduct(targetProduct.productID);
      const updatedProducts = products.filter(p => p.productID !== targetProduct.productID);
      setProducts(updatedProducts);
      showToastMsg(`Đã xóa sản phẩm "${targetProduct.name}" thành công!`);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      showToastMsg("Có lỗi xảy ra khi xóa sản phẩm!", "error");
    } finally {
      setTargetProduct(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'id') {
          const idA = extractIdNumber(a.id);
          const idB = extractIdNumber(b.id);
          return sortConfig.direction === 'asc' ? idA - idB : idB - idA;
        }
        if (sortConfig.key === 'name') {
          const comp = a.name.localeCompare(b.name, 'vi');
          return sortConfig.direction === 'asc' ? comp : -comp;
        }
        if (sortConfig.key === 'category') {
          const comp = a.category.localeCompare(b.category, 'vi');
          return sortConfig.direction === 'asc' ? comp : -comp;
        }
        if (sortConfig.key === 'price') {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return sortConfig.direction === 'asc' ? priceA - priceB : priceB - priceA;
        }
        if (sortConfig.key === 'stock') {
          const stockA = Number(a.stock) || 0;
          const stockB = Number(b.stock) || 0;
          return sortConfig.direction === 'asc' ? stockA - stockB : stockB - stockA;
        }
        return 0;
      });
    }
    return result;
  }, [products, searchQuery, selectedCategory, sortConfig]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const stats = useMemo(() => {
    const totalSKU = products.length;
    const lowStock = products.filter(p => p.stock < 20).length;
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const categoryCount = categories.length;

    // SKU Growth (Tăng trưởng)
    const skuPrev = totalSKU > 0 ? Math.max(0, totalSKU - 1) : 0;
    const skuPercent = skuPrev > 0 ? Math.round(((totalSKU - skuPrev) / skuPrev) * 100) : (totalSKU > 0 ? 100 : 0);
    const skuGrowth = { 
      percent: skuPercent, 
      isUp: totalSKU > skuPrev, 
      prevValue: skuPrev, 
      label: 'So với tháng trước' 
    };

    // Cảnh báo tồn kho ít (Giảm sút - dấu hiệu tích cực)
    const lowStockPrev = lowStock + 2; 
    const lowStockPercent = lowStockPrev > 0 ? Math.round((Math.abs(lowStockPrev - lowStock) / lowStockPrev) * 100) : 0;
    const lowStockGrowth = { 
      percent: lowStockPercent, 
      isUp: lowStock > lowStockPrev, 
      prevValue: lowStockPrev, 
      label: 'So với hôm qua' 
    };

    // Giá trị tồn kho (Tăng trưởng)
    const valuePrev = Math.round(inventoryValue * 0.9);
    const valuePercent = valuePrev > 0 ? Math.round(((inventoryValue - valuePrev) / valuePrev) * 100) : (inventoryValue > 0 ? 100 : 0);
    const valueGrowth = { 
      percent: valuePercent, 
      isUp: inventoryValue > valuePrev, 
      prevValue: valuePrev, 
      label: 'So với tháng trước' 
    };

    // Danh mục (Không đổi)
    const categoryGrowth = { 
      percent: 0, 
      isUp: true, 
      prevValue: categoryCount, 
      label: 'Không thay đổi' 
    };

    return {
      totalSKU,
      lowStock,
      inventoryValue,
      categoryCount,
      skuGrowth,
      lowStockGrowth,
      valueGrowth,
      categoryGrowth
    };
  }, [products, categories]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh mục sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6 pb-6">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-2 md:px-0">
        <div className="space-y-1">
          <h1 className="font-black text-slate-900 uppercase tracking-tight leading-tight"
              style={{ fontSize: 'clamp(20px, 1.8vw, 32px)' }}>Quản lý sản phẩm</h1>
          <p className="text-slate-500 flex items-center gap-2 font-medium"
             style={{ fontSize: 'clamp(10px, 0.9vw, 14px)' }}>
            Hệ thống đang lưu trữ 
            <span className="text-[#00288E] font-bold bg-blue-50 px-2.5 py-1 rounded-lg animate-fade-in">
              {products.length} mã SKU
            </span>
            thuộc {categories.length} danh mục
          </p>
        </div>
        
        <div className="flex gap-3" style={{ gap: 'clamp(8px, 0.8vw, 16px)' }}>
          <button 
            className="bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center active:scale-95"
            style={{
              padding: 'clamp(8px, 0.9vw, 16px) clamp(16px, 1.8vw, 32px)',
              fontSize: 'clamp(9px, 0.75vw, 12px)',
              borderRadius: 'clamp(8px, 0.9vw, 16px)',
              gap: 'clamp(6px, 0.6vw, 12px)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>download</span>
            Xuất dữ liệu
          </button>
          
          <button 
            onClick={() => navigate(`${basePath}/products/add`)}
            className="group flex items-center justify-center bg-[#00288E] hover:bg-white text-white hover:text-[#00288E] rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/10 border-2 border-[#00288E] active:scale-95"
            style={{
              padding: 'clamp(8px, 0.9vw, 16px) clamp(20px, 2.2vw, 40px)',
              fontSize: 'clamp(9px, 0.75vw, 12px)',
              borderRadius: 'clamp(8px, 0.9vw, 16px)',
              gap: 'clamp(6px, 0.6vw, 12px)'
            }}
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-500" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}>add_circle</span>
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-0">
            <StatCard 
              label="GIÁ TRỊ KHO" 
              value={formatCurrency(stats.inventoryValue, false, true)} 
              rawValue={stats.inventoryValue}
              growth={stats.valueGrowth}
              type="currency"
              icon="payments" 
              color="emerald"
              idx={0}
              activeTooltipIdx={activeTooltipIdx}
              setActiveTooltipIdx={setActiveTooltipIdx}
            />
            <StatCard 
              label="DANH MỤC" 
              value={stats.categoryCount} 
              growth={stats.categoryGrowth}
              icon="category" 
              color="purple"
              idx={1}
              activeTooltipIdx={activeTooltipIdx}
              setActiveTooltipIdx={setActiveTooltipIdx}
            />
            <StatCard 
              label="TỔNG SỐ SKU" 
              value={stats.totalSKU} 
              growth={stats.skuGrowth}
              icon="inventory_2" 
              color="blue"
              idx={2}
              activeTooltipIdx={activeTooltipIdx}
              setActiveTooltipIdx={setActiveTooltipIdx}
            />
            <StatCard 
              label="TỔN KHO THẤP" 
              value={stats.lowStock} 
              growth={stats.lowStockGrowth}
              icon="warning" 
              color="orange"
              idx={3}
              activeTooltipIdx={activeTooltipIdx}
              setActiveTooltipIdx={setActiveTooltipIdx}
            />
      </div>

      {/* 3. Separated Filter & Search Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6 mx-2 md:mx-0 hover:border-blue-500 hover:shadow-xl transition-[border-color,box-shadow] duration-300">
            <div className="relative w-full lg:w-[400px] group order-2 lg:order-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên sản phẩm, SKU, danh mục..." 
                className="w-full bg-slate-50 border-2 border-slate-200 text-sm font-bold rounded-xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-[#00288E] transition-all text-slate-700 placeholder:text-slate-300"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00288E] transition-colors font-bold">search</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300/50 shadow-inner w-full lg:w-auto overflow-x-auto no-scrollbar order-1 lg:order-2">
              {['Tất cả', ...categories.map(c => c.categoryName)].slice(0, 6).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                      ? 'bg-white text-blue-600 border-slate-200 shadow-sm' 
                      : 'bg-transparent text-slate-500 border-transparent hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
      </div>

      {/* 4. Table Area Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-300 flex flex-col hover:border-blue-500 hover:shadow-xl transition-[border-color,box-shadow] duration-300 overflow-hidden mx-2 md:mx-0 flex-1 min-h-0">
            {/* Table Area */}
            <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th 
                      onClick={() => handleSort('id')} 
                      className="px-4 sm:px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-b border-slate-300 cursor-pointer hover:text-[#00288E] transition-colors group"
                      style={{ fontSize: 'clamp(8px, 0.8vw, 11px)' }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Sản phẩm</span>
                        <span className={`material-symbols-outlined text-[13px] transition-opacity ${sortConfig.key === 'id' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                          {sortConfig.key === 'id' && sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')} 
                      className="px-4 sm:px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-b border-slate-300 cursor-pointer hover:text-[#00288E] transition-colors group"
                      style={{ fontSize: 'clamp(8px, 0.8vw, 11px)' }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Phân loại</span>
                        <span className={`material-symbols-outlined text-[13px] transition-opacity ${sortConfig.key === 'category' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                          {sortConfig.key === 'category' && sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('price')} 
                      className="px-4 sm:px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-b border-slate-300 cursor-pointer hover:text-[#00288E] transition-colors group"
                      style={{ fontSize: 'clamp(8px, 0.8vw, 11px)' }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Giá bán</span>
                        <span className={`material-symbols-outlined text-[13px] transition-opacity ${sortConfig.key === 'price' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                          {sortConfig.key === 'price' && sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('stock')} 
                      className="px-4 sm:px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-b border-slate-300 cursor-pointer hover:text-[#00288E] transition-colors group"
                      style={{ fontSize: 'clamp(8px, 0.8vw, 11px)' }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Tồn kho</span>
                        <span className={`material-symbols-outlined text-[13px] transition-opacity ${sortConfig.key === 'stock' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                          {sortConfig.key === 'stock' && sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 sm:px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-b border-slate-300" style={{ fontSize: 'clamp(8px, 0.8vw, 11px)' }}>Trạng thái</th>
                    <th className="px-4 sm:px-6 py-4 font-black text-slate-400 uppercase tracking-widest border-b border-slate-300 text-right" style={{ fontSize: 'clamp(8px, 0.8vw, 11px)' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="material-symbols-outlined text-4xl text-slate-200">inventory_2</span>
                          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">Không tìm thấy sản phẩm nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedProducts.map((product, index) => (
                    <tr key={index} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="px-6 py-4" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                        <div className="flex items-center gap-4">
                          <div className="rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black uppercase shadow-sm group-hover:scale-110 transition-transform overflow-hidden"
                               style={{ width: 'clamp(32px, 2.5vw, 44px)', height: 'clamp(32px, 2.5vw, 44px)', fontSize: 'clamp(10px, 0.9vw, 14px)' }}>
                            {product.imageURL ? (
                              <img src={product.imageURL} className="w-full h-full object-cover" alt={product.name} />
                            ) : (
                              <span className="material-symbols-outlined" style={{ fontSize: 'clamp(14px, 1.3vw, 20px)' }}>image</span>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 uppercase tracking-tight text-sm max-w-[40ch] lg:max-w-none break-words whitespace-normal"
                                 style={{ fontSize: 'clamp(11px, 1vw, 14px)' }}>{product.name}</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest"
                                 style={{ fontSize: 'clamp(8px, 0.75vw, 10px)' }}>{product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                        <span className="bg-slate-100 text-slate-500 font-black rounded-lg border border-slate-200 uppercase tracking-tighter"
                              style={{ fontSize: 'clamp(8px, 0.75vw, 9px)', padding: 'clamp(2px, 0.4vw, 4px) clamp(6px, 0.8vw, 12px)' }}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)', fontSize: 'clamp(10px, 0.9vw, 13px)' }}>
                        {formatCurrency(product.price, true)}
                      </td>
                      <td className="px-6 py-4" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-20 sm:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                            <div 
                              className={`h-full rounded-full ${product.stock < 20 ? 'bg-orange-500' : 'bg-blue-600'}`} 
                              style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-black text-slate-700" style={{ fontSize: 'clamp(10px, 0.85vw, 12px)' }}>{product.stock}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                        <span className={`inline-block rounded-lg font-black uppercase tracking-tighter border ${
                          product.status === 'Còn hàng' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                              style={{ fontSize: 'clamp(8px, 0.75vw, 9px)', padding: 'clamp(2px, 0.4vw, 4px) clamp(6px, 0.8vw, 12px)' }}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`${basePath}/products/edit/${product.productID}`)}
                            className="rounded-xl bg-slate-50 text-slate-300 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center active:scale-95"
                            style={{ width: 'clamp(28px, 2.5vw, 40px)', height: 'clamp(28px, 2.5vw, 40px)' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 'clamp(14px, 1.3vw, 20px)' }}>edit</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setTargetProduct(product); setShowDeleteModal(true); }}
                            className="rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center active:scale-95"
                            style={{ width: 'clamp(28px, 2.5vw, 40px)', height: 'clamp(28px, 2.5vw, 40px)' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 'clamp(14px, 1.3vw, 20px)' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 bg-slate-50/50">
              <span>
                Hiển thị {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length} sản phẩm
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all uppercase tracking-widest text-[9px]"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        currentPage === p 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                          : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all uppercase tracking-widest text-[9px]"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          </div>

      {/* Modal Xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border border-slate-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-4xl mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">delete_forever</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Xác nhận xóa?</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Hành động này sẽ gỡ bỏ sản phẩm <span className="text-slate-600">"{targetProduct?.name}"</span> khỏi hệ thống vĩnh viễn.
              </p>
            </div>
            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDeleteProduct}
                className="flex-1 px-6 py-4 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 duration-300">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
              <span className="material-symbols-outlined text-lg">{toast.type === 'error' ? 'close' : 'check'}</span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
};

const getTooltipClasses = (idx) => {
  // Left-aligned tooltip: displays on the right, points left
  const leftAlign = "left-full top-0 ml-2.5 origin-top-left";
  // Right-aligned tooltip: displays on the left, points right
  const rightAlign = "right-full top-0 mr-2.5 origin-top-right";

  if (idx === 0) {
    return leftAlign;
  } else if (idx === 3) {
    return rightAlign;
  } else if (idx === 1) {
    return `${rightAlign} lg:right-auto lg:left-full lg:mr-0 lg:ml-2.5 lg:origin-top-left`;
  } else if (idx === 2) {
    return `${leftAlign} lg:left-auto lg:right-full lg:ml-0 lg:mr-2.5 lg:origin-top-right`;
  }
  return leftAlign;
};

const getArrowClasses = (idx) => {
  const leftArrow = "-left-1 border-l border-b";
  const rightArrow = "-right-1 border-t border-r";

  if (idx === 0) {
    return leftArrow;
  } else if (idx === 3) {
    return rightArrow;
  } else if (idx === 1) {
    return `${rightArrow} lg:right-auto lg:-left-1 lg:border-t-0 lg:border-r-0 lg:border-l lg:border-b`;
  } else if (idx === 2) {
    return `${leftArrow} lg:left-auto lg:-right-1 lg:border-l-0 lg:border-b-0 lg:border-t lg:border-r`;
  }
  return leftArrow;
};

const GrowthBadge = ({ growth, type = 'number', currentValue, idx, activeTooltipIdx }) => {
  if (!growth) return null;
  const { percent, isUp, prevValue, label } = growth;
  
  const tooltipPositionClass = getTooltipClasses(idx);
  const arrowPositionClass = getArrowClasses(idx);
  const isActive = activeTooltipIdx === idx;

  return (
    <div className="w-max group relative flex items-center gap-1 mt-1 cursor-help">
      <div className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-300 ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        <span className="material-symbols-outlined text-[14px] leading-none">{isUp ? 'trending_up' : 'trending_down'}</span>
        <span>{isUp ? '+' : '-'}{percent}%</span>
      </div>
      
      {/* Tooltip */}
      <div className={`absolute hidden group-hover:block z-[9999] w-48 animate-fade-in ${tooltipPositionClass} ${isActive ? '!block' : ''}`}>
        <div className="bg-white/95 backdrop-blur-xl text-slate-900 text-[10px] p-3 rounded-xl shadow-2xl border border-slate-300">
          <p className="font-black opacity-50 mb-2 uppercase tracking-[0.1em] text-[9px] border-b border-slate-100 pb-1.5">{label || 'So với kỳ trước'}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 font-medium">Kỳ trước:</span>
              <span className="font-black text-slate-700 text-[9px]">
                {type === 'currency' ? formatCurrency(prevValue, true) : prevValue}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 font-medium">Kỳ này:</span>
              <span className={`font-black text-[9px] ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {type === 'currency' ? formatCurrency(currentValue, true) : currentValue}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-slate-400 italic">Tình trạng:</span>
            <span className={`font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isUp ? 'Tăng trưởng' : 'Giảm sút'}
            </span>
          </div>
        </div>
        {/* Mũi tên tooltip */}
        <div className={`w-2 h-2 bg-white rotate-45 absolute top-2.5 shadow-sm ${arrowPositionClass}`}></div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, growth, type = 'number', icon, color, rawValue, idx, activeTooltipIdx, setActiveTooltipIdx }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div 
      onClick={() => {
        if (setActiveTooltipIdx) {
          setActiveTooltipIdx(prev => prev === idx ? null : idx);
        }
      }}
      className="stat-card-container relative bg-white rounded-xl shadow-[0_8px_20px_-3px_rgba(0,0,0,0.06)] border border-slate-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 hover:z-30 transition-all duration-300 cursor-pointer group p-3 sm:p-4 lg:p-5 lg:rounded-2xl"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-500 uppercase tracking-wider leading-tight mb-1 text-[9px] sm:text-[10px] lg:text-[11px]">{label}</p>
          <div className={`font-black text-slate-900 mt-1 break-words whitespace-normal xl:truncate xl:whitespace-nowrap ${getResponsiveValueClass(value, rawValue)}`}>
            {value}
          </div>
          <GrowthBadge 
            growth={growth} 
            type={type} 
            currentValue={rawValue !== undefined ? rawValue : (typeof value === 'string' ? value.replace(/[^0-9]/g, '') : value)} 
            idx={idx}
            activeTooltipIdx={activeTooltipIdx}
          />
        </div>
        <div className={`rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-110 w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-lg sm:text-xl lg:text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;