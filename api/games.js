// Vercel Serverless Function - /api/games
// RAWG API 프록시. API 키를 서버 측에서만 사용.

export default async function handler(req, res) {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RAWG_API_KEY가 설정되지 않았습니다' });
  }

  const platform = req.query.platform || '';
  const days = Math.min(parseInt(req.query.days || '30', 10), 365);

  // 오늘부터 N일 후까지의 날짜 범위
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + days);
  const dateRange = `${formatDate(today)},${formatDate(future)}`;

  const params = new URLSearchParams({
    key: apiKey,
    dates: dateRange,
    ordering: 'released',
    page_size: '40',
  });
  if (platform) params.set('platforms', platform);

  try {
    const rawgRes = await fetch(`https://api.rawg.io/api/games?${params.toString()}`);
    if (!rawgRes.ok) {
      return res.status(502).json({ error: `RAWG API 응답 오류: ${rawgRes.status}` });
    }
    const data = await rawgRes.json();

    // 캐싱 (5분)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
