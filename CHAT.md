## [2026-06-04 07:28] [개발자]
완료: 큐 1순위 '/game/[id] 상세 액션 outline pill' + 2순위 '.game-detail 모바일 블록' 묶음 출고(기획자 07:13 '1·2 같은 상세 표면 묶음 후보' 권고대로). ① 상세 하단 액션 래퍼 인라인 style → `.detail-actions` 클래스화 + '공식 출처' `.detail-link` 부여, globals.css에 outline pill 공통 규칙(border var(--border)·radius-sm·rgba(255,255,255,0.03)·accent 0.88rem/600) + hover/focus-visible(accent 보더·rgba(91,157,255,0.1)) 신설. ② 기존 @media(≤480px) 블록에 `.game-detail{padding:1.2rem 1.1rem 1.6rem}`·`.game-detail h2{1.5rem}` 2규칙 추가. 신규 색 0.
변경된 파일: app/game/[id]/page.tsx (+2/−2), app/globals.css (+26), PROJECT_STATUS.md, CHAT.md
비고: 큐 5→3 (day패널 D-day 3단 규약이 새 1순위 — 신규 2순위 day패널 모바일 3규칙과 같은 CalendarView 표면 묶음 후보). esbuild tsx OK·CSS brace 78/78 균형. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. QA님 라이브 /game/{id} 하단 '캘린더 추가'/'공식 출처' 2버튼 outline pill 렌더·hover 톤·390 flex-wrap 줄바꿈·상세 카드 모바일 패딩 1.1rem/h2 1.5rem 축소·데스크톱 무영향·가로 오버플로 0 확인 부탁.

## [2026-06-04 07:13] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
완료 확인: '헤더 듀얼 브랜드 radial(블루+퍼플)' QA 06:47 라이브 ✅(radial 2개 스펙 일치·h1 그라데 정합·헤더 높이 무변·오버플로 0) → 종결(번호큐는 개발자 06:29 기정리).
유지: 큐 1~4(상세 액션 outline pill·.game-detail 모바일 블록·day패널 D-day 3단 규약·day패널 모바일 3규칙) 순서 그대로 — 1·2 /game/[id] 묶음·3·4 CalendarView 묶음 구현 후보.
추가: - ⑤[외형·하이라이트·D-DAY강조] HeroStrip 최근접 1건 대형 핫카드(span 2·게임명 1.5rem·dday 1.8rem) + HH:MM:SS 라이브 카운트다운 — 'use client' 전환·mount 가드 필수·신규 색 0 (디자이너 06-03 01:05 인벤#1, 02:10부터 후보 대기 → 승격)
IDEAS 보관: 디자이너 05:07 잔여 2건(BackToTop 다크 글래스·푸터 브랜드 hairline) — 다음 큐 우선 후보.
활성 사용자 요청 0(SEO 보류 유지). 신규 BUGS 0(QA 06:47 신규 0·'데이터 갱신 06.02' 이틀 경과는 리서처 주기 참고). 3사이클 정체 0. a11y 제안 0건 → IDEAS 보관 (보류). 코드 미수정(문서만). 개발자 :20 1순위(상세 액션 outline pill) 착수 권장 — 2순위와 같은 상세 표면 묶음 가능.

## [2026-06-04 06:47] [QA]
검증 대상: 헤더 듀얼 브랜드 radial — .site-header::before 단일 블루 → 블루+퍼플 듀얼 글로우 (개발자 06:29 8006b56)
데스크톱 1440: ✅ (resize 미반영·innerWidth 1920 실측)
모바일 390: ✅ (390px same-origin iframe 합성 실측)
상세: ::before 라이브 실측 — radial 2개 확인: 좌상 25% rgba(91,157,255,0.12) 블루 + 우상 78% rgba(201,138,214,0.10) 퍼플, transparent 65% — 스펙 그대로. h1 그라데 linear-gradient(92deg, #5b9dff→#c98ad6) clip:text와 색 정합 ✅. 헤더 높이 데스크 135px·모바일 126px(레이아웃 무변). 가로 오버플로 0: 데스크 scrollW 1905<1920 ✅·390 iframe scrollW 375, >391 요소 0 ✅. 듀얼 radial 모바일 iframe에서도 2개 렌더. 콘솔 에러/#418/#423/#425 0(MetaMask 확장 경고만). 헬스 ✅(홈 h1 🎮·sitemap 50 URL·robots·상세 sol-enchant D-15·new-servers 12·데이터 06.02). 신규 BUGS 0.
참고: 메인 '데이터 마지막 갱신 2026.06.02' 이틀 경과 — 리서처 갱신 주기 참고용 (버그 아님).

## [2026-06-04 06:29] [개발자]
완료: 큐 1순위 '헤더 듀얼 브랜드 radial' — `.site-header::before` 백드롭을 단일 블루 radial → 듀얼 radial(좌상 브랜드 블루 rgba(91,157,255,0.12)·우상 --accent-2 퍼플 rgba(201,138,214,0.10), transparent 65%)로 교체. h1 블루→퍼플 그라데 텍스트와 배경 정합, 헤더 높이/패딩/레이아웃 무변(::before 배경 1선언만). 신규 색 0(기존 accent/accent-2 토큰색 rgba 재사용).
변경된 파일: app/globals.css (+3/−1), PROJECT_STATUS.md, CHAT.md
비고: 큐 5→4 (상세 액션 outline pill이 새 1순위). CSS-only·tsx 무변경·CSS brace 73/73 균형. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. QA님 라이브에서 헤더 좌상 블루·우상 퍼플 듀얼 글로우(h1 그라데와 정합)·헤더 높이 무변·가로 오버플로 0 확인 부탁.

## [2026-06-04 06:12] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
완료 확인: '/game/[id] related-dday 3단 색 규약 통일' QA 05:48 라이브 ✅(D-DAY 주황·임박 amber·그 외 muted 3단 분리·390 오버플로 0·콘솔 0) → 종결(번호큐는 개발자 05:28 기정리).
유지: 큐 1~4(헤더 듀얼 radial·상세 액션 outline pill·.game-detail 모바일 블록·day패널 D-day 3단 규약) 순서 그대로.
추가: - ⑤[외형·모바일·패널 밀도] day-detail 패널 모바일 @media(≤480px) 3규칙 — .dayPanel 0.7rem·.dayRow gap/padding 축소·.dayRowDate 3em/0.72rem (디자이너 05:07 모바일#1, IDEAS→승격. 모바일 1차 콘텐츠 표면·④와 같은 CalendarView 표면 묶음 후보·CSS-only·신규 색 0)
IDEAS 보관: 디자이너 05:07 잔여 2건(BackToTop 다크 글래스 플로팅·푸터 브랜드 그라데 hairline).
활성 사용자 요청 0(SEO 보류 유지). 신규 BUGS 0(QA 05:48 — 패널 D-DAY amber는 큐 ④ 미구현분으로 정상). 3사이클 정체 0. a11y 제안 0건 → IDEAS 보관 (보류). 코드 미수정(문서만). 개발자 :20 1순위(헤더 듀얼 radial) 착수 권장 — ④·⑤ 묶음 구현 가능.

## [2026-06-04 05:48] [QA]
검증 대상: /game/[id] related-dday 단일 블루 → 전역 D-day 3단 색 규약 통일 (개발자 05:28 f250652)
데스크톱 1440: ✅ (resize 미반영·innerWidth 1920 실측)
모바일 390: ✅ (390px same-origin iframe 합성 실측)
상세: /game/raven2-server-zero2 관련카드 6장 실측 — D-DAY rgb(255,122,89)=#ff7a59 ✅·D-1/D-2 amber rgb(245,166,35)=#f5a623 ✅·출시됨 #888 muted ✅. /game/sol-enchant 관련 D-14/15/16·(예정) 전부 #888 — 8일+ muted 규약 일치. 390 iframe: 관련카드 단일컬럼 375px·본문 scrollW 375 가로 오버플로 0(>391 요소 0). 홈 390 무회귀: 통계줄 4칩+총44 한 줄 21px·오늘(06.04) 패널 자동노출 '이후 출시 20건'·오버플로 0(MonthTabs 의도된 스크롤 스트립만 초과). 콘솔 에러/#418/#423/#425 0(MetaMask 확장 경고만). 헬스 ✅(홈 h1 🎮·sitemap 50 URL·robots·상세 D-15·new-servers 12). 신규 BUGS 0.
참고: day-detail 패널 D-DAY는 아직 amber 한 톤(rgb 245,166,35) — 큐 ⑤ 미구현분으로 정상(버그 아님).


## [2026-06-04 05:28] [개발자]
완료: 큐 1순위 '/game/[id] 같은 시기 출시 미니카드 D-day(.related-dday) 단일 블루 → 전역 D-day 3단 색 규약 통일'. related 루프에 rdStage(today/soon/far) 분기 추가, 기본색 muted(--text-faint) 톤다운 + D-DAY 주황 #ff7a59 / 임박(≤7) amber #f5a623 — 본문 dday-badge·메인 리스트와 동일 규약. 출시됨/예정/8일+ 는 muted. 신규 색 0.
변경된 파일: app/game/[id]/page.tsx (+2/−1), app/globals.css (+3/−1), PROJECT_STATUS.md, CHAT.md
비고: 큐 5→4 (헤더 듀얼 radial이 새 1순위). esbuild tsx 통과, CSS brace 73/73. Vercel 빌드 검증 위임. QA님 라이브에서 /game/{id} 하단 관련카드 D-day 색 3단 분기 확인 부탁.


## [2026-06-04 05:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
완료 확인: '메인 통계줄 카테고리 4색 인라인 카운트 분해' QA 04:49 라이브 ✅(4칩 색·스펙 일치·리스트 27 가드·390 오버플로 0·콘솔 0) → 종결(번호큐는 개발자 04:23 기정리).
유지: 큐 1~4(related-dday 색 통일·헤더 듀얼 radial·상세 액션 outline pill·.game-detail 모바일 블록) 순서 그대로.
추가: - ⑤[외형·D-DAY 강조·높음] day-detail 패널 행 D-day 3단 규약 통일 — tsx `diff===0` 분기 1줄+`.dayRowDdayToday{#ff7a59}` 1규칙 (디자이너 05:07 데스크#1, IDEAS→승격. 첫 화면 기본 노출 표면·1순위 related-dday와 같은 색 규약 묶음 후보·신규 색 0)
IDEAS 보관: 디자이너 05:07 잔여 3건(dayPanel 모바일 3규칙·BackToTop 다크 글래스 플로팅·푸터 브랜드 그라데 hairline).
활성 사용자 요청 0(SEO 보류 유지). 신규 BUGS 0(QA 04:49 신규 0). 3사이클 정체 0. a11y 제안 0건(외형 모드, IDEAS 보관만). 코드 미수정(문서만). 개발자 :20 1순위(related-dday 색 통일) 착수 권장.

## [2026-06-04 05:07] [디자이너]
외형 점검 완료 (데스크 1440 + 모바일 390 iframe 합성 + 인벤 비교)
데스크 주요: day-detail 패널 D-day가 D-DAY/D-1 구분 없이 amber 한 톤 — 전역 규약(D-DAY #ff7a59) 불일치, 진입 시 패널 자동 노출(01:30 출고)로 첫 화면 표면이라 높음 / 푸터 무브랜드 마감 보통
모바일 주요: CalendarView @media(≤480px)에 .dayPanel/.dayRow 오버라이드 0 — 셀 게임명 숨김이라 패널이 모바일 1차 표면인데 행 폭 285px·게임명 2줄 랩(iframe 390 실측)
인벤 참고: 우하단 플로팅 '맨 위로' 원형 버튼 → 다크 글래스 BackToTop 신설 제안 (주간 TOP10은 집계 데이터 부재로 계속 보류)
DESIGN_NOTES에 4개 제안 추가 (Chrome resize 모바일 미반영 지속 → 390px same-origin iframe 합성 실측으로 대체. 통계줄 4색 분해 라이브 반영 확인)


## [2026-06-04 04:49] [QA]
검증 대상: 메인 통계줄 카테고리 4색 인라인 카운트 분해 (개발자 04:23 d9c549f)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize/mq480 미반영 → same-origin iframe 390px 합성, 실뷰포트 390 확보)
상세: 라이브 캐시버스트 — 캘린더 뷰 4칩(모바일 11 #81c784·PC·콘솔 5 #64b5f6·글로벌 16 #ba68c8·신서버 12 #ff8a65)+회색 '총 44개', 0.9rem(14.4px)/500·가운뎃점 ::before(첫 span 無) 스펙 일치. 리스트 뷰 전환 9·5·13·총 27(신서버 0 미렌더 가드 OK)·재전환 44 복원. 캘린더 범례 스와치 4색 정합. 390 iframe: 통계줄 한 줄 22px(콘텐츠 351px<390)·scrollW 375 가로 오버플로 0·ViewToggle 168px 풀폭·/game/sol-enchant 상세 related 단일컬럼·backdrop·오버플로 0. 오늘셀(06.04) 자동선택+패널 '이후 출시 20건'·scrollY 0 무회귀. 콘솔 에러/#418/#423/#425 0건. 헬스 ✅(홈 h1·sitemap 50 URL·robots·상세 D-15·같은시기 6장·new-servers 12). 신규 BUGS 0.
참고: 캘린더 뷰 통계줄 콘텐츠 351px — 390px 모바일서 한 줄이지만 여유 적음(카운트 자릿수 증가 시 2줄 줄바꿈 가능, nowrap 칩 단위라 깨짐은 아님 → 관찰만).


## [2026-06-04 04:23] [개발자]
완료: **[외형·카테고리 시각차별화·보통] 메인 통계줄 "총 N개" 단일 회색 → 카테고리 4색 인라인 카운트 분해** (큐 1순위, 여러 사이클 밀린 잔여분)
통계줄이 총합만 회색 한 줄이라 카테고리 분포를 색으로 못 읽던 문제 해소. `Home.tsx`에 `categoryCounts` useMemo(현재 뷰 모집단 — 리스트=listGames/캘린더=filteredGames, 기존 뷰 정합 로직 재사용) 신설, stats 노드를 CATEGORY_META 순서로 count>0 카테고리만 `short` 라벨+카테고리색 span 렌더 후 끝에 회색 `총 {total}개`. 구분 가운뎃점은 CSS `::before`(마크업 노이즈 0). `.stats` 0.9rem/500 상향(디자이너 스펙)·span nowrap·신규 색 0(4색 단일출처 재사용). 기존 카테고리 필터 접미 라벨은 중복이라 제거(필터 시 해당 1칩만 노출).
변경된 파일: components/Home.tsx (+9/−2), components/Home.module.css (+14/−1)
비고: 라벨은 full label 대신 `short`(모바일/PC·콘솔/글로벌/신서버) — '한국 MMO 신규 서버' full은 390px 한 줄 초과 위험. 44개 실데이터 시뮬: 캘린더 뷰 모바일 11·PC·콘솔 5·글로벌 16·신서버 12·총 44 / 리스트 뷰(오늘 이후) 9·5·13·총 27(신서버 0 → 미렌더 가드). esbuild tsx OK·brace 균형·strict any 0. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 통계줄 4색 칩+회색 총합·뷰 전환 카운트 갱신(44↔27)·범례 색 정합·모바일 390 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.

## [2026-06-04 04:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
완료 확인: '리스트 카드 장르 칩 — genres[] 무채색 pill 최대 3개' QA 03:47 라이브 ✅(27카드 전부 렌더·칩 총 48·카드당 최대 3 가드·390 가로 오버플로 0) → 종결.
유지: 큐 1~4(통계줄 4색 분해·related-dday 색 통일·헤더 듀얼 radial·상세 액션 outline pill) 순서 그대로 — 1순위 통계줄 4색(여러 사이클 밀린 잔여) 보호, 신규는 말미만.
추가: - ⑤[외형·모바일·상세] /game/[id] `.game-detail` 모바일 @media(≤480px) 오버라이드 신설 — padding 1.8→1.1rem·h2 2→1.5rem (디자이너 01:05 모바일#1, IDEAS→승격. 2·4순위와 같은 상세 표면 묶음 후보·CSS-only·신규 색 0)
활성 사용자 요청 0(SEO 보류 유지). 신규 BUGS 0(QA 03:47 신규 0). 3사이클 정체 0. a11y 제안 0건(외형 모드, IDEAS 보관만). 코드 미수정(문서만). 개발자 :20 1순위(통계줄 4색 분해) 착수 권장.

## [2026-06-04 03:47] [QA]
검증 대상: 리스트 카드 장르 칩 — genres[] 무채색 pill 최대 3개 (개발자 03:28 c2d7535)
데스크톱 1440: ✅ (resize 미반영·innerWidth 1920 실측)
모바일 390: ✅ (resize 미반영 → 390px iframe 합성 리플로 실측)
상세: 데스크톱 1920 라이브 실측 — 리스트 27카드 전부 genreChips 렌더(칩 총 48·카드당 최대 3 가드 확인, 샘플 'MMORPG|무협'/'서브컬처|수집형RPG'/'RPG|액션'), 칩 스타일 스펙 일치(#9aa3b2=rgb(154,163,178)·11.2px·radius 999px·nowrap·rgba 화이트 5% 면). 390 iframe: 칩 그룹 27·390 초과 행 0·칩행 311px·루트 375/390 가로 오버플로 0·상세(raven2-zero2) 375 오버플로 0·관련카드 6. 무회귀: 캘린더 복귀 시 오늘 패널 '이후 출시 20건'·리스트 기본 총 27개 유지. 콘솔 #418/#423/#425·에러 0(MetaMask 확장 경고만). 헬스 ✅(홈 h1 🎮·robots·sitemap 50 URL·new-servers 12·데이터 06.03). 신규 BUGS 0.

## [2026-06-04 03:28] [개발자]
완료: **[외형·리스트·보통] 리스트 카드 장르 칩 — genres[] 무채색 pill 최대 3개 추가** (큐 1순위, 여러 사이클 밀린 잔여분)
리스트 카드에 카테고리 색면 외 게임 성격 신호가 0이던 문제 해소. `ListView.tsx` `.cardBody`의 `.desc` 위에 `genreChips` div 추가 — `g.genres.slice(0,3)` 최대 3개 무채색 pill(key=장르명), genres 미보유/빈 배열 미렌더 가드. `ListView.module.css`에 `.genreChips`(flex·wrap·gap 0.3rem·margin-top 0.4rem)+`.genreChip`(0.7rem·#9aa3b2·rgba 면/보더·radius 999px·nowrap) 신설 — 디자이너 스펙 그대로, 카테고리=색면/장르=중성칩 위계 분리. 과거카드 약화(li opacity)와 무충돌, 정적 데이터라 하이드레이션 무관.
변경된 파일: components/ListView.tsx (+7), components/ListView.module.css (+17)
비고: esbuild tsx 트랜스폼 OK·CSS brace 40/40·strict any 0·신규 색 #9aa3b2 1톤(디자이너 스펙). 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 리스트 카드 장르 칩 최대 3개·모바일 390 가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.

## [2026-06-04 03:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
완료 확인: 'ViewToggle 모바일 @media(≤480px) 블록' QA 02:47 라이브 ✅(390 iframe 2버튼 168px 균등 풀폭·데스크톱 무영향·가로 오버플로 0) → 종결.
유지: 큐 1~4(리스트 장르 칩·통계줄 4색 분해·상세 related-dday 색 통일·헤더 듀얼 radial) 순서 그대로 — 1순위 장르 칩(여러 사이클 밀린 잔여) 보호, 신규는 말미만.
추가: - ⑤[외형·상세 액션] /game/[id] 하단 액션 평문 링크 2개 → 다크 outline pill 버튼화 (디자이너 01:05 인벤#1, IDEAS→승격. 3순위 related-dday와 같은 상세 표면이라 묶음 구현 후보·신규 색 0)
활성 사용자 요청 0(SEO 보류 유지). 신규 BUGS 0(QA 02:47 신규 0). 3사이클 정체 0. a11y 제안 0건(외형 모드, IDEAS 보관만). 코드 미수정(문서만). 개발자 :20 1순위(리스트 장르 칩) 착수 권장.

## [2026-06-04 02:47] [QA]
검증 대상: ViewToggle 모바일 @media(≤480px) 블록 — 2버튼 풀폭 2분할 (개발자 02:28 6d56a48)
데스크톱 1440: ✅ (resize 미반영·innerWidth 1920 실측)
모바일 390: ✅ (resize 미반영 → 390px iframe 합성 리플로 실측)
상세: 390 iframe 실측 — 캘린더/리스트 2버튼 `flex:1 1 0%`·각 168px 균등 풀폭(행 343px·gap 8px)·padding 9.6px 8px(=0.6rem 0.5rem)·text-align center 전부 출고 확인. 데스크톱 1920 무영향(flex 0 1 auto·8px 16px·95px 유지)·`.active` 그라데 무회귀. 가로 오버플로 0(루트 375/390·헤더 375·필터 343·그리드 321, MonthTabs 624/343는 의도된 스크롤 스트립). 직전 기능 무회귀: 진입 시 오늘 셀 자동선택+패널 '06.04 이후 출시 20건' 데스크/모바일 양쪽 유지·진입 scrollY 0·셀 클릭(6/17) 패널 갱신 정상. 상세 /game/raven2-server-zero2 모바일 373/373 오버플로 0·메타 4행·관련카드 6. 헬스 ✅(홈 h1 🎮·robots·sitemap XML 50 URL·new-servers 12·상세 정상). 콘솔 React #418/#423/#425·에러 0(MetaMask 확장 경고만). 신규 BUGS 0.

## [2026-06-04 02:28] [개발자]
완료: **[외형·모바일·보통] ViewToggle 모바일 @media(≤480px) 블록 신설 — 마지막 미보유 컴포넌트** (큐 1순위, 여러 사이클 밀린 잔여분)
390px서 캘린더/리스트 2버튼이 고정 패딩(0.5rem 1rem)으로 가운데 작게 뭉쳐 터치 폭이 좁던 문제 해소. `ViewToggle.module.css` 말미에 `@media(max-width:480px)` 블록 신설 — `.toggle{gap:0.5rem}` + `.btn{flex:1 1 0; padding:0.6rem 0.5rem; text-align:center}` → 2버튼이 화면폭 2분할 풀폭(터치 면적↑·좌우 균형·세로 패딩 0.6rem 보강). 데스크톱(미디어쿼리 밖) 무영향, `.active` 그라데/그림자 무회귀.
변경된 파일: components/ViewToggle.module.css (+9)
비고: CSS-only(tsx 무변경·`.toggle`/`.btn` 사용처 ViewToggle.tsx 확인)·신규 색 0·brace 7/7. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 모바일 390px 캘린더/리스트 2버튼 풀폭 2분할·데스크톱 무영향·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.

## [2026-06-04 02:10] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
사용자요청 처리: ②'진입 시 캘린더 오늘 셀 자동선택→day-detail 패널 자동 표시' **QA 라이브 검증 완료**(01:47 — 오늘 셀 자동선택·패널 '이후 출시 20건' 자동 노출·스크롤 점프 0·콘솔 0) → USER_REQUESTS '활성' 2건 모두 종결·아카이브 이동. **활성 사용자 요청 0**(SEO 보류 — 안 건드림).
유지: 큐 1~4(ViewToggle 모바일 블록·리스트 장르 칩·통계줄 4색 분해·상세 related-dday 색 통일) 순서 그대로 — 1순위 ViewToggle 보호(여러 사이클 밀린 잔여, 신규는 말미만).
추가: - ⑤[외형·헤더 임팩트] `.site-header::before` 단일 블루 → 듀얼 브랜드 radial(블루+퍼플) — 00:22 사용자요청 삽입 때 후보로 밀렸던 것 재승격(디자이너 13:05 데스크#3, 신규 색 0). 후보 풀엔 핫카드+카운트다운 잔존.
신규 BUGS 0(QA 01:47 신규 0). 3사이클 정체 0. a11y 제안 0건(외형 모드, IDEAS 보관만). 코드 미수정(문서만). 개발자 :20 1순위(ViewToggle) 착수 권장.

## [2026-06-04 01:30] [개발자]
완료: **[사용자요청·캘린더·높음] 진입 시 오늘 날짜 셀 디폴트 선택 → day-detail 패널('오늘 이후 출시') 자동 표시** (큐 1순위, 운영자 직접 요청)
진입 직후 캘린더 아래 패널이 비어 "게임 리스트가 없음"던 문제 해소. mount 후 useEffect로 오늘(KST) ISO를 `selectedISO`에 자동 세팅 → 오늘 셀 선택+패널 '오늘 이후 출시' 자동 노출. 커서 해제 effect를 `prevYMRef`로 '실제 월 이동에만' 보정(첫 mount·이번 달 교체는 유지). `scrollOnSelect` ref로 초기 자동선택은 스크롤 점프 차단, 사용자 클릭에만 패널 스크롤. 오늘 ISO는 mount 후 계산(하이드레이션 안전).
변경된 파일: components/CalendarView.tsx (+22/−5)
비고: 신규 색 0·strict any 0·esbuild tsx 트랜스폼 OK·`{`/`}` 130/130. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 진입 시 오늘 셀 선택·패널 자동 표시·진입 스크롤 점프 없음·월 이동 시 해제·셀 클릭 스크롤·콘솔 #418/#423/#425 0건 실측 부탁.

## [2026-06-04 01:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
사용자요청 처리: ①'리스트 기간 기본 오늘 이후' **QA 라이브 검증 완료**(00:48 — 기본 27건·'전체(과거 포함)' 44 복원·캘린더 과거 달 무파손·콘솔 0) → USER_REQUESTS '활성' 종결. ②'진입 시 캘린더 오늘 셀 자동선택→day-detail 패널 자동 표시'만 활성 = **큐 1순위 유지**(사용자 최우선).
유지: 큐 2~4(ViewToggle 모바일 블록·리스트 장르 칩·통계줄 카테고리 4색 분해) 순서 그대로.
추가: - ⑤[외형·상세] /game/[id] '같은 시기 출시' 미니카드 D-day(`.related-dday`) 단일 블루 → 앱 전역 색 규약(D-DAY 주황/임박 amber/먼미래 muted) 통일 (디자이너 01:05 데스크#1, tsx 1줄+CSS 3규칙·신규 색 0)
디자이너 01:05 신규 외형 4건 중 1건 큐(⑤), 나머지 3건(related-card 카테고리 tint wash·`.game-detail` 모바일 블록·상세 액션 outline pill) → IDEAS 보관(외형 모드·다음 큐 후보).
신규 BUGS 0(QA 00:48 신규 0·하이드레이션 7건 05:47 해소 유지). 3사이클 정체 0. a11y 제안 0건(외형 모드). 코드 미수정(문서만).

## [2026-06-04 01:05] [디자이너]
외형 점검 완료 (데스크 1440 라이브 + 모바일 390 소스검증 + 인벤 비교). 직전 사이클들이 메인/리스트 집중 → 이번엔 미점검 영역 **/game/[id] 상세 표면**에 집중.
데스크 주요: 상세 '같은 시기 출시' 관련카드 D-day가 임박 불문 전부 블루(앱 D-DAY 주황/임박 amber 규약 어긋남) → 색 규약 통일 + 관련카드 카테고리 tint wash.
모바일 주요: `app/globals.css` 유일 @media(≤480) 블록이 헤더만 다룸 → `.game-detail`(상세) 모바일 오버라이드 0(패딩 1.8rem·h2 2rem 미축소), 유일 미보유 표면.
인벤 참고: 본문 행 액션 버튼(일정/홈페이지/영상/찜) → 우리 상세 액션 `.gcal-link`/'공식 출처'가 평문 링크(CSS 0) → outline pill 버튼화(다크 미니멀 재해석).
DESIGN_NOTES에 4개 제안 추가(전부 보통·신규 색 0·상세 표면). a11y/리팩토링 0건(외형 모드).

## [2026-06-04 00:48] [QA]
검증 대상: 리스트뷰 기간 기본값 '전체'→'오늘 이후' (개발자 00:20 5ba8af8 / listGames 하한·캘린더 무하한 보존·'전체(과거 포함)'-1 옵션)
데스크톱 1440: ✅ (resize 미반영·innerWidth 1920 실측, 라이브 렌더 JS 검증으로 갈음)
모바일 390: ✅ (resize 미반영 → 모바일 MQ 번들 실측 + 합성 390 리플로 갈음)
상세: 라이브 Chrome 실측 — 기간 select 옵션 정확(0=오늘 이후[기본]·30·90·180·365·-1=전체(과거 포함)). 리스트 기본 '총 27개'(최상단 2026.06.04 D-DAY·과거 0건) → '전체(과거 포함)' 선택 시 '총 44개'·과거(2025.12.11·2026.03.x) 복원. 캘린더 prev 6월→4월 탐색 시 과거 게임(나이트크로우 4/23) 정상 → 리스트 하한이 캘린더 무하한 무파손 확정. 합성 390 리플로: 루트 390/390·캘린더그리드 326/326·필터 358/358·리스트 358/358 가로 오버플로 0(MonthTabs sw>cw는 의도된 가로 스크롤 스트립·페이지 무영향). /game/raven2-server-zero2-20260601 상세 메타 4행·390 오버플로 0. 콘솔 #418/#423/#425·에러 0(MetaMask 확장 경고만). 헬스 ✅(홈 h1·robots·new-servers 12·sitemap XML). 참고: WebFetch raw HTML은 옛 라벨/데이터 06.02 캐시 잔존이나 Chrome 라이브는 신빌드(데이터 06.03·신옵션) → Vercel CDN 전파중. 신규 BUGS 0.

## [2026-06-04 00:20] [개발자]
완료: 사용자요청 큐 1순위 '리스트뷰 기간 기본값 전체(과거+미래)→오늘 이후' 구현. 진입 시 리스트 최상단이 과거 출시 게임이던 문제 해소. `filters.days` 기본값 0의 의미를 '오늘 이후'(하한 today)로 재정의하고, 캘린더와 공유하는 `filteredGames`(무하한)는 그대로 둔 채 **리스트 전용 `listGames`**에만 `release_date >= today` 하한을 적용 → ListView=listGames·CalendarView=filteredGames로 분리 전달(리스트만 오늘 이후·캘린더 과거 달 탐색 무파손). 기간 select에 '전체 (과거 포함)'(value=-1) 옵션 추가 → 과거는 완전 제거 아니라 선택 시 복원(사용자 확정 반영). 통계줄 카운트도 현재 뷰 정합.
변경된 파일: components/Home.tsx(+9, listGames useMemo·뷰 정합 통계·ListView prop)·components/Filters.tsx(+1, 기간 옵션)
비고: 하한은 now(KST·mount 후 useEffect) 기준 + 기본 뷰 calendar라 리스트 SSR 비렌더 → 날짜의존 하이드레이션(7건 이력) 무재발. strict any 0·신규 색 0·esbuild tsx Home/Filters OK·games.json 44 시뮬(오늘이후 27·과거 17 복원가능·캘린더 44 보존). 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 5→4. QA님 라이브 리스트 기본 '오늘 이후'·기간 '전체(과거 포함)' 선택 시 과거 복원·캘린더 과거 달 탐색 정상·콘솔 #418/#423/#425 0건 실측 부탁.

## [2026-06-04 00:22] [기획자]
사용자 활성 요청 2건 최우선 등록 (큐 1·2순위) — 모드: 외형 집중
요청(운영자 직접): ①리스트뷰 기간 기본 '전체(과거+미래)'→'오늘 이후'(과거는 기간 필터로 유지, 완전 제거 X) ②진입 시 캘린더 '오늘 날짜 셀' 디폴트 선택→day-detail 패널('오늘 이후 출시') 자동 표시(진입 직후 아래 리스트 비어 보이는 문제)
처리: USER_REQUESTS.md '활성' 등재 + TODO 1순위(리스트 오늘이후)·2순위(캘린더 오늘셀 자동선택)
밀림: 기존 1~3(ViewToggle 모바일·장르칩·통계줄 4색)→3~5순위, 직전 4·5(헤더 듀얼 radial·핫카드)→'큐 소진 후 후보'(스펙 보존)
안전장치 명시: 오늘 하한은 useEffect(mount 후) 계산 → 날짜의존 하이드레이션(7건 이력) 회피 / 리스트 하한은 캘린더 과거 달 탐색 무파손(리스트 표시에만 또는 기간 '전체' 선택 시 복원)
캘린더 현재 달 오픈·오늘 셀 강조는 이미 구현 확인(Home.tsx). SEO 보류 유지(안 건드림). 신규 BUGS 0. 개발자 :20 1순위 착수 권장. 코드 미수정(문서만).

## [2026-06-04 00:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 'MonthTabs 모바일 가로 스크롤 어포던스(엣지 페이드 mask+scroll-snap)' 개발자 23:28(1666b87)·QA 23:45 라이브 ✅ → 완료한 기능 이동(번호큐 이미 미반영)
유지: 번호큐 1~4(ViewToggle 모바일 블록·리스트 장르 칩·통계줄 4색 분해·헤더 듀얼 radial) 순서 그대로(1순위 ViewToggle 보호 — 직전 여러 사이클 밀린 잔여라 신규는 5순위 말미만)
추가: - ⑤[외형·하이라이트·D-DAY강조] "🔥 출시 임박" 최근접 1건 대형 핫카드 승격 + 라이브 HH:MM:SS 카운트다운(HeroStrip.tsx+module.css, 디자이너 06-03 01:05 인벤#1). 카운트다운은 useEffect mount 후에만 렌더(SSR 미출력)해 날짜의존 하이드레이션(7건 이력) 재발 방지.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0(ViewToggle 1순위 승격 첫 사이클). 디자이너 신규 제안 0(최신 21:06 기처리). a11y/리팩토링 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).

## [2026-06-03 23:45] [QA]
검증 대상: MonthTabs 모바일 가로 스크롤 어포던스 — 엣지 페이드 mask + scroll-snap (개발자 23:28 1666b87)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 실측)
모바일 390: ✅ (resize 미반영 → 배포 CSS 직접 검증으로 갈음)
상세: 라이브 Chrome 배포 번들 CSS 실측 — `@media(max-width:480px)` `.MonthTabs_tabs` `mask-image:linear-gradient(90deg,transparent,#000 16px,#000 calc(100%-16px),transparent)`(양끝 16px 페이드)+`scroll-snap-type:x`(=proximity 기본), `.MonthTabs_tab` `scroll-snap-align:center` 전부 출고 확인. 월탭 12개(1~12월) 정상. 데스크톱 1920 실측 mask/snap=none(미디어쿼리 밖, 무영향 확인). 가로 오버플로 0(docScrollW 1905<1920). 콘솔 React #418/#423/#425·에러 0(MetaMask 확장 MaxListeners 경고만). 헬스 ✅(홈 h1 🎮·robots·new-servers 12·상세 raven2-zero2 정상). 신규 BUGS 0.

## [2026-06-03 23:28] [개발자]
완료: 큐 1순위 '[외형·모바일·높음] MonthTabs 가로 스크롤 어포던스 — 엣지 페이드 mask + scroll-snap' 구현. 12개 월탭이 모바일 가로 스크롤이나 스크롤 신호 0이라 잘린 9~12월 미발견이던 어포던스 부재 해소. 기존 `@media(≤480px)` 블록에 `.tabs` mask-image 양끝 16px 페이드('더 있음' 신호)+`scroll-snap-type:x proximity`, `.tab`에 `scroll-snap-align:center` 추가.
변경된 파일: components/MonthTabs.module.css(+5, `.tabs` 블록 +4·`.tab` snap +1)
비고: CSS-only(tsx 무변경, `.tabs`/`.tab` className은 MonthTabs.tsx L14·L19 사용 중 확인). 데스크톱 무영향(미디어쿼리 밖)·mask 미지원 폴백 현행 스크롤. 신규 색 0·brace 7/7. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 5→4. QA님 라이브 모바일 ≤480px 월탭 양끝 페이드·중앙 스냅·9~12월 발견성·데스크톱 무영향·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.

## [2026-06-03 23:55] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위) + 중복 1건 제거
완료: 1순위 '[외형·헤더] 인트로 태그라인 헤더 통합' 개발자 23:20·QA 23:40 라이브 ✅ → 완료한 기능 이동
중복 제거: 직전 4순위 'HeroStrip 임박 카드 글로우' = repo 교차검증 결과 **이미 출고 완료**(glowDday/glowCat 분기·--cat 주입·color-mix 외곽 글로우·D-DAY #ff7a59 scale·@media≤480 리셋·reduced-motion 전부 존재, 디자이너 라이브 '4글로우카드' 확인) → 22:00 IDEAS→큐 재승격이 중복이었음. 큐 제거·IDEAS 종결.
유지: 큐 1~3(MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩) 순서 그대로(1순위 MonthTabs 보호 — 신규는 4·5순위 말미만)
추가: - ④[외형·카테고리 시각차별화] 통계줄 카테고리 4색 분해(Home.tsx 통계 노드+Home.module.css, 디자이너 13:05 데스크#2)
      - ⑤[외형·헤더 임팩트] .site-header::before 듀얼 브랜드 radial(블루+퍼플, globals.css, 디자이너 13:05 데스크#3)
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).

## [2026-06-03 23:40] [QA]
검증 대상: 인트로 태그라인 헤더 통합 + .subtitle 위계 강화 (개발자 23:20 4d31340)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize 미반영 → 358px 합성 리플로 갈음)
상세: 라이브 Chrome 실측 — `.site-tagline` 헤더 내 h1 직속 다음형제 1개(중복 0·body `.subtitle` 0), 색 #cfd6e0(rgb 207,214,224)·1.1rem(17.6px)·500·letter-spacing −0.01em. 가로 오버플로 0(docScrollW 1905<1920). 390 합성 리플로서 태그라인 358px·1행·헤더 오버플로 0. 헬스 ✅(홈 h1·sitemap XML·robots·상세 raven2·new-servers 12). 콘솔 React #418/#423/#425·에러 0(MetaMask 확장 MaxListeners 경고만). 정적 HTML "/" 캐시 옛 위계 잔존(태그라인 광고 뒤)이나 new-servers 신규 위계 반영·Chrome 렌더 정상 → Vercel 캐시 전파중. 신규 BUGS 0.

## [2026-06-03 23:20] [개발자]
완료: 큐 1순위 '[외형·헤더·높음] 인트로 카피 태그라인 헤더 통합 + .subtitle 위계 강화' 구현. 태그라인을 Home 본문(광고~임박 스트립 사이 회색 #888 고아 한 줄)에서 떼어 `.site-header` h1 바로 아래로 이동 → 타이틀+태그라인 한 덩어리, 히어로 밴드 radial glow 배경 공유. 톤업(#cfd6e0·1.1rem·500·letter-spacing -0.01em), 모바일 ≤480px 1rem 비례 축소.
변경된 파일: app/layout.tsx(+1 `<p.site-tagline>` 삽입)·app/globals.css(+10 `.site-header .site-tagline`+@media480)·components/Home.tsx(−2 subtitle p 제거)·components/Home.module.css(−6 미사용 .subtitle 규칙 제거).
비고: 디자이너 임팩트안(헤더 통합) 채택. 신규 색 0(#cfd6e0 기존 톤 계열). globals brace 71/71·Home.module 3/3·잔존 subtitle 참조 0건. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 4→3. QA님 라이브 데스크/모바일 태그라인 헤더 통합 위계·가로 오버플로 0 실측 부탁.

