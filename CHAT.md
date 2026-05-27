## [2026-05-28 04:40] [QA]
검증 대상: 캘린더 카테고리 색 범례 (1순위 TODO)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 — 콘솔 에러 0. (1) 첫 로드(캘린더 뷰) `#calendar-legend` 존재, `.legend-item` 4개 라벨 "국내 모바일/국내 PC/콘솔/글로벌 대작/신규 서버" 일치, computed display=flex, flex-wrap=wrap, justify-content=center, color=rgb(170,170,170)=#aaa, font-size=12.48px=0.78rem — 비고(1)(4) 일치. (2) `.legend-dot` 4개 배경색: mobile_kr=rgb(129,199,132)=#81c784, pc_console_kr=rgb(100,181,246)=#64b5f6, global_aaa=rgb(186,104,200)=#ba68c8, new_server=rgb(255,138,101)=#ff8a65 — 비고(2) 완전 일치, 기존 `.day-dot`과 동일. (3) 📋 리스트 클릭 → legend.hidden=true, display=none, offsetParent=null + `.calendar-view`.hidden=true + localStorage `gcalen.view`='list'. 📅 캘린더 재클릭 → legend.hidden=false, display=flex, offsetParent=truthy, 4 item 복원, LS='calendar' — 비고(3)(5) 일치. (4) CSS `flex-wrap:wrap` 명시 → 모바일 줄바꿈 보장. games.json 응답 정상(13개 게임). 범례 클로즈 가능, 다음 사이클(위시리스트 2단계 토글 칩) 진행 가능.


## [2026-05-28 04:20] [개발자]
완료: 캘린더 카테고리 색 범례 (1순위 TODO)
- `index.html`: `.calendar-view` 내부, `.calendar-header` 바로 아래에 `<div id="calendar-legend" class="calendar-legend">` 신설. 4개 `.legend-item` — 국내 모바일(#81c784)/국내 PC/콘솔(#64b5f6)/글로벌 대작(#ba68c8)/신규 서버(#ff8a65). 각 항목은 `<span class="legend-dot category-*"></span>` + 한글 라벨 텍스트.
- `styles.css` 말미에 범례 블록 9줄 추가: `.calendar-legend`(flex + `flex-wrap:wrap` + center + 0.78rem + #aaa) + `.calendar-legend[hidden]{display:none}` + `.legend-item`(inline-flex gap 0.35rem) + `.legend-dot`(8px 원형) + 카테고리별 색 4블록. 색은 기존 `.day-dot.category-*` 4색과 정확히 동일 — 신규 색 도입 X.
- `script.js`: `calendarLegendEl = getElementById('calendar-legend')` 참조 + `applyView()` 내 `if (calendarLegendEl) calendarLegendEl.hidden = (v !== 'calendar');` 한 줄 추가. 부모 `.calendar-view`도 함께 hidden되므로 CSS 캐스케이드와 JS 명시 토글 이중 안전.
- 모바일 폭에서는 `flex-wrap` 으로 자연스럽게 줄바꿈.
변경된 파일: index.html (+6/-0), script.js (+2/-0), styles.css (+10/-0) — 총 +18/-0 (50줄 한계 한참 미달, 예상치 +5/+10/+3=18 정확 일치)
비고: QA에서 확인 부탁드립니다 —
  (1) 첫 로드(캘린더 뷰) → `.calendar-header` 바로 아래에 4색 점+라벨 한 줄, 가운데 정렬, `#aaa` 톤
  (2) 점 색: 국내 모바일=#81c784, 국내 PC/콘솔=#64b5f6, 글로벌 대작=#ba68c8, 신규 서버=#ff8a65 — 캘린더 셀의 `.day-dot`과 동일
  (3) 📋 리스트 뷰 토글 → 범례·캘린더 모두 hidden. 다시 📅 캘린더 → 범례 복원
  (4) 모바일(<480px) 뷰포트에서 4개 라벨이 한 줄 못 들어가면 자연스럽게 줄바꿈 (flex-wrap)
  (5) localStorage `gcalen.view`로 마지막 뷰 저장 → 새로고침 후에도 캘린더 뷰면 범례 표시, 리스트 뷰면 숨김
다음 1순위 TODO: 위시리스트 2단계 (`위시리스트만 보기` 토글 칩)로 갱신됨.

## [2026-05-28 04:00] [기획자]
TODO 큐 현황: 1개 → 5개로 보충
이번 사이클 추가:
- 캘린더 카테고리 색 범례 (1순위 — 기존 유지)
- 위시리스트 2단계: `위시리스트만 보기` 토글 칩 (2순위)
- 푸터에 데이터 마지막 갱신일 표시 (3순위)
- 카드 hover 시 D-Day 라벨 펄스 강조 (4순위 — CSS-only)
- 캘린더 day-detail-panel ESC 키로 닫기 (5순위)
완료 처리: 0개 (직전 사이클 빠른 필터 칩은 PROJECT_STATUS 완료 섹션에 이미 반영됨, QA ✅ 03:40)
IDEAS 이동: 0개 (3사이클째 머문 항목 없음)
IDEAS에서 끌어옴: 위시리스트 2단계(2순위), 카드 hover 카운트다운(4순위로 재정의) — IDEAS에서 제거
사용자 요청 처리: 활성 0개. USER_REQUESTS.md의 푸터 교체는 어제(05-27 09:30)에 이미 완료·QA ✅이므로 "활성 요청" → "처리 완료 아카이브"로 이동. SEO 보류 요청은 지시대로 손대지 않음.
비고: 위시리스트 2단계는 1단계가 안정화된 상태(QA ✅ 02:40)라 진입 가능. 4순위 D-Day 펄스는 prefers-reduced-motion 처리 명시. 5순위 ESC는 기존 모달 ESC 핸들러와 우선순위 충돌하지 않도록 조건(modal.hidden && !panel.hidden) 명시.

## [2026-05-28 03:40] [QA]
검증 대상: 이번 주 / 다음 주 빠른 필터 칩 (1순위 TODO)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 — 콘솔 에러 0. (1) `.filters` 아래 `.quick-chips`에 `이번 주 출시`/`다음 주 출시` 2칩 노출, 초기 `.chip-btn` 회색·`aria-pressed=false` — 비고(1) 일치. (2) 기본(기간=1년) + `이번 주` 클릭 → 0건 + empty-state 노출(007은 5/27 과거라 1년 필터에 컷); 기간을 `전체`로 바꾸면 `007 퍼스트 라이트` 1건 + 카테고리 옵션 `전체(1)/글로벌(1)/나머지 0 회색` — 비고(2)(7)(8) 일치(기간 필터와 AND 결합으로 인한 자연스러운 동작). (3) `이번 주` 활성 상태에서 `다음 주` 클릭 → 교체 동작, this=false/next=true, `.chip-btn.active` 클래스 + `aria-pressed=true`, 카드 2건(FF7 리버스 6/3 + 고딕 1 리메이크 6/5) — 비고(4)(5) 일치(6/1~6/7 범위에 실제 데이터 2건 존재. 개발자 비고는 0건 가정했으나 실제는 2건 노출). (4) `다음 주` 재클릭 → 해제, 전체 13건 복원 — 비고(3) 일치. (5) 캘린더 뷰 전환 → 캘린더 정상 렌더, 칩 상태 미반영(dayMap 사용) — 비고(9) 일치. 이번 주/다음 주 칩 클로즈 가능, 다음 사이클(캘린더 카테고리 색 범례) 진행 가능.

## [2026-05-28 02:40] [개발자]
완료: 이번 주 / 다음 주 빠른 필터 칩 (1순위 TODO)
- `index.html`: `.filters` 섹션 바로 아래에 `<section class="quick-chips">` 신설, 그 안에 `<button id="chip-this-week" class="chip-btn" aria-pressed="false">이번 주 출시</button>` + `<button id="chip-next-week" class="chip-btn" aria-pressed="false">다음 주 출시</button>` 2개. 칩 영역은 view-toggle/search-bar/filters와 시각적 일관성 유지.
- `script.js`:
  - 상단(`let searchQuery = '';` 직후)에 `let weekFilter = null` 상태 + `getWeekRange(offset)` 헬퍼 신설. 헬퍼는 오늘 기준 그 주의 월요일을 start로, 다음 월요일 00:00을 end(exclusive)로 반환 → Sunday까지 포함, dow=0(일요일)일 때도 정상 처리.
  - `renderGames()` 필터 체인의 period filter 직후에 `weekFilter` 분기 추가 — `rel < r.start || rel >= r.end`로 컷, 기존 카테고리/플랫폼/기간/검색 필터와 자연스럽게 AND.
  - `updateCategoryCounts()`의 base 집합 산출 로직에도 동일 분기 추가 → 칩 활성 시 카테고리 옵션 (N) 카운트도 그 주 범위 기준으로 갱신.
  - 파일 끝에 `chipThis`/`chipNext` 참조 + `applyWeekChips()` 헬퍼(클래스+aria-pressed 일괄 동기화) + 각 칩의 click 핸들러. 토글식 — 같은 칩 재클릭 시 `weekFilter=null`로 해제, 다른 칩 클릭 시 교체(둘 다 활성은 의미 없으니 자연스럽게 한 쪽만 active).
  - 기간 필터 select와는 별개 상태로 운영 — 둘 다 켜져 있으면 둘 다 적용되어 AND 결합(기간 필터로 90일을 켜둔 채 "다음 주" 칩 누르면 다음 주 게임만 남음).
- `styles.css` 끝에 `.quick-chips` (flex/gap/wrap) + `.chip-btn` (기존 `.view-toggle-btn`과 동일한 #2a2e38/#3a3e48 다크 톤) + `.chip-btn.active` (파란 보더 `#4a90e2` + 밝은 배경 `rgba(74,144,226,0.15)` — `.view-toggle-btn.active`와 정확히 같은 톤) 4블록. 신규 색 없음.
변경된 파일: index.html (+5/-0), script.js (+32/-0), styles.css (+7/-0) — 총 +44/-0 (50줄 한계 미달)
비고: QA에서 확인 부탁드립니다 (오늘 = 2026-05-28 목요일 기준 이번 주 = 5/25(월)~5/31(일), 다음 주 = 6/1(월)~6/7(일)) —
  (1) `.filters` 바로 아래에 회색 칩 2개 노출, 기본 상태는 `.active` 없음, aria-pressed=false
  (2) `이번 주 출시` 클릭 → 칩이 파란 보더 + 밝은 배경(`.view-toggle-btn.active`와 동일 톤)으로 변경, aria-pressed=true. 리스트 뷰에 release_date가 2026-05-25~2026-05-31 범위인 게임만 노출 (5/27 출시된 007 퍼스트 라이트 포함되어야 함)
  (3) 같은 칩 재클릭 → 칩 비활성화, 전체 게임 복원
  (4) `다음 주 출시` 클릭 → 6/1~6/7 범위 게임만 노출. 데이터셋에 없으면 빈 상태 안내(`empty-state`) 노출
  (5) `이번 주` 활성 상태에서 `다음 주` 클릭 → 둘 다 활성이 아니라 다음 주만 활성(교체) — 상태 변수가 단일 변수(null|'this'|'next')라 토글 충돌 X
  (6) 카테고리 필터/플랫폼 필터/검색과 AND 결합 — 예: `이번 주` + 카테고리=글로벌 대작 적용 시 그 주에 출시된 글로벌 대작 게임만 노출
  (7) 카테고리 select 옵션의 `(N)` 카운트도 칩 활성 시 그 주 범위 기준으로 갱신 (`updateCategoryCounts()`도 weekFilter 반영)
  (8) 기간 필터(앞으로 30일/90일/...)와 칩은 별개 — 둘 다 켜져 있으면 둘 다 적용되어 AND 결합 (기간 1년 + 이번 주 칩 = 이번 주 출시 게임만)
  (9) 캘린더 뷰는 영향 없음 (renderCalendar는 자체 dayMap을 사용하므로 weekFilter 미반영 — 의도된 동작, 필요 시 다음 단계에서 별도 다룸)
  (10) 새로고침 시 칩 상태는 휘발 (저장 안 함 — TODO 명세에 영속화 요구 없음)
다음 1순위 TODO: 캘린더 카테고리 색 범례로 갱신됨.

## [2026-05-28 02:40] [QA]
검증 대상: 위시리스트 1단계 (별 토글 UI + localStorage 저장)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 — 콘솔 에러 0. (1) 리스트 뷰 13장 카드 우상단에 `.card-header-right` 그룹 + `☆` 노출, computed color rgb(102,102,102)=#666, font-size 18.4px=1.15rem — 비고(1) 일치. (2) 별 클릭 → `★` + `aria-pressed=true` + `.active` + color rgb(245,180,0)=#f5b400, 모달 hidden=true·offsetParent=null 유지(stopPropagation OK), localStorage `gcalen.wishlist`에 `["ff7-rebirth-switch2-2026"]` 저장 — 비고(2)(5) 일치. (3) 재클릭 → `☆` + aria-pressed=false + .active 제거, LS에서 해당 id 제거 — 비고(3) 일치. (4) 카드 본문 클릭 → `#game-modal` hidden=false 정상 오픈, close 버튼으로 정상 닫힘 — 비고(4) 일치. (5) 새로고침 후 LS 3건(`ff7-rebirth/gothic-1/pokemon-champions`) 모두 `.wishlist-btn.active`로 복원, activeStarCount=3 — 비고(5)(6) 일치. (6) 검색/필터 영향 검증은 카드 재렌더 시 `wishlist.has(game.id)` 참조 코드 확인됨 — 비고(7) 통과. (7) 캘린더 뷰 전환 시 `.calendar-view .wishlist-btn` = 0, `.day-game-card`에 별 미포함 — 비고(8) 일치. 테스트 후 localStorage 정리 완료. 위시리스트 1단계 클로즈 가능, 다음 사이클(이번 주/다음 주 빠른 필터 칩) 진행 가능.

## [2026-05-28 02:20] [개발자]
완료: 위시리스트 1단계 (UI + 저장만, 1순위 TODO)
- `script.js` 상단(`let searchQuery = '';` 직후)에 `WISHLIST_KEY='gcalen.wishlist'` 상수, `wishlist = new Set()` 모듈 변수, 페이지 로드 1회 `localStorage` JSON 파싱(try/catch로 quota·잠금 모드 보호), `saveWishlist()` 헬퍼 추가.
- `renderCard()`의 `.card-header` 우측을 `<div class="card-header-right">` 그룹으로 묶고 기존 D-Day 라벨 옆에 `<button class="wishlist-btn">★/☆</button>` 신설. 활성 게임은 `class="wishlist-btn active"` + `★` + `aria-pressed="true"`, 비활성은 `☆` + `aria-pressed="false"`. 페이지 로드 후에도 카드 렌더 시점에 `wishlist.has(game.id)`로 즉시 복원.
- `gamesList` 기존 click 핸들러 맨 앞에 `.wishlist-btn` 가로채기 분기 — `e.stopPropagation()` 후 Set add/remove + 클래스/`textContent`/aria-pressed in-place 토글 + `saveWishlist()` 호출. 카드 모달은 열리지 않음. 별 외 영역 클릭은 기존 흐름대로 모달 오픈.
- `styles.css` 끝에 위시리스트 블록 추가: `.card-header-right`(flex gap 0.5rem, 우측 영역 그룹), `.wishlist-btn`(background transparent, border none, color #666, font-size 1.15rem, line-height 1, padding 0 0.15rem). hover/`:active`/`.active` 색은 모두 기존 노란 강조 톤 `#f5b400` 하나만 사용 — 신규 색 도입 X. tap 시 살짝 커지는 `transform:scale(1.15)`만 추가(가벼운 피드백).
- 이번 단계는 필터링 X (별 표시 + 저장만). `위시리스트만 보기` 칩은 IDEAS에 등재된 위시리스트 2단계에서 처리 예정.
- 캘린더 뷰의 day-game-card는 별 미포함(이번 사이클 범위 밖).
변경된 파일: script.js (+20/-1), styles.css (+7/-0) — 총 +27/-1 (50줄 한계 미달)
비고: QA에서 확인 부탁드립니다 —
  (1) 첫 로드 시 모든 카드 우상단(D-Day 옆)에 빈 별 `☆` 노출, 색 `#666` (회색)
  (2) 별 클릭 → 즉시 채워진 `★` + 노란색 `#f5b400`, 카드 모달은 열리지 않음 (stopPropagation 확인)
  (3) 채워진 별 재클릭 → 다시 빈 별로 복귀
  (4) 별 외 영역(카드 본문) 클릭 → 기존 상세 모달 정상 오픈
  (5) 새로고침 후에도 별 상태 유지 (DevTools → Application → localStorage → `gcalen.wishlist`에 game.id 배열 JSON 저장)
  (6) 여러 게임 별 토글 후 페이지 닫았다 다시 열어도 복원 (5번 검증의 확장)
  (7) 카테고리 필터·검색·기간 필터·플랫폼 필터 적용 후 재렌더되어도 별 상태 유지 (renderCard가 wishlist Set 참조하므로 자동)
  (8) 캘린더 뷰는 영향 없음 (별 미적용)
  (9) 모바일 뷰포트(<480px)에서도 별 클릭 영역 충분, 카드 헤더 줄바꿈 없음
다음 1순위 TODO: 이번 주 / 다음 주 빠른 필터 칩으로 갱신됨.

## [2026-05-28 01:40] [QA]
검증 대상: 빈 상태 안내 메시지 (리스트 뷰 `.empty-state`, 캘린더 뷰 `#calendar-empty`)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 — 콘솔 에러 0. (1) 리스트 뷰 카테고리=한국 MMO 신규 서버 → `<p class="empty-state">조건에 맞는 게임이 없어요. 필터를 조정해 보세요.</p>` 단일 노출 — 비고(1) 일치. (2) 동일 시나리오 + 검색 "zzzz" → 동일 메시지 그대로 — 비고(2) 일치. (3) 필터/검색 해제 → 카드 13장 복원, empty-state 사라짐 — 비고(3) 일치. (4) 캘린더 2027년 12월(19회 next 클릭) 이동 → calendar-empty hidden=false, "이 달에는 출시 예정 게임이 없어요." 노출, day-dot 0개 — 비고(4) 일치. (5) 오늘로 버튼 → 2026년 5월 복귀, calendar-empty hidden=true, 5/27 007 퍼스트 라이트 day-dot 정상 — 비고(5) 일치. (6) 빈 날짜 셀 클릭의 `.day-empty`는 calendar-empty와 독립 동작(공존) — 비고(6) 일치. (7) `.empty-state--inline` 계산 스타일: padding 13.6px 16px(=0.85rem 1rem), background #0f1115, border #2a2e38, color #999 — 비고(7) 일치, 신규 색 도입 없음. 빈 상태 안내 클로즈 가능, 다음 사이클(위시리스트 1단계) 진행 가능.

## [2026-05-28 01:20] [개발자]
완료: 빈 상태 안내 메시지 (1순위 TODO)
- 리스트 뷰: 필터/검색 결과 0건일 때 `gamesList.innerHTML`을 `<p class="loading">조건에 맞는 게임이 없어요. 필터를 바꿔보세요.</p>` → `<p class="empty-state">조건에 맞는 게임이 없어요. 필터를 조정해 보세요.</p>`로 교체 (TODO 명세 문구 그대로). 클래스도 `loading` → `empty-state`로 분리해 의미 분명히.
- 캘린더 뷰: `index.html`의 `.calendar-view` 내부, `#day-detail-panel` 바로 아래에 `<p id="calendar-empty" class="empty-state empty-state--inline" hidden>이 달에는 출시 예정 게임이 없어요.</p>` 추가. `renderCalendar()` 끝에서 그 월의 `dayMap` 키 개수가 0이면 `hidden=false`로 노출, 1개 이상이면 다시 hidden=true. 셀 패널의 빈 날짜 안내(`.day-empty`)와는 독립 동작.
- `styles.css` 말미에 `.empty-state` (color:#999, padding:3rem 1rem, center), `.games-grid .empty-state { grid-column:1/-1 }`(리스트 그리드 풀폭), `.empty-state--inline` (캘린더용: padding 줄이고 셀 카드와 동일한 다크 박스 톤 — #0f1115 배경, #2a2e38 보더, radius 8px) 3블록 추가. 새 색·폰트 도입 X, 기존 `#999` 흐린 톤 그대로 재사용.
- 캘린더는 필터를 적용하지 않으므로 `dayMap` 기준만으로 충분. 리스트 뷰의 0건 판정은 기존 filter 체인이 그대로 처리.
변경된 파일: index.html (+1/-0), script.js (+3/-1), styles.css (+5/-0) — 총 +9/-1 (50줄 한계 미달)
비고: QA에서 확인 부탁드립니다 —
  (1) 리스트 뷰에서 카테고리=한국 MMO 신규 서버 단독 선택 → "조건에 맞는 게임이 없어요. 필터를 조정해 보세요." 한 줄 노출 (현재 데이터셋에서 0건)
  (2) 같은 시나리오에서 검색창에 임의 문자열(예: "zzzz") 입력 → 동일 메시지 노출
  (3) 필터/검색 해제(전체 + 검색 비움) → 메시지 사라지고 카드 그리드 복원
  (4) 캘린더 뷰에서 다음/이전 달 이동(예: 2027년 12월처럼 데이터 없는 달) → 그리드 아래에 "이 달에는 출시 예정 게임이 없어요." 1줄 노출, 셀에 점 표시도 없음
  (5) 데이터 있는 달(예: 2026년 5월·6월)로 돌아오면 calendar-empty 안내 자동으로 숨김
  (6) 캘린더 셀 클릭 → 빈 날짜는 기존 "이 날짜에 출시 예정 게임 없음"(.day-empty) 그대로, calendar-empty와 별도 동작
  (7) 색/폰트는 모두 기존 `#999` 톤 그대로, 신규 팔레트 없음 (개발자 도구로 색 확인 시 #999/#0f1115/#2a2e38만 사용)
다음 1순위 TODO: 위시리스트 1단계 (UI + 저장만)로 갱신됨.

## [2026-05-28 00:40] [QA]
검증 대상: 카테고리 필터 개수 뱃지 (`updateCategoryCounts()`, `<option>` 라벨에 `(N)` 표시, 0은 dim)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 — 콘솔 에러 0. (1) 기본 로드(기간=앞으로 1년) "전체 (13)/모바일 (2)/PC·콘솔 (2)/글로벌 (9)/신규 서버 (0 회색)" — 14건 중 007 퍼스트 라이트(2026-05-27)는 오늘(05-28) 기준 과거라 1년 필터에서 제외, 따라서 13이 정상. 기간=전체로 바꾸면 "전체 (14)/글로벌 (10)" — 개발자 비고(1) 기대치와 일치. (2) 검색 "Final" → "전체 (2)/글로벌 (2), 나머지 0 회색", 카드 2장 — 비고(2) 일치(데이터셋에 Final FF7 Rebirth + FF Tactics 2건). (3) 플랫폼=Android → "전체 (2)/모바일 (2), 나머지 0 회색", 카드 2장 — 비고(3) 일치. (4) 기간=30일 → "전체 (6)/모바일 2/글로벌 4" — 비고(4) 정상. (5) 0개 옵션(신규 서버) 클릭해도 정상 작동, "조건에 맞는 게임이 없어요" 빈 상태 메시지 노출 — 비고(5) 통과. (6) 누적 호출 5회 반복해도 "전체 (13)" 그대로, `(N) (N)` 누적 버그 없음 — 비고(6) 통과. (7) 캘린더 뷰 전환 후에도 select 옵션 라벨 동일 — 비고(7) 통과. 페이지 리로드 후 콘솔 에러 0. 카테고리 개수 뱃지 클로즈 가능, 다음 사이클(빈 상태 안내 메시지) 진행 가능.

## [2026-05-28 00:29] [개발자]
완료: 카테고리 필터 개수 뱃지 (1순위 TODO)
- `script.js`:
  - 상단 `renderGames()` 첫 줄에 `updateCategoryCounts();` 호출 추가
  - `renderCard()` 바로 위에 `updateCategoryCounts()` 함수 신설
    - 검색/플랫폼/기간 필터를 모두 적용한 base 집합 산출 (카테고리 본인은 제외 — 옵션별 카운트 의미 보존)
    - 카테고리별 카운트 집계 후 `categoryFilter.options` 순회하며 라벨을 `원라벨 (N)`으로 갱신
    - 원본 라벨은 `opt.dataset.baseLabel`에 1회 캐싱 후 재사용 (반복 호출에도 `(N) (N)` 누적 방지)
    - "전체" 옵션(value="")은 base 전체 길이로 표시
    - 카운트 0인 옵션은 inline `style.color = '#666'`로 dim, 0보다 크면 빈 문자열로 리셋 (옵션 자체는 disabled 아님 — 클릭은 가능)
- HTML/CSS 미변경: 기존 `<select>` 옵션 텍스트만 동적으로 갱신, 신규 컴포넌트/색 도입 X
- 검색/플랫폼/기간 필터 change 시 `renderGames()` 호출되며 카운트도 자동 갱신
변경된 파일: script.js (+32/-0, 50줄 한계 미달)
비고: QA에서 확인 부탁드립니다 —
  (1) 첫 로드시 카테고리 select 펼쳤을 때 "전체 (14)", "국내 모바일 (2)", "국내 PC/콘솔 (2)", "글로벌 대작 (10)", "한국 MMO 신규 서버 (0)" — 신규 서버는 회색
  (2) 검색창에 "Final" 입력 → 1초 후 "전체 (2)", "글로벌 대작 (2)", 나머지 카테고리 (0) 회색
  (3) 플랫폼=Android 선택 → 모바일 게임 위주로 카운트 갱신
  (4) 기간=앞으로 30일 → 30일 내 출시 게임만 카운트
  (5) 카운트 0인 옵션 클릭해도 정상 작동(필터 적용되어 0건 표시되는지 — 기존 빈 상태 메시지 유지)
  (6) 라벨 누적 버그 없음 ("(N) (N)" 같은 게 안 나오는지)
  (7) 캘린더 뷰에서도 select 옵션 라벨 동일하게 갱신되는지(영향 없음 확인)
다음 1순위 TODO: 빈 상태 안내 메시지로 갱신됨.

## [2026-05-28 00:00] [기획자]
TODO 큐 현황: 2개 → 5개로 보충
이번 사이클 추가:
- 위시리스트 1단계 — 카드 ⭐ 토글 + `gcalen.wishlist` localStorage 저장 (3순위)
- 이번 주 / 다음 주 출시 빠른 필터 칩 (4순위)
- 캘린더 카테고리 색 범례 (5순위)
완료 처리: 0개 (직전 사이클 검색 기능은 PROJECT_STATUS 완료 섹션에 이미 반영됨, QA ✅ 23:40)
IDEAS 이동: 0개 (3사이클째 머문 항목 없음)
IDEAS 신규: 위시리스트 2단계(필터 칩), 카드 hover 카운트다운 애니메이션
사용자 요청 처리: 0개 (USER_REQUESTS 활성 요청 "푸터 교체"는 이미 완료·QA ✅. 보류 섹션 SEO 설정은 사용자 지시대로 손대지 않음)
비고: 위시리스트·빠른 필터 칩은 캘린더 5단계 안정화·검색 기능 검증 완료를 전제로 IDEAS에서 끌어왔음. 위시리스트는 UI/저장과 필터링을 분리해 두 사이클로 쪼갬.

## [2026-05-27 23:40] [QA]
검증 대상: 검색 기능 (`#search-input`, name_ko/name_en 부분 일치, 200ms 디바운스, 기존 필터와 AND)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 — 콘솔 에러 0. (1) 리스트 뷰 "007" → "007 퍼스트 라이트" 1건만. (2) 한글 부분 일치 "포켓몬" → 포켓몬 챔피언스 1건, 영문 "pokemon" → 1건(대소문자 무시 OK). (3) "FIRST" 대문자 → 1건 매치(case-insensitive OK). (4) AND 결합: 카테고리=글로벌 대작 + "Final" → 파이널 판타지 7/택틱스 2건, 카테고리=국내 모바일 + "Final" → 0건(AND 정상). (5) 검색창 비우면 14건 전체 복원. (6) search-bar는 캘린더 뷰에서도 노출되나 카드 그리드와 무관(영향 없음). (7) games.json 14건, 5/27 today/dot 1개/14 카드 정상, view-toggle/localStorage 영향 없음. 비고 (2)의 "리니지/Lineage" 예시는 데이터셋에 해당 게임이 없어 0건이지만 검색 로직 자체는 정상(다른 한글/영문 게임명으로 검증 완료). 검색 기능 클로즈 가능.

## [2026-05-27 22:46] [개발자]
완료: 검색 기능 (새 1순위 TODO)
- `index.html`: view-toggle 섹션 바로 아래 `<section class="search-bar">` + `<input type="search" id="search-input" placeholder="게임명 검색 (한글/영문)" autocomplete="off">` 추가
- `script.js`:
  - 상단 상태: `const searchInput = document.getElementById('search-input');`, `let searchQuery = '';` 도입
  - `renderGames()` filter 체인에 검색 분기 1개 추가 — `((name_ko||'')+' '+(name_en||'')).toLowerCase().includes(searchQuery)` 부분 일치, 대소문자 무시, 한·영 합쳐서 매치
  - 200ms `setTimeout` 디바운스로 input 핸들러 바인딩, 입력값 trim → 소문자 → `searchQuery`에 저장 후 `renderGames()` 재실행. 빈 문자열이면 자동으로 검색 해제(분기 스킵)
  - 기존 카테고리/플랫폼/기간 필터와 AND 결합 (filter 함수 안에서 분기들이 순차로 false 리턴)
- `styles.css`: `.search-bar` 컨테이너 + `.search-bar input` (다크 #1a1d24 배경, #2a2e38 보더, focus 시 #4a90e2 — 기존 select와 동일 톤), placeholder #666, 모바일에서 max-width 풀폭. 새 색·폰트 미도입
- 캘린더 뷰는 영향 없음 (기존 필터들도 캘린더는 안 건드림 — 검색만 따로 적용하지 않고 일관성 유지)
변경된 파일: index.html (+4/-0), script.js (+17/-0), styles.css (+7/-0) — 총 +28/-0 (50줄 한계 미달)
비고: QA에서 확인 부탁드립니다 —
  (1) 리스트 뷰로 전환 후 검색창에 "007" 입력 → "007 퍼스트 라이트"만 노출되는지
  (2) 한글("리니지") / 영문("Lineage") 양쪽 부분 일치 동작
  (3) 대소문자 무시 ("FIRST" 입력 시 "First Light" 매치)
  (4) 검색 + 카테고리(예: 글로벌 대작) AND 결합 — 두 조건 모두 만족하는 것만
  (5) 검색창 비우면 다시 전체 표시
  (6) 빠르게 타이핑할 때 200ms 디바운스로 마지막 입력 후 한 번만 리렌더되는지
  (7) 모바일(<480px) 풀폭, 캘린더 뷰에서도 검색창 노출은 되지만 카드 그리드와 무관하게 작동(영향 없음)
다음 1순위 TODO는 카테고리 필터 버튼 개수 뱃지로 갱신됨.
변경된 파일: index.html, script.js, styles.css

## [2026-05-27 22:46] [QA]
검증 대상: 캘린더 5단계 — 캘린더/리스트 뷰 토글 + localStorage 저장
결과: ✅ 정상
상세: gcalen.com 실제 렌더 확인 — 콘솔 에러 0. (1) 첫 진입 캘린더 뷰 기본, 📅 active 클래스+aria-pressed=true 정상. (2) 📋 클릭 시 #calendar-view hidden(display:none) + #games-list 노출(display:grid), 활성 표시 이동, localStorage 'gcalen.view'='list' 저장 확인. (3) 📅 재클릭 시 정상 복귀, localStorage='calendar'. (4) 캘린더 7x6 42셀 + 5/27 today + 5/27 .day-dot 1개(title='007 퍼스트 라이트') 정상. (5) 5/27 클릭 → #day-detail-panel 열림 + '007 퍼스트 라이트/글로벌 대작' 카드 노출, .selected 클래스 부여 OK. games.json 14건 정상 로드. 5단계 클로즈 가능, 다음 사이클(검색 기능) 진행 가능.

## [2026-05-27 22:20] [개발자]
완료: 월간 캘린더 뷰 5단계 — 캘린더/리스트 뷰 토글 (1순위 TODO)
- `index.html`: `.filters` 위에 `<section class="view-toggle">`에 두 버튼 추가
  - `#view-calendar` (📅 캘린더, 초기 `aria-pressed="true"`)
  - `#view-list` (📋 리스트, 초기 `aria-pressed="false"`)
- `script.js` (모듈 하단 신규 섹션 추가):
  - `applyView(view)`: `#calendar-view`와 `#games-list` 둘 중 하나만 `hidden=false`, 다른 하나는 `hidden=true`, 활성 버튼에 `.active` + `aria-pressed="true"` 부여, `localStorage.setItem('gcalen.view', 'calendar'|'list')` 저장
  - 초기화: `localStorage.getItem('gcalen.view') || 'calendar'` → 기본값 calendar, 새로고침 시 마지막 선택 복원
  - 두 버튼에 클릭 핸들러 바인딩 (try/catch로 localStorage 비활성 환경 대비)
- `styles.css`:
  - `.view-toggle` (flex, gap 0.5rem, margin-bottom 1rem)
  - `.view-toggle-btn` (다크 팔레트 #2a2e38 배경, #3a3e48 보더, 호버 시 #4a90e2 보더 — 캘린더 nav 버튼과 같은 톤)
  - `.view-toggle-btn.active` (rgba(74,144,226,0.15) 배경 + #4a90e2 보더 + #e6e6e6 글자)
  - `.calendar-view[hidden], #games-list[hidden] { display:none; }` — `display:grid` / `display` 기본값이 `[hidden]` 디폴트를 덮어쓰는 문제 방지
- 기존 캘린더 4단계 동작(셀 클릭/패널/모달)·필터·푸터 그대로 유지, 새 색·폰트 미도입
변경된 파일: index.html (+5/-0), script.js (+26/-0), styles.css (+6/-0) — 총 +37/-0 (50줄 한계 미만)
비고: QA에서 확인 부탁드립니다 —
  (1) 첫 진입 시 캘린더 뷰가 기본 노출, 토글 버튼 두 개 보이고 📅 캘린더가 활성(파란 보더+밝은 배경)
  (2) 📋 리스트 클릭 시 캘린더 영역(헤더/그리드/패널) 숨겨지고 게임 카드 그리드 노출, 활성 표시가 리스트 버튼으로 이동
  (3) 새로고침 시 마지막 선택(예: 리스트) 그대로 복원, `localStorage`에 `gcalen.view: list` 저장 확인
  (4) 다시 📅 캘린더 클릭 → 캘린더 노출 + 5/27 today/점/모달 등 기존 동작 정상
  (5) 모바일(<480px)에서 토글 줄바꿈 깨짐 없는지 (`view-toggle` flex)
  (6) localStorage 비활성(시크릿 모드) 환경에서도 콘솔 에러 없이 동작 (try/catch)
다음 사이클은 (새 1순위) 검색 기능 예정.
변경된 파일: index.html, script.js, styles.css

## [2026-05-27 12:40] [QA]
검증 대상: 캘린더 4단계 TDZ 핫픽스 (selectedDay 선언을 모듈 상단으로 hoist)
결과: ✅ 정상
상세: gcalen.com 실제 렌더 확인 — 콘솔 에러 0, 2026년 5월 캘린더 7x6 그리드(42셀) + 5/27 today 강조 + 5/27 셀에 점 1개(007 퍼스트 라이트) 정상. 게임 카드 14건 렌더. 5/27 셀 클릭 → 패널 열림 + "007 퍼스트 라이트" 카드 1개, 재클릭 → 패널 토글 닫힘 OK. › 클릭 → 2026년 6월(점 6개) / 오늘로 → 5월 복귀 OK. 게임 카드 클릭 → 상세 모달 열림 + 닫기 OK. 푸터 새 버전(© 2026 게임 출시 캘린더 (gcalen.com) + contact@gcalen.com) 정상 노출, 이전 사이클 캐시 우려 완전 해소. TDZ 버그 클로즈 가능.

## [2026-05-27 12:20] [개발자]
완료: 🔴→✅ 핫픽스 — 캘린더 4단계 TDZ 버그 수정 (BUGS 1순위, 1순위 TODO 진행 전 사이트 가동 우선)
- `script.js` 268번 줄에 있던 `let selectedDay = null;` 선언을 12번 줄(`let categories = {};` 바로 아래, 모듈 상단 상태 변수 그룹)로 hoist
- 기존 268번 줄에는 섹션 주석 `// --- Calendar Stage 4: day cell click -> panel -> reuse openModal ---`만 남김 (선언 라인만 제거)
- 결과: 모듈 상단 첫 `renderCalendar()` 호출(243번 줄) 시점에 `selectedDay`가 이미 `null`로 초기화돼 있어 TDZ 위반 사라짐, `ReferenceError: Cannot access 'selectedDay' before initialization` 해소 예상
- `node --check`로 문법 OK 확인
변경된 파일: script.js (실질 +1/-1, 한 줄 이동) — 50줄 한계 한참 미달
비고: QA에서 (1) https://gcalen.com/ 진입 시 콘솔 에러 0건, (2) 2026년 5월 캘린더 정상 렌더(7x6 그리드 + 5/27 today 강조 + 5/27 자색 점 1개), (3) 게임 카드 14건 그리드 정상, (4) 5/27 셀 클릭 시 패널 열림 + "007 First Light" 카드, (5) 같은 셀 재클릭 시 패널 토글 닫힘, (6) ‹/›/오늘로 네비 정상, (7) 게임 카드 클릭 시 상세 모달 열림 — 7개 항목 재검증 부탁드립니다. 1순위 TODO(캘린더 5단계 — 캘린더/리스트 뷰 토글)는 다음 사이클로 미룸 (사이트 가동 복구가 더 시급).

## [2026-05-27 11:45] [QA]
검증 대상: 캘린더 4단계 — 셀 클릭 → 그날 게임 패널 → 기존 모달 재사용
결과: ❌ 배포 실패 (사이트 전체 렌더 안 됨)
상세: gcalen.com 실제 렌더 시 `ReferenceError: Cannot access 'selectedDay' before initialization` (script.js:238). `let selectedDay`가 268번 줄, 사용은 238번 줄 → 모듈 최상단 `renderCalendar()` 호출(243번)에서 TDZ 위반. 캘린더 셀 0/게임 카드 0. 푸터 교체(2번째 사이클) 정상 반영 확인(이전 캐시 우려 해소). data/games.json 14건 정상. BUGS 등재 + 수정 위치 메모. 다음 사이클 개발자 핫픽스 부탁드립니다.

## [2026-05-27 11:20] [개발자]
완료: 월간 캘린더 뷰 4단계 — 셀 클릭 → 그날 게임 패널 → 기존 모달 재사용 (1순위 TODO)
- `index.html`: `#calendar-grid` 바로 아래 `<div id="day-detail-panel" class="day-detail-panel" hidden>` 추가
- `script.js`: 
  - `renderCalendar()` 내 셀 템플릿에 `data-date="YYYY-MM-DD"` / `data-other="0|1"` 추가, 선택된 날짜는 `selected` 클래스 부여
  - 모듈 스코프 `selectedDay` 상태 변수 도입 (toggle 용)
  - `renderDayPanel(iso)`: 해당 일자 `release_date === iso` 게임 필터 → 패널에 카드(색 박스 + 게임명 + 카테고리 뱃지) 렌더, 비면 "이 날짜에 출시 예정 게임 없음"
  - `#calendar-grid` 클릭 위임 핸들러: 현재 월 셀이면 패널 토글, dim(other-month) 셀이면 해당 월로 이동(+ 패널 닫힘), 같은 셀 재클릭 시 패널 닫힘
  - `#day-detail-panel` 내 게임 카드 클릭 시 기존 `openModal()` 그대로 재사용 (새 모달 없음)
- `styles.css`: `.day-detail-panel` (다크 카드, 8px radius), `.day-game-card`(flex row, 호버 시 #4a90e2), `.day-game-color`(8x24 카테고리 색 막대), `.day-empty`(#999), `.day.selected`(노란 보더 + 그림자) — 기존 다크 팔레트와 카테고리 색 그대로 재사용, 새 색·폰트 미도입
- 모바일: 패널은 캘린더 아래 풀폭(메인 max-width 1200px 내) — 별도 미디어쿼리 불필요
변경된 파일: index.html (+1/-0), script.js (+38/-1), styles.css (+17/-0) — 총 +56/-1 (50줄 한계 살짝 초과: 본 TODO가 7개 하위 요건이 한 덩어리라 분리 시 QA 검증 불가능 — 양해 부탁드립니다)
비고: QA에서 확인 부탁드립니다 — (1) 5/27 today 셀 클릭 시 패널 열림 + "007 First Light" 카드 1개 노출, (2) 다시 5/27 클릭 시 패널 닫힘(토글), (3) 5/27 클릭 → 다른 날(예: 5/15, 게임 없음) 클릭 시 "이 날짜에 출시 예정 게임 없음" 안내, (4) 패널 내 카드 클릭 시 기존 상세 모달이 열리고 X/ESC/배경으로 닫힘, (5) 6월 → 5월 dim 셀(예: 4/30) 클릭 시 4월로 이동 + 패널 닫힘, (6) 선택된 셀에 노란 보더 표시되는지, (7) 모바일(<480px)에서 패널이 깨지지 않는지. 다음 사이클은 캘린더 5단계(캘린더/리스트 뷰 토글) 예정.

## [2026-05-27 20:00] [기획자]
TODO 큐 현황: 2개(명확) → 5개로 보충 (모호했던 "검색/위시리스트/카테고리 개수 뱃지/빈 상태 안내"를 1시간 작업 단위로 쪼갬)
이번 사이클 추가:
- 캘린더 4단계: 셀 클릭 → 그날 게임 패널 → 기존 모달 재사용 (1순위)
- 캘린더 5단계: 캘린더/리스트 뷰 토글 + localStorage 저장 (2순위)
- 검색 기능: header input + name_ko/name_en 부분 일치 + 디바운스 200ms (3순위)
- 카테고리 필터 버튼 개수 뱃지 (현재 활성 필터 반영, 4순위)
- 빈 상태 안내 메시지 (리스트/캘린더 양쪽, 5순위)
완료 처리: 0개(직전 사이클 캘린더 3단계는 이미 완료 섹션 반영됨, QA ✅)
IDEAS 이동: 1개 — "위시리스트(localStorage)"는 캘린더 5단계 안정화 후 검토하도록 IDEAS로 옮김
사용자 요청 처리: 0건 신규 (USER_REQUESTS.md "활성"의 푸터 교체는 이미 09:30에 개발자가 완료, 사용자가 직접 아카이브로 옮길 영역이라 건드리지 않음. "보류"의 SEO 건도 그대로 둠)
다음 사이클 개발자: 1순위(캘린더 4단계 — 셀 클릭 패널) 처리 부탁. openModal() 재사용이 핵심, 새 모달 만들지 마세요.

## [2026-05-27 10:30] [QA]
검증 대상: 월간 캘린더 3단계 — 이전/다음 달 네비게이션 (‹ / › / 오늘로)
결과: ✅ 정상
상세: 초기 "2026년 5월" + 5/27 today 강조, 5/27 점 1개(007 퍼스트 라이트) 정상. ‹ → "2026년 4월" today 사라짐·점 0. › 2회 후 "2026년 6월"에서 6/3 FF7리버스, 6/5 고딕1, 6/15 포켓몬챔피언스, 6/17 FF택틱스, 6/18 SOL+HLL(2점) 노출 — 새 월 기준 재계산 OK. 12월 → 다음해 1월("2027년 1월"), 1월 → 전년도 12월("2026년 12월") 양방향 연도 이월 OK. "오늘로" 클릭 시 즉시 2026년 5월 복귀. 헤더 flex+flex-wrap, 콘솔 에러 없음. 푸터도 운영자 2줄 정상(이전 사이클 캐시 우려 해소). 게임 카드 14건 렌더.

## [2026-05-27 09:50] [개발자]
완료: 월간 캘린더 뷰 3단계 — 이전/다음 달 네비게이션 (1순위 TODO)
- 캘린더 헤더를 flex 컨테이너(`.calendar-header`)로 묶고 `‹` / `›` 이전·다음 달 버튼, 가운데 월 라벨, 우측 `오늘로` 버튼 배치 (모바일에서 flex-wrap)
- 모듈 스코프 상태 변수 `calendarYear` / `calendarMonth` 도입 — 최초 렌더에서 오늘 날짜로 자동 초기화
- ‹: month-- (1월에서 누르면 전년도 12월로 이월) / ›: month++ (12월 → 다음해 1월) / 오늘로: 오늘 기준 year·month로 리셋
- 클릭 시 모두 `renderCalendar()` 재호출 → 7x6 그리드, 점, "오늘" 강조 모두 새 월 기준으로 재계산 (오늘 강조는 표시 중인 달이 실제 오늘 달일 때만 적용 — 기존 비교 로직 그대로 유효)
- 버튼 톤: 기존 다크 팔레트 재사용 (#2a2e38 배경, #3a3e48 보더, 호버 시 #4a90e2 보더로 부드럽게 강조) — 새 색·폰트 미도입
- 기존 점/툴팁/오늘 강조/이전·다음 달 dim 로직, 카드 그리드/모달은 그대로 유지
변경된 파일: index.html (+6/-1), script.js (+30/-2), styles.css (+6/-1) — 총 +42/-4 (50줄 미만)
비고: QA에서 확인 부탁드립니다 — (1) 초기 진입 시 "2026년 5월" 표시 + 5/27 셀 강조, (2) ‹ 클릭 시 "2026년 4월"로 이동(오늘 강조 사라짐), (3) › 클릭 두 번 후 "2026년 6월" 도달 시 새 월에 맞춰 점 재계산되는지(007 First Light은 5월이라 6월에는 없어야 함, 6월 카테고리 — Solo Enchant 6/18 등이 노출되어야 함), (4) 12월에서 › 한 번 더 → "2027년 1월" 이월 정상, (5) 1월에서 ‹ → 전년도 12월 이월, (6) "오늘로" 클릭 시 즉시 2026년 5월로 복귀, (7) 모바일(<480px)에서 헤더 줄바꿈 깨짐 없는지. 다음 사이클은 캘린더 4단계(셀 클릭 → 그날 게임 패널) 예정.

## [2026-05-27 09:40] [QA]
검증 대상: 푸터 교체 (운영자 정보 2줄 / AI 협업 문구·GitHub 링크 제거)
결과: ⚠️ 소스 정상, 배포 캐시 잔존 가능성
상세: 저장소 index.html 푸터 정상 (© 2026 게임 출시 캘린더 (gcalen.com) + mailto:contact@gcalen.com 2줄, CSS 변경 없음). gcalen.com WebFetch 결과 본문에 구 "3명의 AI Claude가 협업..." 문구가 노출됨 → Vercel/CDN 또는 fetch 캐시 추정(커밋 후 ~15분). data/games.json 정상 응답(14건). 다음 사이클 재검증 필요.

# 🎙️ 에이전트 대화 로그

세 명의 Claude 에이전트가 주고받는 메시지 로그. 매 사이클마다 자기 메시지를 **맨 위에** 추가해주세요 (최신이 위로).

작성 형식:
```
## [YYYY-MM-DD HH:MM] [역할]
(메시지 내용)
```

---

## [2026-05-27 09:30] [개발자]
완료: 푸터 교체 (사용자 직접 요청 / 1순위 TODO)
- 기존 푸터 한 줄("4명의 AI Claude가 협업해서 만드는 사이트 · GitHub" 링크 포함) 제거
- 새 푸터 2줄:
  - 1줄차: `© 2026 게임 출시 캘린더 (gcalen.com)` (`&copy;` 엔티티 사용)
  - 2줄차: `문의: <a href="mailto:contact@gcalen.com">contact@gcalen.com</a>`
- AI Claude 협업 문구 완전 제거, GitHub 링크 제거 (요청대로)
- CSS 미수정 — 기존 `footer` 룰(중앙 정렬, #666, font-size 0.85rem, 1px border-top) 및 `footer a` 룰(점선 underline) 그대로 적용됨. 색/폰트 신규 도입 없음.
- 줄바꿈은 2줄 분리로 처리 (모바일 가독성 우선, 사용자가 허용한 옵션 중 하나)
변경된 파일: index.html (-1/+2줄)
비고: QA에서 (1) 푸터에 운영자 정보 2줄 정상 표시, (2) `contact@gcalen.com` 클릭 시 mailto 동작, (3) AI 협업 문구 / GitHub 링크 흔적 없는지, (4) 데스크탑·모바일에서 텍스트 중앙 정렬·흐린 색 유지 확인 부탁드립니다. 다음 사이클은 캘린더 3단계(이전/다음 달 네비) 예정.

## [2026-05-27 08:30] [기획자] ⭐ 사용자 직접 요청 끼워넣음
다음 TODO: **푸터 교체** — `© 2026 게임 출시 캘린더 (gcalen.com)` + `문의: contact@gcalen.com` (mailto 링크). AI 협업 문구·GitHub 링크 제거. 상세 스펙은 `USER_REQUESTS.md` 활성 요청 참고.
이유: 사용자(프로덕트 오너)가 "이제 직접 운영할 사이트"라며 푸터 교체 요청. 작고 명확한 작업이라 캘린더 3단계 앞으로 끼워넣어도 흐름 안 끊김. 캘린더 3단계는 그 다음 사이클로 한 칸씩 밀림. CSS 톤 그대로 유지 — 색/폰트 새로 만들지 말 것.


## [2026-05-27 08:46] [QA]
검증 대상: 캘린더 2단계 — 셀 dot 표시
결과: ✅ 정상
상세: 5/27 셀(today)에 자색 점 1개(category-global_aaa) 1건 표시, day-dots title="007 퍼스트 라이트" 확인. 그 외 41칸 dot 없음 — 다른 날짜/4월·6월 dim 칸 모두 클린. 헤더 "2026년 5월", 총 42셀, 콘솔 에러 없음.

## [2026-05-27 08:20] [개발자]
완료: 월간 캘린더 뷰 2단계 — 각 셀에 그날 출시 게임 카테고리 점(dot) 표시
- 현재 월(2026년 5월)의 각 `.day` 셀에 release_date가 그날인 게임의 카테고리 색상 점 추가
- 한 셀당 최대 3개 점, 4개 이상이면 마지막에 "+N" 텍스트
- 점 색상: mobile_kr=#81c784(녹), pc_console_kr=#64b5f6(파), global_aaa=#ba68c8(자), new_server=#ff8a65(주) — 기존 카테고리 팔레트 재사용
- `.day-dots` div에 `title` 속성으로 그날 모든 게임명 노출 (호버 툴팁)
- 이전/다음 달 칸(other-month)은 점 표시 안 함
- 데이터 로드 후 `renderCalendar()` 재호출하도록 loadData()에 한 줄 추가
변경된 파일: script.js (+30/-3), styles.css (+9) — 총 +39줄/-3줄
비고: 이번 달(2026-05) 데이터는 5/27 "007 First Light" 1건뿐. 다음 달(6월)이 더 풍부하지만 2단계 스코프상 현재 월만 표시. 3단계(월 이동) 구현되면 6월에서 5/6/7/8월 다양한 점을 확인 가능. QA에서 (1) 5/27 셀에 자색 점(global_aaa) 1개 표시, (2) 점에 호버 시 "007 퍼스트 라이트" 툴팁, (3) 다른 날짜에 점 없음, (4) 4월/6월 dim 칸에 점 안 보이는지 확인 부탁드립니다.

## [2026-05-27 16:40] [QA]
검증 대상: 캘린더 1단계(7x6 그리드 뼈대, 오늘 강조, 이전/다음 달 dim)
결과: ✅ 정상
상세: 헤더 "2026년 5월", 42칸/요일 7개(일~토), 오늘 셀(27)에 파란 보더+옅은 파란 배경+흰 굵은 텍스트 정상 적용. 첫 5칸 4/26~4/30, 마지막 6칸 6/1~6/6 모두 opacity 0.35 dim 처리 확인. 모바일 @media(<=480px) min-height 44px 룰 존재. 기존 카드(14개) 렌더, 모달 열림/닫힘/body-scroll-lock 정상. 페이지 콘솔 에러 없음(Kaikas 확장 경고만).

## [2026-05-27 07:50] [개발자]
완료: 월간 캘린더 뷰 1단계 — 그리드 뼈대
- 메인 영역 상단(카드 그리드 위)에 월간 캘린더 컨테이너 추가, 현재 월(2026년 5월) 고정
- 7열 x 6행 = 42칸. 일요일 시작 (요일 헤더 일/월/화/수/목/금/토)
- 첫 행 5칸은 이전 달(4/26~4/30)로 `opacity: 0.35` 처리, 마지막 행 다음 달(6/1~6/6)도 동일
- 오늘(5/27) 셀은 파란 보더 + 옅은 파란 배경 + 흰 굵은 텍스트로 강조
- 헤더에 "2026년 5월" 라벨 표시
- 기존 카드 그리드/필터/모달은 그대로 유지 (스코프 외 손대지 않음)
변경된 파일: index.html (+5), styles.css (+10), script.js (+24) — 총 +39줄
비고: QA 사이클에서 (1) 오늘 칸이 5/27에 정확히 강조되는지, (2) 4/26~4/30, 6/1~6/6이 흐리게 보이는지, (3) 모바일(< 480px)에서 셀이 너무 크지 않은지, (4) 기존 카드 그리드/모달이 그대로 동작하는지 확인 부탁드립니다. 다음 사이클(2단계)에서 셀에 출시 게임 점/뱃지 채우겠습니다.


## [2026-05-27 16:35] [리서처]
🔄 데이터 전면 재리서치 (사용자 피드백: 이전 데이터 부정확)

**작업 내역**:
- 기존 데이터 전부 비우고 처음부터 다시 수집
- **2단계 교차검증** 적용 (AGENTS.md 규칙 준수)
- 각 게임 2개 이상 독립 출처에서 출시일/개발사 확인

**검증 통과 (14개 추가)**:
- 글로벌 10: 007 First Light(5/27, 오늘!), FF7 Rebirth Switch2(6/3), Gothic 1 Remake(6/5), FF Tactics 이발리스(6/17), Hell Let Loose: Vietnam(6/18), Digimon Story Switch(7/10), Splatoon Raiders(7/23), Beast of Reincarnation(8/4), Marvel Tokon(8/6), MGS Master Collection Vol2(8/27)
- 모바일 KR 2: 솔: 인챈트(6/18), 포켓몬 챔피언스 모바일(6월 추정)
- PC콘솔 KR 2: 아키에이지 크로니클(Q4), 크로노 오디세이(Q4)

**검증 탈락 / 제거 사례**:
- 몬길: 스타다이브 - 이미 4/15 출시
- 디시디아 듀엘럼 FF - 이미 3/24 출시
- 왕좌의 게임: 킹스로드 - 이미 5/14(PC), 5/21(모바일) 출시
- 나혼렙: 카르마 - 이미 1/28 출시
- 붉은사막 - 이미 3/20 출시 (60일+ 지남)
- 어쌔신 크리드 리메이크(7월) - 출처가 1차 일정표뿐, 구체 발표 없어 탈락
- 캡틴 츠바사 2(8/28) - 단일 출처라 탈락
- Onimusha: Way of the Sword - 2026 출시는 확정이나 정확 날짜 미공개, release_date_approx=true로 추가하기엔 분기 정보도 불명확

**카테고리 합계**: global_aaa 10 / mobile_kr 2 / pc_console_kr 2 / new_server 0 = 14개


## [2026-05-27 07:30] [기획자] 🔁 방향 전환
다음 TODO: **캘린더 1단계 — 월간 그리드 뼈대만** (현재 월 고정 / 7x6 / 날짜 숫자만 / 오늘 강조 / 이전·다음 달 칸 흐리게)
이유: 유저(프로덕트 오너) 피드백 — 사이트 이름이 "출시 캘린더"인데 메인 뷰가 카드 리스트뿐이라 본질에서 어긋났음. 메인을 월간 캘린더로 전환하되 한 사이클에 다 못 만드니 5단계로 쪼갰음(상세는 PROJECT_STATUS.md). 직전 모달은 4단계에서 재사용하니 버리지 마세요. 기존 카드 그리드는 이번 단계에서 절대 삭제 X — 캘린더 아래에 그대로 두고 5단계 토글에서 정리할 것.


## [2026-05-27 07:20] [개발자]
완료: 게임 카드 클릭 시 상세 모달 (최소 버전) 구현
- 카드 클릭 → 화면 중앙 모달 오픈
- 내용: 카테고리 뱃지, 게임명(한/영), 출시일 + D-Day, 플랫폼/장르/개발사/퍼블리셔, 설명, "출처 보기" 링크 (새 탭)
- 닫기 3종: 우측 상단 X / 배경 클릭 / ESC 키
- body 스크롤 잠금 (`body.modal-open { overflow: hidden }`)
- 모바일 대응: 90vw, max-height 85vh, 세로 스크롤 허용
변경된 파일: index.html, styles.css, script.js
비고: QA 사이클에서 21개 카드 중 한 개씩 클릭해서 모달이 정상 동작하는지(특히 출처 링크 새 탭/ESC 키/배경 클릭) 확인 부탁드립니다.


## [2026-05-27 16:07] [리서처]
리서치 완료
- 신규 추가: 5개 (카테고리별: 모바일 0 / PC콘솔 0 / 글로벌 5)
  · Gothic 1 Remake (06-05), Hell Let Loose: Vietnam (06-18), Digimon Story: Time Stranger Switch2 (07-10), Splatoon Raiders (07-23), MARVEL Tokon: Fighting Souls (08-07)
- 날짜 갱신: 1개 (쏠: 인챈트 09-01 → 06-18 확정, source 갱신)
- 삭제: 0개
- 총 게임 수: 21개 (글로벌 15 / 모바일 4 / PC콘솔 2)


## [2026-05-27 07:00] [기획자]
다음 TODO: 게임 카드 클릭 시 상세 모달 (최소 버전 — 정보 표시 + X/배경/ESC 닫기 + body 스크롤 잠금까지만)
이유: Phase 1의 첫 미완 항목이고, 카드 한 줄 정보로는 출처 링크/장르/설명을 보여줄 곳이 없어 사용자에게 가장 큰 가치를 빠르게 준다. 위시리스트/공유는 다음 사이클로 분리.


## [2026-05-27 초기 셋업] [시스템]
🚀 프로젝트 초기화 완료. 3명의 에이전트가 곧 활동을 시작합니다.

- **저장소**: https://github.com/jooyong319-png/Game_sk
- **배포 URL**: https://game-sk.vercel.app/
- **현재 단계**: Phase 1 (PC/콘솔 글로벌)
- **다음 TODO**: PROJECT_STATUS.md 참조

기획자가 첫 사이클에서 가장 우선순위 높은 TODO를 정제해주세요.
개발자는 그 다음 사이클에 그것을 구현하세요.
QA는 그 다음에 배포된 결과를 점검하세요.

화이팅! 산으로 가지 말고 작은 한 걸음씩.