import { TrendingUp, TrendingDown } from 'lucide-react';
import { SparklineChart } from './SparklineChart';

export default function KPICard({ icon: Icon, label, value, delta, color, sparkData }) {
  const positive = delta >= 0;

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-4 flex flex-col gap-3 hover:border-[#2a2d3e] transition-colors">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '22' }}>
          <Icon size={17} style={{ color }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          positive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
        }`}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(delta)}%
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-100 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>

      {sparkData && (
        <div className="h-8">
          <SparklineChart data={sparkData} color={color} />
        </div>
      )}
    </div>
  );
}
