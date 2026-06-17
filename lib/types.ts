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

// 메인 필터 상태 (좌 CategoryRail + 검색바가 사용). §F 3컬럼 이관 후
// 가로 Filters 바는 제거됐고, 타입만 단일 출처로 보존한다.
export interface FilterState {
  category: Category | null;
  platform: string | null;
  days: number;
  search: string;
  wishlistOnly: boolean;
}

// 카테고리별 표기/색/아이콘(SVG 스프라이트 id) 단일 출처
export const CATEGORY_META: Record<Category, {
  label: string;
  short: string;
  icon: string;
  color: string;
}> = {
  mobile_kr:     { label: '국내 모바일',     short: '모바일',  icon: 'ic-mobile',  color: '#6f9c7a' },
  pc_console_kr: { label: '국내 PC·콘솔',    short: 'PC·콘솔', icon: 'ic-gamepad', color: '#5f86b8' },
  global_aaa:    { label: '글로벌 대작',     short: '글로벌',  icon: 'ic-globe',   color: '#9a7bb0' },
  new_server:    { label: '신규 서버 · 대규모 이벤트', short: '서버·이벤트', icon: 'ic-server', color: '#c08560' },
};
