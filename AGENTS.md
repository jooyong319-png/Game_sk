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
- 미래 출시 예정 + 지난 6개월 내 출시/오픈한 게임만 보관 (180일 롤링)
- 6개월 넘은 항목은 리서처가 삭제

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
    release_date: "YYYY-MM-DD",
    release_date_approx: boolean,
    category: "mobile_kr" | "pc_console_kr" | "global_aaa" | "new_server",
    platforms: string[],
    developer: string | null,
    publisher: string | null,
    description: string | null,
    genres: string[],
    image_url: string | null,
    source_url: string | null,
  }>
}
```

리서처는 스키마 임의 변경 금지. 변경 필요 시 기획자와 합의 후.
new_server는 워치리스트(`data/server_watchlist.json`) 기반 + 공식 공지 확인 필수.

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
