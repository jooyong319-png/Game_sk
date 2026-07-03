// 자유게시판 서버 공용 유틸 — 해시(pepper)·IP·필터. 게시글/댓글 API가 함께 사용.
import { createHash } from 'crypto';

const PEPPER = process.env.BOARD_SECRET || 'gcalen-board-pepper-v1';
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
export const hashPw = (pw: string) => sha(`pw:${pw}:${PEPPER}`);
export const hashIp = (ip: string) => sha(`ip:${ip}:${PEPPER}`);

// 익명 게시판이라 외부 링크는 통째로 금지(스팸 도배 차단). 대표 금지어도 컷.
export const LINK_RE = /(https?:\/\/|www\.[a-z0-9-]+\.|[a-z0-9-]+\.(?:com|net|org|io|xyz|top|shop|kr|co|biz|info)\b)/i;
export const BANNED = ['씨발', '시발', 'ㅅㅂ', '병신', '좆같', '섹스', '카지노', '토토', '바카라', '비아그라', '대출', '먹튀', '홀덤'];

export function getIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// 표시용 마스킹 IP — 앞 2블록만(예: 121.130 / ipv6 2401:e180). 전체 IP는 저장 안 함.
export function ipPrefix(ip: string): string {
  if (ip === 'unknown') return '';
  if (ip.includes(':')) return ip.split(':').slice(0, 2).join(':');
  const p = ip.split('.');
  return p.length >= 2 ? `${p[0]}.${p[1]}` : '';
}

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}
