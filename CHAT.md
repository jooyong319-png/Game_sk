## [2026-06-03 20:47] [QA]
검증 대상: 캘린더 셀 게임명 word-break:break-all→keep-all + overflow-wrap:anywhere (개발자 20:27 c52efe0)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize 실뷰포트/mq480 미반영 → 360px 합성 리플로 갈음)
상세: 라이브 실측 — .cellName computed word-break:keep-all·overflow-wrap:anywhere·line-clamp 2 적용 확인. 문제됐던 "파이널 판타지 7 리버스 (Switch 2)" 셀이 어절 단위 2줄 클램프(scrollW 149=clientW, 셀 내부 오버플로 0)로 라틴/괄호 글자단위 절단 해소. 가로 오버플로 0(docScrollW 1905<1920). 콘솔 React #418/#423/#425·에러 0건(MetaMask 확장 경고만 → 하이드 해소 유지). 360 합성: 캘린더 grid(296=296)·main 오버플로 0, /game/sol-enchant 상세 D-15·related 그리드 오버플로 0·콘솔 에러 0. 셀명은 ≤480서 display:none이라 금일 변경 모바일 무영향. 헬스 ✅(홈 h1·sitemap XML·robots·상세·new-servers 12). 신규 BUGS 0.
※resize_window innerWidth/matchMedia 미반영(1920 고정·mq480 false) 환경 한계 → 1920 실측+360 합성 리플로 대체. 금일 변경=데스크톱 전용 셀명 타이포라 대표성 충분.

## [2026-06-03 20:27] [개발자]
완료: **[외형·타이포·높음] 캘린더 셀 게임명 `word-break:break-all`→`keep-all` + `overflow-wrap:anywhere`** (큐 1순위)
라이브 데스크 1440서 셀 게임명이 글자 단위로 절단("파이널 판타지 7 리버스 (Switch↵2)"·라틴/괄호 어색 절단)되던 결함 해소. `.cellName`의 `word-break:break-all`→`keep-all`(한글 어절 보존·공백에서만 줄바꿈)로 교체 + `overflow-wrap:anywhere`(공백 없는 초장문 영문 안전망) 추가. `-webkit-line-clamp:2`·말줄임 2줄 클램프 그대로 유지.
변경된 파일: components/CalendarView.module.css (+1줄 추가/1줄 교체)
비고: 신규 색 0·CSS brace 63/63 균형·tsx 무변경. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 캘린더 셀 게임명이 어절 단위로 자연스럽게 2줄 클램프되는지·라틴 단어 중간 절단 해소·가로 오버플로 0 실측 부탁.

## [2026-06-03 13:40] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 직전 1순위 '리스트 카드 배너 카테고리 세로 그라데이션 + D-DAY 좌상단 리본' 개발자 13:20·QA 13:30 라이브 ✅ → 완료한 기능 이동(개발자 5→4 반영 확인)
추가: - [외형·타이포·높음] 캘린더 셀 게임명 `word-break:break-all`→`keep-all`+`overflow-wrap:anywhere` (디자이너 13:05 데스크#1, 라이브 가시 타이포 결함 → 신규 1순위)
유지: 인트로 subtitle 위계·MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩 → 2~5순위로 한 칸씩 밀림
IDEAS 보관: 디자이너 13:05 잔여 보통 4건(통계줄 카테고리 4색 분해·헤더 듀얼 브랜드 radial·리스트 배너 모바일 40px·image_url 배경이미지)
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).

## [2026-06-03 13:30] [QA]
검증 대상: 리스트 카드 배너 카테고리 세로 그라데이션 + D-DAY 좌상단 리본 (개발자 13:20 a5e1a57)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize 실뷰포트/mq(≤480) 미반영 → 358px 합성 리플로 갈음)
상세: 라이브 캐시버스트 — 리스트뷰 .cardBanner 세로 그라데(computed linear-gradient(180deg, cat → cat 34%alpha))·D-DAY 리본 1개만(글로벌 보라 #ba68c8, diff===0 한정)·과거('출시됨')카드 무충돌. 콘솔 React #418/#423/#425·에러 0건(MetaMask 확장 경고 2건만) → 하이드레이션 7건 라이브 미재현(05:47 해소 확정 유지). 가로 오버플로 0(scrollW1905<1920). 358 합성: 리스트 카드 단일컬럼·리본 카드 내부(right70<342)·오버플로 0; /game/[id] 상세 백드롭·'같은 시기' 6장 단일컬럼·오버플로 0. 헬스 ✅(홈 h1·sitemap XML·robots·상세 D-15·new-servers 12). 신규 BUGS 0.
※resize_window 실뷰포트/미디어쿼리 미반영(innerWidth 1920·matchMedia480 false)→1920 실측+358 합성 대체. 금일 변경=그라데/리본(미디어쿼리 무관)이라 합성 대표성 충분.

## [2026-06-03 13:20] [개발자]
완료: **[외형·리스트·보통] 리스트 카드 배너 카테고리 세로 그라데이션 + D-DAY 카드 좌상단 리본** (큐 1순위)
카드 상단 `.cardBanner`가 카테고리 단색 tint라 밋밋하고 D-DAY가 amber border로만 구분되던 문제 해소. (a) `.cardBanner`를 카테고리색 세로 그라데이션(`linear-gradient(180deg, var(--cat), color-mix(in srgb,var(--cat) 34%,transparent))`, 단색 `var(--cat)` 폴백 선행)으로 — 배너에 인라인 `--cat` 주입. (b) D-DAY(diff 0) 카드 좌상단에 카테고리색 리본 배지(`.ddayRibbon`, radius 0 0 8px 0). 배너 이모지는 채도 높아진 배너 대비 흰색화.
변경된 파일: components/ListView.tsx (+3/−2), components/ListView.module.css (+20/−1)
비고: CATEGORY_META 4색 단일 출처 재사용(신규 임의 색 0)·`.released`(과거카드 약화)·`.imminent`와 무충돌(리본은 D-DAY만·`.item` overflow:hidden 내부). TypeScript strict 유지(any 0, CSSProperties 캐스트). esbuild tsx 트랜스폼 OK·CSS brace 38/38. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 리스트 카드 배너 세로 그라데이션·D-DAY 리본·과거('출시됨') 카드 약화 무충돌·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.


## [2026-06-03 13:05] [디자이너]
외형 점검 완료 (데스크 1440 + 모바일 390 소스 + 인벤 비교)
데스크 주요: 캘린더 셀 게임명이 `word-break:break-all`로 단어 중간 절단(라이브 "(Switch↵2)" 확인) → keep-all+overflow-wrap:anywhere 제안(높음). 통계줄 "총 44개" 단색 → 카테고리 4색 분해, 헤더 글로우 블루 단일 → 듀얼 브랜드 radial.
모바일 주요: 리스트 `.cardBanner` 모바일 오버라이드 0 → 1열 스택서 56px 빈 색배너 누적, @media(≤480) height 40px 제안. (Chrome resize 모바일 뷰포트 미반영=직전 사이클 동일 한계, 소스 갈음.)
인벤 참고: 인벤 지배 시각요소=게임 아트워크 이미지(히어로/핫카드/007 카드) → 우리 `.cardBanner` image_url 미사용(대부분 null·색배너 대체) → image_url 있을 때 다크 오버레이 배경이미지 렌더+폴백 제안.
DESIGN_NOTES에 5개 제안 추가(데스크3/모바일1/인벤1). 높음 1건(셀명 keep-all) → PROJECT_STATUS IDEAS 승격.


## [2026-06-03 12:30] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·상세] `/game/[id]` 카테고리색 라디얼 백드롭' — 개발자 12:20 완료(a7cc251, .detail-backdrop 인라인 radial-gradient)·QA 11:48 라이브 ✅(카테고리색 글로우·상단 4px 바 동톤·가로 오버플로 0·콘솔 #418/#423/#425 0건) → 완료한 기능 이동(개발자 큐 5→4 반영 확인).
유지: 리스트 배너 그라데+D-DAY 리본·인트로 카피 .subtitle 위계강화·MonthTabs 가로 스크롤·ViewToggle 모바일 블록 = 1~4순위.
추가: - [외형·리스트·보통] 리스트 카드 장르 칩(genres[] 무채색 pill 3개, 디자이너 09:05 인벤#1, 데이터 44/44 보유·리서처 선결 불필요, IDEAS→5순위) → 4→5.
사용자 요청 활성 0(SEO 보류 — 안 건드림). QA 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).

## [2026-06-03 11:48] [QA]
검증 대상: /game/[id] 상세 카테고리색 라디얼 백드롭(.detail-backdrop 인라인 radial-gradient, 개발자 12:20 a7cc251)
데스크톱 1440: ✅ (이 환경 resize 미반영·innerWidth 1920 고정에서 실측)
모바일 390: ✅ (resize 미반영·innerWidth 1920 고정 → 358px 합성 리플로로 검증)
상세: 라이브 캐시버스트 실측 — sol-enchant 상세 .detail-backdrop 존재, radial-gradient(80% 45% at 50% 0%, #81c78422→transparent 60%) 카테고리색(국내모바일 초록 #81c784) 글로우 정상·.game-detail borderTop 4px #81c784 동톤 일치·D-day 배지 D-15(먼미래 faint #2a2e38)·같은시기 그리드 6장. 가로 오버플로 0(scrollW1905<1920). 358px 합성: backdrop/카드/related 오버플로 0·related-grid 단일컬럼·글로우 유지. 콘솔 React#418/#423/#425·에러 0건(MetaMask 확장 경고만). 헬스 홈(h1 게임패드SVG+"게임 출시 캘린더"·125셀·총44개)·sitemap XML·robots·new-servers(12)·상세 정상. 신규 BUGS 0.
※Chrome resize_window가 innerWidth 미반영(1920 고정)→실뷰포트 1440/390 미확인, 1920 실측+358 합성 리플로 대체. 금일 변경=인라인 글로우(미디어쿼리 무관)라 합성 대표성 충분.

## [2026-06-03 12:20] [개발자]
완료: **[외형·상세·보통] `/game/[id]` 상세 카테고리색 라디얼 백드롭 (빈 검정 공백 해소)** (큐 1순위)
상세 카드가 평면 #0f1115 검정 공백에 떠 면 깊이 0이던 문제 해소(상단 4px 바·D-day 배지는 기출고). `catColor=CATEGORY_META[game.category].color` 변수 추출 후 반환 fragment 전 콘텐츠(detail-top 광고·`.game-detail`·`.detail-related`·detail-bottom 광고)를 `<div className="detail-backdrop" style={{ background: `radial-gradient(80% 45% at 50% 0%, ${catColor}22, transparent 60%)` }}>`로 래핑 → 카테고리색(초록/파랑/보라/주황) α≈+22 글로우가 상단 중앙→카드 상부 뒤로 퍼지다 60%서 페이드. 상단 4px 바와 동톤 일관, 검정 공백에 색 깊이 부여.
변경된 파일: app/game/[id]/page.tsx (+9/−1)
비고: CATEGORY_META 4색 단일 출처 재사용(신규 색 0)·CSS 신규 규칙 0(인라인 배경만)·빌드타임 생성·런타임 무영향. TypeScript strict 유지(catColor:string, any 0). esbuild tsx 트랜스폼 OK. 래퍼가 main 콘텐츠 폭 안이라 full-bleed 미사용 → 가로 오버플로 위험 없음. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 /game/[id] 상세 상단 카테고리색 라디얼 글로우·카테고리별 색 일관·상단 4px 바 톤 일치·가로 오버플로 0·콘솔 0 실측 부탁.


## [2026-06-03 11:30] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·신규컴포넌트] `/game/[id]` "같은 시기 출시" 미니카드 그리드' — 개발자 11:20 완료·QA 10:50 라이브 ✅(±2주 윈도우·가까운순 3~6개·관련0건 숨김·미니카드 내부이동·카테고리 좌측바·콘솔 #418/#423/#425 0건) → 완료한 기능 이동(개발자 큐 5→4 반영 확인).
유지: /game/[id] 라디얼 백드롭·리스트 배너 그라데+D-DAY 리본·인트로 카피 .subtitle 위계강화·MonthTabs 가로 스크롤 어포던스 = 1~4순위.
추가: - [외형·모바일·보통] ViewToggle 모바일 @media(≤480px) 블록 신설 (디자이너 09:05 모바일#2, 마지막 미보유 컴포넌트·Filters/GameModal 선례 동형, IDEAS→5순위) → 4→5.
IDEAS 보관: 디자이너 09:05 잔여 2건 — 장르 칩(리스트 카드, genres 44/44 보유)·광고 placeholder 약화(.ad-slot dashed→solid·min-height 250→160).
사용자 요청 활성 0(SEO 보류 — 안 건드림). QA 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).

## [2026-06-03 10:50] [QA]
검증 대상: /game/[id] 하단 '같은 시기 출시' 관련 미니카드 그리드(±2주·가까운순 3~6개·관련0건 숨김, 개발자 10:31 7470134)
데스크톱 1920: ✅ (이 환경 창폭 1440 미적용·1920 고정에서 검증)
모바일 390: ✅ (창폭 390 미반영·innerWidth 1920 고정 → 컨테이너 358px 합성 리플로 테스트로 단일컬럼·그리드 오버플로 0 확인)
상세: 라이브 캐시버스트 실측 — raven2-zero2(관련11) 그리드 6장 가까운순 정렬 정상(poe2 출시됨·ff7 D-DAY·미르진/메이크드라마 D-1·블소 출시됨·고딕 D-2), 카테고리 좌측 4px 바 색상 정상(글로벌 보라·신서버 주황·모바일 초록), 미니카드 클릭→/game/poe2 내부이동 OK(이동후 페이지도 그리드 6장). 관련0건 dk-mobile 섹션 미렌더 확인. 콘솔 React #418/#423/#425·에러 0건. 헬스 홈(h1 🎮·총44개)·sitemap(50 URL)·robots·상세·new-servers(서버12) 전부 정상. 가로 오버플로 0(scrollW1905<1920). 신규 BUGS 0.
※주의: 캐시버스트 미적용 WebFetch는 배포후 16분 시점에도 구 CDN 캐시(그리드 누락) 반환 → 라이브 검증은 ?t= 필수.

## [2026-06-03 11:20] [개발자]
완료: **[외형·신규컴포넌트·보통] `/game/[id]` 하단 "같은 시기 출시" 관련 게임 미니카드 그리드** (큐 1순위)
빌드타임에 출시일 ±2주(14일) 윈도우 내 다른 게임을 자기 제외·가까운 순 3~6개 추려 `</article>` 직후 `<section.detail-related>`(h3 "같은 시기 출시" + `<a href>` 미니카드 그리드)로 렌더, 관련 0건이면 섹션 미렌더. 미니카드=카테고리색 좌측 4px 바·게임명(700)·formatShortDate 출시일·D-day. CSS `.related-grid`(auto-fill minmax(220px,1fr) gap12)·`.related-card`(hover accent border+translateY-2px) 신설, 메인 톤·CATEGORY_META 4색 재사용(신규 색 0).
변경된 파일: app/game/[id]/page.tsx (+44/−1), app/globals.css (+11)
비고: TypeScript strict 유지(any 0). esbuild로 tsx 트랜스폼 OK, games.json 44개 시뮬레이션 — 관련>0 42개·관련=0 2개(섹션 숨김 확인)·거리순 정렬 정상, CSS brace 68/68 균형. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 /game/[id] 상세 하단 '같은 시기 출시' 그리드 노출·카테고리 좌측 바·관련 0건 게임(상세 2개) 섹션 숨김·미니카드 클릭 내부이동 실측 부탁.


## [2026-06-03 11:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·캘린더] 캘린더 컨테이너 패널 카드화' — 개발자 10:20 완료(.view #13151b·radius14·border·pad14, 모바일 ≤480 pad9·radius12, CSS-only brace 63/63)·QA 10:40 라이브 ✅(데스크 패널 카드 묶음·가로 오버플로 0·강조 셀 무회귀·콘솔 React#418/#423/#425 0건) → 완료한 기능 이동, 큐에서 종결.
유지: /game/[id] 같은시기 그리드·/game/[id] 라디얼 백드롭·리스트 배너 그라데+D-DAY 리본·인트로 카피 .subtitle 위계강화 = 1~4순위.
추가: - [외형·모바일·높음] MonthTabs 가로 스크롤 어포던스(엣지 페이드 mask + scroll-snap, 디자이너 09:05 모바일#1, IDEAS→5순위) → 4→5.
사용자 요청 활성 0(SEO 보류 — 안 건드림). QA 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).

## [2026-06-03 10:40] [QA]
검증 대상: 캘린더 컨테이너 패널 카드화(.view: #13151b·radius14·border·pad14) + 모바일 ≤480 비례 축소(pad9·radius12)
데스크톱 1440: ✅ (실측 뷰포트 1920 — 창폭이 1440 미만으로 안 줄어 1920에서 검증)
모바일 390: ⚠️ (이 환경 Chrome 창폭이 390으로 안 줄어 라이브 390 렌더 미확인 / 단 라이브 CSS 번들에 @media≤480 .view{padding:9px;border-radius:12px} 적재 확인)
상세: 데스크 .view 패널 카드 적용 실측(bg rgb(19,21,27)·br14·border 1px rgba(255,255,255,.06)·pad14), grid 패널 내부 래핑, 가로 오버플로 0(scrollW1905<vw1920). 강조 셀 무회귀(today2·cellHas12·임박스트립4). 콘솔 React #418/#423/#425·adsbygoogle 0건(확장프로그램 경고만). 헬스: 홈/sitemap/robots/game상세/new-servers 전부 200. 신규 BUGS 0.

## [2026-06-03 10:20] [개발자]
완료: **[외형·캘린더·보통] 캘린더 컨테이너 패널 카드화 + 빈 셀 hairline 보강** (큐 1순위)
`CalendarView.module.css` `.view`(CalendarView.tsx L97 section 루트)에 `background:#13151b; border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:14px` 패널 카드 부여(기존 `margin:1rem 0` 유지) → 격자가 페이지에 떠 있던 것을 면 카드로 감쌈. 모바일 ≤480px에 `.view{padding:9px; border-radius:12px}` 비례 축소. 빈 셀 hairline은 기존 그리드 gap 배경(`.grid` gap:1px·#2a2e38)이 셀 구분선으로 현행 유지. today/임박/선택·cellHas 카테고리 좌띠는 셀 단위라 무영향(무회귀).
변경된 파일: components/CalendarView.module.css (+8/−1, CSS-only)
비고: 신규 색 0(패널 톤 #13151b 재사용)·CSS brace 63/63 균형·tsx 무변경. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 데스크·모바일 캘린더 패널 카드 묶음·가로 오버플로 0·강조 셀 무회귀 실측 부탁.


## [2026-06-03 09:20] [리서처]
리서치 완료 (4개 카테고리)
- 모바일 6→0, PC/콘솔 3→0, 글로벌 5→0, 신규서버 8→0 (후보→통과)
- 신규 0개 / 갱신 0개 / 정리(180일+) 0개
- 총 등록 44개 (직전 2사이클 연속 0건 — 캘린더 포화 상태 유지)
[검증 탈락]
- 오딘 신규서버 '에기르'(6/26): ★연도 함정★ 공지 "6월 26일(水)"=2024년(3주년). 오딘 출시 2021-06-29 → 3주년은 2024년, 2026년은 5주년. 2026-06-26은 금요일이라 불일치. 과거 동일 실수 경고대로 추가 X.
- 아키에이지워 '멜리사라'(5/3): 2023년 공지. '이녹'/'그델론·에윈'/'바르아': 올해 명확 날짜 미확인 → 추가 X.
- 프라시아전기 '카렐'(4/28): 2023년 공지 → 추가 X.
- 달빛조각사 글로벌통합 'G-서버'(2026-04-03): 단일 출처 위주·이미 2개월 경과 과거건 → 보류.
- 로드나인 '디나페리'(3/27)·레이븐2 'ZERO/ZERO2'(5/27·6/1)·리니지M '켄트·오렌'·아이온2 글로벌(2026 하반기): 이미 등록됨(중복) → 추가 X.
- 나이트크로우 '에스텔라/신시아·콘라드': 2025년 공지·올해 6월 날짜 미확인 → 추가 X.
- 글로벌 후보(7th Guest 리메이크·열혈서유기·모노폴리 스타워즈 등): 한국/주목도·연도 재검증 미충족 → 추가 X.

## [2026-06-03 09:16] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·D-DAY강조] 임박 스트립 카드 임박도별 글로우(데스크톱)' — 개발자 완료·QA 라이브 ✅·신규 BUGS 0 → 완료한 기능 이동, 큐에서 종결.
유지: 캘린더 컨테이너 패널 카드화·/game/[id] 같은시기 그리드·/game/[id] 라디얼 백드롭·리스트 배너 그라데+리본 = 1~4순위.
추가: - [외형·헤더·높음] 인트로 카피 .subtitle 위계 강화 + 헤더 통합 (디자이너 09:05 데스크#1, IDEAS→5순위) → 4→5.
정리: 디자이너 09:05 다른 높음 'MonthTabs 모바일 스크롤 어포던스'는 IDEAS 보관(차기). '헤더 풀블리드 히어로 밴드'는 06-02 10:29 이미 출고 확인 → 큐소진후보에서 제거(중복 정리).
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).


## [2026-06-03 09:05] [디자이너]
외형 점검 완료 (데스크 1440 Chrome 라이브 + 모바일 390 소스검증 + 인벤 비교)
데스크 주요: 인트로 카피 `.subtitle`(#888·0.95rem)가 광고슬롯~임박 스트립 사이 붕 떠 위계 약함 → 톤업/헤더 통합(높음). 부수: `.ad-slot` 점선 placeholder가 특히 /game/[id] 상세서 콘텐츠보다 튐 → solid 헤어라인+min-height 축소(보통).
모바일 주요: MonthTabs 12탭 가로 스크롤인데 스크롤 신호 0 → @media≤480 엣지 페이드 mask+scroll-snap(높음). ViewToggle만 모바일 블록 부재(Filters/GameModal 선례 동형) → @media≤480 풀폭 2분할(보통).
인벤 참고: 행마다 장르/키워드 태그칩 → 우린 `genres[]` 44/44 보유하나 리스트 카드 미노출 → 무채색 다크 장르 칩(데이터 선결 불필요, 보통).
DESIGN_NOTES에 5개 제안 추가(데스크2·모바일2·인벤1). 높음 2건(인트로 카피·MonthTabs 스크롤) PROJECT_STATUS IDEAS 등재. 큐/IDEAS/완료와 중복 0. a11y/리팩토링 0건(외형 모드). 코드 미수정(문서만).


## [2026-06-03 08:47] [QA]
검증 대상: HeroStrip '출시 임박' 임박도별 글로우(개발자 09:20 — diff===0 glowDday·diff<=3 glowCat·데스크톱 한정)
데스크톱 1440: ✅ (Chrome 라이브 실측. 스트립 4카드 D-DAY/D-1/D-1/D-2 — glowDday 1개 box-shadow rgba(255,122,89,.7)+transform scale(1.02) pop 확정, glowCat 3개 카테고리색 글로우[국내모바일 녹색·글로벌 보라] transform none 확정. 가로오버플로 0[scrollW 1905≤1920]·캘린더 125셀·'불러오는 중' 플래시 0. 헬스 ✅ /·robots·sitemap(XML 200)·/game/sol-enchant-20260618[h1 🎮]·/new-servers[12서버])
모바일 390: ✅ (Chrome resize 뷰포트 미반영 한계 동일[innerWidth 1920·mq480 false] → 배포 CSS 번들 실측으로 갈음. 프로덕션 스타일시트에 @media(max-width:480px) `.glowCat,.glowDday{box-shadow:none;transform:none;border-color:rgba(255,255,255,.08)}` 라이브 확정 + `.card::before{display:none}`·`.card:nth-child(n+4){display:none}`[임박 3행 캡] 유지 → 모바일 컴팩트 행 글로우 무영향, 회귀 0)
상세: 개발자 09:20 1순위(임박 글로우) 데스크 라이브 통과·모바일 무영향 CSS 번들 확정. 신규 BUGS 0.

## [2026-06-03 09:20] [개발자]
완료: **[외형·D-DAY강조·보통] "출시 임박" 스트립 카드 — 임박할수록 카테고리색 글로우(데스크톱 한정)** (큐 1순위)
HeroStrip 카드가 D-day 숫자색만 달라 D-1과 D-7 임팩트가 동일하던 문제 해소. tsx에서 `diff`별 글로우 클래스 분기(`diff===0→glowDday`·`diff<=3→glowCat`·그외 없음) → 카드 className 합성. module.css 데스크톱 그리드(미디어쿼리 밖)에 `.glowCat`(D-1~3) 카테고리색 외곽 글로우(box-shadow color-mix 55/22%·border 45%)+`::before` 카테고리 radial, `.glowDday`(D-DAY) 주황 #ff7a59 강글로우+`transform:scale(1.02)`+주황 radial. 가까운 출시일일수록 카드가 "튀어나옴".
모바일(≤480px)은 컴팩트 행 유지 위해 `.glowCat,.glowDday` box-shadow/transform 리셋(무영향), `prefers-reduced-motion`서 scale 생략. color-mix 폴백 선행.
변경된 파일: components/HeroStrip.tsx (+2), components/HeroStrip.module.css (+30). 신규 색 0(카테고리 4색·#ff7a59 재사용)·strict 유지(any 0)·esbuild OK·CSS brace 33/33.
비고: 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 1순위 완료 → 기획자님 2~4를 1~3로 당겨주세요. QA님: 라이브 데스크 임박 스트립 D-1~D-3 카테고리색 글로우·D-DAY 주황 글로우+pop·모바일 무영향 실측 부탁.

## [2026-06-03 08:12] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '리스트 과거카드 약화' — 개발자 07:20·QA 07:46 라이브 ✅·신규 BUGS 0 → 큐 5→4.
정리: ①직전 5순위 '/game/[id] D-DAY 배지+카테고리 상단바'는 **이미 06-02 11:20 출고됨**(page.tsx L78·L88, globals.css L101~104) → 중복 큐잉이라 제거·IDEAS 종결. ②직전 2순위 '캘린더 면 강화'도 셀 톤업·출시셀 카테고리 악센트 이미 출고 → 남은 '컨테이너 패널 카드화'로 스코프 축소.
추가: - [외형·상세] /game/[id] 카테고리색 라디얼 백드롭 (IDEAS→4순위), - [외형·리스트] 카드 배너 카테고리 세로 그라데 + D-DAY 좌상단 리본 (IDEAS→5순위) → 큐 4→5 복구.
큐 1~5: ①임박 스트립 글로우(데스크톱) ②캘린더 컨테이너 패널 카드화 ③/game/[id] 같은시기 그리드 ④/game/[id] 라디얼 백드롭 ⑤리스트 배너 그라데+리본.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드).

## [2026-06-03 07:46] [QA]
검증 대상: 리스트 과거('출시됨') 카드 시각 약화(개발자 07:20 — ListView diff<0 released 플래그·opacity 0.62·배너 saturate 0.55·hover 복원·회색 releasedTag)
데스크톱 1440: ✅ (Chrome 라이브 실측 — 리스트뷰+기간'전체'서 released 카드 16개 전부 opacity 0.62·.cardBanner filter saturate(0.55)·D-day 회색칩 '출시됨' 확정, .released:hover{opacity:1} 규칙 라이브, 미래/임박 카드 opacity 1 또렷 유지. 헬스 ✅ /·robots·/game/sol-enchant-20260618·/new-servers(12서버)·h1 SVG·가로오버플로 0[scrollW 1905≤1920]·캘린더 125셀·임박 4카드·'불러오는 중' 없음. 콘솔 클린[사이트에러 0·하이드#418/#423/#425 0·no_div 0, MetaMask 확장 경고만])
모바일 390: ✅ (Chrome resize 뷰포트 미반영 한계 동일[innerWidth 1920·mq480 false] → 변경분 갈음: 이번 변경은 opacity/saturate만(레이아웃·폭 무변경)이고 .released/.releasedTag 규칙이 @media 밖이라 전 뷰포트 동일 적용=모바일도 과거카드 약화·hover복원 동작. ListView 모바일 단일컬럼·Filters/GameModal 모바일 블록은 직전 사이클 라이브 확정분. 신규 모바일 회귀 위험 0)
상세: 개발자 07:20 1순위 완료분 데스크 라이브 실측 통과. 신규 BUGS 0.

## [2026-06-03 07:20] [개발자]
완료: **[외형·리스트·높음] 리스트 과거('출시됨') 카드 시각 약화** (큐 1순위)
ListView 카드에서 `diff<0`(과거 출시) 게임에 `released` 플래그 → `<li>`에 `.released` 부여(opacity 0.62·배너 saturate 0.55·hover 시 opacity 1 복원), D-day 배지를 '출시됨'일 때 회색 미니칩 `.releasedTag`로 분기. 미래·임박 카드는 또렷 유지 → 다가오는 신작이 먼저 눈에.
변경된 파일: components/ListView.tsx (+4/−3), components/ListView.module.css (+12). strict 유지(any 0)·신규 색 0·CSS brace 37/37.
비고: 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 1순위 완료 → 기획자님 2~5를 1~4로 당겨주세요. QA님: 라이브 데스크 '전체' 기간 리스트 과거카드 흐림·hover 복원 실측 부탁.

## [2026-06-03 07:11] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 'GameModal @media(≤480px) 모바일 블록' — 개발자 06:20 GameModal.module.css 6클래스(overlay/modal/title/image/imageEmoji/actions) 모바일 비례 신설·QA 06:46 라이브 CSS 번들 실측 ✅·신규 BUGS 0 → 큐 5→4.
추가: - [외형·D-DAY강조·높음·회귀] /game/[id] 상세 D-DAY 배지 + 카테고리 상단바 (디자이너 06-02 16:50, IDEAS→5순위 승격) → 4→5 복구. 4순위 '같은 시기 출시 그리드'와 동일 /game/[id] 표면 묶음.
큐 1~5: ①리스트 과거카드 약화 ②캘린더 면 강화 ③임박 스트립 글로우(데스크) ④/game/[id] 같은시기 그리드 ⑤/game/[id] D-DAY 배지+카테고리 상단바.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 디자이너 제안 0(05:05 이후 없음). QA 신규 BUGS 0. 3사이클 정체 0. a11y/리팩토링 0건 큐잉(외형 모드).

## [2026-06-03 06:46] [QA]
검증 대상: GameModal @media(≤480px) 모바일 블록 신설(개발자 06:20 — 모달 패딩/제목/이미지/이모지/액션 모바일 비례)
데스크톱 1440(실측 1920): ✅ (h1 SVG·가로오버플로 0[scrollW 1905≤innerW]·캘린더 137셀·임박 4카드·'불러오는 중' 플래시 없음·카드 클릭→모달 정상 오픈)
모바일 390: ✅ (Chrome resize 뷰포트 미반영 한계 동일[innerWidth 1920·mq480 false] → 배포 CSS 번들 실측으로 갈음. 프로덕션 4b077633…css에 @media(max-width:480px) GameModal 6클래스 전량 라이브 확정: overlay .6rem·modal{1.2rem/radius12/maxH92vh}·title 1.2rem·image{78px/.6rem}·imageEmoji 2.2rem·actions .4rem — 개발자 스펙 정확 일치)
상세: 헬스 ✅ /·sitemap.xml(50 URL)·robots·/game/sol-enchant-20260618·/new-servers(12서버). 콘솔 클린(사이트 에러 0, MetaMask 확장 경고만)·하이드레이션 #418/#423/#425 0건 재확인. 신규 BUGS 0.

## [2026-06-03 06:20] [개발자]
완료: **[외형·모바일·높음] GameModal @media(≤480px) 모바일 블록 신설** (큐 1순위)
GameModal만 유일하게 모바일 블록 0건(직전 Filters 모바일 블록과 동형 누락)이라 390px서 모달 패딩(1.6rem)·제목(1.4rem)·이미지(100px)·이모지(3rem)가 좁은 폭에 과대하던 문제 해소.
구현: `GameModal.module.css` 말미에 `@media(max-width:480px){ .overlay{padding:0.6rem} .modal{padding:1.2rem;border-radius:12px;max-height:92vh} .title{font-size:1.2rem} .image{height:78px;margin-bottom:0.6rem} .imageEmoji{font-size:2.2rem} .actions{gap:0.4rem} }`. 6개 타깃 클래스 전부 GameModal.tsx 사용 중 확인.
변경된 파일: components/GameModal.module.css (+11). 레이아웃만(신규 색 0)·데스크톱 무영향·tsx 무변경. CSS brace 27/27.
비고: 로컬 빌드 sandbox 디스크 제한 → Vercel typecheck+build 위임. 큐 5→4(2~5순위 한 칸씩 당김). **QA님: 라이브 모바일 390px 모달 패딩/제목/이미지 비례 실측 부탁(Chrome resize 미반영 시 소스 갈음).**

## [2026-06-03 06:11] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '하이드레이션 7건 재점검' — 개발자 05:31 kstDateOnly(lib/utils.ts) 서버UTC↔클라KST 단일기준 fix·QA 05:47 라이브 #418/#423/#425 0건 해소 확정(adsbygoogle no_div도 미관측) → 큐 5→4.
추가: - [외형·캘린더 임팩트·높음] 캘린더 면 디자인 강화(빈 셀 톤업+컨테이너 패널 카드화+출시 셀 카테고리색 좌측 악센트) — IDEAS 13:01 #2·#3 묶어 3순위 승격 → 4→5 복구.
큐 1~5: ①GameModal 모바일 블록 ②리스트 과거카드 약화 ③캘린더 면 강화 ④임박 스트립 글로우(데스크) ⑤/game/[id] 같은시기 그리드.
다음 후보: 상세 D-day배지+상단바(회귀)·이모지→SVG 2단계·헤더 히어로 밴드.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 0건 큐잉(외형 모드).

## [2026-06-03 05:47] [QA]
검증 대상: 하이드레이션 7건 kstDateOnly fix(개발자 05:31, UTC↔KST 시간대 불일치)
데스크톱 1440: ✅ (h1 SVG·가로오버플로 0·137셀·임박4카드·로딩플래시 없음·콘솔 React에러 0)
모바일 390: ⚠️ (Chrome resize 후에도 innerWidth 1920·matchMedia480 false → 실측 불가, 소스 갈음. 5개 컴포넌트 @media≤480 보유·캘린더 모바일 cellName 숨김으로 그리드 오버플로 무위험. GameModal 모바일블록 부재는 기존 IDEA)
상세: **하이드레이션 #418/#423/#425=0건 해소 확정** — KST 05:47(00~09시 위험구간) 캐시버스트 2회 재로드 콘솔 클린. 헬스 ✅ /·sitemap.xml(50 URL)·robots·/game/007-first-light-2026·/new-servers. adsbygoogle no_div도 미관측. 신규 BUGS 0.

## [2026-06-03 05:31] [개발자]
완료: **하이드레이션 7건(#418×3·#423×1·#425×3) 근본원인 규명·수정 — 서버(UTC)↔클라(KST) timezone 불일치**. f021717(serverNow)은 UTC instant를 주입했지만 모든 렌더가 `new Date(serverNow)` 후 **로컬 날짜필드**(getDate/getMonth/getDay/getFullYear)를 읽음 → Vercel은 UTC, 사용자는 KST(UTC+9)라 빌드 instant의 UTC일자≠KST일자인 시간대(KST 00~09시 빌드)마다 D-day·'오늘'셀·달 라벨·요일이 서버HTML↔클라 첫렌더에서 갈려 #418/#423/#425 발생. 그래서 fix가 '반영됐는데도 미해소'로 보였음(부분 fix였음).
수정: `lib/utils.ts`에 TZ무관 `kstDateOnly(iso)` 신설(+9h 시프트→getUTC*로 KST 연/월/일→로컬자정 Date, 어느 환경서도 동일 날짜필드). `Home.tsx` now·calendarCursor 초기값 + mount 실시간 교체를 kstDateOnly 기반으로 전환(사용자 로컬TZ 무관, 항상 KST 기준=한국 타깃 의도와 일치).
검증: node로 TZ=UTC vs Asia/Seoul 시뮬 — 수정 전 date=2/D-3(UTC) vs date=3/D-2(KST) 불일치 재현 → 수정 후 양쪽 date=3·D-2·월라벨·today셀 전부 동일(불일치 0). release_date는 양쪽 동일일자라 무변경. strict 유지(any 0).
변경된 파일: lib/utils.ts(+10), components/Home.tsx(+0/−4 치환). 합 +14/−4.
비고: **adsbygoogle 'no_div' ERROR는 본 수정 밖(별개 추적)** — 하이드 7건과 무관(날짜 텍스트 불일치가 원인이었음). 로컬 빌드는 sandbox 디스크 제한 → Vercel typecheck+build 위임. **QA님: gcalen.com 콘솔 #418/#423/#425 0건 실측 부탁(특히 KST 00~09시대 빌드분에서 재현 안 되는지).**

## [2026-06-03 05:11] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
**배포 블로커 해소 확정**: QA(04:47) 라이브 재검 — vercel.json 출고로 gcalen.com이 레거시 정적→신 Next 앱 전환(h1 SVG·임박 스트립·캘린더 주말색/today원형·상세 D-day배지 라이브). 직전 05:00 'f021717 미배포 추정'은 정정. → 직전 1순위 '배포 확인'을 완료 처리·재프레이밍.
추가(높음): - GameModal @media(≤480px) 모바일 블록 신설(디자이너 05:05 모바일#1) / - 리스트 과거('출시됨') 카드 시각 약화(디자이너 05:05 데스크#1)
큐 1~5: ①하이드레이션 7건 재점검(fix 불완전/애드센스 ad-div 원인 — 신 빌드에도 #425×3·#418×3·#423×1 매 로드 재현) ②GameModal 모바일 블록 ③과거 카드 약화 ④임박 스트립 글로우(데스크톱) ⑤/game/[id] "같은 시기 출시" 그리드
IDEAS로 밀림: 리스트 배너 그라데+리본·범례 tint 칩(외형 보통, 다음 사이클 재승격 우선). 디자이너 05:05 보통 3건(상세 라디얼 백드롭·임박 행 좌띠·카테고리 필터 색칩) IDEAS 보관.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 제안 0건 큐잉(외형 모드).

