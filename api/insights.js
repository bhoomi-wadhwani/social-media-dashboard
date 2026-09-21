import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { channel, videos } = req.body;
  const ai = new GoogleGenAI({ apiKey });

  const videoList = videos
    .map((v, i) =>
      `${i + 1}. "${v.title}" — Views: ${v.views.toLocaleString()} | Likes: ${v.likes.toLocaleString()} | Comments: ${v.comments.toLocaleString()} | Eng: ${v.engRate}% | Duration: ${v.duration}`
    )
    .join('\n');

  const prompt = `You are a senior social media strategist. Analyze this real YouTube channel data and generate sharp, data-driven insights.

CHANNEL: ${channel.name}
Subscribers: ${Number(channel.subscribers).toLocaleString()}
Total All-Time Views: ${Number(channel.totalViews).toLocaleString()}
Total Videos: ${channel.videoCount}
Avg Views per Video: ${Number(channel.avgViews).toLocaleString()}

RECENT ${videos.length} VIDEOS (newest to oldest):
${videoList}

Generate exactly:
- 3 "What's Working" insights: things performing well, citing specific numbers from the data
- 3 "Needs Attention" insights: real problems or missed opportunities, citing specific numbers

Rules:
- Every insight MUST reference a specific number from the data
- Title: max 7 words, punchy and direct
- Detail: max 22 words, must include a stat or percentage

Return ONLY valid JSON, no markdown, no extra text:
{"working":[{"title":"string","detail":"string"},{"title":"string","detail":"string"},{"title":"string","detail":"string"}],"attention":[{"title":"string","detail":"string"},{"title":"string","detail":"string"},{"title":"string","detail":"string"}]}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in response');
    const parsed = JSON.parse(match[0]);
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
