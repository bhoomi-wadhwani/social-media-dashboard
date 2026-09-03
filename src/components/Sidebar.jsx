import { BarChart2, Users, FileText, TrendingUp, Settings, Globe, ChevronDown, Activity, PlayCircle } from 'lucide-react';
import { companies } from '../data/mockData';
import { useState } from 'react';

const LIVE_COMPANY = { id: 'nike', name: 'Nike', industry: 'YouTube · Live', isLive: true };

const navItems = [
  { icon: BarChart2, label: 'Overview',   active: true  },
  { icon: TrendingUp, label: 'Analytics',  active: false },
  { icon: FileText,   label: 'Content',    active: false },
  { icon: Users,      label: 'Audience',   active: false },
  { icon: Globe,      label: 'Competitors',active: false },
  { icon: Activity,   label: 'Reports',    active: false },
  { icon: Settings,   label: 'Settings',   active: false },
];

export default function Sidebar({ selectedCompany, onCompanyChange }) {
  const [open, setOpen] = useState(false);
  const allCompanies = [...companies, LIVE_COMPANY];
  const company = allCompanies.find(c => c.id === selectedCompany) ?? LIVE_COMPANY;

  return (
    <aside className="w-60 min-h-screen bg-[#13151f] border-r border-[#1e2130] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e2130]">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <BarChart2 size={16} className="text-white" />
        </div>
        <span className="text-slate-100 font-semibold tracking-tight">SocialPulse</span>
      </div>

      {/* Company selector */}
      <div className="px-3 py-4 border-b border-[#1e2130]">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">Company</p>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-[#1a1d2e] hover:bg-[#1f2236] transition-colors text-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-indigo-400">{company.name[0]}</span>
            </div>
            <span className="text-slate-200 font-medium truncate">{company.name}</span>
          </div>
          <ChevronDown size={14} className={`text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-1 rounded-lg bg-[#1a1d2e] border border-[#2a2d3e] overflow-hidden">
            {allCompanies.map(c => (
              <button
                key={c.id}
                onClick={() => { onCompanyChange(c.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#242740] transition-colors text-left ${c.id === selectedCompany ? 'text-indigo-400' : 'text-slate-300'}`}
              >
                {c.isLive
                  ? <PlayCircle size={14} className="text-[#ff0000] shrink-0" />
                  : <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-indigo-400">{c.name[0]}</span>
                    </div>
                }
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{c.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{c.industry}</div>
                </div>
                {c.isLive && (
                  <span className="text-[9px] font-bold text-[#ff0000] bg-[#ff0000]/15 px-1.5 py-0.5 rounded-full shrink-0">LIVE</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-3">Navigation</p>
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
              ${active
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1d2e]'}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-[#1e2130]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">SM</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Social Manager</p>
            <p className="text-xs text-slate-500 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
