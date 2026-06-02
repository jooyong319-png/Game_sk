## [2026-06-03 04:20] [개발자]
완료: 1순위 **[버그·SEO·동작] React 하이드레이션 에러 7건/로드 해소 (#418/#423/#425, 날짜 의존 SSR↔CSR 불일치)**. 원인=클라 컴포넌트들이 렌더 중 `new Date()`(현재 시각)에 의존 → 정적 빌드(SSR) 날짜와 클라 현재 날짜가 달라 D-day·'오늘' 셀·캘린더 커서 월·요일/D-day 텍스트가 불일치(#423로 루트 클라 재렌더·플래시·SSR SEO 손실). 해결=`page.tsx`(서버)에서 `serverNow=new Date().toISOString()`를 `<Home serverNow>` prop 주입 → Home에 `now` state(초기값 serverNow)를 두고 SSR/첫 클라 렌더가 동일 serverNow를 쓰게 함(서버 HTML==첫 렌더, 불일치 0). mount 직후 `useEffect` 1회로 실제 `new Date()`/이번 달 교체(하이드레이션 이후라 에러 아님). `now:Date`를 CalendarView·ListView에 스레딩, filteredGames/imminent/MonthTabs도 now 기준. HeroStrip(imminent에서 diff 수령)·GameModal·/game/[id](서버 정적)은 초기 SSR DOM 밖이라 무영향.
변경된 파일: app/page.tsx(+2)·components/Home.tsx(+21/−10)·components/CalendarView.tsx(+6/−5)·components/ListView.tsx(+4/−3)
비고: TypeScript strict 유지(any 0, serverNow:string·now:Date 명시). esbuild(tsx) 6파일 트랜스폼 OK. 로컬 빌드는 sandbox 디스크 제한 → Vercel typecheck+build 검증 위임. 큐 5→4(2~5순위 한 칸씩 당김). **QA님: gcalen.com DevTools 콘솔 #418/#423/#425 0건 + view-source 초기 SSR HTML에 캘린더 그리드/D-day 노드 존재(SEO 보존)·'불러오는 중' 플래시 제거 실측 부탁.**

## [2026-06-03 04:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·모바일·높음] Filters @media(≤480px) 모바일 블록 신설(검색 풀폭+셀렉트 2×2+위시 풀폭) — 개발자 03:20 출고·QA 03:44 소스검증(Chrome resize 뷰포트 미반영→소스 갈음) → 완료한 기능 이동(개발자 큐 5→4).
추가(5순위): - [외형·캘린더 범례] 카테고리 범례 8px 점+회색 텍스트(#aaa) → 카테고리 tint 미니 칩 (디자이너 01:05 데스크#2, components/CalendarView.tsx·CalendarView.module.css)
잔여 큐 1~5(전부 Next app/·components/): ①하이드레이션 에러 7건/로드 해소(버그·SEO·동작) ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] "같은 시기 출시" 관련게임 미니카드 그리드 ④리스트 카드 배너 카테고리색 그라데이션+D-DAY 리본 ⑤캘린더 범례 tint 칩
QA 03:44 재확인: 하이드레이션 #418/#423/#425 7건/로드 미해소 → 큐 1순위 대기.
사용자 요청 처리: 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0.
IDEAS 정리: 완료된 01:05 IDEA 2건(구 accent 전 표면 통일·Filters 모바일 블록) 제거(개발자 출고 반영).
a11y/리팩토링 제안 0건 큐잉 → IDEAS 보관 (외형 모드). 디자이너 01:05 데스크#3(필터 border/radius 토큰 정렬)은 일관성·리팩토링 성격이라 큐 X·IDEAS 보류.

## [2026-06-03 03:44] [QA]
검증 대상: Filters 모바일 @media(≤480px) 블록 신설 (검색 풀폭+셀렉트 2열+위시 풀폭, 개발자 03:20)
데스크톱 1440: ⚠️ (레이아웃 정상·하이드레이션 7건 잔존)
모바일 390: ⚠️ (소스 확정·Chrome resize 뷰포트 미반영으로 라이브 실측 불가)
상세: Filters.module.css 말미 @media(max-width:480px) 블록 실재 확인 — .search flex:1 1 100%·.label flex:1 1 calc(50%-0.25rem)·.label select width:100%·.wishBtn flex:1 1 100% 스펙대로(brace 13/13, Filters.tsx 무변경). 단 Chrome resize 390 후에도 innerWidth 1920·matchMedia(480)=false(직전 사이클 동일 한계)라 풀폭/2열 라이브 실측 불가→소스검증 갈음. 데스크톱 무영향(미디어쿼리 밖). 콘솔 하이드레이션 #425×3·#418×3·#423×1=7건 매 로드 재현(큐 2순위 미해소·이번 사이클 개발자는 Filters만). adsense no_div 1건 별개. 헬스체크 ✅: /(h1 🎮)·sitemap.xml(application/xml)·robots.txt·/game/sol-enchant-20260618·/new-servers(서버 12) 정상.

## [2026-06-03 03:20] [개발자]
완료: 1순위 **[외형·모바일·높음] Filters 모바일 @media(≤480px) 블록 신설** (디자이너 01:05 모바일#1). `components/Filters.module.css`에 모바일 블록이 0건이라 390px에서 `.search`(flex 1 1 200px)+카테고리/플랫폼/기간 셀렉트 3개+위시 버튼이 남는 폭에 불균등 줄바꿈하던 문제 해소. 파일 말미에 `@media(max-width:480px){ .filters{gap:0.5rem} .search{flex:1 1 100%} .label{flex:1 1 calc(50% - 0.25rem)} .label select{width:100%} .wishBtn{flex:1 1 100%;text-align:center} }` 신설 → 검색=풀폭 1줄·셀렉트=2×2 그리드형·위시=풀폭 버튼.
변경된 파일: components/Filters.module.css (+18줄, @media 블록 1개)
비고: 레이아웃만(신규 색 0). 데스크톱 단일 `.filters` 규칙은 미디어쿼리 밖이라 무영향. 위시 버튼 ★은 이미 SVG(#ic-star)라 Filters.tsx 무변경. CSS brace 13/13 균형. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 검증 위임. QA님 라이브 모바일 390px에서 검색 풀폭·셀렉트 2열·위시 풀폭 정렬 실측 부탁(Chrome resize 뷰포트 미반영 시 소스검증). 큐 5→4(2~5순위 한 칸씩 당김).

## [2026-06-03 03:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·팔레트·높음] 구 accent #4a90e2·rgba(74,144,226)→브랜드 #5b9dff 전 표면 통일 — 개발자 출고·QA 01:47 라이브 확정(리스트/모달/캘린더/월탭 신톤 #5b9dff, 잔존 구리터럴=의도된 focus-visible 2건·gcal 구글블루뿐) → 완료한 기능 이동(개발자 반영 확인, 큐 5→4).
추가(5순위): - [외형·리스트] 리스트 카드 배너(.cardBanner) 카테고리 단색 → 카테고리색 세로 그라데이션 + D-DAY 카드 좌상단 리본 강조 (components/ListView.module.css·ListView.tsx)
잔여 큐 1~5(전부 Next app/·components/): ①Filters @media(480) 모바일 블록 신설(검색 풀폭+셀렉트 2×2+위시 풀폭) ②하이드레이션 에러 7건 해소(버그·SEO) ③임박 스트립 글로우(데스크톱 한정) ④/game/[id] "같은 시기 출시" 미니카드 그리드 ⑤리스트 카드 배너 그라데이션
QA 재확인: Filters @media(480) 부재·하이드레이션 #418/#423/#425 7건/로드 미해소 = 큐 1·2순위로 계속 대기.
활성 사용자 요청 0(SEO 보류 — 안 건드림) · 미해결 코드 버그 1(하이드레이션, 큐 2순위) · 3사이클 정체 0 · 신규 디자이너 제안 0(01:05 처리 완료)
a11y/리팩토링 0건 큐잉 → IDEAS 보관 (외형 모드)

## [2026-06-03 01:47] [QA]
검증 대상: 구 accent #4a90e2·rgba(74,144,226) → #5b9dff 전 표면 통일 (개발자 06-03)
데스크톱 1440: ⚠️ (accent 통일 라이브 확정·단 하이드레이션 에러 7건 잔존)
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920·matchMedia(480)=false → 소스검증)
상세: 라이브 Chrome 실측 — todayBtn 보더 rgba(91,157,255,0.4)·캘린더/리스트/모달/월탭 전부 신톤 #5b9dff 통일 확인(구 리터럴 잔존=의도된 focus-visible 2건·gcal 구글블루뿐). 캘린더 125셀·overflowX 0·h1 🎮 정상. ★단 콘솔 React 하이드레이션 #425×3·#418×3·#423×1=**7건 매 로드 재현**(00:47 BUG 미해소, 큐 2순위 대기 — 이번 사이클 개발자는 accent만 작업). adsense no_div 1건은 광고슬롯 별개. 모바일: accent 치환은 비미디어 base 규칙이라 모바일에도 적용 ✅, Filters @media(480) 블록 여전히 부재(큐 1순위 미착수). 헬스체크 ✅: /(h1 🎮)·sitemap.xml(xml)·robots.txt·/game/sol-enchant-20260618·/new-servers(서버12) 정상.

## [2026-06-03] [개발자]
완료: 1순위 **[외형·팔레트·높음] 구 accent #4a90e2·rgba(74,144,226) 리터럴 → 브랜드 var(--accent) #5b9dff / rgba(91,157,255) 전 표면 통일** (디자이너 01:05 데스크#1). 헤더/뷰토글/월탭/today만 신톤이고 리스트·모달·캘린더·월탭 일부 면이 구톤이라 블루가 두 톤으로 갈리던 문제 해소. 치환: ListView .monthHeader·.item:hover·.date / GameModal .source·.detail:hover / CalendarView .navBtn:hover·.todayBtn(+hover)·.dayRow:hover / MonthTabs .tab:hover. enumerate에 없던 동일 두 톤 잔존면(navBtn·todayBtn·dayRow·MonthTabs)까지 함께 치환해 제목 "전 표면 통일"을 한 사이클로 완결.
변경된 파일: components/ListView.module.css(~4값)·GameModal.module.css(~3값)·CalendarView.module.css(~6값)·MonthTabs.module.css(2값)
비고: 유지(미변경) — GameModal .gcal:hover rgba(66,133,244)(구글 브랜드 블루)·CalendarView .cell/.cellClickable:focus-visible #4a90e2 2건(a11y, 외형 모드 제외). 신규 색 0(#5b9dff=기존 출고색), 값만 치환이라 brace 무변동(33/20/62/6 균형). grep 검증: 구 리터럴 잔존=의도한 focus-visible 2건+gcal뿐. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 검증 위임. QA님 라이브 1440에서 리스트 .date/.item:hover·모달 출처링크·캘린더 오늘/네비 버튼 hover가 헤더 타이틀과 동일 #5b9dff 톤인지 실측 부탁. 큐 5→4.

## [2026-06-03 02:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·버그·캘린더·높음] 요일 헤더(.dayHead) 주말 색 미적용 fix — 개발자 출고·QA 00:47 라이브 실측(일 #e57373·토 #7aa7ff·평일 #888) → 완료한 기능 이동·BUG 해소.
추가: - [외형·팔레트·높음] 구 accent #4a90e2→#5b9dff 전 표면 통일(디자이너 01:05 데스크#1, 리스트/모달/캘린더 잔존 리터럴 치환) / - [외형·모바일·높음] Filters @media(480) 모바일 블록 신설(디자이너 01:05 모바일#1, 검색 풀폭+셀렉트 2×2+위시 풀폭) / - [버그·SEO] React 하이드레이션 에러 7건/로드 해소(QA 00:47, 날짜 의존 SSR↔CSR 불일치·#418/#423/#425 → suppressHydrationWarning/mount 가드)
큐 1~5: ①구 accent 통일 ②Filters 모바일 블록 ③하이드레이션 에러(버그) ④임박 스트립 글로우(데스크톱) ⑤/game/[id] 관련게임 그리드. 디스플레이스(리스트 배너 그라데·--accent-grad 칩)는 다음 후보 IDEAS 인접 보존.
사용자 요청 처리: 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0.
a11y/리팩토링 제안 0건 큐잉 → IDEAS 보관 (외형 모드). 디자이너 01:05 인벤 제안(핫카드·이벤트 타입 배지)은 데이터/판단 선결로 IDEAS 유지.

## [2026-06-03 01:05] [디자이너]
외형 점검 완료 (데스크 1440 + 모바일 390 소스검증 + 인벤 비교)
데스크 주요: 리스트/모달/캘린더에 구 accent #4a90e2·rgba(74,144,226) 잔존 → 브랜드 #5b9dff로 통일 제안(헤더만 신톤이라 면마다 블루 두 톤으로 갈림). +범례 tint 칩·필터 토큰(radius/border) 정렬.
모바일 주요: Filters에 @media(max-width:480px) 블록 부재 → 검색+셀렉트3+위시 불규칙 줄바꿈, 풀폭검색+2×2 셀렉트 블록 신설 제안. (Chrome resize 미반영 여전 → 소스검증)
인벤 참고: 핫카드+라이브 카운트다운(임박 1건 대형화, 데이터 무관)·이벤트 타입 색배지(테스트/얼리액세스/쇼케이스, 데이터 선결).
DESIGN_NOTES에 6개 제안 추가(데스크3+모바일1+인벤2), 임팩트 큰 2건(accent 통일·모바일 필터) PROJECT_STATUS IDEAS 등재. 코드 미수정(문서만).
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
