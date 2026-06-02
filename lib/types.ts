// 게임/서버 데이터 타입 정의 (data/games.json의 스키마)

export type Category =
  | 'mobile_kr'       // 국내 모바일
  | 'pc_console_kr'   // 국내 PC/콘솔
  | 'global_aaa'      // 글로벌 대작
  | 'new_server';     // 한국 MMO 신규 서버

export interface Game {
  id: string;
  name_ko: string;
  name_en: string | null;
  release_date: string;             // 'YYYY-MM-DD'
  release_date_approx: boolean;
  category: Category;
  platforms: string[];
  developer: string | null;
  publisher: string | null;
  description: string | null;
  genres: string[];
  image_url: string | null;
  source_url: string | null;
}

export interface GamesData {
  schema_version: number;
  last_updated: string;             // ISO 8601
  last_researched_by: string;
  categories: Record<Category, string>;
  games: Game[];
}

// 카테고리별 표기/색/이모지 단일 출처
export const CATEGORY_META: Record<Category, {
  label: string;
  short: string;
  emoji: string;
  color: string;
}> = {
  mobile_kr:     { label: '국내 모바일',     short: '모바일',  emoji: '📱', color: '#81c784' },
  pc_console_kr: { label: '국내 PC·콘솔',    short: 'PC·콘솔', emoji: '🎮', color: '#64b5f6' },
  global_aaa:    { label: '글로벌 대작',     short: '글로벌',  emoji: '🌍', color: '#ba68c8' },
  new_server:    { label: '한국 MMO 신규 서버', short: '신서버', emoji: '🆕', color: '#ff8a65' },
};
