import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl p-3 shadow-xl">
      <p className="text-xs font-medium text-slate-200 mb-1">{d.type}</p>
      <p className="text-xs text-slate-400">{d.count} posts · <span className="text-emerald-400 font-semibold">{d.engRate}% eng.</span></p>
    </div>
  );
};

export default function ContentMix({ company }) {
  const data = company.contentMix;
  const total = data.reduce((s, d) => s + d.count, 0);
  const best = [...data].sort((a, b) => b.engRate - a.engRate)[0];

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">Content Mix</h3>
        <p className="text-xs text-slate-500 mt-0.5">Format breakdown & engagement rates</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-36 h-36 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={3}
                dataKey="count"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((d, i) => <Cell key={i} fill={d.color} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg font-bold text-slate-100">{total}</p>
            <p className="text-[10px] text-slate-500">posts</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-slate-400 truncate">{d.type}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-500">{d.count}</span>
                <span className="text-[10px] font-semibold text-emerald-400">{d.engRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1d2e] rounded-lg px-3 py-2.5 flex items-center gap-2">
        <span className="text-lg">🏆</span>
        <div>
          <p className="text-xs font-medium text-slate-200">Best format: <span style={{ color: best.color }}>{best.type}</span></p>
          <p className="text-[10px] text-slate-500">{best.engRate}% avg. engagement rate</p>
        </div>
      </div>
    </div>
  );
}
