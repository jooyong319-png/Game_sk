// 다국어(/en, /ja) 페이지 공용 UI 문구 — 정적 딕셔너리(번역 API 미사용, 직접 작성).
import type { Category } from './types';

export type Locale = 'en' | 'ja';
export const LOCALES: Locale[] = ['en', 'ja'];

// events.json 이벤트 타입(game_show/sale/season/free_game) 라벨
export const EVENT_TYPE_LABELS: Record<Locale, Record<'game_show' | 'sale' | 'season' | 'free_game', string>> = {
  en: { game_show: 'Game Show', sale: 'Sale', season: 'New Season', free_game: 'Free' },
  ja: { game_show: 'ゲームショー', sale: 'セール', season: '新シーズン', free_game: '無料' },
};

export const CATEGORY_LABELS: Record<Locale, Record<Category, string>> = {
  en: {
    mobile_kr: 'Mobile (Korea)',
    pc_console_kr: 'PC & Console (Korea)',
    global_aaa: 'Global AAA',
    new_server: 'New Server / Event',
  },
  ja: {
    mobile_kr: 'モバイル(韓国)',
    pc_console_kr: 'PC・コンソール(韓国)',
    global_aaa: 'グローバルAAA',
    new_server: '新規サーバー・イベント',
  },
};

interface UiStrings {
  siteName: string;
  siteNameShort: string;
  home: string;
  calendar: string;
  news: string;
  blog: string;
  coupons: string;
  gamesList: string;
  upcoming: string;
  preReg: string;
  newServers: string;
  events: string;
  mobile: string;
  pcConsole: string;
  global: string;
  releaseDate: string;
  platforms: string;
  genres: string;
  developer: string;
  publisher: string;
  tba: string;
  viewOriginal: string;
  backToList: string;
  publishedOn: string;
  source: string;
  notFound: string;
  notTranslated: string;
  contact: string;
  about: string;
  contactPage: string;
  guide: string;
  privacy: string;
  terms: string;
  footerDisclaimer: string;
  fullSiteNotice: string;
}

export const UI: Record<Locale, UiStrings> = {
  en: {
    siteName: 'Gcalen — Game Release Calendar',
    siteNameShort: 'Game Release Calendar',
    home: 'Home',
    calendar: 'Calendar',
    news: 'Game News',
    blog: 'Roundups',
    coupons: 'Game Coupons',
    gamesList: 'Game List',
    upcoming: 'Upcoming',
    preReg: 'Pre-Registration',
    newServers: 'New Servers',
    events: 'Events',
    mobile: 'Mobile',
    pcConsole: 'PC & Console',
    global: 'Global',
    releaseDate: 'Release date',
    platforms: 'Platforms',
    genres: 'Genres',
    developer: 'Developer',
    publisher: 'Publisher',
    tba: 'TBA',
    viewOriginal: 'View full interactive page (Korean) →',
    backToList: '← Back to list',
    publishedOn: 'Published',
    source: 'Source',
    notFound: 'Page not found.',
    notTranslated: "This page hasn't been translated into English yet.",
    contact: 'Contact',
    about: 'About',
    contactPage: 'Contact',
    guide: 'Guide',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    footerDisclaimer: 'Game names, images, and trademarks are property of their respective rights holders. This site exists to provide release-schedule information and will edit or remove content upon a rights holder’s request.',
    fullSiteNotice: 'The calendar, game listings, and comments below are shown in Korean (the site’s primary data language). Page titles and navigation are in English.',
  },
  ja: {
    siteName: 'Gcalen — ゲーム発売カレンダー',
    siteNameShort: 'ゲーム発売カレンダー',
    home: 'ホーム',
    calendar: 'カレンダー',
    news: 'ゲームニュース',
    blog: 'まとめ記事',
    coupons: 'ゲームクーポン',
    gamesList: 'ゲーム一覧',
    upcoming: '発売予定',
    preReg: '事前予約',
    newServers: '新規サーバー',
    events: 'イベント',
    mobile: 'モバイル',
    pcConsole: 'PC・コンソール',
    global: 'グローバル',
    releaseDate: '発売日',
    platforms: '対応機種',
    genres: 'ジャンル',
    developer: '開発',
    publisher: '販売',
    tba: '未定',
    viewOriginal: '詳細ページ(韓国語・全機能)を見る →',
    backToList: '← 一覧へ戻る',
    publishedOn: '公開日',
    source: '出典',
    notFound: 'ページが見つかりません。',
    notTranslated: 'このページはまだ日本語に翻訳されていません。',
    contact: 'お問い合わせ',
    about: 'サイトについて',
    contactPage: 'お問い合わせ',
    guide: 'ガイド',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    footerDisclaimer: 'ゲーム名・画像・商標等は各権利者の資産であり、本サイトは発売日程情報の提供を目的としています。権利者の要請があれば該当コンテンツを速やかに修正・削除します。',
    fullSiteNotice: '以下のカレンダー・ゲーム一覧・コメントは韓国語(本サイトの基本データ言語)で表示されます。ページタイトルとナビゲーションは日本語です。',
  },
};

// hreflang용 언어 코드(Next Metadata alternates.languages 키)
export const HREFLANG: Record<Locale, string> = { en: 'en', ja: 'ja' };

// 캘린더/리스트/모달 등 딥 컴포넌트용 UI 문구 (usePathname 자체 감지 컴포넌트에서 사용)
interface CalUiStrings {
  searchPlaceholder: string;
  wishlist: string;
  wishlistOnly: string;
  viewCalendar: string;
  viewList: string;
  today: string;
  noImage: string;
  lastUpdated: string;
  noSchedule: string;
  totalCount: string;
  free: string;
  comingSoon: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  weekdays: string[]; // Sun..Sat
  close: string;
  official: string;
  addToWishlist: string;
  removeFromWishlist: string;
  share: string;
  comments: string;
  commentPlaceholder: string;
  postComment: string;
  nickname: string;
  loading: string;
  released: string;
  goTo: string;
  prevMonth: string;
  nextMonth: string;
  goToToday: string;
  noReleaseThisMonth: string;
  swipeHint: string;
  closePanel: string;
  noScheduleThisDate: string;
  preRegTag: string;
  deadlineTag: string;
  preRegStartBadge: string;
  preRegEndBadge: string;
  ongoing: string;
  closed: string;
  all: string;
  categoryFilter: string;
  prevYear: string;
  nextYear: string;
  monthSelect: string;
  months: string[]; // Jan..Dec short
  noDateSet: string;
  noApproxGames: string;
  noReleaseThisMonthYear: (monthYearLabel: string) => string;
  pickOtherMonth: string;
  viewSource: string;
  goToPreReg: string;
  favorited: string;
  favorite: string;
  fullPage: string;
  copied: string;
  preRegLive: string;
  preRegTimeLeft: string;
  preRegClosedText: string;
  preRegDeadlineTba: string;
  preRegInfo: string;
  startsOn: (label: string) => string;
}

export const CAL: Record<Locale, CalUiStrings> = {
  en: {
    searchPlaceholder: 'Search games…',
    wishlist: 'Wishlist',
    wishlistOnly: 'Wishlist only',
    viewCalendar: 'Calendar',
    viewList: 'List',
    today: 'Today',
    noImage: 'No image',
    lastUpdated: 'Data last updated',
    noSchedule: 'No games scheduled.',
    totalCount: 'Total',
    free: 'Free',
    comingSoon: 'Coming soon',
    days: 'D', hours: 'H', minutes: 'M', seconds: 'S',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    close: 'Close',
    official: 'Official source →',
    addToWishlist: 'Add to wishlist',
    removeFromWishlist: 'Remove from wishlist',
    share: 'Share',
    comments: 'Comments',
    commentPlaceholder: 'Comment on this game (max 500 chars)',
    postComment: 'Post',
    nickname: 'Nickname',
    loading: 'Loading…',
    released: 'Released',
    goTo: 'View',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    goToToday: 'Today',
    noReleaseThisMonth: 'No releases scheduled this month.',
    swipeHint: 'Swipe or use ‹ › to browse other months.',
    closePanel: 'Close panel',
    noScheduleThisDate: 'Nothing scheduled on this date.',
    preRegTag: 'Pre-reg',
    deadlineTag: 'Deadline',
    preRegStartBadge: 'Pre-registration opens',
    preRegEndBadge: 'Pre-registration closes',
    ongoing: 'Ongoing',
    closed: 'Closed',
    all: 'All',
    categoryFilter: 'Category & event filter',
    prevYear: 'Previous year',
    nextYear: 'Next year',
    monthSelect: 'Select month',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    noDateSet: 'TBA',
    noApproxGames: 'No games with a TBA release date.',
    noReleaseThisMonthYear: (label) => `No releases in ${label}.`,
    pickOtherMonth: 'Pick another month from the tabs above.',
    viewSource: 'View source',
    goToPreReg: 'Go to pre-registration',
    favorited: 'Favorited',
    favorite: 'Favorite',
    fullPage: 'Full page',
    copied: 'Copied',
    preRegLive: 'Pre-registration open',
    preRegTimeLeft: 'Time left to pre-register',
    preRegClosedText: 'Pre-registration closed',
    preRegDeadlineTba: 'Pre-registration deadline TBA',
    preRegInfo: 'Pre-registration info',
    startsOn: (label) => `Starts ${label}`,
  },
  ja: {
    searchPlaceholder: 'ゲームを検索…',
    wishlist: 'お気に入り',
    wishlistOnly: 'お気に入りのみ表示',
    viewCalendar: 'カレンダー',
    viewList: 'リスト',
    today: '今日',
    noImage: '画像なし',
    lastUpdated: 'データ最終更新',
    noSchedule: '登録されている予定がありません。',
    totalCount: '合計',
    free: '無料',
    comingSoon: '発売間近',
    days: '日', hours: '時間', minutes: '分', seconds: '秒',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    close: '閉じる',
    official: '公式情報 →',
    addToWishlist: 'お気に入りに追加',
    removeFromWishlist: 'お気に入りから削除',
    share: '共有',
    comments: 'コメント',
    commentPlaceholder: 'このゲームへのコメント(最大500文字)',
    postComment: '投稿',
    nickname: 'ニックネーム',
    loading: '読み込み中…',
    released: '発売済み',
    goTo: '見る',
    prevMonth: '前月',
    nextMonth: '翌月',
    goToToday: '今日',
    noReleaseThisMonth: '今月の発売予定はありません。',
    swipeHint: 'スワイプまたは‹ ›で他の月を見る。',
    closePanel: 'パネルを閉じる',
    noScheduleThisDate: 'この日には予定がありません。',
    preRegTag: '事前予約',
    deadlineTag: '締切',
    preRegStartBadge: '事前予約開始',
    preRegEndBadge: '事前予約締切',
    ongoing: '受付中',
    closed: '終了',
    all: 'すべて',
    categoryFilter: 'カテゴリ・イベントフィルター',
    prevYear: '前年',
    nextYear: '翌年',
    monthSelect: '月を選択',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    noDateSet: '未定',
    noApproxGames: '発売日未定のゲームはありません。',
    noReleaseThisMonthYear: (label) => `${label}の発売予定はありません。`,
    pickOtherMonth: '上のタブから他の月を選んでください。',
    viewSource: '出典を見る',
    goToPreReg: '事前予約はこちら',
    favorited: 'お気に入り済み',
    favorite: 'お気に入り',
    fullPage: '詳細ページ',
    copied: 'コピーしました',
    preRegLive: '事前予約受付中',
    preRegTimeLeft: '事前予約締切までの時間',
    preRegClosedText: '事前予約は終了しました',
    preRegDeadlineTba: '事前予約締切日は未定',
    preRegInfo: '事前予約情報',
    startsOn: (label) => `${label}開始`,
  },
};
