import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function InsightsPanel({ company }) {
  const { working, attention } = company.insights;

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">AI Insights</h3>
        <p className="text-xs text-slate-500 mt-0.5">What to double down on — and what to fix</p>
      </div>

      {/* What's working */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">What's Working</p>
        </div>
        <div className="space-y-2">
          {working.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 bg-emerald-400/5 border border-emerald-400/15 rounded-xl">
              <div className="w-1 rounded-full bg-emerald-400 shrink-0 self-stretch" />
              <div>
                <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Needs attention */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Needs Attention</p>
        </div>
        <div className="space-y-2">
          {attention.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 bg-amber-400/5 border border-amber-400/15 rounded-xl">
              <div className="w-1 rounded-full bg-amber-400 shrink-0 self-stretch" />
              <div>
                <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
