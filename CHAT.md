## [2026-06-03 00:47] [QA]
검증 대상: 요일 헤더(.dayHead) 주말 색 미적용 fix (개발자 06-03)
데스크톱 1440: ⚠️ (요일헤더 fix 자체는 ✅, 단 콘솔 React 하이드레이션 에러 신규 발견)
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정·matchMedia(480)=false → 헤더색은 비미디어 CSS라 동일 적용 확인, 모바일 전용 렌더 실측 불가)
상세: 라이브 Chrome 실측 — 요일 헤더 일=rgb(229,115,115)·토=rgb(122,167,255)·평일=rgb(136,136,136)로 **fix 확정**(셀 날짜와 동일 톤). today 채움 원형(accent bg·반경50%·"3")·셀날짜 주말색·overflowX 0·캘린더 125셀 정상. **★단 콘솔에 React 하이드레이션 에러 #418/#423/#425 7건이 매 로드 재현**(직전 사이클 '콘솔 0' 대비 신규) → BUGS [공통] 등록. 추정: 날짜 의존 SSR/CSR 불일치(#423로 루트 클라 재렌더·'불러오는 중' 플래시). 헬스체크 ✅: /(h1 🎮 게임 출시 캘린더)·/sitemap.xml(application/xml)·/robots.txt·/game/sol-enchant-20260618·/new-servers(서버 12개) 정상.

## [2026-06-03] [개발자]
완료: 1순위 **[외형·버그·캘린더·높음] 요일 헤더(.dayHead) 주말 색 미적용 수정** (QA 06-02 23:48 BUG). 원인: `.dayHead{color:#888}`(module.css L62)가 `.sun`/`.sat`(L45-46)보다 소스 후행+동일 특이도(1클래스)라 일/토 헤더를 회색으로 override(셀 날짜는 `.cellDate.sun` 2클래스라 정상). 권장안(a)로 `.dayHead` 블록 직후 2클래스 규칙 `.dayHead.sun{color:#e57373}`·`.dayHead.sat{color:#7aa7ff}` 추가 → 특이도 2로 override 역전, 일=빨강·토=파랑(셀 날짜 톤 일치).
변경된 파일: components/CalendarView.module.css (+3: 주석1+규칙2)
비고: tsx 헤더 div는 이미 `${styles.dayHead} ${sun|sat}` 부여라 무변경. 신규 색 0(주말 2색 재사용), CSS brace 62/62. 로컬 tsc/build는 sandbox 디스크 제한으로 Vercel(typecheck+build) 검증 위임. QA님 라이브에서 일요일 헤더=빨강·토요일 헤더=파랑(셀 날짜와 동일 톤) 실측 부탁. 큐 5→4.

## [2026-06-03 00:12] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·캘린더·높음·묶음] 캘린더 시각 강화 3종(주말 색 구분·today 채움 원형·모바일 출시셀 강화) — 개발자 23:29·QA 23:48 검증 → 완료한 기능 이동(개발자가 큐 5→4 반영).
추가(1순위): - [외형·버그·캘린더·높음] 요일 헤더(.dayHead) 주말 색 미적용 수정 (QA 23:48 발견) — 셀 날짜는 적용되나 헤더만 회색(.dayHead{color:#888}가 .sun/.sat보다 후행·동일 특이도라 override). .dayHead.sun/.sat 2클래스 규칙 추가(또는 블록 후행 이동)로 마감. 방금 출고한 외형 기능의 미완분이라 작은 단위 예외로 큐잉.
잔여 큐 1~5(전부 Next app/·components/): ①요일 헤더 주말 색 fix ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] 미니카드 그리드 ④리스트 카드 배너 그라데 ⑤--accent-grad 그라데 칩
활성 사용자 요청 0(SEO 보류)·미해결 코드 버그 0(요일헤더는 본 큐 1순위로 처리)·3사이클 정체 0·신규 디자이너 제안 0
a11y/리팩토링 0건 → IDEAS 보관 (외형 모드)

## [2026-06-02 23:48] [QA]
검증 대상: 캘린더 시각 강화 3종 (주말 색 구분·today 채움 원형·모바일 출시셀 강화) (개발자 23:29)
데스크톱 1440: ⚠️ (요일 헤더 주말색 미적용 — 셀 날짜는 정상)
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정·matchMedia(480)=false → 소스검증 대체)
상세: 라이브 Chrome 실측 — today 채움 원형 ✅(accent#5b9dff bg·border-radius 50%·흰자 "2"·"오늘" 텍스트배지 제거 확인), 선택 셀 날짜 흰색 ✅, 셀 날짜 주말색 ✅(.cellDate.sun 일=rgb(229,115,115)·.cellDate.sat 토=rgb(122,167,255), 각 6셀). **단 요일 헤더(.dayHead)는 회색 #888 잔존(일/토 동일 rgb(136,136,136))** → `.dayHead{color:#888}`(module.css L62)가 `.sun/.sat`(L45-46)보다 후행·동일 특이도라 override. 셀 날짜만 2클래스라 정상. → BUGS 등록. 모바일 출시셀 tint16%·좌띠4px·점7px는 소스확인 ✅(뷰포트 미반영으로 렌더실측 불가). 콘솔 에러 0·가로오버플로 0(scrollWidth≤innerWidth). 헬스체크 ✅: /(h1 게임 출시 캘린더·🎮 0)·/sitemap.xml(XML·50 URL)·/robots.txt·/game/sol-enchant-20260618(상세 정상)·/new-servers(서버 12개) 정상. 노출 이모지 0·svg.ic 5종 렌더.

## [2026-06-02 23:29] [개발자]
완료: **[외형·캘린더·높음·묶음] 캘린더 시각 강화 3종** (1순위) — (a) 주말 색 구분: 요일 헤더·출시셀 날짜에 `getDay()` 기반 일/토 클래스(.sun #e57373·.sat #7aa7ff 톤다운), 선택 셀 날짜는 흰색 유지. (b) today 날짜 채움 원형(.cellTodayNum, var(--accent) 배경)으로 구글캘린더식 강조, "오늘" 텍스트 배지 제거·셀 테두리 약화(rgba(91,157,255,0.45)). (c) 모바일(≤480px) 출시셀 tint 8→16%·좌측 색띠 3→4px·점 6→7px로 점 신호 강화(데스크톱 현행 유지).
변경된 파일: components/CalendarView.tsx (+5/−4), components/CalendarView.module.css (+20/−10)
비고: 신규 색=주말 2색만, 카테고리/accent 토큰 재사용. CSS brace 59/59. 로컬 tsc/build는 sandbox 디스크 제한으로 Vercel(typecheck+build) 검증 위임. QA님 라이브 확인 부탁 — ①요일 헤더 일=빨강·토=파랑 + 셀 날짜 동일 ②today 채움 원형(배지 없음)·선택 셀 날짜 흰색 ③모바일 출시셀 색/띠/점 진해짐. 큐 5→4(2~5순위 한 칸씩 당김).

## [2026-06-02 23:12] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 1순위 [외형·미니멀·운영자요청] 이모지→SVG **2단계**(잔존 전량: Filters ★·GameModal 📅📄↗·ListView 📅·GoogleCalendarButton 📅·상세 📅 + 스프라이트 #ic-file·#ic-arrow-ur) — 개발자 23:28·QA 22:47 ✅(데스크톱 실측·모바일 소스검증, 라이브 노출 이모지 0건·콘솔 0·가로오버플로 0) → 완료한 기능 이동. **운영자 "이모지 제거·SVG 미니멀" 요청 1·2단계 전량 출고 완료.**
추가: - [외형·브랜드통일] `--accent-grad` 소비(뷰토글·MonthTabs·퀵칩 active 그라데이션 + MonthTabs hover 잔여토큰 정렬) → IDEAS에서 큐 **5순위** 승격
잔여 큐 1~5(전부 Next app/·components/): ①캘린더 시각 강화 묶음 ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] 미니카드 그리드 ④리스트 카드 배너 그라데 ⑤--accent-grad 그라데 칩
활성 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0·신규 디자이너 제안 0(20:50 처리 완료)
a11y/리팩토링 0건 → IDEAS 보관 (외형 모드)
## [2026-06-02 22:47] [QA]
검증 대상: 이모지→SVG 2단계 잔존 전량(Filters ★·GameModal 📅📄↗·ListView 📅·GoogleCalendarButton 📅·상세 📅) + 신규 스프라이트 #ic-file·#ic-arrow-ur (개발자 23:28)
데스크톱 1440: ✅
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정·matchMedia(480)=false → 소스검증 대체)
상세: 라이브 Chrome 실측 — 홈 노출 이모지 0건(📅📄★↗🎮🔥📋☆ 등 12종 스캔 0), h1 #ic-gamepad SVG, svg.ic 5종 전부 비제로 사이즈. 카드 모달 오픈 실측: 잔존 0 + 신규 #ic-file·#ic-arrow-ur(×2)·#ic-calendar·#ic-star 전부 렌더(zero-size 0)·모달 뷰포트 내·가로오버플로 0. 콘솔 에러 0. 캘린더 137셀 정상('불러오는 중' 해소). 스프라이트 symbol 7종 전부 정의. 모바일: .ic 규칙 globals.css L176~191(@media L57 밖)·em 사이즈→뷰포트 비종속 동일 렌더, 소스 노출 이모지 grep 0건(app·components·globals·layout). globals.css brace 58/58. 헬스체크 ✅: /·/sitemap.xml(XML)·/robots.txt·/game/sol-enchant-20260618·/new-servers(서버 12개) 정상. 미해결 코드 버그 0.
## [2026-06-02 23:28] [개발자]
완료: **[외형·미니멀·운영자요청] 노출 이모지→인라인 SVG 2단계** — 1단계 후 라이브 잔존 이모지 전량 정리. layout 스프라이트에 `#ic-file`·`#ic-arrow-ur` 2종 추가(DESIGN_NOTES 13:10 스펙 path 그대로, viewBox 0 0 24 24, #ic-calendar 기존 재사용). 잔존 노출 이모지를 `<svg class="ic"><use/></svg>`로 일괄 치환: Filters ★→#ic-star+.ic-fill / GameModal 출처보기 ↗→#ic-arrow-ur·📅 캘린더추가→#ic-calendar·📄 전체페이지 ↗→#ic-file+#ic-arrow-ur / ListView 출시일 📅→#ic-calendar / GoogleCalendarButton 📅→#ic-calendar / app/game/[id] 출시일 📅→#ic-calendar(서버 컴포넌트, layout 스프라이트 상속 OK). 전부 currentColor 단색(.ic 규칙 재사용, 신규 색 0). grep 검증: app·components 노출 이모지(📅📄★↗) 0건. 네비 글리프 ← → ‹ › 는 이모지 아님→스코프 외.
변경된 파일: app/layout.tsx(+2), components/Filters.tsx(+1/−1), components/GameModal.tsx(+3/−3), components/ListView.tsx(+1/−1), components/GoogleCalendarButton.tsx(+1/−1), app/game/[id]/page.tsx(+1/−1) — 총 6파일 +9/−7
비고: 로컬 tsc/build 미실행(sandbox 디스크). Vercel typecheck+build 검증 위임. QA님 라이브에서 노출 이모지 0건(특히 위시 필터 버튼·모달 액션 3종·리스트/상세 출시일) + 새 #ic-file/#ic-arrow-ur 렌더 실측 부탁. 큐 5→4(2~5순위 한 칸씩 당김).
## [2026-06-02 22:12] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 1순위 [외형·미니멀·운영자요청] 이모지→SVG **1단계**(헤더/뷰토글/임박/위시) — 개발자 21:30·QA 21:48 ✅(데스크톱 실측·모바일 소스검증, 콘솔 0·가로오버플로 0) → 완료한 기능 이동.
추가: - [외형·미니멀·운영자요청] 이모지→SVG **2단계**(잔존 전량: Filters ★·GameModal 📅📄↗·ListView 📅·GoogleCalendarButton 📅·상세 📅, layout 스프라이트에 #ic-file·#ic-arrow-ur 추가) → 큐 **1순위** 승격. QA 21:48이 IDEAS로 올린 위시 필터 ★ 잔존을 흩어진 나머지와 묶어 운영자요청 마무리(큰 단위).
잔여 큐 1~5(전부 Next app/·components/): ①이모지→SVG 2단계 ②캘린더 시각 강화 묶음 ③임박 스트립 글로우(데스크톱) ④/game/[id] 미니카드 그리드 ⑤리스트 카드 배너 그라데
신규 디자이너 제안 0·신규 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0
a11y/리팩토링 0건 → IDEAS 보관 (외형 모드)
## [2026-06-02 21:48] [QA]
검증 대상: 이모지→인라인 SVG 1단계 (헤더/뷰토글/임박/위시) (개발자 21:30)
데스크톱 1440: ✅
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정 → 소스검증 대체)
상세: 라이브 Chrome 실측 — h1 텍스트 "게임 출시 캘린더"(🎮 잔존 0)·헤더 #ic-gamepad SVG(accent)·뷰토글 #ic-calendar/#ic-list·임박 #ic-flame SVG 렌더, 스프라이트 symbol 5종 정의. 리스트뷰 위시 별 #ic-star SVG 44개(ic-fill 토글) 정상. 콘솔 에러 0·가로 오버플로 0(scrollWidth=clientWidth). ※잔존 이모지 1건: 위시 필터 버튼 "★ 위시리스트"(Filters.tsx L78) — 1단계 스코프 외(개발자는 카드/모달 위시만 변환)·동작 정상이라 BUGS 아님 → IDEAS 등록. .ic 규칙 @media 밖·em 사이즈라 모바일 동일 렌더(뷰포트 비종속). globals.css brace 58/58. 헬스체크 ✅: /·/sitemap.xml(XML)·/robots.txt·/game/sol-enchant-20260618·/new-servers 정상(※WebFetch 홈은 CDN 캐시로 구 🎮 노출됐으나 라이브 Chrome 실측은 SVG 반영 확인). 미해결 코드 버그 0.
## [2026-06-02 21:30] [개발자]
완료: 1순위 **[외형·미니멀·높음·운영자요청] 노출 이모지 → 인라인 SVG (1단계: 헤더/뷰토글/임박/위시)**. OS별 이모지 편차 제거·클린 미니멀. DESIGN_NOTES 13:10 Lucide 라인 스프라이트 스펙대로 구현.
변경된 파일: app/layout.tsx(+8 — `<body>` 최상단에 `<svg width=0 height=0 position:absolute aria-hidden>` 스프라이트(symbol 5종 #ic-gamepad/#ic-calendar/#ic-list/#ic-flame/#ic-star, viewBox 0 0 24 24) + h1 로고 🎮을 `<svg class="ic ic-gamepad"><use href="#ic-gamepad"/></svg>`로 치환)·components/ViewToggle.tsx(+2/−2 — 📅→#ic-calendar·📋→#ic-list)·components/HeroStrip.tsx(+1/−1 — 🔥→#ic-flame)·components/GameModal.tsx(+1/−1 — 위시 ★/☆를 `<svg class="ic [ic-fill]"><use href="#ic-star"/>` class 토글로)·components/ListView.tsx(+1/−1 — 위시 ★/☆ 동일)·app/globals.css(+20 — `.ic`{1em·vertical-align -0.14·flex-shrink 0·fill none·stroke currentColor·width 1.75·round}·`.ic-fill`{fill currentColor·stroke none}·`.ic-gamepad`{color var(--accent)}, brace 58/58).
비고: 색은 전부 currentColor 단색, 유일 컬러 포인트 헤더 🎮(.ic-gamepad=var(--accent))·🔥 단색 유지. 위시 별 토글은 textContent 교체 대신 ic-fill class 토글(활성 채움, 색은 버튼 .wishOn #f5b400을 currentColor로 상속). 2·3단계(카드/모달 메타·액션 🛠️🏢📄▶🔗·build.js SEO)는 후속 TODO — GameModal 📅캘린더추가·📄전체페이지·ListView 📅출시일은 의도적 미변경. 로컬 빌드는 sandbox 디스크 제한으로 Vercel typecheck+build 검증 위임. 큐 5→4. QA님 라이브에서 헤더 게임패드 아이콘(accent색)·뷰토글 캘린더/리스트 라인아이콘·임박 불꽃·위시 별 토글(빈/채움) 렌더·이모지 잔존 0 확인 부탁.
## [2026-06-02 21:12] [리서처]
리서치 완료 (4개 카테고리)
- 모바일 3→0, PC/콘솔 2→0, 글로벌 3→0, 신규서버 9→0 (후보→통과)
- 신규 0개 / 갱신 0개 (메타데이터만) / 정리(180일+) 0개
- 총 등록 44개 (최오래 dk모바일 번영의월드 173일=보관)
[검증 탈락]
- 메이플 챌린저스 월드 시즌2(6/19?): 시즌제 임시서버(규칙10)+출처 hitpaw 블로그 비공식·시즌2/3 충돌 → 탈락
- 에오스블랙 부스팅서버 루스캠프/마룬캠프: 인벤+ZDNet(06-02) 2출처지만 "운영종료 후 일반서버 이전"=임시서버(규칙10), 오픈일 미공지(사전예약 6/2~6/23만) → 탈락
- 나이트크로우 에스텔라: 공지ID 469530(<5/21 738219)=과거 서버 → 탈락
- 아키에이지워 이녹: "08/21(수)" 요일불일치(26년 8/21=금)=과거 공지 → 탈락
- 프라시아 카렐: 2023년 공지 → 탈락
- 로드나인 디나페리·레이븐2 ZERO/ZERO2: 이미 등록됨
## [2026-06-02 21:10] [기획자]
TODO 큐 3→5 (모드: 외형 집중, 큰 단위)
추가: - [외형·캘린더·높음·묶음] 캘린더 시각 강화 3종 (주말 색 일=빨강#e57373/토=파랑#7aa7ff + today 채움 원형(구글캘린더식, .cellTodayBadge 제거) + 모바일 cellHas tint 8→16%·띠 3→4px·dot 6→7px) — 디자이너 20:50 데스크#1·#2+모바일#1, CalendarView.tsx/.module.css 한 묶음
       - [외형·리스트카드·보통] 리스트 카드 배너 플랫 단색→카테고리 그라데이션(ListView, 56→64px, SVG 워터마크는 이모지→SVG 후속) — 디자이너 20:50 인벤#2
디자이너 20:50 제안 5건 처리: 높음 3(캘린더)→묶음 큐 승격, 인벤#2→큐 5순위, 인벤#1(위시 인기 TOP5)→데이터 선결로 IDEAS 보류
잔여 큐 1~5순위(전부 Next.js app/·components/): ①이모지→SVG 1단계(운영자요청) ②캘린더 시각 강화 묶음 ③임박 스트립 카테고리색 글로우(데스크톱 한정) ④/game/[id] 미니카드 그리드 ⑤리스트 카드 배너 그라데
완료/IDEAS 이동: 없음(직전 완료분은 00:00 사이클서 정리)
신규 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0·a11y/리팩토링 0건(외형 모드 IDEAS 보관)
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
