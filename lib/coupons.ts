// server-only: fs 사용. data/coupons.json 을 읽어 게임별 쿠폰(기프트코드)을 제공.
// 데이터는 리서처 에이전트가 유지(실제 유효 코드만, 만료 관리). 파일 없거나 비면 조용히 빈 값.
import path from 'path';
import { promises as fs } from 'fs';

export interface Coupon {
  code: string;              // 쿠폰/기프트 코드
  reward: string;            // 보상 설명
  expires?: string | null;   // 'YYYY-MM-DD' 만료일(있으면). 지나면 자동 숨김
  added?: string;            // 'YYYY-MM-DD' 등록일
}

interface CouponData {
  coupons: Record<string, Coupon[]>;
  last_updated?: string;
}

async function read(): Promise<CouponData> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'coupons.json'), 'utf-8');
    const d = JSON.parse(raw);
    return { coupons: d.coupons ?? {}, last_updated: d.last_updated };
  } catch {
    return { coupons: {} };
  }
}

let cached: Promise<CouponData> | null = null;
function getData(): Promise<CouponData> {
  if (!cached) cached = read();
  return cached;
}

// KST(UTC+9) 오늘
function kstToday(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}
function isActive(c: Coupon, today: string): boolean {
  return !c.expires || c.expires >= today;
}

// 특정 게임의 유효(미만료) 쿠폰
export async function getCouponsForGame(id: string): Promise<Coupon[]> {
  const { coupons } = await getData();
  const today = kstToday();
  return (coupons[id] ?? []).filter(c => isActive(c, today));
}

// 유효 쿠폰이 하나라도 있는 게임 id 목록
export async function getGameIdsWithCoupons(): Promise<string[]> {
  const { coupons } = await getData();
  const today = kstToday();
  return Object.keys(coupons).filter(id => (coupons[id] ?? []).some(c => isActive(c, today)));
}

// 허브용: 유효 쿠폰이 있는 게임 → 쿠폰 배열 맵
export async function getAllActiveCoupons(): Promise<Record<string, Coupon[]>> {
  const { coupons } = await getData();
  const today = kstToday();
  const out: Record<string, Coupon[]> = {};
  for (const [id, list] of Object.entries(coupons)) {
    const active = (list ?? []).filter(c => isActive(c, today));
    if (active.length) out[id] = active;
  }
  return out;
}

export async function getCouponsLastUpdated(): Promise<string | undefined> {
  return (await getData()).last_updated;
}
