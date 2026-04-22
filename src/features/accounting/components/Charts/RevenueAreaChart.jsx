import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-3xl shadow-float border border-slate-100 animate-fade-in" style={{ padding: 'var(--space-lg)', minWidth: '14rem' }}>
        <p className="text-label-xs text-acc-text-light border-b border-slate-50" style={{ marginBottom: 'var(--space-sm)', paddingBottom: 'var(--space-xs)' }}>
          {label}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-acc-primary shadow-sm"></div>
              <span className="text-body-sm font-bold text-acc-text-muted">Doanh thu:</span>
            </div>
            <span className="text-body-sm font-black text-acc-text-main">
              {Number(data.revenue || 0).toLocaleString()} VNĐ
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-body-sm font-bold text-acc-text-muted">Công nợ:</span>
            </div>
            <span className="text-body-sm font-black text-amber-600">
              {Number(data.expense || data.debt || 0).toLocaleString()} VNĐ
            </span>
          </div>
          <div className="border-t border-slate-50 flex items-center justify-between bg-blue-50/30 rounded-2xl" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', marginHorizontal: 'calc(var(--space-lg) * -1)' }}>
            <span className="text-label-xs text-acc-primary font-black">Thực thu:</span>
            <span className="text-body-sm font-black text-acc-primary">
              {Number(data.collected || 0).toLocaleString()} VNĐ
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueAreaChart = ({ data, loading }) => {
  const containerRef = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Đo kích thước ngay lập tức
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        if (newWidth > 0) setWidth(newWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative flex-1 min-h-[350px]">
      {(loading || width === 0) ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-acc-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tính toán không gian...</p>
          </div>
        </div>
      ) : (!data || data.length === 0) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 text-center">
          <span className="material-symbols-outlined text-4xl mb-2">database_off</span>
          <p className="text-[10px] font-black uppercase tracking-widest">Không có dữ liệu</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 30 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00288E" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00288E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} 
              dy={15}
              interval={0}
            />
            <YAxis hide width={0} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00288E" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={1500}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#00288E' }}
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorDebt)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueAreaChart;
