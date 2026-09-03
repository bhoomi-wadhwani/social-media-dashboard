import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PLATFORMS, dates, fmt } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.slice().reverse().map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs mb-0.5">
          <span style={{ color: PLATFORMS[p.dataKey]?.color }}>{PLATFORMS[p.dataKey]?.name.split(' ')[0]}</span>
          <span className="text-slate-300 font-medium">{fmt(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-[#2a2d3e] mt-2 pt-2 flex justify-between text-xs">
        <span className="text-slate-400">Total</span>
        <span className="text-slate-100 font-bold">{fmt(total)}</span>
      </div>
    </div>
  );
};

export default function AudienceGrowth({ company, activePlatforms, dateRange }) {
  const days = dateRange === '7D' ? 7 : 30;
  const slice = (arr) => arr.slice(-days);

  const data = slice(dates).map((date, i) => {
    const offset = 30 - days;
    const row = { date };
    activePlatforms.forEach(pk => {
      row[pk] = company.followerGrowth[pk]?.[offset + i] ?? 0;
    });
    return row;
  });

  const totalNow = activePlatforms.reduce((s, pk) => {
    const arr = company.followerGrowth[pk];
    return s + (arr?.[arr.length - 1] ?? 0);
  }, 0);

  const totalBefore = activePlatforms.reduce((s, pk) => {
    const arr = company.followerGrowth[pk];
    const offset = 30 - days;
    return s + (arr?.[offset] ?? 0);
  }, 0);

  const growthPct = totalBefore > 0 ? (((totalNow - totalBefore) / totalBefore) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Audience Growth</h3>
          <p className="text-xs text-slate-500 mt-0.5">Follower trajectory across platforms</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-100">{fmt(totalNow)}</p>
          <p className="text-xs text-emerald-400 font-medium">+{growthPct}% this period</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              {activePlatforms.map(pk => (
                <linearGradient key={pk} id={`grad-${pk}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PLATFORMS[pk].color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={PLATFORMS[pk].color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={days <= 7 ? 0 : 4}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmt}
              width={38}
            />
            <Tooltip content={<CustomTooltip />} />
            {activePlatforms.map(pk => (
              <Area
                key={pk}
                type="monotone"
                dataKey={pk}
                stroke={PLATFORMS[pk].color}
                strokeWidth={1.5}
                fill={`url(#grad-${pk})`}
                dot={false}
                stackId="stack"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3">
        {activePlatforms.map(pk => (
          <div key={pk} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PLATFORMS[pk].color }} />
            {PLATFORMS[pk].name}
          </div>
        ))}
      </div>
    </div>
  );
}
