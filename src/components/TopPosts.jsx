import { useState } from 'react';
import { PLATFORMS, fmt } from '../data/mockData';
import { ArrowUpDown, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

const SORT_OPTIONS = [
  { key: 'engRate', label: 'Eng. Rate' },
  { key: 'reach',   label: 'Reach'     },
  { key: 'likes',   label: 'Likes'     },
];

const platformBadge = (pk) => {
  const p = PLATFORMS[pk];
  if (!p) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: p.color + '22', color: p.color }}
    >
      {p.name.split(' ')[0]}
    </span>
  );
};

const typeBadge = (type) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2a2d3e] text-slate-400">
    {type}
  </span>
);

export default function TopPosts({ company }) {
  const [sortBy, setSortBy] = useState('engRate');

  const sorted = [...company.topPosts].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="bg-[#13151f] border border-[#1e2130] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Top Performing Posts</h3>
          <p className="text-xs text-slate-500 mt-0.5">Best content from the past 30 days</p>
        </div>
        <div className="flex items-center gap-1 bg-[#1a1d2e] rounded-lg p-1">
          <ArrowUpDown size={12} className="text-slate-500 mx-1" />
          {SORT_OPTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                sortBy === s.key ? 'bg-[#2a2d3e] text-slate-200' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="border-b border-[#1e2130]">
              <th className="text-left text-slate-500 font-medium pb-2.5 pl-1 w-full">Content</th>
              <th className="text-right text-slate-500 font-medium pb-2.5 px-3 whitespace-nowrap"><Eye size={11} className="inline mr-1" />Reach</th>
              <th className="text-right text-slate-500 font-medium pb-2.5 px-3 whitespace-nowrap"><Heart size={11} className="inline mr-1" />Likes</th>
              <th className="text-right text-slate-500 font-medium pb-2.5 px-3 whitespace-nowrap"><MessageCircle size={11} className="inline mr-1" />Cmts</th>
              <th className="text-right text-slate-500 font-medium pb-2.5 px-3 whitespace-nowrap"><Share2 size={11} className="inline mr-1" />Shares</th>
              <th className="text-right text-slate-500 font-medium pb-2.5 pr-1 whitespace-nowrap">Eng.%</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((post, i) => (
              <tr key={post.id} className="border-b border-[#1e2130] last:border-0 hover:bg-[#1a1d2e]/50 transition-colors">
                <td className="py-3 pl-1 pr-4">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2a2d3e] flex items-center justify-center text-xs font-bold text-slate-400 shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-200 leading-tight line-clamp-1 mb-1">{post.content}</p>
                      <div className="flex items-center gap-1.5">
                        {platformBadge(post.platform)}
                        {typeBadge(post.type)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">{fmt(post.reach)}</td>
                <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">{fmt(post.likes)}</td>
                <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">{fmt(post.comments)}</td>
                <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">{fmt(post.shares)}</td>
                <td className="py-3 pr-1 text-right whitespace-nowrap">
                  <span className={`font-semibold ${post.engRate >= 10 ? 'text-emerald-400' : post.engRate >= 5 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {post.engRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
