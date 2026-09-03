import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { PLATFORMS, dates } from '../data/mockData';
import { fmt } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl p-3 shadow-xl min-w-[160px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: p.color }} />
            {PLATFORMS[p.dataKey]?.name ?? p.dataKey}
          </span>
          <span className="text-slate-200 font-semibold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function EngagementChart({ company, activePlatforms, dateRange }) {
  const days = dateRange === '7D' ? 7 : dateRange === '90D' ? 30 : 30;
  const slice = (arr) => arr.slice(-days);

  const data = slice(dates).map((date, i) => {
    const offset = 30 - days;
    const row = { date };
    activePlatforms.forEach(pk => {
      row[pk] = company.engagementData[pk]?.[offset + i] ?? 0;
    });
    return row;
  });

  // Show every Nth label to avoid crowding
  const tickEvery = days <= 7 ? 1 : days <= 14 ? 2 : 5;

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Engagement Over Time</h3>
          <p className="text-xs text-slate-500 mt-0.5">Total interactions per day across platforms</p>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={tickEvery - 1}
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
              <Line
                key={pk}
                type="monotone"
                dataKey={pk}
                stroke={PLATFORMS[pk].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {activePlatforms.map(pk => (
          <div key={pk} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-0.5 rounded-full inline-block" style={{ backgroundColor: PLATFORMS[pk].color }} />
            {PLATFORMS[pk].name}
          </div>
        ))}
      </div>
    </div>
  );
}
