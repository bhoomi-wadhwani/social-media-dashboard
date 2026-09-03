const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE = 'https://www.googleapis.com/youtube/v3';

export const NIKE_CHANNEL = {
  id: import.meta.env.VITE_NIKE_CHANNEL_ID,
  name: 'Nike',
  handle: '@nike',
  logo: 'https://yt3.ggpht.com/dH3iizKWU0_ARwvja6SLytlC-pjB3sJyPjNTeVTV5DUoY6VNorOJDPaykjs_VR450hKgkJ1AsQ=s240-c-k-c0x00ffffff-no-rj',
};

export async function fetchChannelStats(channelId) {
  const res = await fetch(`${BASE}/channels?part=statistics,snippet&id=${channelId}&key=${API_KEY}`);
  const data = await res.json();
  return data.items?.[0] ?? null;
}

export async function fetchRecentVideos(channelId, maxResults = 20) {
  const res = await fetch(`${BASE}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`);
  const data = await res.json();
  return data.items ?? [];
}

export async function fetchVideoStats(videoIds) {
  const ids = videoIds.join(',');
  const res = await fetch(`${BASE}/videos?part=statistics,contentDetails&id=${ids}&key=${API_KEY}`);
  const data = await res.json();
  return data.items ?? [];
}

export function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(m?.[1] ?? 0);
  const min = parseInt(m?.[2] ?? 0);
  const s = parseInt(m?.[3] ?? 0);
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${min}:${String(s).padStart(2, '0')}`;
}
