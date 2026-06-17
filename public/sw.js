// 게임 출시 캘린더 서비스워커 — PWA 설치/오프라인 폴백용.
// 콘텐츠는 매일 갱신되므로 '네트워크 우선'. 오프라인일 때만 캐시된 홈 → 전용 오프라인 페이지 순으로 폴백.
const CACHE = 'gcalen-v2';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(['/', OFFLINE_URL]).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // 페이지 이동(navigation)만 처리: 네트워크 우선, 실패 시 캐시된 홈 → 오프라인 페이지.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match('/').then((home) => home || caches.match(OFFLINE_URL))
      )
    );
  }
});
