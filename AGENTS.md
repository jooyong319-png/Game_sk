# 5명의 AI Claude 협업 규칙 (Next.js 14 + TypeScript)

이 프로젝트는 **5명의 Claude 에이전트가 자율 협업**하는 게임 출시 캘린더 웹사이트입니다.
2026-06 vanilla → Next.js 14 App Router + TypeScript로 마이그레이션 완료.

🌐 사이트: https://gcalen.com/
📦 저장소: https://github.com/jooyong319-png/Game_sk
⚙️ 스택: Next.js 14 (App Router) · React 18 · TypeScript 5 (strict) · CSS Modules · Vercel

---

## 1. 파일 구조 (중요 — 모든 에이전트 숙지)

```
app/                          # Next.js App Router (서버 컴포넌트 기본)
├── layout.tsx                # 전역 헤더/푸터/메타데이터/AdSense 스크립트
├── page.tsx                  # 메인 (서버에서 데이터 로드 → Home 컴포넌트)
├── globals.css               # 전역 CSS (변수, 헤더/푸터, 카테고리, 광고자리)
├── sitemap.ts                # Next 네이티브 sitemap (자동 생성)
├── robots.ts                 # Next 네이티브 robots
├── not-found.tsx / error.tsx # 에러 페이지
├── game/[id]/page.tsx        # 게임 상세 정적 SEO 페이지 (generateStaticParams)
└── {upcoming,new-servers,mobile,pc-console,global}-games/page.tsx  # 5개 키워드 랜딩

components/                   # 재사용 컴포넌트 + 각자의 *.module.css
├── Home.tsx                  # 클라이언트 메인 컨테이너 (상태/모달/필터 통합)
├── HeroStrip.tsx             # 🔥 출시 임박 (D-7 이내)
├── MonthTabs.tsx             # 1~12월 빠른 점프 탭
├── Filters.tsx               # 검색/카테고리/플랫폼/기간/위시
├── ViewToggle.tsx            # 캘린더/리스트 토글
├── CalendarView.tsx          # 월간 그리드
├── ListView.tsx              # 카드 리스트
├── GameModal.tsx             # 클라 모달 (위시/GCal/링크)
├── AdSlot.tsx                # 광고 자리 placeholder
├── GoogleCalendarButton.tsx
├── SeoLanding.tsx            # 랜딩 페이지 공통
└── useWishlist.ts            # localStorage 훅

lib/                          # 유틸 (TypeScript)
├── types.ts                  # Game/Category 타입 + CATEGORY_META
├── games.ts                  # ⚠️ 서버 전용 (fs로 data/games.json 읽음)
├── utils.ts                  # 순수 헬퍼 (날짜 포맷, D-day 계산 등)
└── google-calendar.ts        # GCal URL 빌더

data/                         # 데이터 (리서처만 수정)
├── games.json                # 메인 데이터 (게임/서버 통합)
└── server_watchlist.json     # 신규 서버 추적 대상

public/                       # Vercel 정적 자산 (필요 시 추가)
├── favicon.svg / og-image.png
└── ads.txt
```

---

## 2. ⚠️ 절대 규칙 (모든 에이전트)

1. **`lib/games.ts`는 fs를 import한다 → 클라이언트 컴포넌트에서 import 금지**
   - 클라 컴포넌트(`'use client';`)에서 헬퍼가 필요하면 `@/lib/utils` 사용
   - 서버 컴포넌트(layout/page.tsx 기본)에서는 `@/lib/games` OK
2. **서버/클라 경계 지키기**: `'use client';`가 맨 위에 있으면 클라, 없으면 서버
3. **TypeScript strict 모드** — `any` 남발 금지, 타입 명시
4. **CSS는 컴포넌트별 `*.module.css` 우선**, 전역 `globals.css`는 최소
5. **데이터는 `data/games.json`만 정답** — public/ 사본은 옛 vanilla 잔재라 무시
6. **node_modules 만지지 마라** — `npm install`은 Vercel에서 자동

---

## 3. 5명의 역할

### 📚 리서처 Claude
- **주기**: 하루 2회 (09:00 / 21:00)
- **수정 가능**: `data/games.json`, `CHAT.md`, `PROJECT_STATUS.md`
- **읽기만**: `data/server_watchlist.json`, 다른 모든 파일
- **본업**: 신규 게임/서버 정보 수집 → 2단계 검증 → JSON 갱신 → push
- **상세**: 별도 프롬프트(스케줄 작업)에 모두 포함

### 🎯 기획자 Claude
- **주기**: 매시간 :00
- **수정 가능**: `PROJECT_STATUS.md`, `CHAT.md`, `AGENTS.md`
- **본업**: TODO 큐(3~5개) 유지, 다음 작업 결정
- **금지**: 코드/데이터 직접 수정 X

### 💻 개발자 Claude
- **주기**: 매시간 :20
- **수정 가능**: `app/**/*.tsx`, `components/**/*.tsx`, `components/**/*.module.css`, `lib/*.ts`, `app/globals.css`, `package.json`(신중히)
- **금지**: `data/**`(리서처 영역), `legacy/`, `archive/`, `node_modules/`
- **본업**: 기획자가 정한 TODO를 .tsx 컴포넌트로 구현, 200줄까지 OK
- ⚠️ **AdSense 심사 중(2026-07)**: 저품질 판정 대응으로 **콘텐츠 우선 정책** 시행 중. `layout.tsx`의 `SideRailAds`(애드핏)와 본문 AdFit은 **의도적으로 비활성** — 승인 전까지 광고를 다시 켜지 말 것(애드핏 수익 낮음). AdSense 자동광고 스크립트는 유지. 승인 후 재검토.

### 🔍 QA Claude
- **주기**: 매시간 :40
- **수정 가능**: `CHAT.md`, `PROJECT_STATUS.md`만
- **본업**: gcalen.com 라이브 검증 (메인/상세/랜딩/sitemap)
- **금지**: 코드 절대 수정 X

### 🎨 디자이너 Claude (UX/UI 디렉터)
- **주기**: 4시간마다 :50
- **수정 가능**: `DESIGN_NOTES.md`, `PROJECT_STATUS.md`(IDEAS), `CHAT.md`
- **본업**: Chrome으로 라이브 스크린샷 → 외형/시각 디자인 제안 (당분간 a11y X)
- **금지**: 코드 절대 수정 X

### ✍️ 작가 Claude (신작 총정리)
- **주기**: 주 1회 — 주차별 주제 로테이션(BLOG_AUTHORING.md §7). 데이터 빈약 주는 스킵.
- **수정 가능**: `content/blog/*.md`(신규 글만), `CHAT.md`
- **본업**: 검색 유입용 "신작 총정리" 글 발행 → 게임 상세(/game/[id]) 내부 링크로 회유
- **필독**: `BLOG_AUTHORING.md`(글 형식·지원 마크다운·주제 로테이션·내부링크 규격·**§9 다국어 발행**). 어기면 글이 깨진다.
- **다국어(2026-07-18 도입, 가능하면)**: 원본(`<slug>.md`, 한국어) 발행 시 같은 사이클에 `<slug>.en.md`·`<slug>.ja.md`도 같이 — 번역이 아니라 그 언어로 **새로 쓰기**(BLOG_AUTHORING.md §9). 여력 없으면 한국어만 먼저 내고 다음 사이클에 추가해도 됨(필수 아님).
- **금지**: `content/blog/`에 글 아닌 파일 두기(전부 자동 발행됨), `data/**`·코드 수정

### 🧹 로그청소 봇
- **주기**: 3일에 1회 새벽 3시
- **본업**: CHAT.md(30개)/DESIGN_NOTES.md(15개)/PROJECT_STATUS.md 변경로그(20개) 정리

---

## 4. 로그/노트 유지 정책 (토큰 절약)
- `CHAT.md`: 최근 30개 메시지만
- `DESIGN_NOTES.md`: 최근 15개 제안만
- `PROJECT_STATUS.md` "최근 변경 로그": 최근 20개만

각 에이전트 자기 메시지 추가 시 한계 체크. 초과 시 가장 오래된 거 삭제.
`archive/` 디렉토리는 읽지 말 것.

---

## 5. 데이터 보관 정책
- **지난 게임도 삭제하지 말 것 — 전부 보관(아카이브).** 출시된 지 오래된 게임 상세도 SEO 롱테일·애드센스 지면·고유 콘텐츠 자산이라 계속 유지한다.
- 출시일이 지난 게임은 코드가 "출시 예정"·캘린더 upcoming에서 자동으로 빠지므로, 데이터에 남겨도 화면이 지저분해지지 않는다(상세 페이지는 URL로 계속 접근·색인).
- 오래됐다는 이유로 삭제 금지. (명백한 오등록·중복·취소된 항목만 정리)
- 단, 오래된 항목도 description은 부실(한 줄)하면 안 됨 — 품질은 유지.

## 6. data/games.json 스키마
```ts
{
  schema_version: 1,
  last_updated: "ISO 8601",
  last_researched_by: string,
  categories: { mobile_kr, pc_console_kr, global_aaa, new_server },
  games: Array<{
    id: string,                       // slug-2026 형식
    name_ko: string,
    name_en: string | null,
    name_ja?: string | null,          // 일본어 표기명 (선택 — 없으면 name_en/name_ko로 폴백)
    release_date: "YYYY-MM-DD",
    release_date_approx: boolean,
    category: "mobile_kr" | "pc_console_kr" | "global_aaa" | "new_server",
    platforms: string[],
    developer: string | null,
    publisher: string | null,
    description: string | null,
    description_en?: string | null,   // 영어 설명 (선택 — §6-4)
    description_ja?: string | null,   // 일본어 설명 (선택 — §6-4)
    genres: string[],
    image_url: string | null,
    source_url: string | null,
    pre_registration?: boolean,           // 사전예약 진행 중이면 true (선택 필드)
    pre_registration_date?: string | null,     // "YYYY-MM-DD" 사전예약 시작일 (선택)
    pre_registration_end_date?: string | null, // "YYYY-MM-DD" 사전예약 마감일 (선택)
    pre_registration_url?: string | null,      // 공식 사전예약 페이지 URL (선택)
  }>
}
```

**사전예약 필드군** (사전예약 페이지 `/pre-registration` + 캘린더 + 상세 SEO 표면용):
- `pre_registration`: 공식 출처에서 **현재/예정 사전예약(사전등록)을 받는** 게임에 `true`.
  - 출시되면(release_date 지남) 자연히 빠지므로 별도 false 처리는 선택.
  - 모바일이 대부분이지만 PC/콘솔도 사전예약 받으면 `true` 가능.
  - 미설정(필드 없음)이면 false로 간주. 리서처가 0건 채운 동안엔 코드가 '출시예정 모바일'로 폴백.
- `pre_registration_date`: 사전예약 **시작일**. 있으면 캘린더 해당 날짜에 '사전예약' 마커(속 빈 링)로 별도 표시됨. **확정 시 반드시 채울 것.**
- `pre_registration_end_date`: 사전예약 **마감일**. 있으면 캘린더에 '마감' 마커로 표시. 미정이면 생략(null/미설정) — 나중에 확정되면 추가.
- `pre_registration_url`: **공식 사전예약 페이지 URL**. 있으면 상세/모달에 '사전예약 하러 가기' CTA 버튼 노출. (예: `https://zeus.com2us.com/pre-registration/`) source_url(뉴스 출처)과 **별개** — 이건 실제 사전예약 신청 페이지.
  - ⚠️ 이건 **이미 스키마에 정의된 기존 필드**다(types.ts에 존재, 여러 게임이 이미 사용). 채우는 건 '새 필드 추가/스키마 변경'이 **아니다** — 175행 '스키마 임의 변경 금지'와 무관하니 주저 말고 채울 것.
  - `pre_registration=true`이면 **공식 사전등록 페이지 URL을 적극적으로 찾아 반드시 채울 것**(스토어 사전예약 페이지, 공식 홈페이지 사전등록 등). 뉴스 기사(인벤 등)는 source_url이지 여기가 아님.
  - 정말 못 찾으면 비워두되, **못 찾았다는 사실을 CHAT.md에 기록**해 다음 사이클에 재시도되게 할 것.
- ⚠️ SEO: `pre_registration=true`면 상세 페이지 제목·설명·FAQ·구조화 데이터가 자동으로 '사전예약' 중심으로 생성됨. 그래서 사전예약 게임은 **위 필드들을 최대한 채워야** 검색 노출이 강해짐(예: "제우스 사전예약").

**description 작성 기준** (상세 페이지 콘텐츠 품질 = AdSense 저가치 판정 대응) — ⚠️ **2026-07 AdSense "주의 필요"(저품질 콘텐츠) 판정을 받아 전 게임 설명을 2~4문장으로 확장 완료. 이 수준을 반드시 유지할 것**:
- 한 줄 사실 나열 절대 금지. **2~4문장, 한국어 최소 130자 이상(권장 150~300자)**의 **원본 소개**로 작성. (평균 목표 ≈ 180자)
- 담을 내용: ① 어떤 장르·느낌의 게임인지 ② 개발사/IP 맥락 ③ 주목 포인트(핵심 특징·기대 요소) ④ 플랫폼·출시(또는 사전예약) 맥락. 신규 서버/업데이트면 ⑤ 신규·복귀 이용자 관점의 의미(예: 같은 출발선, 성장 지원)를 자연스럽게 곁들이면 좋다.
- 공식 마케팅 문구 **그대로 복붙 금지** → 직접 요약·재서술(원본성 확보).
- **사실만**: 검증 안 된 추측·과장·수치 창작 금지. 모르면 확인된 범위까지만(허위 정보는 AdSense에 더 치명적).
- **신규 게임은 처음부터 130자+로 작성**. 130자 미만 설명이 하나라도 생기지 않게 관리(과거 얇은 설명이 저품질 판정 원인이었음).

## 6-4. 다국어 필드 (description_en / description_ja / name_ja) — 2026-07-18 도입
`/en/game/[id]`, `/ja/game/[id]` 페이지는 **해당 언어 필드가 있는 게임만** 정적 생성된다(없으면 그 언어 페이지 자체가 안 생김 — 얇은/중복 콘텐츠로 SEO 감점 방지).
- 리서처가 신규 게임 등록 시 **가능하면 함께 채움**(필수는 아님 — 확신 없으면 null, §17 "의심스러우면 추가 안 함" 동일 적용).
- **기계번역이 아니라 같은 사실관계를 그 언어로 자연스럽게 재서술**(한국어 description을 그대로 번역기 돌리지 말 것). 1~3문장, 한국어만큼 길 필요 없음.
- name_ja는 공식 일본어 표기가 확실할 때만(모르면 생략 → 프론트가 name_en/name_ko로 자동 폴백).
- 기존 등록된 게임(130+개)은 **소급 작성 대상 아님** — 신규 등록분부터 적용, 기존분은 나중에 별도 작업.

리서처는 스키마 임의 변경 금지. 변경 필요 시 기획자와 합의 후.
- 여기서 '스키마 변경'은 **위 목록에 없는 완전히 새로운 key를 추가/삭제/개명**하는 것을 말한다. `pre_registration_url`처럼 **위에 이미 정의된 선택 필드를 값으로 채우는 것은 스키마 변경이 아니다** — 오히려 반드시 채워야 하는 정상 작업이다. (선택 필드 = "값이 없을 수도 있음"이지 "존재하지 않는 필드"가 아님)
new_server는 워치리스트(`data/server_watchlist.json`) 기반 + 공식 공지 확인 필수.

## 6-2. data/events.json (게임 이벤트 — 게임쇼/할인/시즌)
출시 외 기간성 이벤트. `/events` 페이지·사이드바에 노출. 리서처가 관리.
```ts
{ id, type: "game_show"|"sale"|"season", title,
  title_en?: string, title_ja?: string,  // /en, /ja 캘린더·이벤트 페이지용(없으면 title로 자동 폴백)
  start_date, end_date: "YYYY-MM-DD",   // 단일이면 둘 다 동일
  date_approx?: boolean,                 // 날짜 불확실하면 true → '예정' 표기
  host?: string,                         // 게임쇼 장소 / 할인 플랫폼 / 시즌 게임명
  description?, source_url?, image_url? }
```
- **game_show**: 게임스컴·도쿄게임쇼·지스타·TGA 등. 시드는 `date_approx:true`로 들어가 있으니 **공식 발표 나오면 정확한 날짜로 갱신 + approx 제거**.
- **sale**: 스팀 계절세일·넥스트페스트, PSN·닌텐도 e숍 대규모 할인. 시작~종료 기간 필수.
- **season**: 디아블로·PoE·오버워치2·에이펙스 등 시즌제 게임의 새 시즌 오픈일. host에 게임명.
- **free_game(무료배포)는 여기 넣지 말 것** — 에픽은 `/api/free-games`가 실시간 자동 수집함.
- end_date 지난 이벤트는 자동으로 안 보이므로, 끝난 건 주기적으로 정리.
- 사실 검증 원칙 동일: 공식 출처 확인된 일정만.

## 6-3. data/coupons.json (게임 쿠폰/리딤코드 — 게임 카탈로그, 리서처 관리) ⭐schema v2
게임별 **쿠폰 번호·리딤코드(기프트코드)**. `/coupons` 허브 + 게임 쿠폰 전용 페이지(`/coupons/[키]`) + **게임 허브(`/games/[키]`)** + games.json에 연결된 게임이면 그 게임 상세의 '쿠폰' 섹션까지 자동 노출. "게임명 쿠폰/리딤코드" 검색 유입 + 콘텐츠 가치(AdSense)에 매우 유리하니 **적극 수집**.

⚠️ **v2 구조 = games.json과 독립**. 쿠폰 대상(원신·스타레일 등 라이브 서비스)은 대부분 출시 캘린더에 없으므로, **각 게임을 여기에 자체 완결형으로 등록**한다. `coupons`(v1, 게임id→코드배열)가 아니라 **`games`(키→게임객체)** 구조를 쓸 것. (v1도 코드가 읽긴 하나 신규는 반드시 v2로.)
```ts
{ schema_version: 2, last_updated: "YYYY-MM-DD",
  games: {
    "<키=URL 슬러그>": {                    // 예: "genshin-impact" → /coupons/genshin-impact, /games/genshin-impact
      name_ko: "원신",                       // 기본 게임명(버전·업데이트 꼬리표 없이)
      name_en: "Genshin Impact",            // 선택
      name_ja: "原神",                       // 선택: /en, /ja 쿠폰·게임 허브 페이지용(없으면 name_en→name_ko 순 폴백)
      image_url: "https://...",             // 선택(허브·목록 썸네일)
      game_id: "genshin-6-7-...",           // 선택: 연결된 games.json id(있으면 게임 상세에도 노출·상호링크)
      term: "리딤코드",                       // 선택: 주 용어 강제. 없으면 이름으로 자동('리딤코드'|'쿠폰')
      redeem_url: "https://genshin.hoyoverse.com/ko/gift", // 선택: 공식 쿠폰/리딤 '웹 등록' 페이지(확인된 것만) → 상세에 CTA 버튼
      aliases: ["원신","Genshin Impact"],   // 선택: 허브가 캘린더 항목을 이 게임에 묶을 별칭(항목명이 이 별칭으로 시작하면 매칭). 없으면 name/name_en로 유도
      codes: [
        { code: "쿠폰코드",
          reward: "보상 설명(예: 원석 60, 모험 경험치 5)",
          expires: "YYYY-MM-DD" | null,     // 만료일(없으면 null). 지나면 '만료됨' 표시
          added: "YYYY-MM-DD" }
      ]
    }
  } }
```
- ⚠️ **실제로 유효한 코드만**: 게임사 공식 채널(공지·SNS·쿠폰/리딤 페이지)에서 확인된 것만. **코드 창작 절대 금지**(안 먹히는 코드는 신뢰·AdSense에 치명적).
- **키**는 영문 슬러그로 안정적으로(게임당 1개, 패치마다 바꾸지 말 것). 같은 게임이면 기존 키에 `codes`만 추가.
- **games.json에 없어도 등록 가능** — 라이브 게임(원신·스타레일·브롤스타즈·쿠키런 등)은 캘린더에 없어도 여기 자유롭게 추가. 캘린더에 대응 항목이 있으면 `game_id`로 연결.
- **`redeem_url`(선택)**: 게임사 **공식 웹 쿠폰/리딤 등록 페이지**가 있으면 넣는다(호요버스류가 대표적). 상세 페이지에 등록 버튼·HowTo 링크로 노출돼 SEO·전환에 유리. **확인된 공식 URL만**(사설 리딤 사이트·만료성 링크 금지).
- 주 대상: **모바일 MMORPG·가챠·방치형·호요버스류** 등 쿠폰/리딤코드를 자주 뿌리는 게임. 콘솔 AAA는 대부분 없음.
- **만료 관리**: 만료(`expires` 지난) 코드도 **'만료됨'으로 90일간 노출**(콘텐츠·SEO). **바로 지우지 말 것**, 90일 넘은 것만 정리.

---

## 7. 빌드 시스템
- Vercel이 push 감지 → `next build` 자동 실행
- `app/`의 모든 페이지가 SSG/RSC로 자동 생성됨
- `app/sitemap.ts`가 sitemap.xml 자동 생성 (이전 build.js 폐기)
- `app/game/[id]/page.tsx`의 `generateStaticParams`가 게임별 정적 페이지 생성
- 에이전트는 로컬 빌드 시도 X (sandbox 디스크 제한). 푸시 후 Vercel 검증.

---

## 8. 작업 흐름
```
매일 09:00/21:00 → 리서처: data/games.json 갱신
매시간 :00       → 기획자: TODO 큐 갱신
매시간 :20       → 개발자: TODO 1개를 .tsx로 구현 + push
매시간 :40       → QA: gcalen.com 검증
4시간:50         → 디자이너: 외형 제안
3일 03:00        → 로그청소
```

## 9. 현재 모드
**외형(시각 디자인) 집중 모드** — a11y/리팩토링 마이크로 트윅 보류.
사용자가 "이제 a11y 다시 해도 돼"라고 할 때까지 외형 위주.

## 🎯 현재 디자인 모드: 미니멀 리셋 (정리)

운영자 피드백 "디자인이 너무 지저분하다" 이후 '외형 추가'를 멈추고 정리(declutter)로 전환.
**모든 에이전트(특히 기획자/개발자/QA/디자이너)는 이 섹션을 매 사이클 읽고 준수.**

### 확정 방향 (되돌리지 말 것)
1. **테마**: 라이트(화이트) 기본 + 다크 토글. `:root` 토큰 + `next-themes`(defaultTheme=light).
   - 라이트 토큰: `--bg #f6f7f9` (패널분리 페이지 `#eceef1`) · `--bg-elev #fff` · `--border #e4e7ec` · `--text #1a1d24` · `--text-faint #6b7280` · `--accent #2f6fe0` · `--accent-warm #c47a00`
   - 카테고리 정보색: 모바일 `#3f7d54` · PC `#3a6ea5` · 글로벌 `#7e4f99` · 신서버 `#b5601f`
   - 다크 토큰은 기존 값 유지
2. **데스크톱 3컬럼**: 좌=카테고리(필터+기간) / 중=본문(검색·토글·캘린더) / 우=출시임박(세로 레일·sticky). 모바일=1컬럼 스택(헤더→카테고리 가로칩→검색/토글→캘린더→출시임박). 모바일 기본 리스트 권장.
3. **컬럼 패널(B 확정)**: 세 컬럼 동일 흰 패널 + 라벨헤더 + 1px 보더·간격으로 구획. warm은 출시임박 헤더 띠만. (3색 틴트 금지)
4. **헤더 미니멀**: 워드마크(시그니처 그라데 유지) + 위시·테마토글만. 카테고리 내비 없음.
5. **하단 광고 제거** (상단만).
6. **절제 시스템**: 색 3역할(인터랙션 블루 1 / 임박 warm 1 / 카테고리 정보색 점·좌바만), 그라데 1곳(h1), 칩 1언어(중립), 여백 우선.
7. **폐기**: 구 accent `#4a90e2` 전량 청산.

### 🚫 금지 (장식 추가)
글로우, 그라데(h1 제외), 핫카드 확대, 펄스, 해치 패턴 — 발견 시 제거 권한 있음.

### 모드별 행동
- **기획자**: TODO 우선순위 "추가" 대신 "제거/단순화/정렬". 외형 추가 제안은 IDEAS 보관.
- **개발자**: 새 토큰 사용. 구 `#4a90e2` 발견 시 교체. 장식 코드 제거 권한.
- **QA**: 확정 방향 1~7 라이브 검증. 구 accent 잔존 여부 grep.
- **디자이너**: 정리 제안만, 장식 추가 0건. 큰 변경은 show_widget 목업 먼저.

