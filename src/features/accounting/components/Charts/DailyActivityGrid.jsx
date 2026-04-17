import React, { useState, useMemo, useRef, useEffect } from 'react';

const DailyActivityGrid = ({ loading, apiData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerView, setPickerView] = useState('months'); // 'months' or 'years'
  
  // Year range logic for picking across decades
  const currentActualYear = new Date().getFullYear();
  const [yearRangeStart, setYearRangeStart] = useState(Math.floor(currentActualYear / 12) * 12);
  
  const pickerRef = useRef(null);

  // Calendar logic
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const [tempYear, setTempYear] = useState(year); // Temporarily hold year while picking
  const totalDays = daysInMonth(month, year);
  const startOffset = firstDayOfMonth(month, year);

  // Month labels
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
        setPickerView('months');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setTempYear(year);
    // Reset year range start when picker opens to current selection
    setYearRangeStart(Math.floor(year / 12) * 12);
  }, [year]);

  // Data logic - Prioritize API data, fallback to simulation
  const dailyData = useMemo(() => {
    // Only use apiData if it actually has the expected daily structure (contains .day)
    if (apiData && apiData.length > 0 && apiData[0].day !== undefined) return apiData;

    return Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const seed = (month + 1) * day * (year % 100);
      const revenue = Math.floor((seed % 50) + 10) * 1000000;
      const debt = Math.floor((seed % 20)) * 500000;
      const actual = revenue - debt;
      const intensity = (revenue / 50000000); 
      return { day, revenue, debt, actual, intensity };
    });
  }, [month, year, totalDays, apiData]);

  const changeMonth = (offset) => {
    setSelectedDate(new Date(year, month + offset, 1));
  };

  const selectMonth = (m) => {
    setSelectedDate(new Date(tempYear, m, 1));
    setShowPicker(false);
  };

  const selectYear = (y) => {
    setTempYear(y);
    setPickerView('months');
  };

  const formatCurrency = (val) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  // Generate 12 years based on yearRangeStart
  const yearsList = useMemo(() => {
    const years = [];
    for (let i = 0; i < 12; i++) {
        years.push(yearRangeStart + i);
    }
    return years;
  }, [yearRangeStart]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col gap-4 animate-pulse px-2">
        <div className="h-8 w-48 bg-slate-50 rounded-xl mx-auto"></div>
        <div className="grid grid-cols-7 gap-1.5 flex-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 bg-white relative font-sans">
      {/* Date Selector Header */}
      <div className="flex items-center justify-between mb-2 px-1 shrink-0 relative">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => changeMonth(-1)}
            className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center transition-all group"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-acc-primary">chevron_left</span>
          </button>
          
          <button 
            onClick={() => { setShowPicker(!showPicker); setPickerView('months'); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 hover:bg-white hover:shadow-sm group ${showPicker ? 'bg-white shadow-sm ring-1 ring-acc-primary/10' : ''}`}
          >
            <h4 className="text-[10px] font-black text-acc-text-main uppercase tracking-widest min-w-[100px] text-center group-hover:text-acc-primary">
              {monthNames[month]}, {year}
            </h4>
            <span className={`material-symbols-outlined text-[14px] text-slate-300 transition-transform ${showPicker ? 'rotate-180 text-acc-primary' : ''}`}>expand_more</span>
          </button>

          <button 
            onClick={() => changeMonth(1)}
            className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center transition-all group"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-acc-primary">chevron_right</span>
          </button>
        </div>

        {/* Improved Picker Popup */}
        {showPicker && (
          <div 
            ref={pickerRef}
            className="absolute top-[115%] left-1 z-[100] bg-white shadow-2xl rounded-2.5xl border border-slate-100 p-5 min-w-[320px] animate-fade-in origin-top-left"
          >
            {pickerView === 'months' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-black text-acc-text-muted uppercase tracking-widest">Chọn tháng</span>
                  <button 
                    onClick={() => setPickerView('years')}
                    className="flex items-center gap-2 px-3 py-1 bg-acc-primary/5 rounded-lg border border-acc-primary/10 hover:bg-acc-primary/10 transition-colors group"
                  >
                    <span className="text-[12px] font-black text-acc-primary uppercase">{tempYear}</span>
                    <span className="material-symbols-outlined text-[14px] text-acc-primary group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {monthNames.map((mName, idx) => (
                    <button
                      key={mName}
                      onClick={() => selectMonth(idx)}
                      className={`text-[10px] font-black py-2.5 rounded-xl transition-all ${
                          idx === month 
                          ? 'bg-acc-primary text-white shadow-lg shadow-blue-500/30' 
                          : 'text-acc-text-light hover:bg-slate-50'
                      }`}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setPickerView('months')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-acc-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    </button>
                    <span className="text-[10px] font-black text-acc-text-muted uppercase tracking-widest">Chọn Năm</span>
                  </div>
                  
                  {/* Decade Navigation */}
                  <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg">
                    <button 
                        onClick={() => setYearRangeStart(prev => prev - 12)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white hover:shadow-sm text-acc-primary transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    </button>
                    <span className="text-[9px] font-black text-acc-text-muted px-1">
                        {yearRangeStart} - {yearRangeStart + 11}
                    </span>
                    <button 
                        onClick={() => setYearRangeStart(prev => prev + 12)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white hover:shadow-sm text-acc-primary transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-1">
                  {yearsList.map((y) => (
                    <button
                      key={y}
                      onClick={() => selectYear(y)}
                      className={`text-[11px] font-black py-3 rounded-xl transition-all ${
                          y === tempYear 
                          ? 'bg-acc-primary text-white shadow-lg shadow-blue-500/30' 
                          : 'text-acc-text-light hover:bg-slate-50'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
                <span className="text-[9px] text-acc-text-light font-black uppercase tracking-tighter">Thấp</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-acc-primary shadow-sm shadow-blue-400"></div>
                <span className="text-[9px] text-acc-text-light font-black uppercase tracking-tighter">Cao</span>
            </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mb-1 shrink-0 px-1">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, idx) => (
          <div key={`weekday-${d}-${idx}`} className="text-center text-[9px] font-black text-acc-text-muted uppercase tracking-widest opacity-40">
            {d}
          </div>
        ))}
      </div>

      {/* Grid Area */}
      <div className="flex-1 min-h-0 px-1 pb-1">
        <div className="grid grid-cols-7 grid-rows-6 gap-1 h-full">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="border border-dashed border-slate-100/50 rounded-lg opacity-5"></div>
          ))}

          {dailyData.map((data) => (
            <div 
              key={`day-${data.day}-${month}-${year}`}
              onMouseEnter={() => setHoveredDay(data)}
              onMouseLeave={() => setHoveredDay(null)}
              className="relative rounded-lg transition-all duration-300 cursor-help border border-transparent hover:border-acc-primary/40 group overflow-hidden min-h-[1.5rem]"
              style={{ 
                  backgroundColor: `color-mix(in srgb, var(--acc-primary), white ${Math.max(0, 100 - (data.intensity * 100))}%)`,
                  opacity: data.intensity < 0.05 ? 0.3 : 1
              }}
            >
              <span className={`absolute top-0.5 left-1 text-[8px] font-black z-10 transition-colors ${data.intensity > 0.6 ? 'text-white' : 'text-acc-text-main opacity-30 group-hover:opacity-100'}`}>
                {data.day}
              </span>
              
              {data.debt > 5000000 && (
                  <span className="absolute bottom-0.5 right-1 w-1 h-1 bg-rose-500 rounded-full shadow-sm ring-1 ring-white/10"></span>
              )}
            </div>
          ))}

          {Array.from({ length: Math.max(0, 42 - (startOffset + totalDays)) }).map((_, i) => (
            <div key={`empty-${i}`} className="opacity-0"></div>
          ))}
        </div>
      </div>

      {/* Tooltip Popup */}
      {hoveredDay && (
        <div 
            className="fixed z-[999] pointer-events-none animate-fade-in"
            style={{ 
                left: '50%', 
                bottom: '100px',
                transform: 'translateX(-50%)'
            }}
        >
            <div className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2.5xl p-5 min-w-[220px] border-slate-100 shadow-blue-900/10">
                <div className="flex flex-col gap-4">
                    <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
                        <span className="text-[11px] font-black text-acc-text-main uppercase tracking-widest">Chi tiết Ngày {hoveredDay.day}</span>
                        <div className="w-2 h-2 rounded-full bg-acc-primary shadow-lg shadow-blue-500/50"></div>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-acc-text-light font-black uppercase tracking-tighter">Doanh thu</span>
                            <span className="text-[12px] font-black text-emerald-600">+{formatCurrency(hoveredDay.revenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-acc-text-light font-black uppercase tracking-tighter">Công nợ</span>
                            <span className="text-[12px] font-black text-rose-500">-{formatCurrency(hoveredDay.debt)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                            <span className="text-[11px] text-acc-text-main font-black uppercase tracking-wider">Thực thu</span>
                            <span className="text-[11px] font-black text-acc-primary bg-acc-primary/10 px-3 py-1 rounded-lg">
                                {formatCurrency(hoveredDay.actual)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DailyActivityGrid;
