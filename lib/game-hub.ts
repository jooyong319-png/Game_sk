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
