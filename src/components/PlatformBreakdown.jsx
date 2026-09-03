import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { PLATFORMS, fmt } from '../data/mockData';

const METRICS = [
  { key: 'followers',      label: 'Followers'     },
  { key: 'reach',          label: 'Reach'         },
  { key: 'engagementRate', label: 'Eng. Rate %'   },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const platform = PLATFORMS[label];
  return (
    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl p-3 shadow-xl">
      <p className="text-xs font-medium mb-1" style={{ color: platform?.color }}>{platform?.name ?? label}</p>
      <p className="text-sm font-bold text-slate-100">{fmt(payload[0].value)}</p>
    </div>
  );
};

export default function PlatformBreakdown({ company, activePlatforms }) {
  const [metric, setMetric] = useState('followers');

  const data = activePlatforms.map(pk => ({
    key: pk,
    name: PLATFORMS[pk].name.split(' ')[0],
    value: company.stats[pk]?.[metric] ?? 0,
    color: PLATFORMS[pk].color,
  }));

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Platform Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">Per-platform performance</p>
        </div>
        <div className="flex gap-0.5 bg-[#1a1d2e] rounded-lg p-1">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                metric === m.key ? 'bg-[#2a2d3e] text-slate-200' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={36} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map(d => <Cell key={d.key} fill={d.color} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-5 gap-1">
        {data.map(d => (
          <div key={d.key} className="text-center">
            <p className="text-[10px] font-bold text-slate-200">{fmt(d.value)}{metric === 'engagementRate' ? '%' : ''}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
