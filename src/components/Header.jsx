import { Download, RefreshCw, Bell } from 'lucide-react';
import { PLATFORMS } from '../data/mockData';

const DATE_RANGES = ['7D', '30D', '90D'];

export default function Header({ company, dateRange, onDateRangeChange, activePlatforms, onPlatformToggle }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#0f1117]/80 backdrop-blur border-b border-[#1e2130]">
      {/* Left: title + company tag */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-100 leading-none">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Social media performance dashboard</p>
        </div>
        <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${company.tagColor}`}>
          {company.industry}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Platform filter */}
        <div className="hidden lg:flex items-center gap-1 bg-[#1a1d2e] rounded-lg p-1">
          {Object.values(PLATFORMS).map(p => (
            <button
              key={p.key}
              onClick={() => onPlatformToggle(p.key)}
              title={p.name}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activePlatforms.includes(p.key)
                  ? 'text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={activePlatforms.includes(p.key) ? { backgroundColor: p.color + '33', color: p.color } : {}}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-0.5 bg-[#1a1d2e] rounded-lg p-1">
          {DATE_RANGES.map(d => (
            <button
              key={d}
              onClick={() => onDateRangeChange(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                dateRange === d
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1d2e] hover:bg-[#1f2236] text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors">
          <Download size={13} />
          Export
        </button>

        <button className="relative p-2 rounded-lg bg-[#1a1d2e] hover:bg-[#1f2236] text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
        </button>
      </div>
    </header>
  );
}
