import { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import YoutubeView from './components/YoutubeView';
import KPICard from './components/KPICard';
import EngagementChart from './components/EngagementChart';
import PlatformBreakdown from './components/PlatformBreakdown';
import ContentMix from './components/ContentMix';
import TopPosts from './components/TopPosts';
import AudienceGrowth from './components/AudienceGrowth';
import InsightsPanel from './components/InsightsPanel';
import { companies, PLATFORM_KEYS, fmt } from './data/mockData';
import { Users, Eye, Zap, FileText, BarChart2 } from 'lucide-react';

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [dateRange, setDateRange] = useState('30D');
  const [activePlatforms, setActivePlatforms] = useState([...PLATFORM_KEYS]);

  const isNike = selectedCompany === 'nike';
  const company = companies.find(c => c.id === selectedCompany) ?? companies[0];

  const togglePlatform = (pk) => {
    setActivePlatforms(prev =>
      prev.includes(pk)
        ? prev.length > 1 ? prev.filter(p => p !== pk) : prev
        : [...prev, pk]
    );
  };

  const kpis = useMemo(() => {
    const active = activePlatforms.filter(pk => company.stats[pk]);
    const totalFollowers  = active.reduce((s, pk) => s + company.stats[pk].followers, 0);
    const totalReach      = active.reduce((s, pk) => s + company.stats[pk].reach, 0);
    const totalImpressions= active.reduce((s, pk) => s + company.stats[pk].impressions, 0);
    const avgEngagement   = (active.reduce((s, pk) => s + company.stats[pk].engagementRate, 0) / active.length).toFixed(1);
    const totalPosts      = active.reduce((s, pk) => s + company.stats[pk].posts, 0);

    const sparkFollowers = company.followerGrowth[active[0]]?.slice(-14) ?? [];
    const sparkReach     = company.engagementData[active[0]]?.slice(-14) ?? [];
    const sparkEng       = company.engagementData[active[0]]?.slice(-14).map(v => v * 0.05) ?? [];
    const sparkPosts     = Array.from({ length: 14 }, (_, i) => 3 + (i % 5));

    return [
      { icon: Users,     label: 'Total Followers',    value: fmt(totalFollowers),    delta: company.deltas.followers,   color: '#6366f1', sparkData: sparkFollowers },
      { icon: Eye,       label: 'Total Reach',         value: fmt(totalReach),        delta: company.deltas.reach,       color: '#8b5cf6', sparkData: sparkReach },
      { icon: Zap,       label: 'Avg. Engagement',     value: avgEngagement + '%',    delta: company.deltas.engagement,  color: '#10b981', sparkData: sparkEng },
      { icon: BarChart2, label: 'Total Impressions',   value: fmt(totalImpressions),  delta: company.deltas.impressions, color: '#f59e0b', sparkData: sparkReach },
      { icon: FileText,  label: 'Posts Published',     value: fmt(totalPosts),        delta: company.deltas.posts,       color: '#ec4899', sparkData: sparkPosts },
    ];
  }, [company, activePlatforms]);

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden text-slate-100">
      <Sidebar selectedCompany={selectedCompany} onCompanyChange={setSelectedCompany} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isNike && (
          <Header
            company={company}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            activePlatforms={activePlatforms}
            onPlatformToggle={togglePlatform}
          />
        )}

        {isNike ? <YoutubeView /> : (
          <main className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {kpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
            </div>

            {/* Engagement chart + Platform breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EngagementChart company={company} activePlatforms={activePlatforms} dateRange={dateRange} />
              </div>
              <div className="lg:col-span-1">
                <PlatformBreakdown company={company} activePlatforms={activePlatforms} />
              </div>
            </div>

            {/* Content mix + Top posts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <ContentMix company={company} />
              </div>
              <div className="lg:col-span-2">
                <TopPosts company={company} />
              </div>
            </div>

            {/* Audience growth + Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <AudienceGrowth company={company} activePlatforms={activePlatforms} dateRange={dateRange} />
              <InsightsPanel company={company} />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
