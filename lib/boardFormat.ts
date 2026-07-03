// 커뮤니티 게시판 표시용 포맷 헬퍼 (서버·클라 공용)

export const BOARD_CATEGORIES = [
  { key: 'chat', label: '잡담' },
  { key: 'humor', label: '유머' },
  { key: 'news', label: '뉴스/기사' },
  { key: 'info', label: '정보/질문' },
] as const;

export type BoardCategory = (typeof BOARD_CATEGORIES)[number]['key'];

export const BOARD_CATEGORY_KEYS = BOARD_CATEGORIES.map(c => c.key) as string[];

export function categoryLabel(key: string | null): string {
  return BOARD_CATEGORIES.find(c => c.key === key)?.label ?? '잡담';
}


export function firstChar(nick: string): string {
  return (nick.trim()[0] ?? '?').toUpperCase();
}

export function avatarColor(nick: string): string {
  let h = 0;
  for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) % 360;
  return `hsl(${h}, 55%, 55%)`;
}

export function formatRelative(iso: string): string {
  const now = new Date();
  const t = new Date(iso);
  const diff = Math.floor((now.getTime() - t.getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, '0')}.${String(t.getDate()).padStart(2, '0')}`;
}
