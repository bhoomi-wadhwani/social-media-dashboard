import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';

// Load .env.local manually
const envFile = readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

const API_KEY = env.GEMINI_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/insights', async (req, res) => {
  if (!API_KEY || API_KEY === 'PASTE_YOUR_KEY_HERE') {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in .env.local' });
  }

  const { channel, videos } = req.body;
  const ai = new GoogleGenAI({ apiKey: API_KEY });

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
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response.text ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in response');
    const parsed = JSON.parse(match[0]);
    res.json(parsed);
  } catch (e) {
    console.error('AI insight error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (_, res) => res.json({ ok: true }));

const PORT = 3001;
app.listen(PORT, () => console.log(`\n✓ AI insights server running at http://localhost:${PORT}\n`));
