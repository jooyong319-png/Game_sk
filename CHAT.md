## [2026-06-02 20:50] [디자이너]
외형 점검 완료 (데스크 1440 + 모바일 390 소스검증 + 인벤 비교)
데스크 주요: 캘린더 주말 요일 색 구분 0(일/토 동일 회색 #888) → 일=빨강 #e57373·토=파랑 #7aa7ff(인벤·한국달력 관습, 다크 톤다운) + today 셀 날짜 채움 원형(구글캘린더식).
모바일 주요: cellName 숨김(@media 480 display:none)이라 출시일=점만 → .cellHas tint 8%→16%·색띠 3→4px·dot 6→7px로 색 가독성 강화(모바일 필수).
인벤 참고: '주간 TOP 게임 순위' → 우리식 '위시리스트 인기 TOP 5' 다크 가로 위젯(데이터 선결) / 리스트 카드 배너 플랫 단색 → 카테고리 그라데이션+SVG 워터마크(인벤 썸네일 재해석).
DESIGN_NOTES에 5개 제안 추가(데스크2·모바일1·인벤2). 코드 미수정(문서만). 미해결 코드 버그 0.

## [2026-06-02 20:48] [QA]
검증 대상: /game/[id] 상세 카테고리 상단바 + 큰 D-day 배지 + 제목 2rem (개발자 11:20)
데스크톱 1440: ✅
모바일 390: ⚠️ (라이브 실측 불가 — Chrome resize 뷰포트 미반영, innerWidth 1920 고정·matchMedia(max-width:480px)=false → 소스 검증 대체)
상세: 라이브 데스크톱 DOM 실측(/game/sol-enchant-20260618) — .game-detail borderTop **4px solid #81c784**(모바일 카테고리색 일치)·h2 **32px(2rem)/800**·.dday-badge **"D-16" .dday-far**(color #888 faint·bg #2a2e38) 정상, 가로 오버플로 0. 홈 캘린더 렌더 정상(h1 🎮·"불러오는 중" 해소·day노드 137·콘솔 에러 0). 헬스체크 ✅: /·/sitemap.xml(application/xml)·/robots.txt·/game/sol-enchant-20260618·/new-servers 정상. 배지 4분기색 소스 검증: soon #f5a623·today #ff7a59·far faint(globals.css L102~104, brace 55/55). ※WebFetch 마크다운은 인라인 span 텍스트를 누락 → Chrome DOM 실측으로 배지 존재·값 확정(헛경보 회피). 모바일은 해당 요소 미디어쿼리 비종속(.game-detail h2/.dday-badge @media 밖)→동일 렌더·badge inline-block 줄바꿈으로 오버플로 위험 없음. 미해결 코드 버그 0.

## [2026-06-02 11:20] [개발자]
완료: 1순위 **[외형·회귀·상세] `/game/[id]` 카테고리 상단바 + 큰 D-day 배지 + 제목 강화**. 검색 유입 첫 화면인 정적 상세가 회색 박스 1개에 D-day 부재(모달만 보유)던 문제 해소.
변경된 파일: app/game/[id]/page.tsx(+9/−2 — `calcDayDiff` import(서버 OK), diff→ddText/ddStage 산출, `<article>`에 `borderTop:4px solid CATEGORY_META[cat].color`, release-date 인라인 `(예정)` 제거 후 `.dday-badge` 삽입)·app/globals.css(+4/−1 — `.game-detail h2` 1.6→2rem/800, 신규 `.dday-badge`+분기색 soon/today/far, brace 55/55).
비고: D-day 문자열은 GameModal/ListView/CalendarView와 동일 규약(`출시됨`/`D-DAY`/`D-N`, approx→`(예정)`)으로 통일. 배지색 임박≤7 amber #f5a623·D-DAY 주황 #ff7a59·먼미래/과거 faint — 앱 기존 D-day 색 재사용, 신규 색 없음. 빌드타임 생성·런타임 무영향. 로컬 빌드는 sandbox 제한으로 Vercel typecheck+build 검증 위임. 큐 4→3. QA님 라이브 /game/[id](예: /game/007-first-light-2026·approx 게임 1건) 상단 4px 카테고리 바·제목 2rem·D-day 배지 4분기 색 확인 부탁.

## [2026-06-03 00:00] [기획자]
TODO 큐 3→4 (모드: 외형 집중, 큰 단위)
완료 처리: 1순위 [외형·회귀·캘린더] 출시 셀 카테고리 색 복구(CalendarView) — 개발자 23:20·QA 23:40 ✅ → 완료한 기능 이동.
추가: - [외형·신규컴포넌트] /game/[id] 하단 "같은 시기 출시" 관련 게임 미니카드 그리드 (디자이너 09:01안 Next 재경로, page.tsx 빌드타임 같은달±2주 추림 + 미니카드 그리드, 관련 0건 숨김 — #1과 같은 상세페이지 표면 묶음)
잔여 큐 1~4순위(전부 Next.js 경로): ①/game/[id] D-day 배지+카테고리 상단바(page.tsx·globals.css) ②이모지→SVG 1단계(layout/ViewToggle/HeroStrip/GameModal/ListView) ③임박 스트립 카테고리색 글로우(HeroStrip, 데스크톱 한정) ④관련 게임 미니카드 그리드(신규)
IDEAS 정리: 디자이너 16:50 폰트/토큰/헤더 복구 묶음(개발자 18:20 출고)을 완료로 IDEAS에서 제거.
신규 디자이너 제안 0·신규 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0.
a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드, 보류).

## [2026-06-02 23:40] [QA]
검증 대상: 출시 셀 카테고리 색 복구 (개발자 23:20, CalendarView.tsx·CalendarView.module.css)
데스크톱 1440: ✅
모바일 390: ⚠️ (라이브 실측 불가 — Chrome resize 뷰포트 미반영, innerWidth 1920 고정·matchMedia(max-width:480px)=false → 소스 검증 대체. 단 변경분은 미디어쿼리 비종속이라 모바일 동일 렌더)
상세: 라이브 데스크톱 실측 — 출시 셀 12개 전부 좌측 색띠(box-shadow inset 3px var(--cat)) + color-mix 면 tint 정상. --cat 인라인 주입 카테고리 일치(신서버 #ff8a65·글로벌 #ba68c8·모바일 #81c784, PC콘솔은 당월 출시 0건이라 미노출=정상). today 셀은 자체 파란 풀링(inset 2px #4a90e2) 유지·색띠 미적용 → 충돌 회피 확인. 콘솔 에러 0, 가로 오버플로 없음. 소스: .cellHas(L89, color-mix+#181d27 폴백·inset 3px 띠)가 @media(max-width:480px)(L237) 위라 뷰포트 비종속 → 모바일 동일. .cellToday/.cellSelected가 소스 순서상 .cellHas 뒤=우선. brace 54/54. 헬스체크 ✅: /·/sitemap.xml(XML)·/robots.txt·/game/sol-enchant-20260618·/new-servers 정상. 미해결 코드 버그 0.

## [2026-06-02 23:20] [개발자]
완료: 1순위 **[외형·회귀·캘린더] 출시 셀 카테고리 색 복구**(CalendarView). 이관 회귀로 출시 셀 `.cellHas`가 단색 #181d27이라 빈 셀과 차이가 거의 없고 카테고리는 점으로만 구분되던 것을, 좌측 카테고리 색띠 + 옅은 동색 면 tint로 복구.
변경된 파일: components/CalendarView.tsx(+2/−1 — `type CSSProperties` import·출시 셀 div에 `style={{ '--cat': CATEGORY_META[firstGame.category].color } as CSSProperties}` 주입, any 미사용)·components/CalendarView.module.css(+3/−1 — `.cellHas`를 color-mix 면 tint + `inset 3px 0 0 var(--cat)` 색띠로 교체, 미지원 폴백 #181d27 선행, brace 54/54).
비고: `.cellToday`/`.cellSelected`가 소스 순서상 `.cellHas` 뒤라 today(파랑)/선택(amber) 셀은 풀링 강조 유지→색띠는 평범한 출시 셀 한정(충돌 회피). 색점 보조 유지, 카테고리 4색(CATEGORY_META) 재사용·신규 색 없음. 로컬 빌드는 sandbox 디스크 제한으로 Vercel typecheck+build 검증 위임. 큐 4→3. QA님 라이브에서 출시 셀 좌측 띠+옅은 면이 그날 카테고리 색(모바일 초록·PC콘솔 파랑·글로벌 보라·신서버 주황)으로 보이는지·today/선택 강조 셀 무충돌·color-mix 미지원 폴백 확인 부탁.

## [2026-06-02 22:00] [기획자]
TODO 큐 5→4 (모드: 외형 집중)
완료 처리: 활성 운영자 요청 [UX·모바일] 임박 스트립 모바일 컴팩트화 — 개발자 21:20 완료·QA 21:40 ✅(데스크톱 실측, 모바일 ≤480px 소스검증) → USER_REQUESTS 아카이브 이동.
추가: 없음 / 완료·IDEAS 이동: 위 1건 완료
잔여 큐 1~4순위(전부 Next.js 이관 외형 회귀복구): ①출시 셀 카테고리색 복구(CalendarView.tsx/.module.css) ②/game/[id] D-day 배지+카테고리 상단바(page.tsx·globals.css) ③이모지→SVG 1단계(layout/ViewToggle/HeroStrip/GameModal/ListView) ④임박 스트립 카테고리색 글로우(HeroStrip, 데스크톱 한정).
신규 디자이너 제안 0(16:50 5건 전량 소진)·신규 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0.
a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드, 보류).

## [2026-06-02 21:40] [QA]
검증 대상: HeroStrip 모바일 컴팩트화 (개발자 21:20, HeroStrip.tsx·HeroStrip.module.css)
데스크톱 1440: ✅
모바일 390: ⚠️ (라이브 실측 불가 — Chrome resize 뷰포트 미반영, innerWidth 1920 고정 → 소스 검증 대체)
상세: 라이브 데스크톱 — gcalen.com 정상 렌더(h1 "🎮 게임 출시 캘린더"·당일 데이터 로드·"불러오는 중" 없음·갱신 2026.06.02), 콘솔 에러 0, 가로 오버플로 없음. 임박 카드 4건 표시·hover/glow 데스크톱 현행 유지(base 규칙 무변경=무회귀). 헬스체크 ✅: /·/sitemap.xml(XML)·/robots.txt·/game/sol-enchant-20260618·/new-servers 전부 정상. 모바일은 Chrome resize가 페이지 뷰포트에 미반영되어 라이브 실측 불가 → @media(max-width:480px) 소스 검증으로 개발자 4항목 확인: (1)임박행 min-height 140px→44px·flex-row·padding 축소로 영역 대폭 감소 (2)캘린더 첫 화면 진입 (3).card:nth-child(n+4){display:none}로 4번째 이후 숨김 (4).dot{background:var(--cat)}·HeroStrip.tsx가 CATEGORY_META color(모바일#81c784·PC콘솔#64b5f6·글로벌#ba68c8·신서버#ff8a65)를 --cat로 주입→색점 카테고리색 일치. brace 26/26 균형. 라이브 모바일 무회귀 단정 불가(실측환경 확보 시 재확인 권고). 미해결 코드 버그 0.

## [2026-06-02 21:20] [개발자]
완료: 1순위 **[UX·모바일] "🔥 출시 임박" 스트립 모바일 컴팩트화** (운영자 요청, 인벤 참고). 모바일(≤480px)에서 큰 세로 카드 1열 스택(~550px) → 가로 컴팩트 행(min-height 44px·카테고리 색점+게임명 ellipsis+우측 D-day)으로 재작성, `.card::before` 글로우·hover transform 제거, `.title` margin 축소. 3건 초과는 `.card:nth-child(n+4){display:none}`(Home.tsx slice 무변경)로 숨김 → 임박 영역 ~160px로 축소돼 캘린더가 첫 화면에 진입. 데스크톱 grid는 현행 유지(무변경).
변경된 파일: components/HeroStrip.tsx(+5/−1, CSSProperties import·`--cat` 인라인 style·dot span 추가)·components/HeroStrip.module.css(+~34, 모바일 블록 재작성, brace 26/26).
비고: 신규 색 없음(CATEGORY_META 4색 재사용). 로컬 빌드는 sandbox 디스크 제한으로 생략 → Vercel typecheck+build 검증 위임. QA: 라이브 모바일 폭(≤480px) 실측으로 (1)임박 영역 높이 축소 (2)캘린더 첫 화면 진입 (3)4번째 이후 행 숨김 (4)색점이 카테고리 색과 일치 확인 부탁. 데스크톱 그리드 무회귀도 확인. 큐 5→4.

## [2026-06-02 20:00] [기획자]
TODO 큐 5→5 (모드: 외형 집중) — 유지보수 사이클, 구조 무변경.
추가: 없음 / 완료·IDEAS 이동: 없음
1순위 = 활성 운영자 요청 [UX·모바일] '🔥 출시 임박' 스트립 모바일 컴팩트화(인벤 참고) 유지. 2~5순위 = 캘린더 출시셀 카테고리색 복구·/game/[id] D-day 배지·이모지→SVG 1단계·임박 스트립 글로우(데스크톱 한정).
직전 [브랜드토큰+Pretendard+헤더그라데이션] 개발자 완료·QA 18:40 ✅(데스크톱 실측; 모바일은 Chrome resize 미반영으로 소스검증) → 이미 완료 이동 확인. 모바일 무회귀는 다음 QA 실측환경 확보 시 재확인 권고(코드 버그 아님).
신규 디자이너 제안 0(최신 16:50 전량 반영)·신규 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0.
a11y 제안 0건 → IDEAS 보관(외형 모드, 보류).

## [2026-06-02 18:40] [QA]
검증 대상: 브랜드 토큰 복구 + Pretendard 재도입 + 헤더 그라데이션 타이틀 (개발자 18:20, globals.css·layout.tsx·ViewToggle/MonthTabs.module.css)
데스크톱 1440: ✅
모바일 390: ⚠️ (라이브 실측 불가 — 소스 검증 대체)
상세: 데스크톱 라이브 실측 — body Pretendard Variable 적용·h1 a 블루→퍼플 그라데이션 텍스트(linear-gradient 92deg #5b9dff→#c98ad6, clip:text)·🎮 표시·--accent #5b9dff·뷰토글/월탭 active 칩 그라데이션 모두 확인, 콘솔 에러 0, 가로스크롤 없음. ⚠️ Chrome resize가 뷰포트에 미반영(innerWidth 1920 고정)되어 모바일 390 라이브 렌더 실측 불가 → 소스 미디어쿼리 검증 대체: h1 1.8rem(≤480px)·MonthTabs overflow-x:auto·Filters flex-wrap·ListView 1열(grid 1fr)·GameModal width100%/max520/90vh 정상. 라이브 모바일 무회귀 단정 불가(다음 사이클 실측환경 확보 시 재확인). 미해결 코드 버그 0.

## [2026-06-02 17:50] [기획자]
운영자 직접 요청 1순위 신규 (모드: 외형 집중).
요청: "출시 임박 배너 모바일에서 너무 불편함" + 참고 https://www.inven.co.kr/webzine/calendar/
진단: HeroStrip이 모바일(≤480px)에서 1열 큰 카드 세로 스택(min-height 110px·최대 5건=~550px)이라 첫 화면을 다 잡아먹고 캘린더가 밀림. 인벤은 임박=단일 카운트다운 하이라이트+컴팩트 리스트(큰 카드 스택 없음).
조치: USER_REQUESTS 활성 등록 + TODO 1순위 추가 — [UX·모바일] HeroStrip 모바일 컴팩트화(가로 행 min-height 44px·색점+게임명+D-day, ::before 글로우/110px 제거, 모바일 최대 3건 nth-child(n+4) 숨김). 데스크톱 그리드 현행 유지. components/HeroStrip.tsx·.module.css.
완료 반영: 개발자 17:31 [브랜드 토큰+Pretendard+헤더 그라데이션] ✅ → 큐에서 빠짐. 잔여 회귀복구 4건 = 현 2~5순위. 임박 글로우(현 5순위)는 모바일 컴팩트화와 충돌 없게 데스크톱 한정으로 명시.
활성 사용자 요청 1 · 미해결 코드 버그 0 · 3사이클 정체 0 · a11y/리팩토링 0건. 코드 미수정(문서만).

## [2026-06-02 18:20] [개발자]
완료: 1순위 **[외형·회귀·높음] 브랜드 토큰 복구 + Pretendard 재도입 + 헤더 그라데이션 타이틀** (디자이너 16:50 ①②③ 묶음). (a) layout.tsx <head>에 Pretendard Variable jsdelivr CDN + preconnect, globals.css `--font-sans` 신설 → body 적용. (b) `--accent` #4a90e2→#5b9dff 복구, `--accent-2`/`--accent-grad`/`--radius`/`--radius-sm` 토큰 신설, ViewToggle·MonthTabs `.active`를 브랜드 그라데이션 칩으로, `a` 링크색 토큰화. (c) `.site-header` 배경 그라데이션+상단 글로우 ::before + h1 2.1rem/800 그라데이션 텍스트(모바일 1.8rem). 신규 색 없음(출고색 복구).
변경된 파일: app/globals.css(+38/−5), app/layout.tsx(+5), components/ViewToggle.module.css(+9/−2), components/MonthTabs.module.css(+6/−3) — 4파일 약 48줄 순증.
비고: 로컬 빌드는 sandbox 디스크 제한으로 생략, Vercel 빌드(typecheck+next build) 검증에 위임. h1 그라데이션 텍스트에 🎮 이모지 포함(emoji 글리프는 background-clip:text에도 자체 색 유지 — 이모지 분리는 4순위 SVG 작업에서). QA: 라이브에서 한글 Pretendard 렌더·헤더 h1 블루→퍼플 그라데이션 텍스트·뷰토글/월탭 active 칩 그라데이션·accent 밝은 블루·🎮 표시 실측 부탁. 큐 5→4.

## [2026-06-02 17:12] [기획자]
TODO 큐 전면 재구성 (모드: 외형 집중, 큰 단위). **vanilla→Next.js 이관 외형 회귀 복구로 전환.**
배경: 디자이너 16:50 발견(직전 "완료" 외형 자산이 이관 중 유실) 소스 재확인 → app/globals.css가 --accent:#4a90e2·시스템폰트·헤더 1.6rem 단색으로 회귀. 기존 큐 5건은 전부 죽은 vanilla 경로(script.js/styles.css/build.js/index.html) 참조라 라이브 Next 빌드에 안 닿음 → **폐기**.
교체: 디자이너 16:50 회귀복구 5제안(현행 Next 경로)으로 큐 재작성.
현재 큐 1~5: ①브랜드토큰+Pretendard+헤더그라데이션(globals.css·layout.tsx 묶음) ②캘린더 출시셀 카테고리색 복구(CalendarView.tsx·.module.css) ③상세 /game/[id] D-day배지+카테고리상단바+제목(page.tsx·globals.css) ④이모지→SVG 1단계 Next 재경로(layout/ViewToggle/HeroStrip/GameModal/ListView) ⑤임박 스트립 카테고리색 글로우 Next 재경로(HeroStrip).
IDEAS 환원(Next 재경로 필요): 관련게임 미니카드 그리드·통계줄 컬러칩(옛 build.js/script.js 참조).
개발자 주의: 외형 작업은 **app/·components/ 의 .tsx/.module.css/globals.css** 에서만. styles.css/script.js/build.js는 라이브 빌드 미반영(legacy). 검증은 `npm run typecheck` + `npm run build`.
활성 사용자 요청 0(SEO 보류) · 미해결 코드 버그 0 · 3사이클 정체 0 · a11y 제안 0건(IDEAS 보관). 코드 미수정(문서만).

## [2026-06-02 16:50] [디자이너]
외형 점검 완료 (모드: 시각 디자인 집중, a11y 보류). 실측 gcalen.com 데스크톱 홈/리스트/상세 + 신규 Next.js 소스 교차.
주요: **vanilla→Next.js 이관서 직전 출고 외형 자산 다수 유실 확인** — 라이브 Next 빌드에 Pretendard·#5b9dff accent·--accent-grad/--radius 토큰·캘린더 셀 카테고리 색띠·상세 D-day/백드롭이 모두 빠짐(변경로그엔 styles.css 기준 '완료'로 남음). 현행 Next 파일경로 기준으로 회귀 복구 제안 재작성.
DESIGN_NOTES에 외형 제안 5개 추가(폰트회귀·브랜드토큰회귀·헤더그라데이션·캘린더 카테고리색·상세 D-day배지). 임팩트 큰 2개(토큰/폰트/헤더 묶음, 상세 D-day)는 PROJECT_STATUS IDEAS 상단 등록.

## [2026-06-02 16:47] [QA]
검증 대상: 정기 헬스체크 (직전 개발자 14:29 출시 셀 카테고리색 악센트는 QA 14:40 검증 완료, 신규 개발 작업 없음)
결과: ✅ 정상
상세: 홈 HTML 200·`# 🎮 게임 출시 캘린더` 본문 정상, robots.txt 정상(sitemap 참조), sitemap.xml 200(application/xml), /game/sol-enchant-20260618 정적 상세페이지 정상 렌더, /new-servers 랜딩 정상(신서버 4건). 미해결 코드 버그 0.

## [2026-06-02 15:10] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위 권장)
완료 처리: 직전 1순위 [외형·캘린더] 출시 셀 좌측 악센트 카테고리색(--cat) (개발자 14:29·QA 14:40 ✅ 라이브 무회귀) → 완료한 기능 이동(개발자가 큐 5→4 반영).
추가: - [외형·D-DAY강조] 임박 스트립 카드 임박할수록 카테고리색 글로우 (디자이너 13:01 #4, IDEAS→5순위 승격). 'D-DAY 강조' 외형 모드 적합·기존 임박 스트립 표면 후속.
현재 큐 1~5: ①이모지 SVG 1단계 ②상세페이지 카드 헤더바+큰 D-day ③관련게임 미니카드 그리드 ④통계줄 컬러칩 ⑤임박 스트립 카테고리 글로우.
디자이너 신규 제안 0(최신 13:10분 전량 반영). a11y 제안 0건 → IDEAS 보관 유지.
활성 사용자 요청 0(SEO 보류) · 미해결 코드 버그 0 · 3사이클 정체 0. 코드 미수정(문서만).

## [2026-06-02 14:40] [QA]
검증 대상: 캘린더 출시 셀 좌측 악센트를 그날 카테고리 색으로(--cat 주입 + color-mix tint) (개발자 14:29, script.js/styles.css)
결과: ✅ 정상
상세: 라이브(gcalen.com) Chrome 실측 — 출시 셀 9개(전체 42셀)에 --cat 셀별 주입 확인(new_server #ff8a65 주황·global_aaa #ba68c8 보라·mobile_kr #81c784 초록). 강조 없는 셀은 좌측 box-shadow 악센트(3px inset)가 --cat색과 일치·면도 color-mix 9% 동색 tint 적용. day-soon 셀은 amber 면 유지+악센트 억제로 가드 정상 무충돌. 홈 HTML 200·games.json 45건 파싱 정상·콘솔 에러 0.

## [2026-06-02 14:29] [개발자]
완료: 1순위 [외형·캘린더] 출시 셀 좌측 악센트를 그날 카테고리 색으로.
시각 변화: 출시 1건↑ 셀의 좌측 악센트 띠가 지금까지 카테고리 무관 전부 파랑이던 것을 → 그날 대표(첫) 게임의 카테고리 색으로 표시(모바일 #81c784 초록·PC콘솔 #64b5f6 파랑·글로벌 #ba68c8 보라·신규서버 #ff8a65 주황). 띠 두께 2→3px, 셀 면도 같은 카테고리색 옅은 tint(color-mix 9%)로 칠해 날짜별 카테고리가 한눈에 구분됨. today/임박/선택 강조 셀은 가드로 보존, color-mix 미지원 브라우저는 기존 블루 면으로 폴백.
변경된 파일: script.js(+11, CATEGORY_COLORS 색맵 + renderCalendar --cat 주입), styles.css(.day-has 규칙 1줄 교체), PROJECT_STATUS.md, CHAT.md
비고: node --check ✓, CSS brace 309/309 균형. 카테고리 4색 재사용(신규 색 없음). data/games.json 무변경. 큐 5→4. QA: 라이브에서 출시 셀 좌측 띠 카테고리색 구분·강조 셀 무충돌·미지원 폴백 실측 부탁.

## [2026-06-02 14:10] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위 권장)
완료 처리: 1순위 [외형·캘린더] 빈 셀 타일감+컨테이너 패널 카드화 (개발자 13:29·QA 13:45 ✅ 라이브 무회귀) → 완료한 기능 이동(개발자가 큐 5→4 반영).
추가: - [외형·상세페이지] /game/{id} 카드 카테고리색 상단 바 + 큰 D-day 배지 (디자이너 13:01 #3, 높음 → 3순위. 라디얼 백드롭·#4 관련게임 그리드와 같은 상세페이지 표면 묶음). [외형·통계줄 컬러칩]은 5순위로 한 칸 내림.
현재 큐 1~5: ①출시 셀 좌측악센트 카테고리색 ②이모지 SVG 1단계 ③상세페이지 헤더바+D-day ④관련게임 미니카드 그리드 ⑤통계줄 컬러칩.
IDEAS 이동: 디자이너 13:01 #4(임박 스트립 카테고리색 글로우)·#5(--accent-grad active 칩 그라데이션) → 다음 사이클 큐 후보로 IDEAS 등록.
활성 사용자 요청 0(SEO 보류) · 미해결 코드 버그 0 · 3사이클 정체 0 · 신규 a11y 제안 0건(IDEAS 보관 유지). 코드 미수정(문서만).
## [2026-06-02 13:45] [QA]
검증 대상: 캘린더 빈 셀 타일감(--cell-bg)+컨테이너 패널 카드화(--cal-panel) (개발자 13:29, styles.css)
결과: ✅ 정상
상세: 라이브(gcalen.com) Chrome 실측 — 빈 셀 .day bg #161922(=--cell-bg)·hairline 보더 rgba(255,255,255,.05)로 body #0f1115와 분리돼 타일감 확인, .calendar-view bg #13151b·radius 14px·padding 14px 패널 카드 적용 확인. 셀 42개 정상 렌더·콘솔 에러 0. 홈 HTML 200·games.json 45건 파싱 정상.


## [2026-06-02 13:29] [개발자]
완료: 1순위 [외형·캘린더] 빈 셀 타일감 + 캘린더 컨테이너 패널 카드화.
시각 변화: (1) 출시 없는 빈 셀이 그동안 body 배경(--bg #0f1115)과 같아 "검은 공백"으로 읽히던 것을 한 톤 올린 --cell-bg(#161922) 면 + hairline 보더(rgba(255,255,255,0.05))로 바꿔 격자가 타일처럼 보임. (2) 캘린더 컨테이너 .calendar-view를 --cal-panel(#13151b)·border-radius 10→14px·padding 1rem→14px 패널 카드로 묶어 격자를 하나의 면으로 감쌈. 모바일(≤480px)은 padding 9px·radius 12px로 축소. 기존 강조 셀(today 파란보더·임박 amber·선택 채움·.day-has 좌측악센트)은 후행 셀렉터로 우선순위 유지되어 무회귀.
변경된 파일: styles.css(+6/-2줄: :root 토큰 3개 추가 + .calendar-view + .day base + 모바일 분기), PROJECT_STATUS.md, CHAT.md
비고: CSS-only(script.js 무변경). CSS brace 309/309 균형, node --check 통과. 다른 TODO 미터치. QA 권고 — 라이브에서 (1) 빈 달(출시 0건 달로 ‹ › 이동) 격자가 검은 공백 아닌 타일 면으로 보이는지, (2) 데스크톱/모바일 패널 카드 외곽 라운드·padding, (3) 오늘/임박/선택/출시 셀 강조가 base 톤에 묻히지 않는지 확인 부탁.

## [2026-06-02 13:12] [기획자]
TODO 큐 재구성 5건 유지 (모드: 외형 집중, 큰 단위 권장)
완료 처리: 1순위 [외형·SEO상세] /game/{id} 카테고리색 라디얼 백드롭 (개발자 13:29·QA 12:46 ✅) → 완료한 기능 이동.
승격(디자이너 13:01·13:10 신규 외형 제안): 
- 1순위 [외형·캘린더] 빈 셀 타일감 + 컨테이너 패널 카드화 (핵심 뷰 "검은 공백" 해소, 최약점)
- 2순위 [외형·캘린더] 출시 셀 좌측 악센트를 그날 카테고리 색으로 (1순위와 짝)
- 3순위 [외형·미니멀] 이모지 11종→인라인 SVG 스프라이트 1단계 (운영자 요청)
4·5순위 캐리오버: 통계줄 컬러칩·관련게임 미니카드 그리드.
IDEAS 환원: 카드 호버 입체감·로딩 스켈레톤 (상대적 저임팩트, 보존).
활성 사용자 요청 0(SEO 보류) · 미해결 코드 버그 0 · 3사이클 정체 0 · a11y 제안 0건 신규(IDEAS 보관 유지). 코드 미수정(문서만).

## [2026-06-02 13:10] [디자이너]
외형 점검 완료 (현재 모드: 시각 디자인 집중) — 운영자 요청 접수: "이모지 제거하고 SVG 미니멀".
주요: 사용자 노출 이모지 11종(🎮📅📋🔥★☆🛠️🏢📄▶🔗) 전수 인벤토리 → 인라인 SVG 스프라이트(Lucide 라인, currentColor 단색)로 통일하는 구체 스펙 작성(symbol path·CSS·치환 매핑·build.js 적용·분할 3단계 포함). 색 포인트는 h1 로고 1곳만, 나머지 단색이 미니멀 핵심. AGENTS.md 신규 이모지 금지 명문화 권고.
DESIGN_NOTES에 상세 스펙 1건 추가, PROJECT_STATUS IDEAS에 높음 등록.

## [2026-06-02 13:01] [디자이너]
외형 점검 완료 (현재 모드: 시각 디자인 집중, a11y 보류)
주요: 캘린더 빈 셀이 배경(#0f1115)과 동일해 격자가 "검은 공백"으로 읽힘 + 출시 셀 좌측 악센트가 카테고리 무관 전부 파랑 → 캘린더 시각 임팩트/차별화가 가장 약한 지점.
DESIGN_NOTES에 5개 외형 제안 추가(캘린더 빈셀 타일감·셀 카테고리색 차별화·상세페이지 헤더바+큰 D-day·임박 스트립 카테고리 글로우·미사용 --accent-grad로 active 칩 포인트화). 상위 2개(캘린더 빈셀·셀 카테고리색)는 PROJECT_STATUS IDEAS에 등록.

## [2026-06-02 12:46] [QA]
검증 대상: /game/{id} 상세페이지 카테고리색 라디얼 백드롭 (개발자 13:29, build.js)
결과: ✅ 정상
상세: 라이브(gcalen.com) Chrome 실측 — /game/007-first-light-2026(global_aaa) body 라디얼 글로우 rgba(186,104,200,.133)=#ba68c8 보라·background-attachment fixed(글로우 레이어 스크롤 고정) 확인, 콘솔 에러 0. 랜딩 /upcoming-games body backgroundImage:none(무변화) 확인. build.js catColor 4색 매핑·gamePage만 bodyAttr 주입·랜딩 pageShell 평문 소스 일치. 홈 HTML 200·games.json 45건 파싱 정상.

## [2026-06-02 13:29] [개발자]
완료: 1순위 **[외형·SEO상세] `/game/{id}` 상세페이지 카테고리색 라디얼 백드롭** 구현. 빌드타임 생성 상세페이지가 검정(#0f1115) 공백 한가운데 카드 1개로만 떠 화면 ~70%가 휑하던 문제 해소 — `<body>`에 카테고리색 라디얼 글로우(상단 중앙에서 퍼져 58%에서 페이드)를 깔아 빈 공간을 카테고리 색감으로 채움. 카테고리별 색(모바일=초록 #81c784 / PC·콘솔=파랑 #64b5f6 / 글로벌=보라 #ba68c8 / 신규서버=주황 #ff8a65, α≈13%)으로 페이지마다 분위기가 달라짐. 스크롤해도 글로우는 고정(background-attachment:fixed). 랜딩페이지(/upcoming-games 등)는 변화 없음.
변경된 파일: build.js (pageShell +1 인자·body 1줄 / gamePage 색매핑+bodyAttr 3줄 / return 1줄 = +~5줄)
비고: 빌드타임 생성이라 런타임 JS 무영향, 신규 색 토큰 없음(카테고리 4색 재사용). 생성물(game/*.html·sitemap)은 .gitignore라 Vercel 빌드에서 재생성 → 커밋은 build.js만. node --check ✓, `node build.js`로 게임 44개 재생성·global_aaa 게임 보라 백드롭·랜딩 `<body>` 평문 확인. QA: 라이브에서 상세페이지(예: /game/007-first-light-2026) 상단 카테고리색 라디얼 글로우·스크롤 시 고정·랜딩페이지 무변화 실측 부탁.

## [2026-06-02 12:10] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위 권장)
완료 처리: 1순위 [외형·신규컴포넌트] 헤더 아래 "🔥 출시 임박" 가로 하이라이트 스트립 (개발자 12:29·QA 11:46 라이브 무회귀 ✅) → 완료한 기능 이동, 잔여 4건 1~4순위로 당김.
추가: - [외형·로딩] 데이터 로드 스켈레톤 플레이스홀더 + 콘텐츠 페이드인 전환 (5순위, '로딩/전환 애니메이션' 카테고리, --surface 재사용·신규 색 없음·prefers-reduced-motion 분기).
디자이너 신규 제안 0(최신 09:01분 전량 처리 완료). a11y 제안 0건 → IDEAS 보관 유지.
활성 사용자 요청 0(SEO 보류). 미해결 코드 버그 0. 3사이클 정체 TODO 0. 코드 미수정(문서만).

## [2026-06-02 11:46] [QA]
검증 대상: 헤더 아래 "🔥 출시 임박" 가로 하이라이트 스트립 (개발자 12:29)
결과: ✅ 정상
상세: 라이브(gcalen.com) Chrome 실측 — 통계줄↔컨트롤 사이 "🔥 출시 임박" 스트립에 임박 4건이 가까운 순으로 노출(파판7리버스 D-1 / 미르의전설:진 D-2 / 메이크드라마:MAD D-2 / 고딕1리메이크 D-3) — 개발자 보고(D-1·D-2·D-2·D-3)와 일치. 카드 클릭→상세 모달(/game/ff7-rebirth-switch2-2026) 정상 오픈. 콘솔 에러 0, games.json 파싱 정상. D-DAY 주황색·0건 달 숨김은 오늘 해당 데이터(D-DAY 0건)가 없어 실측 불가하나 코드 로직(diff 0=D-DAY 색, imminent 0건 시 section.hidden) 정상 확인.

## [2026-06-02 12:29] [개발자]
완료: 헤더 아래 **"🔥 출시 임박" 가로 하이라이트 스트립** 구현 (1순위). 통계줄↔컨트롤 행 사이에 새 섹션(제목 "🔥 출시 임박" + 가로 스크롤 카드 띠). D-7 이내(D-DAY~D-7) 게임을 가까운 순 최대 5개 카드로 노출 — 카드마다 카테고리 라벨 + 게임명 + 큰 D-day 배지(D-DAY는 주황 #ff7a59, 그 외 임박 amber #f5a623), 왼쪽 4px 카테고리색 바·다크 그라데이션 배경·호버 상승. 카드 클릭 시 기존 상세 모달 오픈. **임박 게임 0건인 날(달)엔 스트립 전체가 숨김.** 실데이터(오늘 2026-06-02) 기준 임박 4건(D-1·D-2·D-2·D-3) 노출.
변경된 파일: index.html(+4), script.js(+~30, renderHeroStrip+클릭바인딩), styles.css(+~28)
비고: node --check ✓ / CSS brace 307/307 균형 / 신규 색 토큰 없음(카테고리 4색·기존 amber 재사용). QA께: 라이브에서 (1)스트립에 임박 카드 노출 (2)가로 스크롤 (3)카드 클릭→모달 (4)임박 0건 달 진입 시 스트립 숨김 실측 부탁. 잔여 TODO 4건 1~4순위로 당김.

---

_(오래된 137 개 항목은 archive/CHAT_2026-05.md로 이동됨)_
