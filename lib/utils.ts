// 서버/클라이언트 양쪽에서 안전한 순수 헬퍼 (fs 의존 없음)

// D-day 계산
export function calcDayDiff(release_date: string, now: Date = new Date()): number {
  const r = new Date(release_date);
  r.setHours(0, 0, 0, 0);
  const t = new Date(now);
  t.setHours(0, 0, 0, 0);
  return Math.ceil((r.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
}

// 표시용 날짜 포맷 ('2026년 6월 18일')
export function formatKoreanDate(release_date: string): string {
  const d = new Date(release_date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 짧은 포맷 ('2026.06.18')
export function formatShortDate(release_date: string): string {
  const d = new Date(release_date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 요일 (한글)
export function getKoreanWeekday(release_date: string): string {
  const d = new Date(release_date);
  return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
}
