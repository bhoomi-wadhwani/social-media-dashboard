// Deterministic seeded pseudo-random (returns 0–1)
const r = (seed) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const PLATFORMS = {
  instagram: { key: 'instagram', name: 'Instagram',  color: '#E1306C' },
  twitter:   { key: 'twitter',   name: 'Twitter / X', color: '#1d9bf0' },
  linkedin:  { key: 'linkedin',  name: 'LinkedIn',   color: '#0a66c2' },
  facebook:  { key: 'facebook',  name: 'Facebook',   color: '#1877f2' },
  tiktok:    { key: 'tiktok',    name: 'TikTok',     color: '#ff0050' },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

// Last 30 days date labels
export const dates = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const genEngagement = (base, c, p) =>
  dates.map((_, i) => {
    const trend = 1 + (i / 30) * 0.18;
    const noise = 0.75 + r(c * 1000 + p * 100 + i) * 0.5;
    return Math.round(base * trend * noise);
  });

const genGrowth = (start, end, c, p) =>
  dates.map((_, i) => {
    const progress = i / 29;
    const base = start + (end - start) * progress;
    return Math.round(base * (1 + (r(c * 2000 + p * 200 + i) - 0.5) * 0.015));
  });

export const companies = [
  {
    id: 'techcorp',
    name: 'TechCorp Inc',
    industry: 'Technology',
    tagColor: 'text-indigo-400 bg-indigo-400/10',
    deltas: { followers: 4.2, reach: 11.3, impressions: 8.7, engagement: 0.3, posts: -2 },
    stats: {
      instagram: { followers: 45200,  posts: 324,  engagementRate: 3.2, reach: 312000,   impressions: 890000  },
      twitter:   { followers: 128500, posts: 4521, engagementRate: 1.8, reach: 890000,   impressions: 2100000 },
      linkedin:  { followers: 89300,  posts: 892,  engagementRate: 4.1, reach: 445000,   impressions: 1200000 },
      facebook:  { followers: 34100,  posts: 1243, engagementRate: 2.1, reach: 198000,   impressions: 520000  },
      tiktok:    { followers: 12400,  posts: 87,   engagementRate: 8.9, reach: 156000,   impressions: 780000  },
    },
    engagementData: {
      instagram: genEngagement(1450, 0, 0),
      twitter:   genEngagement(2310, 0, 1),
      linkedin:  genEngagement(3660, 0, 2),
      facebook:  genEngagement(716,  0, 3),
      tiktok:    genEngagement(1103, 0, 4),
    },
    followerGrowth: {
      instagram: genGrowth(42000,  45200,  0, 0),
      twitter:   genGrowth(122000, 128500, 0, 1),
      linkedin:  genGrowth(84000,  89300,  0, 2),
      facebook:  genGrowth(32000,  34100,  0, 3),
      tiktok:    genGrowth(9800,   12400,  0, 4),
    },
    contentMix: [
      { type: 'Reels / Video', count: 42,  engRate: 9.1,  color: '#6366f1' },
      { type: 'Carousels',     count: 28,  engRate: 6.3,  color: '#8b5cf6' },
      { type: 'Photos',        count: 89,  engRate: 3.8,  color: '#a855f7' },
      { type: 'Stories',       count: 156, engRate: 2.1,  color: '#d946ef' },
      { type: 'Text Posts',    count: 34,  engRate: 1.9,  color: '#ec4899' },
    ],
    topPosts: [
      { id: 1, platform: 'instagram', type: 'Reel',    content: 'Behind the scenes: Building our AI pipeline 🤖',            reach: 28400,  likes: 2341, comments: 189,  shares: 423,  engRate: 10.4 },
      { id: 2, platform: 'linkedin',  type: 'Article', content: 'The future of enterprise software: 5 trends to watch',      reach: 45200,  likes: 1893, comments: 312,  shares: 891,  engRate: 6.8  },
      { id: 3, platform: 'twitter',   type: 'Thread',  content: 'Thread: Everything wrong with cloud costs (and how to fix)', reach: 89300,  likes: 4521, comments: 678,  shares: 2341, engRate: 8.4  },
      { id: 4, platform: 'tiktok',    type: 'Video',   content: 'Tech myth: Does more RAM always = faster computer?',         reach: 34100,  likes: 8923, comments: 1204, shares: 3421, engRate: 39.8 },
      { id: 5, platform: 'instagram', type: 'Carousel','content': '10 VS Code shortcuts that will 10x your productivity',    reach: 19800,  likes: 1567, comments: 98,   shares: 234,  engRate: 9.6  },
      { id: 6, platform: 'facebook',  type: 'Video',   content: 'Live Q&A recap: Ask us anything about cloud migration',     reach: 12400,  likes: 423,  comments: 89,   shares: 67,   engRate: 4.7  },
    ],
    insights: {
      working: [
        { title: 'Video content dominates', detail: 'Reels & TikToks get 3.1× more engagement than static posts' },
        { title: 'LinkedIn articles drive reach', detail: 'Long-form content gets 2.4× more reach vs. short updates' },
        { title: '9am Tue/Wed posts peak', detail: 'Tuesday & Wednesday mornings see 67% higher engagement rate' },
      ],
      attention: [
        { title: 'Facebook reach declining', detail: 'Organic reach dropped 18% this month — consider a boost strategy' },
        { title: 'Story views have plateaued', detail: 'Story engagement stagnant for 3 weeks — try a new format' },
        { title: 'Comment response is slow', detail: 'Avg. reply time 4.2 h — target under 1 h for better retention' },
      ],
    },
  },
  {
    id: 'retailbrand',
    name: 'RetailBrand Co',
    industry: 'Retail & E-commerce',
    tagColor: 'text-amber-400 bg-amber-400/10',
    deltas: { followers: 7.8, reach: 22.1, impressions: 18.4, engagement: 1.1, posts: 12 },
    stats: {
      instagram: { followers: 234500, posts: 1891, engagementRate: 4.8, reach: 1200000, impressions: 4500000 },
      twitter:   { followers: 45200,  posts: 2341, engagementRate: 1.2, reach: 234000,  impressions: 680000  },
      linkedin:  { followers: 23100,  posts: 341,  engagementRate: 2.9, reach: 89000,   impressions: 234000  },
      facebook:  { followers: 189300, posts: 3421, engagementRate: 3.4, reach: 890000,  impressions: 2800000 },
      tiktok:    { followers: 89200,  posts: 312,  engagementRate: 12.3,reach: 1400000, impressions: 8900000 },
    },
    engagementData: {
      instagram: genEngagement(11256, 1, 0),
      twitter:   genEngagement(542,   1, 1),
      linkedin:  genEngagement(670,   1, 2),
      facebook:  genEngagement(6436,  1, 3),
      tiktok:    genEngagement(10971, 1, 4),
    },
    followerGrowth: {
      instagram: genGrowth(218000, 234500, 1, 0),
      twitter:   genGrowth(43000,  45200,  1, 1),
      linkedin:  genGrowth(21000,  23100,  1, 2),
      facebook:  genGrowth(181000, 189300, 1, 3),
      tiktok:    genGrowth(71000,  89200,  1, 4),
    },
    contentMix: [
      { type: 'Reels / Video', count: 89,  engRate: 14.2, color: '#f59e0b' },
      { type: 'Photos',        count: 234, engRate: 5.8,  color: '#f97316' },
      { type: 'Carousels',     count: 67,  engRate: 8.9,  color: '#ef4444' },
      { type: 'Stories',       count: 891, engRate: 3.2,  color: '#ec4899' },
      { type: 'UGC Reposts',   count: 45,  engRate: 6.1,  color: '#8b5cf6' },
    ],
    topPosts: [
      { id: 1, platform: 'tiktok',    type: 'Video',   content: 'GRWM: Styling our new summer collection ☀️ #fashion',  reach: 234000, likes: 45231, comments: 3421, shares: 12341, engRate: 26.1 },
      { id: 2, platform: 'instagram', type: 'Reel',    content: 'New arrivals just dropped 🔥 Swipe to shop the look', reach: 89200,  likes: 12341, comments: 892,  shares: 2341,  engRate: 17.4 },
      { id: 3, platform: 'facebook',  type: 'Video',   content: 'Flash sale: 50% off everything for 24 hours only!',  reach: 67800,  likes: 3421,  comments: 1892, shares: 4521,  engRate: 14.5 },
      { id: 4, platform: 'instagram', type: 'Carousel','content': '5 ways to style our best-selling denim jacket',    reach: 45600,  likes: 6782,  comments: 423,  shares: 1204,  engRate: 18.4 },
      { id: 5, platform: 'tiktok',    type: 'Video',   content: 'Honest review: Customers try the new collection',    reach: 156000, likes: 28900, comments: 2341, shares: 8923,  engRate: 25.7 },
      { id: 6, platform: 'instagram', type: 'UGC',     content: 'Our fave customer look this week 💕 @username',      reach: 23400,  likes: 4521,  comments: 234,  shares: 892,   engRate: 24.1 },
    ],
    insights: {
      working: [
        { title: 'TikTok is your #1 growth engine', detail: 'TikTok drove 68% of new followers this month across all platforms' },
        { title: 'UGC outperforms branded content', detail: 'Customer reposts get 41% more engagement than studio shoots' },
        { title: 'Flash sale posts go viral', detail: 'Limited-time offer posts are shared 3× more than regular content' },
      ],
      attention: [
        { title: 'Twitter nearly inactive', detail: 'Only 12 posts this month — platform going stale' },
        { title: 'LinkedIn severely underused', detail: 'B2B audience potential untapped — only 341 total posts ever' },
        { title: '77% of comments unanswered', detail: 'Low response rate is a brand risk — build a reply workflow' },
      ],
    },
  },
  {
    id: 'startupx',
    name: 'StartupX',
    industry: 'SaaS / AI',
    tagColor: 'text-emerald-400 bg-emerald-400/10',
    deltas: { followers: 12.4, reach: 31.7, impressions: 28.9, engagement: 2.1, posts: 8 },
    stats: {
      instagram: { followers: 8900,  posts: 89,   engagementRate: 5.1, reach: 45000,  impressions: 134000 },
      twitter:   { followers: 34200, posts: 1892, engagementRate: 3.9, reach: 234000, impressions: 780000 },
      linkedin:  { followers: 28900, posts: 423,  engagementRate: 6.8, reach: 189000, impressions: 560000 },
      facebook:  { followers: 5600,  posts: 234,  engagementRate: 1.4, reach: 23000,  impressions: 67000  },
      tiktok:    { followers: 4200,  posts: 34,   engagementRate: 11.2,reach: 89000,  impressions: 456000 },
    },
    engagementData: {
      instagram: genEngagement(454,  2, 0),
      twitter:   genEngagement(1334, 2, 1),
      linkedin:  genEngagement(1966, 2, 2),
      facebook:  genEngagement(78,   2, 3),
      tiktok:    genEngagement(470,  2, 4),
    },
    followerGrowth: {
      instagram: genGrowth(7200,  8900,  2, 0),
      twitter:   genGrowth(28000, 34200, 2, 1),
      linkedin:  genGrowth(23000, 28900, 2, 2),
      facebook:  genGrowth(5200,  5600,  2, 3),
      tiktok:    genGrowth(2800,  4200,  2, 4),
    },
    contentMix: [
      { type: 'Threads / Posts', count: 892, engRate: 4.2,  color: '#10b981' },
      { type: 'Articles',        count: 67,  engRate: 8.9,  color: '#0ea5e9' },
      { type: 'Product Demos',   count: 23,  engRate: 12.1, color: '#6366f1' },
      { type: 'Reels / Video',   count: 34,  engRate: 11.3, color: '#8b5cf6' },
      { type: 'Infographics',    count: 45,  engRate: 6.7,  color: '#f59e0b' },
    ],
    topPosts: [
      { id: 1, platform: 'linkedin', type: 'Article', content: 'How we got our first 1,000 customers with $0 ad spend',        reach: 89200,  likes: 4521, comments: 892,  shares: 2341, engRate: 8.7  },
      { id: 2, platform: 'twitter',  type: 'Thread',  content: 'Thread: We analyzed 1M AI prompts. Here\'s what we found 🧵',  reach: 45600,  likes: 8923, comments: 1204, shares: 4521, engRate: 32.3 },
      { id: 3, platform: 'tiktok',   type: 'Video',   content: 'AI tool that does your entire morning routine 😂 #productivity', reach: 34500, likes: 7823, comments: 892,  shares: 2341, engRate: 32.3 },
      { id: 4, platform: 'linkedin', type: 'Post',    content: 'We just raised our Series A 🎉 Here\'s the story...',           reach: 156000, likes: 6782, comments: 2341, shares: 3421, engRate: 8.1  },
      { id: 5, platform: 'twitter',  type: 'Post',    content: 'The problem with most productivity apps: they require willpower.', reach: 23400, likes: 3421, comments: 423, shares: 1892, engRate: 24.5 },
      { id: 6, platform: 'instagram','type': 'Reel',  content: 'Day in the life of an AI startup founder 📱⚡',                reach: 12400,  likes: 892,  comments: 67,   shares: 134,  engRate: 8.8  },
    ],
    insights: {
      working: [
        { title: 'Twitter threads going viral', detail: 'Educational threads avg. 24.5% engagement — your top format' },
        { title: 'LinkedIn drives qualified leads', detail: 'Professional posts drive 4.2× more leads vs. other platforms' },
        { title: 'Founder-led content wins', detail: 'Posts featuring the founder get 3.1× more shares' },
      ],
      attention: [
        { title: 'Facebook essentially inactive', detail: 'Engagement critically low — consider abandoning or automating' },
        { title: 'Instagram inconsistent', detail: 'Only 3 posts this month — algorithm is deprioritising the account' },
        { title: 'No video on LinkedIn', detail: 'LinkedIn video gets 5× more reach — a big untapped opportunity' },
      ],
    },
  },
];

export const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};
