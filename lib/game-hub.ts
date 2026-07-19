// server-only: 게임 허브(/games/[key]) 데이터 조립.
// 게임 마스터(coupons.json)의 정체성·쿠폰 + 캘린더(games.json)의 관련 출시/업데이트 일정을 '조인'.
import { getCouponGame, getAllCouponKeys, type CouponGameView } from './coupons';
import { getAllGames } from './games';
import type { Game } from './types';

export interface GameHub {
  view: CouponGameView;   // 정체성 + 쿠폰(active/expired)
  related: Game[];        // 이 게임의 캘린더 항목(출시/신서버/패치/콜라보), 날짜 오름차순
}

// games.json 항목이 이 마스터 게임에 속하는지: game_id 정확 일치 OR 항목명이 별칭으로 시작.
function belongs(g: Game, view: CouponGameView): boolean {
  if (view.game_id && g.id === view.game_id) return true;
  return view.aliases.some(a =>
    !!a && (g.name_ko.startsWith(a) || (!!g.name_en && g.name_en.startsWith(a))),
  );
}

export async function getGameHub(key: string): Promise<GameHub | null> {
  const view = await getCouponGame(key);
  if (!view) return null;
  const all = await getAllGames();
  const related = all
    .filter(g => belongs(g, view))
    .sort((a, b) => a.release_date.localeCompare(b.release_date));
  return { view, related };
}

export async function getGameHubKeys(): Promise<string[]> {
  return getAllCouponKeys();
}

// 게임 목록(/games) 인덱스용 요약 — 카탈로그의 모든 게임 + 쿠폰/일정 개수.
export interface GameHubSummary {
  key: string;
  name: string;
  name_en: string | null;
  name_ja: string | null;
  term: '리딤코드' | '쿠폰';
  image_url: string | null;
  activeCount: number;   // 유효 코드 수
  expiredCount: number;  // 최근 만료 코드 수
  relatedCount: number;  // 연결된 캘린더 일정 수
}

export async function getAllGameHubs(): Promise<GameHubSummary[]> {
  const [keys, all] = await Promise.all([getAllCouponKeys(), getAllGames()]);
  const views = await Promise.all(keys.map(k => getCouponGame(k)));
  return views
    .filter((v): v is CouponGameView => !!v)
    .map(v => ({
      key: v.key,
      name: v.name,
      name_en: v.name_en,
      name_ja: v.name_ja,
      term: v.term,
      image_url: v.image_url,
      activeCount: v.active.length,
      expiredCount: v.expired.length,
      relatedCount: all.filter(g => belongs(g, v)).length,
    }))
    .sort((a, b) => b.activeCount - a.activeCount || b.relatedCount - a.relatedCount || a.name.localeCompare(b.name));
}
