// server-only: fs 사용. data/coupons.json 을 읽어 게임별 쿠폰(기프트코드/리딤코드)을 제공.
// 데이터는 리서처 에이전트가 유지(실제 유효 코드만, 만료 관리). 파일 없거나 비면 조용히 빈 값.
//
// ⚠️ 구조(schema v2): 쿠폰은 games.json과 '독립'적이다. 라이브 서비스 게임(원신·스타레일 등)은
// 출시 캘린더(games.json)에 없어도 여기에 자유롭게 등록한다. 각 항목이 게임명·이미지·용어를
// 자체 보유하고, 캘린더에 대응 엔트리가 있으면 game_id로 연결해 상호링크한다.
import path from 'path';
import { promises as fs } from 'fs';

export interface Coupon {
  code: string;              // 쿠폰/기프트/리딤 코드
  reward: string;            // 보상 설명
  expires?: string | null;   // 'YYYY-MM-DD' 만료일(있으면). 지나면 '만료됨' 처리
  added?: string;            // 'YYYY-MM-DD' 등록일
}

// coupons.json 의 게임 1개 항목(자체 완결형)
export interface CouponGame {
  name_ko: string;
  name_en?: string | null;
  image_url?: string | null;
  game_id?: string | null;   // 대응하는 games.json id(있으면). 상세 상호링크·게임 상세 노출용
  term?: '리딤코드' | '쿠폰'; // 주 용어 강제(없으면 이름으로 자동 판별)
  codes: Coupon[];
}

interface CouponData {
  games: Record<string, CouponGame>;
  last_updated?: string;
}

// v1(구 스키마: coupons[게임id] = 코드배열)도 읽어들이도록 얇은 호환 변환.
function normalize(d: any): CouponData {
  if (d && d.games && typeof d.games === 'object') {
    return { games: d.games as Record<string, CouponGame>, last_updated: d.last_updated };
  }
  if (d && d.coupons && typeof d.coupons === 'object') {
    const games: Record<string, CouponGame> = {};
    for (const [id, codes] of Object.entries(d.coupons)) {
      games[id] = { name_ko: id, game_id: id, codes: (codes as Coupon[]) ?? [] };
    }
    return { games, last_updated: d.last_updated };
  }
  return { games: {} };
}

async function read(): Promise<CouponData> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'coupons.json'), 'utf-8');
    return normalize(JSON.parse(raw));
  } catch {
    return { games: {} };
  }
}

let cached: Promise<CouponData> | null = null;
function getData(): Promise<CouponData> {
  if (!cached) cached = read();
  return cached;
}

// ─────────────────────────────────────────────────────────────────────────────
// 표기 헬퍼 (게임명 정리 · 주요 용어 · SEO 키워드)
// ─────────────────────────────────────────────────────────────────────────────

// 쿠폰 표기용 기본 게임명 — 이름이 "원신 6.7 'Luna VIII' 업데이트"처럼 길면
// 업데이트/시즌/패치 '마커가 있을 때만' 버전·꼬리표를 떼어 기본 게임명("원신")으로 정리.
// (마커 없는 정식 시퀄명 "파이널 판타지 7 리버스" 등은 절대 건드리지 않음.)
const COUPON_NAME_MARK = /(대형\s*)?(업데이트|패치|시즌|버전)/;
export function couponDisplayName(nameKo: string): string {
  if (!COUPON_NAME_MARK.test(nameKo)) return nameKo;
  const tokens = nameKo.split(/\s+/);
  let cut = tokens.length;
  tokens.forEach((t, i) => {
    if (i < cut && (/^v?\d+(\.\d+)?$/i.test(t) || COUPON_NAME_MARK.test(t))) cut = i;
  });
  const base = tokens.slice(0, Math.max(cut, 1)).join(' ').trim();
  return base || nameKo;
}

// 게임별 '쿠폰'을 부르는 주요 용어. 호요버스류(원신·붕괴·스타레일·젠레스)는 유저가
// '쿠폰'보다 '리딤코드'로 훨씬 많이 검색 → SEO상 주 키워드. 그 외는 '쿠폰'.
const REDEEM_CODE_GAMES = /원신|붕괴|스타\s*레일|스타레일|젠레스|genshin|honkai|star\s*rail|zenless/i;
export function couponTerm(nameKo: string, nameEn?: string | null): '리딤코드' | '쿠폰' {
  return REDEEM_CODE_GAMES.test(`${nameKo} ${nameEn ?? ''}`) ? '리딤코드' : '쿠폰';
}

// SEO 키워드: "게임명 + (리딤코드/쿠폰/쿠폰번호/기프트코드)" 변형(콜론·첫 단어 표기까지 커버).
// 리딤코드 게임은 리딤코드를 앞세우되, 어느 쪽이든 쿠폰·기프트코드 변형을 함께 포함해 전부 커버.
export function couponKeywords(nameKo: string, nameEn?: string | null): string[] {
  const base = couponDisplayName(nameKo);
  const noColon = base.replace(/[:：]/g, '').replace(/\s+/g, ' ').trim();
  const first = base.split(/[:：\s]/).filter(Boolean)[0];
  const names = Array.from(new Set([base, noColon, first].filter(Boolean)));
  const nouns = couponTerm(nameKo, nameEn) === '리딤코드'
    ? ['리딤코드', '리딤 코드', '쿠폰', '쿠폰번호', '기프트코드']
    : ['쿠폰', '쿠폰번호', '기프트코드', '쿠폰코드'];
  const out: string[] = [];
  for (const n of names) for (const noun of nouns) out.push(`${n} ${noun}`);
  return Array.from(new Set(out));
}

// ─────────────────────────────────────────────────────────────────────────────
// 유효/만료 판정
// ─────────────────────────────────────────────────────────────────────────────

// KST(UTC+9) 오늘
function kstToday(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}
function isActive(c: Coupon, today: string): boolean {
  return !c.expires || c.expires >= today;
}
// 유효/만료(최근 windowDays 이내) 분리. 만료도 노출하되 '만료됨' 표시(콘텐츠·SEO 유지).
function split(codes: Coupon[], expiredWindowDays: number): { active: Coupon[]; expired: Coupon[] } {
  const today = kstToday();
  const cutoff = new Date(Date.now() + 9 * 3600 * 1000 - expiredWindowDays * 86400 * 1000)
    .toISOString()
    .slice(0, 10);
  const active: Coupon[] = [];
  const expired: Coupon[] = [];
  for (const c of codes ?? []) {
    if (isActive(c, today)) active.push(c);
    else if (c.expires && c.expires >= cutoff) expired.push(c);
  }
  expired.sort((a, b) => (b.expires ?? '').localeCompare(a.expires ?? ''));
  return { active, expired };
}

// ─────────────────────────────────────────────────────────────────────────────
// 조회 API — 전부 coupons.json '키' 기준(games.json id 아님)
// ─────────────────────────────────────────────────────────────────────────────

// 화면 표기용으로 정리된 쿠폰 게임 뷰
export interface CouponGameView {
  key: string;               // coupons.json 키 = URL 슬러그(/coupons/{key})
  name: string;              // 정리된 표기 게임명
  term: '리딤코드' | '쿠폰';
  image_url: string | null;
  game_id: string | null;    // 연결된 games.json id(있으면)
  active: Coupon[];
  expired: Coupon[];
}

function toView(key: string, g: CouponGame, expiredWindowDays: number): CouponGameView {
  const { active, expired } = split(g.codes, expiredWindowDays);
  return {
    key,
    name: couponDisplayName(g.name_ko),
    term: g.term ?? couponTerm(g.name_ko, g.name_en),
    image_url: g.image_url ?? null,
    game_id: g.game_id ?? null,
    active,
    expired,
  };
}

// 쿠폰 상세(/coupons/[key])용: 키로 1개 조회. 없으면 null.
export async function getCouponGame(key: string, expiredWindowDays = 90): Promise<CouponGameView | null> {
  const { games } = await getData();
  const g = games[key];
  return g ? toView(key, g, expiredWindowDays) : null;
}

// 게임 상세(/game/[id])용: games.json id로 역조회(연결된 쿠폰 게임 찾기). 없으면 null.
export async function getCouponsByGameId(gameId: string, expiredWindowDays = 90): Promise<CouponGameView | null> {
  const { games } = await getData();
  for (const [key, g] of Object.entries(games)) {
    if (g.game_id === gameId) return toView(key, g, expiredWindowDays);
  }
  return null;
}

// 허브(/coupons)용: 유효 코드가 있는 게임 뷰 목록(유효 개수 내림차순).
export async function getActiveCouponGames(): Promise<CouponGameView[]> {
  const { games } = await getData();
  return Object.entries(games)
    .map(([key, g]) => toView(key, g, 90))
    .filter(v => v.active.length > 0)
    .sort((a, b) => b.active.length - a.active.length);
}

// 전용 페이지 정적 경로 · sitemap 용: 유효 또는 최근 만료 코드가 있는 키 목록.
export async function getCouponPageKeys(expiredWindowDays = 90): Promise<string[]> {
  const { games } = await getData();
  return Object.entries(games)
    .filter(([, g]) => {
      const { active, expired } = split(g.codes, expiredWindowDays);
      return active.length > 0 || expired.length > 0;
    })
    .map(([key]) => key);
}

export async function getCouponsLastUpdated(): Promise<string | undefined> {
  return (await getData()).last_updated;
}
