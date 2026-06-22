const webpush = require('web-push');

const SUPA = 'https://celnyjkunzmxvjjxqoel.supabase.co';
const KEY = 'sb_publishable_IPQiEc05JWTnU4B_jfRgzg_OeO314jx';

webpush.setVapidDetails(
  'mailto:jooyco319@gmail.com',
  'BCXLBtU0zdL2tWw5yNXd3Ge0tfUvR10GTzbLpwi2mpXs7belTbaHDgkv8CA-TrfUB_SGR4toANPWHBfWJuZPJe0',
  'itdFMt_mYzKifogXgRTHglspzovolWyck7SIPF3ozFw',
);

(async () => {
  const res = await fetch(`${SUPA}/rest/v1/push_subscriptions?select=endpoint,p256dh,auth`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const subs = await res.json();
  const payload = JSON.stringify({
    title: '테스트 알림 🔔',
    body: '게임 출시 캘린더 푸시가 정상 작동해요!',
    url: '/wishlist',
  });
  let sent = 0;
  for (const s of subs) {
    if (!String(s.endpoint).startsWith('http')) continue; // 테스트행 스킵
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload,
        { TTL: 3600, urgency: 'high' },
      );
      sent++;
      console.log('SENT ->', s.endpoint.slice(0, 60));
    } catch (e) {
      console.log('FAIL', e.statusCode, (e.body || '').slice(0, 120));
      if (e.statusCode === 404 || e.statusCode === 410) {
        // 만료 구독 정리
        await fetch(`${SUPA}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(s.endpoint)}`, {
          method: 'DELETE',
          headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
        });
        console.log('  (만료 → 삭제)');
      }
    }
  }
  console.log('총 발송:', sent);
})();
