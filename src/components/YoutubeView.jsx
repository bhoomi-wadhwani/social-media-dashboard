import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell,
} from 'recharts';
import {
  fetchChannelStats, fetchRecentVideos, fetchVideoStats,
  parseDuration, NIKE_CHANNEL,
} from '../services/youtube';
import { fmt } from '../data/mockData';
import { Eye, ThumbsUp, MessageSquare, PlayCircle, TrendingUp, Zap, Film, CheckCircle2, AlertTriangle } from 'lucide-react';

const YT_RED = '#ff0000';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl p-3 shadow-xl max-w-[220px]">
      <p className="text-[10px] text-slate-400 mb-1 leading-tight">{label}</p>
      <p className="text-sm font-bold text-slate-100">{fmt(payload[0].value)} views</p>
    </div>
  );
};

const EngTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d2e] border border-[#2a2d3e] rounded-xl p-3 shadow-xl max-w-[220px]">
      <p className="text-[10px] text-slate-400 mb-1 leading-tight">{label}</p>
      <p className="text-sm font-bold text-emerald-400">{payload[0].value}% engagement</p>
    </div>
  );
};

function KPICard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-4 flex flex-col gap-2 hover:border-[#2a2d3e] transition-colors">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '22' }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-emerald-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function YoutubeView() {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const channelData = await fetchChannelStats(NIKE_CHANNEL.id);
        const recentVideos = await fetchRecentVideos(NIKE_CHANNEL.id, 15);
        const videoIds = recentVideos.map(v => v.id.videoId).filter(Boolean);
        const statsData = await fetchVideoStats(videoIds);

        const statsMap = {};
        statsData.forEach(s => { statsMap[s.id] = s; });

        const enriched = recentVideos
          .filter(v => v.id?.videoId)
          .map(v => {
            const stats = statsMap[v.id.videoId] ?? {};
            const views = parseInt(stats.statistics?.viewCount ?? 0);
            const likes = parseInt(stats.statistics?.likeCount ?? 0);
            const comments = parseInt(stats.statistics?.commentCount ?? 0);
            const engRate = views > 0 ? (((likes + comments) / views) * 100).toFixed(2) : '0.00';
            return {
              id: v.id.videoId,
              title: v.snippet.title,
              thumbnail: v.snippet.thumbnails?.medium?.url,
              publishedAt: v.snippet.publishedAt,
              duration: parseDuration(stats.contentDetails?.duration ?? 'PT0S'),
              views, likes, comments,
              engRate: parseFloat(engRate),
            };
          });

        setChannel(channelData);
        setVideos(enriched);

        // Fetch AI insights after YouTube data is ready
        setAiLoading(true);
        try {
          const chStats = channelData?.statistics ?? {};
          const subscribers = parseInt(chStats.subscriberCount ?? 0);
          const totalViews  = parseInt(chStats.viewCount ?? 0);
          const videoCount  = parseInt(chStats.videoCount ?? 0);
          const avgViews    = videoCount > 0 ? Math.round(totalViews / videoCount) : 0;

          const res = await fetch('http://localhost:3001/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channel: { name: 'Nike', subscribers, totalViews, videoCount, avgViews },
              videos: enriched,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setAiInsights(data);
          }
        } catch {
          // AI server not running — insights panel will show placeholder
        } finally {
          setAiLoading(false);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#ff0000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Fetching live Nike YouTube data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-400 text-sm">Error: {error}</p>
      </div>
    );
  }

  const stats = channel?.statistics ?? {};
  const subscribers = parseInt(stats.subscriberCount ?? 0);
  const totalViews  = parseInt(stats.viewCount ?? 0);
  const videoCount  = parseInt(stats.videoCount ?? 0);
  const avgViews    = videoCount > 0 ? Math.round(totalViews / videoCount) : 0;

  const chartData = [...videos]
    .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
    .map(v => ({
      name: v.title.length > 28 ? v.title.slice(0, 28) + '…' : v.title,
      views: v.views,
      engRate: v.engRate,
    }));

  const topByViews = [...videos].sort((a, b) => b.views - a.views).slice(0, 6);
  const bestEng = [...videos].sort((a, b) => b.engRate - a.engRate)[0];
  const bestViews = topByViews[0];

  return (
    <main className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Live banner */}
      <div className="flex items-center gap-3 bg-[#ff0000]/10 border border-[#ff0000]/25 rounded-xl px-4 py-3">
        <img src={NIKE_CHANNEL.logo} alt="Nike" className="w-9 h-9 rounded-full" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-100">Nike — YouTube Analytics</p>
          <p className="text-xs text-slate-500">Live data via YouTube Data API · Updated just now</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#ff0000] bg-[#ff0000]/15 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-pulse" />
          LIVE
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={TrendingUp} label="Subscribers"       value={fmt(subscribers)} sub="Public channel"         color="#ff0000" />
        <KPICard icon={Eye}        label="Total Views"        value={fmt(totalViews)}  sub="All-time"               color="#6366f1" />
        <KPICard icon={Film}       label="Videos Published"   value={videoCount}       sub="Since 2006"             color="#f59e0b" />
        <KPICard icon={Zap}        label="Avg Views / Video"  value={fmt(avgViews)}    sub="Across all uploads"     color="#10b981" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Views per recent video */}
        <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Recent Video Views</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last {videos.length} uploads · oldest → newest</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={38} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="views" radius={[5, 5, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={YT_RED} fillOpacity={0.7 + (i / chartData.length) * 0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement rate per video */}
        <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Engagement Rate per Video</h3>
            <p className="text-xs text-slate-500 mt-0.5">(Likes + Comments) ÷ Views × 100</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} width={38} />
                <Tooltip content={<EngTooltip />} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="engRate" radius={[5, 5, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.engRate >= 5 ? '#10b981' : d.engRate >= 2 ? '#f59e0b' : '#6366f1'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top videos table */}
      <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Top Performing Videos</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ranked by views from recent uploads</p>
        </div>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="border-b border-[#1e2130]">
                <th className="text-left text-slate-500 font-medium pb-2.5 pl-1">Video</th>
                <th className="text-right text-slate-500 font-medium pb-2.5 px-3"><Eye size={10} className="inline mr-1" />Views</th>
                <th className="text-right text-slate-500 font-medium pb-2.5 px-3"><ThumbsUp size={10} className="inline mr-1" />Likes</th>
                <th className="text-right text-slate-500 font-medium pb-2.5 px-3"><MessageSquare size={10} className="inline mr-1" />Cmts</th>
                <th className="text-right text-slate-500 font-medium pb-2.5 px-3"><PlayCircle size={10} className="inline mr-1" />Dur.</th>
                <th className="text-right text-slate-500 font-medium pb-2.5 pr-1">Eng.%</th>
              </tr>
            </thead>
            <tbody>
              {topByViews.map((v, i) => (
                <tr key={v.id} className="border-b border-[#1e2130] last:border-0 hover:bg-[#1a1d2e]/50 transition-colors">
                  <td className="py-3 pl-1 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={v.thumbnail} alt="" className="w-16 h-9 rounded-lg object-cover shrink-0 bg-[#2a2d3e]" />
                      <div className="min-w-0">
                        <a
                          href={`https://youtube.com/watch?v=${v.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-200 hover:text-[#ff0000] transition-colors line-clamp-2 leading-tight font-medium"
                        >
                          {v.title}
                        </a>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                          {new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap font-medium">{fmt(v.views)}</td>
                  <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">{fmt(v.likes)}</td>
                  <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">{fmt(v.comments)}</td>
                  <td className="py-3 px-3 text-right text-slate-500 whitespace-nowrap">{v.duration}</td>
                  <td className="py-3 pr-1 text-right whitespace-nowrap">
                    <span className={`font-semibold ${v.engRate >= 5 ? 'text-emerald-400' : v.engRate >= 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {v.engRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
        {/* What's Working */}
        <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">What's Working</p>
            </div>
            <span className="text-[10px] text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full font-medium">✦ AI Generated</span>
          </div>

          {aiLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="p-3 bg-emerald-400/5 border border-emerald-400/15 rounded-xl animate-pulse">
                  <div className="h-3 bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-slate-800 rounded w-full" />
                </div>
              ))}
              <p className="text-[10px] text-slate-500 text-center">Analysing real data with AI...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(aiInsights?.working ?? [
                { title: 'Start the AI server to see insights', detail: 'Run "npm run dev:api" in a second terminal, then reload this page' },
              ]).map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-emerald-400/5 border border-emerald-400/15 rounded-xl">
                  <div className="w-1 rounded-full bg-emerald-400 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Needs Attention */}
        <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Needs Attention</p>
            </div>
            <span className="text-[10px] text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full font-medium">✦ AI Generated</span>
          </div>

          {aiLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="p-3 bg-amber-400/5 border border-amber-400/15 rounded-xl animate-pulse">
                  <div className="h-3 bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-slate-800 rounded w-full" />
                </div>
              ))}
              <p className="text-[10px] text-slate-500 text-center">Analysing real data with AI...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(aiInsights?.attention ?? [
                { title: 'AI insights unavailable', detail: 'Add ANTHROPIC_API_KEY to .env.local and run "npm run dev:api"' },
              ]).map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-amber-400/5 border border-amber-400/15 rounded-xl">
                  <div className="w-1 rounded-full bg-amber-400 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
