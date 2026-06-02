# 프로젝트 현재 상태

마지막 갱신: 2026-05-31 10:11 KST (기획자 사이클 — aria-modal 완료 종결·큐 4→5 재구성)

## 현재 단계
Phase 1 — 정적 JSON 기반 게임 출시 캘린더 (3개 카테고리)

## 🔁 방향 (2026-05-27 유지)
메인 뷰를 월간 캘린더로 전환 중. 카드 그리드는 "리스트 뷰"로 보존 → 5단계 토글에서 정리.
캘린더 1·2단계 완료. 남은 3·4·5단계를 한 사이클당 1개씩 진행.

## 아키텍처
- **프론트** → `/data/games.json` (리서처 Claude가 매일 9시 갱신)
- RAWG API 의존성 없음. 모든 데이터는 리서처 Claude가 WebSearch로 큐레이션.

## 완료한 기능
- [x] **[a11y·모달] 열린 상세 모달 다이얼로그 접근명(aria-modal="true" + aria-labelledby=제목 id)** — `.modal`에 `role="dialog" aria-modal="true" aria-labelledby="modal-title"`(index.html L142), 모달 제목 `<h2 id="modal-title">`(script.js L433) 연결로 스크린리더가 모달을 게임 제목으로 안내. 디자이너 10:03 라이브·repo 교차검증으로 이미 충족 확인 → 기획자 완료 종결(중복 개발 방지). 잔존 '열림 포커스 이동/닫힘 트리거 복귀'는 별도 TODO로 승격. — 검증 종결 2026-05-31 10:11
- [x] **[정보중복] 개발사==퍼블리셔 동일 시 '개발·퍼블리셔 X' 한 줄 병합** — developer와 publisher 값이 trim 후 동일한 게임에서 두 줄 중복 노출을 해소. 상세 모달은 '개발'/'퍼블리셔' 2행→'개발·퍼블리셔 X' 1행 병합, 리스트 카드 메타는 동일 값 2개 행(🛠️/🏢)→🏢 1행으로 dedup. 값이 다르면 기존 2행 유지, 한쪽만 있으면 그 행만 노출. renderCard 메타·모달 템플릿에 trim 동일성 분기(IIFE) 추가. 검증: 동일(공백포함)→1행, 상이→2행, dev-only/pub-only→해당 1행 런타임 테스트 통과, node --check ✓. script.js만 수정, 신규 색/CSS 없음 — 개발자 완료 2026-05-31 09:28
- [x] **[a11y·구조] 리스트 뷰 게임 카드 제목 헤딩 레벨 h3→h4** — renderCard 게임명을 `<h3>`→`<h4>`로 내려 날짜 그룹헤더(h3) 하위 위계로(WCAG 1.3.1), CSS `.info h3`→`.info h4` 셀렉터 치환으로 외형 무변경. CSS-only 외형, 신규 색 없음 — 개발자 완료 2026-05-31 08:39
- [x] **[a11y·높음·버그] 닫힌 상세 모달 컨트롤 키보드/AT 포커스 잔존 해소** — 페이드용 `.modal-overlay[hidden]{display:flex!important}`가 `hidden`을 무효화해 닫힌 모달이 computed `display:flex; visibility:visible; opacity:0`로 남아 ×/전체페이지/트레일러/링크복사/위시☆/출처보기 버튼이 Tab 포커스를 받고(JS `.focus()`=true) 제목 헤딩이 접근성 트리에 누출되던 문제(WCAG 2.4.3/4.1.2) 해소. `.modal-overlay`(열림)에 `visibility:visible`+`transition: opacity 0.18s ease, visibility 0s`, `.modal-overlay[hidden]`에 `visibility:hidden`+`transition: opacity 0.18s ease, visibility 0s linear 0.18s`(페이드아웃 0.18s 동안 보이다 끝나는 순간 가려짐, 열림 시엔 즉시 visible) 부여. `visibility:hidden`은 닫힌 컨트롤을 탭 순서·접근성 트리에서 제거. prefers-reduced-motion에는 `.modal-overlay[hidden]{transition:none}` 추가로 즉시 가림. 스코프 한정—포커스 누출만(role=dialog/aria-modal/포커스 트랩은 IDEAS 후속). CSS-only(styles.css ~4줄), script.js 무변경, 신규 색 없음, node --check ✓, CSS brace 279/279 균형 — 개발자 완료 2026-05-31 07:28
- [x] **[a11y·키보드] 리스트 뷰 게임 카드 키보드 포커스 + Enter/Space 모달 오픈** — `renderCard` article에 `tabindex="0" role="button" aria-label="{게임명} 상세 보기"` 부여 + `gamesList` keydown(Enter/Space, 카드 article 자체 포커스 시 `card===e.target` 가드로 내부 위시버튼 중복 방지 → openModal 재사용) + styles.css `.game-card:focus-visible{outline:2px solid var(--accent);outline-offset:2px}`. 키보드/SR 사용자가 리스트 뷰에서 상세 모달 진입 가능(.day-row 패턴과 표면 일치, WCAG 2.1.1). script.js +8/−1·styles.css 1줄, 신규 색 없음, node --check ✓, CSS brace 278/278 — 개발자 완료 2026-05-31 06:30
- [x] **[모바일·핵심·스캔성] ≤480px 캘린더 셀 게임명 라벨 숨김 + 카테고리 점 확대** — 모바일(≤480px)에서 셀 게임명 `.day-game-label`이 0.62rem 한 줄 말줄임으로 거의 안 보이고 점도 7px로 작아 '날짜별 출시 스캔' 핵심 가치가 약화되던 문제 해소. styles.css `@media(max-width:480px)`에서 `.day-game-label{display:none}`로 라벨 숨기고 `.day-dot` 7px→9px 확대(신규서버 링 점은 border 1.5→2px 보강), 데스크톱 7px·기존 점 모양(원/사각/마름모/링)·하단 정렬 유지. 점만으로 그날 카테고리/건수를 스캔하고 상세는 기존 셀 클릭 패널로 확인. 셀 `aria-label="M월 D일, 출시 N건"`은 이미 renderCalendar(L656)에 구현되어 있어 검증으로 갈음(추가 변경 없음). CSS-only(styles.css 4줄), script.js 무변경, 신규 색 없음, brace 277/277 균형, node --check ✓. — 개발자 완료 2026-05-31 05:28
- [x] **[일관성] 카테고리 라벨 단일 출처화 (드롭다운/통계줄/범례/카드·모달 태그 4표면 통일)** — 표시명이 표면마다 갈리던 문제 해소(특히 `new_server` 3종 분기 `한국 MMO 신규 서버`/`신규서버`/`신규 서버`, `global_aaa` 2종 `글로벌`/`글로벌 대작`). script.js에 단일 출처 맵 `CATEGORY_LABELS`(국내 모바일/국내 PC·콘솔/글로벌 대작/신규 서버) 신설 → loadData에서 `categories=Object.assign({},data.categories,CATEGORY_LABELS)`로 games.json 라벨을 덮어써 카드·모달 태그·툴팁·점이 맵 참조, renderStatsSummary는 `CATEGORY_LABELS[k]` 참조로 통계줄 통일, updateCategoryCounts baseLabel을 `CATEGORY_LABELS[opt.value]`에서 가져와 드롭다운 통일, 신규 `renderLegend()`가 범례 라벨도 맵에서 채움(점 모양 span 보존). index.html 정적 폴백도 캐노니컬로 정렬(드롭다운 2·범례 1). data/games.json 무수정(리서처 영역). 검증: 4표면 라벨 통일 런타임 테스트 통과, node --check 통과, CSS brace 275/275 무변경. — 개발자 완료 2026-05-31 04:30
- [x] **[a11y·폼] 게임명 검색 입력(#search-input) 접근형 이름(aria-label) 부여** — 헤더 검색 input(`#search-input`)에 placeholder만 있고 label·aria-label이 없어 스크린리더가 용도를 안내 못하던 문제(WCAG 4.1.2/3.3.2) 해소. `aria-label="게임명 검색"` 1속성 추가, placeholder는 보조로 유지. select 3종은 이미 label 래핑으로 이름 보유 → 검색만 누락분 보완. 정적 마크업이라 index.html 1줄, script.js·CSS 무변경, 외형/신규 색 없음. — 개발자 완료 2026-05-31 03:28
- [x] **[캘린더·시각위계] '오늘' 셀 other-month 디밍 예외(today 강조 소실 방지)** — 캘린더가 최근접 출시월로 자동 점프하므로 당월 출시 0건이면 '오늘'이 인접월 trailing 셀(`.other-month` opacity 0.35)로 렌더돼 today 파란 보더/tint가 거의 비가시던 문제 해소. styles.css에 `.calendar-grid .day.other-month.today { opacity:1; }` 1규칙 추가(today는 위치 무관 디밍 예외). CSS-only, 신규 색 없음, brace 275/275 균형, JS 무변경 — 개발자 완료 2026-05-31 02:28
- [x] **[캘린더·정보손실] 데스크톱 월간 셀 '같은 날 2건↑' 시 '+N' 배지 추가** — 셀이 대표 1건 게임명+색점만 노출해 둘째 게임 이상(특히 동일 카테고리 동색 점)이 은닉되던 문제 해소. `renderCalendar` 출시일 셀에서 `extra=list.length-1` 계산 → 2건↑ 셀의 day-dots 행 우측 끝에 `.day-more`(`+N`, N=나머지 건수) 배지 노출, 1건 셀은 미표시. `margin-left:auto`로 우측 정렬해 기존 점 overflow(`.day-dot-more`)와 위치 분리. CSS 1규칙(중립톤 #aaa+var(--border), 신규 색 없음), script.js 2줄. 검증: 1건→배지 없음, 2건→'+1', 3건→'+2', 5건→'+4'. node --check 통과, CSS brace 274/274 — 개발자 완료 2026-05-31 01:30
- [x] **[일관성·정확성] approx(예정) 날짜 게임의 리스트/날짜패널 그룹헤더 요일 표기 통일** — `release_date_approx:true`(분기/월 추정→15일) 게임이 리스트/날짜패널 그룹헤더·흡수행에서 확정 요일 `(월)`로 찍혀 모달(요일 생략·`(예정)`)·카드와 표기가 엇갈리고 가짜 확정감을 주던 문제 해소. 헬퍼 `weekdaySuffix(g)` 신설(확정→`(요일)`, approx→요일 생략 후 `(예정)`)로 `renderGroupedList` 헤더·`renderDayRows` 헤더·흡수행 3곳을 모달·카드 규칙과 단일화. 검증: 확정 2026-06-05→`(금)`, approx→`(예정)`. script.js 순증 ~12줄(헬퍼 5 + 참조 3곳 치환·미사용 wdInline 제거), 신규 색/CSS 없음, node --check 통과 — 개발자 완료 2026-05-31
- [x] **[정확성·푸터] '데이터 마지막 갱신' 상대시간 미래(음수 diff) '(방금 전)' 오표기 가드** — `formatRelativeTime`에 `if (diffMin < 0) return '';` 가드 1줄 추가. 타임스탬프가 현재보다 미래면(예: 갱신표기 21:00 vs 현재 18:05) 상대 라벨을 생략 → 푸터 사용처(`rel ? `${absStr} (${rel})` : absStr`)가 절대 시각만 노출. 양수 diff(방금 전/분/시간/일 전) 동작 무변경. 검증: future+3h→''(절대시각만), now→'방금 전', past 5분→'5분 전', 3시간→'3시간 전'. script.js 1줄, 신규 색/CSS 없음, node --check 통과 — 개발자 완료 2026-05-30 23:30
- [x] **[밀도·정보중복·리스트] 리스트 뷰 카드 출시일(.release-date) 중복 표기 제거 (그룹헤더 맥락 한정)** — 리스트 뷰는 날짜 그룹헤더(`2026.05.30 (토)`)가 날짜를 책임지므로 그 아래 각 카드의 `.release-date`(`📅 날짜`) 텍스트를 제거(헤더1+카드N=N+1회 중복 해소). `renderCard(game, single, grouped)`에 grouped 플래그 추가, `renderGroupedList`에서 항상 grouped=true 전달 → 카드 `.release-date` div 미렌더. D-day 배지(card-header 별도)는 유지. 그룹헤더 없는 단독/검색 맥락(grouped 미지정)은 날짜 전체 노출 분기 유지. script.js 3줄, 신규 색/CSS 없음, node --check 통과 — 개발자 완료 2026-05-30 21:29
- [x] **[정렬·패널] 날짜 클릭 패널 '1건 흡수' 행 날짜 고정폭+우측정렬** — `.day-row-date`에 `min-width:6.5em; text-align:right`(+padding-right) 부여로 가변폭이던 흡수행 인라인 날짜를 고정폭 우측정렬 → 뒤따르는 점·게임명 시작 x 통일(그룹헤더 행과의 ~78px 어긋남 축소). CSS-only, 신규 색 없음 — 개발자 완료 2026-05-30 20:20
- [x] **[정렬·패널] 날짜 클릭 패널 행 우측 '플랫폼·D-day' 고정 컬럼 정렬** — `.day-row-plat`에 `min-width:4.5em; text-align:right` 부여로 플랫폼 컬럼을 고정폭+우측정렬 → 뒤따르는 D-day가 행마다 동일한 좌측 x에서 시작(세로 스캔성↑). CSS-only, 신규 색 없음 — 개발자 완료 2026-05-30 15:10
- [x] **[UX·발견성] 활성 필터 '초기화' 컨트롤 추가** (카테고리/플랫폼/기간/검색/주칩/위시 6종 중 비기본값 1개↑ 활성 시에만 `#filter-reset` 버튼 노출(hasActiveFilters→updateFilterReset 토글, renderGames 진입 시 호출). 클릭 시 resetAllFilters로 6종 일괄 기본값 복귀(카테고리·플랫폼='', 기간=365, 검색 input·searchQuery 비움, weekFilter=null, wishlistOnly=false) 후 재렌더 — 0건 빈 상태 탈출구 겸함. const filterReset는 TDZ 회피 위해 상단 element 블록에 선언. CSS는 기존 톤(--text-faint→hover --accent) 재사용, 신규 색 없음) — 개발자 완료 2026-05-30 13:20
- [x] **[정렬·모달] 상세 모달 메타 행 라벨 폭 정렬** — `.modal-row strong`에 `display:inline-block; min-width:5em; vertical-align:top` 부여, 라벨(출시일/플랫폼/장르/개발/퍼블리셔) 폭 통일로 값(value) 시작 컬럼 세로 정렬. CSS-only, 신규 색 없음 — 개발자 완료 2026-05-30 12:28
- [x] 상세 모달 상단 컬러 배너(placeholder)의 중복 카테고리 텍스트 제거 — 카테고리는 본문 pill 1회만 노출(리스트 카드 dedup 패턴과 일관, 컬러만 유지)
- [x] 프로젝트 스켈레톤 (HTML/CSS/JS)
- [x] 정적 JSON 데이터 파일 (`data/games.json`)
- [x] 카테고리 필터 (국내 모바일 / 국내 PC/콘솔 / 글로벌 대작)
- [x] 플랫폼 필터 (PC, PS5, Xbox, Switch, iOS, Android)
- [x] 기간 필터 (30일~1년, 전체)
- [x] D-Day 표시 + 출시 임박 강조 (7일 이내 노란 보더)
- [x] 모바일 반응형
- [x] 다크 테마 디자인
- [x] 카테고리별 색상 구분
- [x] 게임 카드 클릭 시 상세 모달 (X / 배경 / ESC 닫기, body 스크롤 잠금)
- [x] 월간 캘린더 뷰 1단계: 그리드 뼈대 (현재 월, 7x6, 오늘 강조, 이전·다음 달 칸 흐리게)
- [x] 월간 캘린더 뷰 2단계: 셀에 그날 출시 게임 카테고리 점(dot) 표시 (최대 3개 + "+N", title 툴팁)
- [x] [캘린더] 출시 임박(오늘~+7일) 게임 있는 셀 옅은 강조 (.day-soon, 노란 보더+옅은 배경, 리스트 뷰 imminent와 색 일관)
- [x] **푸터 교체 (운영자 정보 2줄, AI 협업 문구·GitHub 링크 제거)** — 개발자 완료(05-27 09:30), QA 소스 검증 통과(05-27 09:40). ※배포 CDN 캐시 반영은 시간 경과로 자연 해소.
- [x] 월간 캘린더 뷰 3단계: 이전/다음 달 네비게이션 (‹ › + 오늘로, calendarYear/calendarMonth 상태, 12월↔1월 연도 처리)
- [x] 월간 캘린더 뷰 4단계: 셀 클릭 → 그날 게임 목록 패널 → openModal 재사용 (× 닫기, 다른 날 클릭 시 교체)
- [x] 월간 캘린더 뷰 5단계: 캘린더/리스트 뷰 토글 (📅/📋, localStorage 'gcalen.view')
- [x] 검색 기능 (게임명 name_ko/name_en 부분일치, 결과 건수 표시, / 단축키)
- [x] 카테고리별 개수 뱃지 (필터 옵션 라벨에 현재 건수 표시)
- [x] 리스트 뷰 출시일별 그룹핑 (같은 release_date 게임을 `YYYY.MM.DD (요일)` 헤더 아래로 묶음, 헤더는 그리드 전체 폭)
- [x] **카테고리 통계 요약 한 줄** (헤더 아래 `#stats-summary`, 현재 데이터 기준 `국내 모바일 N · 국내 PC/콘솔 N · 글로벌 N · 신규서버 N · 총 N`)
- [x] **검색/필터 결과 0건 빈 상태 안내** (리스트 뷰 `.empty-state` — 위시리스트/검색/일반 분기 메시지, 기획자 스펙 문구 '필터를 바꿔보세요.' 정렬)
- [x] **상세 모달 '링크 복사' 버튼** (`🔗 링크 복사` → `현재URL?game={id}` 클립보드 복사, navigator.clipboard + execCommand 폴백, '링크 복사됨' 2초 토스트)

- [x] 공유 링크 진입(?game={id}) 시 해당 게임 상세 모달 자동 오픈 (데이터 로드 후 1회)
- [x] **[캘린더] 날짜 클릭 시 '그날 이후 출시 전체' 목록 패널** (release_date>=클릭일, 날짜별 그룹핑 리스트 재활용, 현재 필터 반영, openModal 재사용, 패널 세로 스크롤) — 개발자 완료 2026-05-29
- [x] **[가독성] 본문/메타 텍스트 대비·크기 상향** (`.desc`#cdd2db `.meta-row`#b3b8c2/0.85rem `.subtitle`#9aa0ac `.name-en`#8b92a0, `.info h3`1.1rem; 카테고리태그/링크 색 미변경) — 개발자 완료 2026-05-29
- [x] **[컨트롤 정리] 검색바 + 필터 한 줄 묶기** (`.controls-row` flex 래퍼, 데스크탑 가로/≤480px 세로, gap 1rem, 검색 input max-width 360px 유지) — 개발자 완료 2026-05-29
- [x] **[캘린더] 셀 키우고 대표 게임명 1건 텍스트 노출** (`.day` min-height 60→84/모바일 44→60, 그날 첫 게임 `name_ko`를 `.day-game-label` 1줄 말줄임으로, 점은 보조 유지) — 개발자 완료 2026-05-29
- [x] **[컨트롤 정리] 퀵칩을 필터 행 끝으로 이동 + 모바일 가로 스크롤** (`.quick-chips`를 `.controls-row` 안 필터 우측 끝으로 이동, 데스크탑 `margin-left:auto`, ≤480px `flex-wrap:nowrap;overflow-x:auto`·chip `flex:0 0 auto`) — 개발자 완료 2026-05-29

- [x] **[정리] 핵심 색 :root CSS 변수 1차 토큰화** (`:root`에 --bg/--surface/--border/--text/--text-dim/--text-faint/--accent 정의, 최다 사용 5색 #0f1115/#1a1d24/#2a2e38/#e6e6e6/#4a90e2 → var() 치환, 외형 무변화 리팩터) — 개발자 완료 2026-05-29
- [x] **[모달] 유튜브 트레일러 검색 링크** (상세 모달 modal-actions에 `▶ 트레일러 검색` 새 탭 링크, `youtube.com/results?search_query={name_ko} 트레일러`, 임베드 아님) — 개발자 완료 2026-05-29
- [x] **[리스트뷰] 단일 게임 날짜그룹 행 전체 폭** (그날 출시 1건인 날짜의 카드에 `.single-game` 부여 → `.games-grid .game-card.single-game{grid-column:1/-1}`로 행 전체 폭, 2건↑ 날짜는 기존 그리드 유지) — 개발자 완료 2026-05-29
- [x] **[리스트뷰] 카드 상단 배너 카테고리 라벨 중복 제거** (이미지 없는 카드의 컬러 배너+카테고리명 텍스트 → 카테고리 컬러 4px `.card-banner`로 콤팩트화, 본문 category-tag 유지, 신규 색 X) — 개발자 완료 2026-05-29 16:17
- [x] **[모달] 열림/닫힘 페이드 트랜지션 (CSS-only)** (`.modal` 박스 opacity+scale(0.97→1) 0.18s, 오버레이 opacity는 기존 구현 활용, `prefers-reduced-motion` 분기 포함) — 개발자 완료 2026-05-29
- [x] **[푸터] mailto 링크 hover/focus 색상 강조** (footer a:hover/:focus → --accent + 밑줄, 평상시 흐린 톤 #aaa 유지, CSS-only) — 개발자 완료 2026-05-29

- [x] **[캘린더] 진입 시 '오늘 이후 가장 가까운 출시 달'로 자동 초기화** (loadData 최초 1회 calendarMonthInitialized 가드, allGames 중 release_date>=오늘 가장 이른 게임의 연/월로 calendarYear/Month 설정 후 renderCalendar, 미래 게임 없으면 현재 달 유지, 사용자 네비 후 재초기화 안 함) — 개발자 완료 2026-05-29
- [x] **[캘린더] 출시 0건인 달 빈 상태 안내** (현재 보는 달 출시 0건 시 `#calendar-empty`에 '이 달 출시 일정이 없어요. ‹ ›로 다른 달을 살펴보세요.' 노출, dayMap 카운트로 토글 — 인프라는 기존, 기획자 스펙 문구·네비 힌트로 정렬) — 개발자 완료 2026-05-29

- [x] **[버그수정] 통계줄 '총 N' vs 카테고리 드롭다운 '전체 (N)' 숫자 불일치 해소** (updateCategoryCounts 카운트 base에서 기간(period) 날짜창 제외 → 통계 요약과 동일 모집단 allGames 사용. 기본 상태 29=29 일치. 플랫폼/검색/주/위시 필터는 카운트에 계속 반영, 기간 필터는 표시 목록 renderGames에만 적용. JS 소규모, 외형/문구 무변경) — 개발자 완료 2026-05-29 21:20

- [x] **[캘린더] 날짜 클릭 패널 한 줄 컴팩트 행 전환** (패널 전용 renderDayRows: `색점·게임명·플랫폼·D-day·☆`, min-height 44px, 날짜그룹 헤더 유지, 클릭/Enter·Space=openModal·☆=위시 토글 재사용, 표시범위 '그날 이후 전체' 유지, 내부 스크롤 제거→인라인 확장) — 개발자 완료 2026-05-29 21:40
- [x] **[긴급·버그] 라이브 전체 다운(script.js TDZ dayPanel ReferenceError) 복구** (`const dayPanel` 선언을 첫 사용 L477 위(모달 핸들부 L379)로 hoist, Stage4 중복 선언 제거. runtime DOM 스텁 로드로 top-level ReferenceError 0건 확인) — 개발자 완료 2026-05-29 22:20
- [x] **[안정성] 로딩/크래시 에러 상태 fallback** (index.html에 script.js와 독립된 inline `<script>` 가드: 9초 내 캘린더 grid·게임 리스트 미렌더 시 `.load-fallback`로 '데이터를 불러오지 못했어요' + 새로고침 버튼 노출. 500ms 폴링으로 정상 렌더 감지 시 타이머 자기-해제. 메인 스크립트가 죽어도 동작) — 개발자 완료 2026-05-29
- [x] **[헤더] 좌측정렬 + 컴팩트화로 캘린더를 첫 화면 위로** (운영자 요청; CSS-only: `header` 패딩 2.5/1.5rem→1.25/1rem·`text-align` center→left, h1 2rem→1.7rem·margin-bottom 0.25rem 축소, 헤더 자식 max-width:1200px+1rem gutter로 `<main>`과 좌측 정렬(gradient bg는 full-bleed 유지), stats-summary text-align left 정렬. 상단 높이 절감→첫 화면에 캘린더 상향. 모바일 ≤480px 정렬 유지) — 개발자 완료 2026-05-29 12:30
- [x] **[뷰] 진입 시 기본 뷰 캘린더 고정** (최초 방문 시 localStorage 'gcalen.view' 비어있으면 기본값 calendar. 코드상 `getItem(VIEW_KEY) || 'calendar'` + `let savedView='calendar'`로 이미 충족되어 있어 검증 후 의도 고정용 주석 2줄 추가. 사용자 토글 선택은 계속 기억) — 개발자 완료 2026-05-29 13:20

- [x] **[캘린더] 날짜 셀 클릭 시 결과 패널 auto-scroll + 헤더 강조 플래시** (renderDayPanel 렌더 직후 `dayPanel.scrollIntoView({behavior:'smooth',block:'start'})` 1회 + `.day-panel-header.flash` 0.7s 배경 페이드 강조, `prefers-reduced-motion` 시 즉시 이동·플래시 생략. 신규 색 없이 --accent 재사용) — 개발자 완료 2026-05-29 23:29
- [x] **[캘린더] 선택 셀 위계 분리 (보더→배경 채움+inset 링)** (`.day.selected` 보더 제거→`background:rgba(74,144,226,0.18)` 채움+`box-shadow:inset 0 0 0 2px var(--accent)` 링. 오늘=파랑보더/임박=amber보더 유지로 3상태 위계 분리, amber 보더 색충돌 해소. CSS-only 1줄, 신규 색 없음) — 개발자 완료 2026-05-30 00:20
- [x] **[리스트/패널] 날짜 그룹 헤더 sticky 고정** (`.date-group-header`에 `position:sticky;top:0;z-index:2;background:var(--bg)` + padding-top 0.4rem. 리스트 뷰·날짜 패널 공통, 스크롤 중 날짜 맥락 유지, --bg 불투명 배경으로 뒤 카드 비침 방지) — 개발자 완료 2026-05-30 00:30
- [x] **[버그수정] 지난 날짜 셀 클릭 시 패널 헤더↔목록 불일치+당일 게임 누락 해소** (원인: getActiveFilteredGames 기간필터 하한이 today라 rel<today 과거 게임 제외 → 지난 날짜 클릭해도 그날 게임 빠짐, renderDayPanel은 >=iso로 필터하나 이미 제외된 뒤. 수정: getActiveFilteredGames(floorIso) 선택 인자 추가, 기간필터 하한을 floor=클릭한 날짜로 사용. renderDayPanel이 getActiveFilteredGames(iso) 호출 → 클릭한 날 게임 포함되어 헤더 'N건 이후'와 목록 일치. 카테고리/플랫폼/기간상한/검색/주/위시 필터 반영 유지) — 개발자 완료 2026-05-30 16:30
- [x] **[접근성] 날짜 셀 클릭 어포던스 + 키보드 접근** (게임 있는 셀만 role="button"·tabindex=0·aria-label '·월 ·일, 출시 N건' 부여, cursor:pointer+호버(보더 accent+옅은 배경)·focus-visible 아웃라인, calGrid keydown(Enter/Space)→cell.click() 기존 핸들러 재사용. 빈 셀은 cursor:default 유지) — 개발자 완료 2026-05-30 21:20
- [x] [버그수정] D-day KST off-by-one 해소 — release_date를 로컬 자정(`parseReleaseDate`=`new Date(str+'T00:00:00')`)으로 통일 파싱, today와 동일 기준. 오늘 출시 게임이 'D-DAY'로 정상 표시(캘린더 '오늘' 셀과 일치).
- [x] **[버그수정] 날짜 패널 게임 행(.day-row) 마우스/터치 클릭 시 상세 모달 미동작 해소** (원인: `.day-row`의 openModal 처리가 `#games-list` 리스너에만 있어 `#day-detail-panel` 소속 .day-row에 미도달; dayPanel click 리스너는 `.game-card`만 매칭. 수정: dayPanel click 핸들러의 `e.target.closest('.game-card')`→`closest('.day-row, .game-card')` 확장. ☆ 위시 토글·× 닫기 분기는 기존 유지. 마우스/터치/키보드 모두 openModal 동작 통일) — 개발자 완료 2026-05-31 08:20

- [x] **[접근성] 카테고리 점 색+모양 이중 인코딩** (캘린더 셀 `.day-dot`·범례 `.legend-dot`를 4색에 더해 모양으로도 구분: 모바일=원/PC·콘솔=사각(border-radius:1px)/글로벌=마름모(rotate45deg)/신규서버=링(border만, 배경 transparent). 색각이상 사용자 구분성↑(WCAG 1.4.1). 셀 dot에 카테고리명 `title`/`aria-label` 부여(스크린리더·호버), 범례는 인접 텍스트 라벨 유지. 기존 4색 그대로, styles.css 8줄+script.js dotEls 속성 부여) — 개발자 완료 2026-05-30 05:29

- [x] **[밀도] 날짜 클릭 패널 1건 날짜 행 흡수** (renderDayRows에서 dateCounts 분기: 1건 날짜는 날짜 헤더 생략하고 `MM.DD (요일)`를 행 첫 칸 `.day-row-date`로 인라인 흡수, 2건↑ 날짜만 `.date-group-header` 유지. 세로 헤더/행 반복 과다 해소, 리스트 single-game 패턴과 일관. styles.css `.day-row-date` 1줄, 신규 색 없음) — 개발자 완료 2026-05-30
- [x] **[스캔성] 출시 있는 셀 옅은 면+좌측 악센트 강조** (출시 1건↑인 `.day`에 `day-has` 클래스 → `background:rgba(74,144,226,0.06)` 옅은 tint + `box-shadow:inset 2px 0 0 var(--accent)` 좌측 2px 악센트로 콘텐츠 있는 셀을 면으로 강조. 점/라벨 보조 유지. `:not(.today):not(.day-soon):not(.selected)`로 오늘·임박·선택 강조와 색 충돌 회피. styles.css 1줄+script.js 1줄, 신규 색 없이 --accent 재사용) — 개발자 완료 2026-05-30
- [x] 캘린더 '오늘' 셀 라벨 색 amber→--accent(파랑) 통일 (today 파란보더와 색 일관, amber는 임박 .day-soon 전용으로 한정)

- [x] 상세 모달 닫기(×) 버튼 가시성: 배너/이미지 색 무관 고정 대비 — 반투명 다크 원형 배경(rgba(0,0,0,0.45)) + 흰 아이콘 + 44×44px 히트영역 (a11y, WCAG 2.5.5)

- [x] **[a11y] 날짜 클릭 패널 게임 행 카테고리 점(.day-row-dot) 색+모양 이중 인코딩** — `.day-row-dot`에 셀/범례와 동일 per-category 모양 부여(모바일=원/PC·콘솔=사각 border-radius:1px/글로벌=마름모 rotate45deg/신규서버=링 transparent+border:1.5px), 패널 게임 행 점에 카테고리명 `title`/`aria-label` 노출(색각이상 카테고리 구분 단서 복원, WCAG 1.4.1). styles.css 4줄·script.js 1줄, 신규 색 없음 — 개발자 완료 2026-05-30 16:28
- [x] **[a11y·대비] 월간 캘린더 요일 헤더 평일(월~금) 색 대비 상향** — `.calendar-grid .weekday` 기본 색 `#888`→`var(--text-dim)`(#aaa)로 상향해 평일 요일 헤더 다크 배경 대비 WCAG AA 충족. 일요일(nth-child(1) #e57373)·토요일(nth-child(7) #64b5f6) 강조색은 오버라이드로 그대로 유지. CSS-only 1줄, 신규 색 토큰 없음, brace 273/273 균형 — 개발자 완료 2026-05-30 06:30

- [x] **[일관성·어포던스] 리스트 카드 비인터랙티브 메타칩(장르) 중립톤 통일** — `.genre-tag` 배경/글자색을 accent블루(`rgba(74,144,226,0.1)`/`#6ab0e8`)에서 플랫폼칩과 동일한 중립 회색(`background:var(--border); color:#bbb`)으로 통일. 클릭 불가한 장르태그가 링크블루로 보이던 어포던스 오인 해소 — accent블루는 실제 인터랙티브 요소(링크/날짜/필터)에만 한정. 카테고리 솔리드 컬러칩은 그대로 유지. CSS-only 1규칙, 신규 색 없음, brace 273/273 — 개발자 완료 2026-05-30 08:20

- [x] **[밀도·정렬·패널] 날짜 클릭 패널 '1건 흡수' 행 날짜 풀year→'MM.DD (요일)' 단축** — renderDayRows 흡수행(`.day-row-date`) 날짜 포맷을 `formatDate().slice(5)`로 연도 생략한 `MM.DD (요일)`로 단축(패널 헤더가 이미 연도 명시→`2026.` 프리픽스 잉여 제거). 풀year 폭이 흡수행 게임명을 그룹헤더 행 대비 ~91px 우측으로 밀던 좌측 시작점 어긋남 해소. 그룹헤더(2건↑) 포맷은 풀year 유지. script.js 2줄, 신규 색/CSS 없음, node --check 통과 — 개발자 완료 2026-05-30 18:20

- [x] **[시인성·일관성·D-day] D-day 배지 근접도 단계 보강 + 표면 간 색 통일** — D-day 배지를 카드/리스트(`.dday`)·날짜패널(`.day-row-dday`) 두 표면 공통 규칙으로 통일하고 근접도 4단계화. 신규 헬퍼 `ddayStageClass(diff)`가 diff에 따라 단일 클래스 부여: D-DAY/≤7일=`soon/today`(amber #f5a623+굵게, today만 pulse), 8~30일=`mid`(중립 `var(--text)`), >30일=`far`(흐린 `var(--text-faint)`), 출시됨=`past`. 표면 불일치 해소 — D-DAY 색 리스트=빨강(#e74c3c)→amber 통일, 먼미래 회색 리스트 #888/패널 #aaa→`--text-faint` 통일. styles.css 중복 패널 규칙 2줄 제거하고 `.dday.*`/`.day-row-dday.*` 공유 블록으로 정리, script.js renderCard/renderDayRows 분기를 헬퍼 호출로 단순화. 신규 색 없음(기존 amber·--text·--text-faint 재사용), node --check 통과, CSS brace 273/273 균형 — 개발자 완료 2026-05-30 22:31

## 다음 TODO (우선순위 순)

> 갱신 2026-05-31 10:11 KST (기획자): 큐 4→5 재구성. **종결 처리: '[a11y·모달] 모달 aria-modal+접근명'은 디자이너 10:03 라이브·repo(index.html L142 / script.js L433 #modal-title) 교차검증으로 이미 충족 확인 → 완료한 기능으로 이동(큐 4→3).** 디자이너 10:03 신규 IDEAS 2건을 끌어옴 — (a)모달 열림 포커스 이동+닫힘 트리거 복귀('높음', aria-modal 완료의 자연스러운 후속)를 1순위 승격, (b)위시 ☆ 비활성 색 대비('보통')를 4순위. 활성 사용자 요청 0(SEO 보류 유지), 미해결 코드 버그 0, 정체 TODO 0.



1. **[a11y·모달·높음] 상세 모달 열림 시 포커스 다이얼로그로 이동 + 닫힘 시 트리거로 복귀** (디자이너 2026-05-31 10:03 발견 '높음', aria-modal 완료 후속)
   - aria-modal/접근명은 충족됐으나 openModal 직후에도 포커스가 트리거(.game-card/.day-row)에 잔존하고, 닫을 때 포커스가 어디로 갈지 미정의 → 키보드/SR 사용자가 모달 본문에 진입 못 하고 닫은 뒤 컨텍스트를 잃음(WCAG 2.4.3). 실측 openModal 직후 activeElement=트리거 카드.
   - openModal에서 열기 직전 `document.activeElement`를 변수(예: `lastFocusedTrigger`)에 저장 → 렌더 후 다이얼로그(`.modal` 또는 `#modal-title`/닫기 ×버튼)에 `tabindex="-1"` 부여하고 `.focus()`로 포커스 이동. closeModal(× / 배경 / ESC 공통 경로)에서 저장한 트리거가 아직 document에 있으면 `.focus()`로 복귀, 없으면 무시. **스코프 한정** — 포커스 트랩(Tab 순환 가둠)은 별도 후속 IDEAS 유지.
   - script.js openModal/closeModal 소규모(~12줄), 신규 색/CSS 없음, node --check 통과·CSS brace 균형 확인. QA: (1)카드/패널행 클릭·Enter로 열면 포커스가 모달로 이동, (2)×/배경/ESC로 닫으면 직전 트리거로 복귀 실측.

2. **[심미·밀도·모달] 상세 모달 상단 컬러 배너 이미지 없을 때 축소 (160px→6~8px 컬러 바)** (디자이너 2026-05-31 04:04 발견 '보통')
   - 상세 모달 상단 `.modal-image` 160px 컬러 배너가 이미지 없는 게임(현재 전부)에서 정보 0의 빈 그라데이션 블록으로 자리만 차지 → 제목·출시일·D-day가 그만큼 아래로 밀리고, 배너의 유일 신호(카테고리 색)는 바로 아래 카테고리 pill과 중복. 리스트 카드는 이미 빈 배너를 4px 악센트로 콤팩트화했는데 모달만 160px라 표면 불일치.
   - image 없을 때 `.modal-image`에 `.no-image` 분기로 높이 160px→6~8px 컬러 바(또는 48~64px)로 축소, image 있으면 160px 유지. 축소 시 닫기(×) 버튼 우상단 위치 재확인. styles.css 1규칙(+선택 JS 1줄), 신규 색 없음, node --check 통과·CSS brace 균형 확인.

3. **[a11y·시맨틱] 캘린더 '오늘' 셀 aria-current="date" + 모든 셀 aria-label에 요일·'오늘' 토큰 보강** (디자이너 2026-05-31 09:03 발견 '보통')
   - 캘린더가 최근접 출시월로 자동 점프하는 구조라 '오늘'이 인접월 trailing 셀로 자주 렌더되는데, today 셀에 `aria-current`가 없고 출시 0건 셀은 aria-label 자체가 없어 '오늘'이 SR/시각 양쪽에 파란 보더로만 전달됨(WCAG 4.1.2). 출시 1건↑ 셀 aria-label('M월 D일, 출시 N건')은 이미 있음.
   - renderCalendar에서 today 셀에 `aria-current="date"` 부여 + 모든 셀(출시 0건 포함)에 aria-label `'M월 D일(요일)[, 출시 N건]'` 부여(today면 앞에 '오늘' 토큰). 외형 무변경, 신규 색/CSS 없음. script.js 소규모(~10줄), node --check 통과·CSS brace 균형 확인.

4. **[a11y·어포던스] 위시 ☆ 비활성(미추가) 색 대비 상향 (#666→토큰)** (디자이너 2026-05-31 10:03 발견 '보통')
   - 위시 별 비활성 색 `#666`(다크 배경 대비 ~2.7:1)이 WCAG 1.4.11(비텍스트 3:1) 미달 + '클릭 가능한 위시 추가 버튼'임을 가려 발견성 저하. 활성 별(#f5b400 노랑)은 충분.
   - `.wishlist-btn`/`.modal-wishlist-btn` 비활성 색 `#666`→`var(--text-dim)`(또는 `#8a8f98` 이상)으로 상향, 활성 노랑은 유지. styles.css 2규칙, 신규 색 토큰 추가 없이 기존 토큰 재사용, node --check(무관)·CSS brace 균형 확인.

5. **[a11y·대비] 헤더 '마지막 업데이트' 타임스탬프 색 대비 상향 (#555→토큰)** (디자이너 02:05 발견 '낮음')
   - 헤더의 '마지막 업데이트' 타임스탬프 색 `#555`(다크 배경 대비 ~2:1, 12.8px)가 페이지 최저 대비인데 데이터 신선도(신뢰) 정보라 가독 필요(WCAG AA 미달).
   - 해당 요소 색을 `#555`→`var(--text-faint)`(또는 `--text-dim`) 이상으로 상향. 신규 색 토큰 추가 없이 기존 토큰 재사용, 외형 위계는 여전히 흐린 보조 톤 유지. styles.css 1규칙 치환. CSS brace 균형·node --check(무관) 확인. 신규 색 없음.

### (큐 소진 후 후보, IDEAS에서)
캘린더 패널 흡수행↔그룹헤더행 게임명 좌측 x 정렬(정체로 IDEAS 보류), 위시 별 색 --wish 토큰 통일+전역 focus-visible(a11y), 캘린더 그리드 ARIA(role=grid/gridcell) — 디자이너 재점검 후 끌어옴.


## 알려진 버그 (BUGS)
- [2026-05-31] ✅ 해소(개발자 fix 2026-05-31 08:20) — 캘린더 날짜 클릭 패널의 게임 행(.day-row) 마우스/터치 클릭 시 상세 모달 미동작. dayPanel click 핸들러의 `e.target.closest('.game-card')`→`closest('.day-row, .game-card')`로 확장해 .day-row도 openModal 도달. ☆ 위시/× 닫기 분기 유지, node --check 통과. QA께 라이브에서 (1)마우스 클릭 (2)터치 (3)키보드 Enter 모두 모달 열림 실측 부탁. [이전 보고] 키보드 Enter는 정상이나 마우스/터치만 무반응이라 '고장' 인식 위험. 원인: .day-row openModal이 #games-list 리스너 소속이라 #day-detail-panel의 .day-row 미도달; dayPanel click 리스너는 .game-card만 처리. 디자이너 04:50 Chrome 실측 발견.
- [2026-05-29] ✅ 해소(QA 22:40 라이브 확인) — 개발자 fix(2026-05-29 22:20): `const dayPanel` 선언을 모달 핸들부(L379, 첫 사용 L478 위)로 hoist + Stage4 중복 선언 제거 → TDZ 제거. QA Chrome 실측: gcalen.com 콘솔 ReferenceError 0건, 콘텐츠 정상 렌더 확인. [이전 보고] (배포 사이트 전체 미동작) script.js TDZ 에러: dayPanel을 L477(keydown 리스너)·L525(ESC)에서 참조하나 `const dayPanel`은 L652에 선언 → 모듈 로드 시 'Cannot access dayPanel before initialization' ReferenceError로 스크립트 중단. 결과: 캘린더 0셀, '불러오는 중...' 고착, 통계/리스트/모달 등 전 기능 미동작. 재현: gcalen.com 진입 후 DevTools 콘솔 확인(script.js:477). data/games.json은 29건/05-29T12:35로 정상(데이터 무관). 원인: 21:40 컴팩트행 커밋(8fbbba2)이 dayPanel 리스너를 선언부 위에 추가. node --check는 TDZ 미검출. 권고: `const dayPanel = document.getElementById('day-detail-panel');`를 첫 사용(L477) 위로 이동.
- [2026-05-29] ✅ 해소 — (모바일 캘린더 가로 오버플로) 개발자 fix: grid-template-columns repeat(7,1fr)→repeat(7,minmax(0,1fr)) + .day-game-label min-width:0. 트랙이 최장 게임명 폭으로 확장되던 원인 제거(minmax 0 바닥 + flex/grid 자식 min-width:0). QA 모바일폭 재측정 권고. [이전 보고] 모바일폭에서 .calendar-grid가 컨테이너를 넘쳐 깨짐. 재현: Chrome에서 .calendar-view 폭 360px 제약 시 grid clientWidth 326px vs scrollWidth 727px. 원인: repeat(7,1fr) + 셀 .day-game-label white-space:nowrap → 1fr min-content가 최장 게임명 폭으로 확장(overflow:hidden/ellipsis는 트랙 사이징에 무효). 권고: repeat(7,minmax(0,1fr)) 또는 .day/.day-game-label min-width:0.
- [2026-05-29] ✅ 해소 — (배포 지연) Chrome 실측 결과 배포본 gcalen.com 데이터 갱신 05-29 11:30·20건으로 최신화 확인. 직전 17건/05-28은 WebFetch 자체 캐시였음(실제 배포 정상). 빌드 파이프라인 이상 없음.
- [2026-05-29] ✅ 해소 — (데이터 중복) 프로야구 스피리츠 2026 중복(pro-spirit-2026 / pro-yakyu-spirits-2026). 리서처가 11:00 사이클에 pro-yakyu-spirits-2026 삭제. QA 확인: repo games.json 17건, release_date 2026-07-16 항목 1건(pro-spirit-2026)만 존재. 배포본 gcalen.com/data/games.json도 7/16 1건 확인.
- (코드 버그 없음) 05-27 09:40 QA가 배포본에 구 푸터 문구 잔존 보고 → 소스는 정상, Vercel/CDN 캐시 지연으로 판단. 시간 경과로 해소되었을 가능성 높음. 다음 QA 사이클에서 gcalen.com 재확인만 권고.

## 개선 아이디어 (IDEAS)
- [디자이너 2026-05-31 10:03] [a11y·승격권고] 상세 모달 '열림 시 포커스 다이얼로그 미이동(트리거 카드 잔존)·닫힘 트리거 복귀 미적용' — role=dialog + aria-modal="true" + aria-labelledby=modal-title 는 이미 live·repo(index.html L142) 충족(=큐 '모달 aria-modal+접근명'은 완료상태 → 종결 권고). 남은 '열림 포커스 이동 / 닫힘 트리거 복귀(+선택 트랩)'를 TODO 승격 권고. 실측 openModal 직후 activeElement=트리거 .game-card. 우선순위 높음
- [디자이너 2026-05-31 10:03] [a11y·어포던스] 위시 ☆ 비활성 색 #666(다크 배경 대비 ~2.7:1, WCAG 1.4.11 3:1 미달)이 '클릭 가능한 위시 추가 버튼'임을 가려 발견성 저하 → #8a8f98~var(--text-dim)로 상향(활성 #f5b400 노랑은 유지). .wishlist-btn·.modal-wishlist-btn 2규칙, 신규 색 없음. 우선순위 보통
- [디자이너 2026-05-31 09:03] [a11y·시맨틱] '오늘' 캘린더 셀에 `aria-current` 부재 + 출시 0건 셀 `aria-label` 부재 → today가 인접월 trailing 셀로 자주 등장하는 구조라 '오늘'이 SR/시각 양쪽에 파란 보더로만 전달(범례도 없음, WCAG 4.1.2). 수정: renderCalendar의 today 셀에 `aria-current="date"` + 모든 셀 aria-label 'M월 D일(요일), 출시 N건'(today면 '오늘' 토큰). 외형 무변. 우선순위 보통
- [디자이너 2026-05-31 07:05·08:05갱신 / 기획자 08:11 일부 TODO화] [a11y] 상세 모달 다이얼로그 시맨틱 후속 — (완료)닫힘 상태 컨트롤 포커스 누출은 개발자 07:28 해소·디자이너 08:05 라이브 .focus() 실측 확정. (TODO화)aria-modal="true"+aria-labelledby(접근명) → 큐 5순위로 끌어옴. (잔여 IDEAS)포커스 트랩·열림 포커스 이동·닫힘 트리거 복귀. 우선순위 보통
- [디자이너 2026-05-31 07:05] [a11y·인터랙션] 날짜 셀 클릭으로 패널 오픈 시 키보드/SR 포커스 미이동·미안내(`#day-detail-panel` role/tabindex/aria-live 전부 null, 시각 scrollIntoView+flash만 기출고) → 패널/제목에 `tabindex=-1`+`focus()` 또는 `role=region`+`aria-label`+헤더 `aria-live=polite`. script.js renderDayPanel 소규모. 우선순위 보통
- [디자이너 2026-05-31 06:07] [일관성·정확성] '데이터 마지막 갱신' 타임스탬프가 헤더('마지막 업데이트: 2026.05.30' 날짜만·점)와 푸터('데이터 마지막 갱신: 2026-05-30 21:10 (8시간 전)' datetime·대시·상대)에 라벨/포맷/구분자/정밀도 모두 다르게 중복 노출 → 단일 헬퍼·포맷으로 통일하거나 헤더 날짜-only 제거하고 푸터 1곳으로 단일화. (헤더 #555 대비 건과 별개) 우선순위 보통
- [디자이너 2026-05-31 06:07] [정보손실·패널] 날짜 클릭 패널 행 플랫폼 컬럼이 멀티플랫폼 게임에서 첫 1개만 노출(script.js L245 `(g.platforms||[])[0]`; 예: EA UFC 6 패널 'PS5' vs 모달/카드 'PS5, Xbox Series X/S') → 'PS5 외 N' suffix 또는 앞 2개 join으로 멀티 신호 부여(모달·카드와 일관). 우선순위 낮음
- [디자이너 05-31] [일관성·모달] 상세 모달 출시일 D-day가 평문('· D-4')이라 카드/패널 컬러 배지와 위계 역전 → 모달도 .dday(soon/today/past) 배지(approx '(예정)' 유지). 신규색 없음. (D-day 색단계화와 별개) 우선순위 보통

- [기획자 2026-05-31 이동·정체] [정렬·패널] 캘린더 날짜 패널 흡수행↔그룹헤더행 게임명 좌측 x 정렬 완결 — 05-30 19:10 #1 승격 후 3사이클+ 미해결(20:20 `.day-row-date` 6.5em 우측정렬 부분출고에 그침, 게임명 x 흡수행≈517 vs 그룹헤더행 427 ~90px 잔존, 01:04 라이브 잔존 재확인) → 절대규칙(3사이클 정체) 따라 IDEAS 보류. 재착수 택1: (a)그룹헤더 맥락 `.day-row`에 흡수행과 동일 좌측 인셋 부여, (b)`.day-row-date`를 flex 분리 고정 컬럼화. 완료기준=두 행 종류 게임명 좌측 x 일치. 우선순위 낮음(정체 이력)
- [디자이너 2026-05-31 01:04] [캘린더·정보손실] 데스크톱 월간 셀에서 같은 날 2건↑ 출시 시 '대표 1건 게임명+색점 N개'만 노출되고 '+N'(나머지 건수) 표시 부재 → 둘째 게임 이상이 은닉(같은 카테고리면 동일색 점 2개라 식별 0). 셀 게임수 2건↑이면 라벨 끝/점 옆에 `+N` 배지(dayMap 배열 count-1). script.js renderCalendar 소규모+`.day-more` 1규칙(중립 톤). 우선순위 보통
- [디자이너 2026-05-31 01:04] [캘린더·시각위계] '오늘' 셀이 other-month 디밍과 겹쳐 opacity 0.35로 렌더 → today 파란 보더/tint 거의 비가시. 캘린더가 최근접 출시월로 자동 점프하는 구조라 당월 출시 0건이면 today가 매 방문 인접월 흐릿한 trailing 셀로만 등장. `.day.other-month.today{opacity:1}`(today는 디밍 예외)로 위치 무관 today 강조 유지(+선택: 월네비 옆 '오늘 M/D' 힌트). styles.css 1규칙, 신규 색 없음. 우선순위 보통
- [디자이너 2026-05-31 00:07] [빈 상태·로딩] 기본 캘린더 뷰 진입 시 로딩 신호 부재 — '불러오는 중…'이 숨겨진 리스트 뷰(#games-list)에만 주입돼 첫 화면(캘린더)에선 fetch 동안 빈 격자만(9초 load-fallback 전까지 피드백 0). 캘린더 컨테이너에도 로딩 플레이스홀더 또는 공통 로딩 표시. 우선순위 보통
- [디자이너 2026-05-31 00:07] [성능·정리] 미사용 Google Fonts preconnect 제거 — head preconnect가 있으나 실제 로드 폰트 없음(시스템 폰트만). 폰트 미도입이면 1줄 삭제, 도입 시 stylesheet와 짝지어 정식 추가. 우선순위 낮음
- [디자이너 05-30] [a11y·키보드] 본문 바로가기(skip-to-content) 링크 부재(WCAG 2.4.1) — 상단 컨트롤 다수를 매번 Tab 통과해야 본문 도달. body 최상단 .skip-link(href=#main, :focus 시 노출)+main에 id. 우선순위 낮음
- [디자이너 2026-05-30 21:09] [정렬·패널·1순위 스코프 보강] 흡수행 `.day-row-date` 고정폭+우측정렬(개발자 20:20 a1d0ae2)은 날짜 자체만 정렬할 뿐 '게임명 좌측 정렬'(1순위 명시목표)은 미달 — 그룹헤더행 `.day-row`에 동일 6.5em 좌측 인셋이 없어 게임명이 컬럼폭(~96px)만큼 어긋난 채 유지(폭 5.5→6.5em 확대로 오히려 +확대). 수정: (a)`.day-row:not(.single-date)`에 동일 좌측 인셋, 또는 (b)날짜를 flex에서 빼 우측 메타로. 우선순위 보통(1순위 마무리)
- [디자이너 05-30] [리스트·가로공간·정정] 리스트 단일게임 카드(.game-card.single-game)가 풀폭(1168px)으로 stretch되나 내용이 좌측 세로 스택→우측 ~50% 빈 공백. 과거 '단일게임 풀폭=가로낭비 해소'(DESIGN_NOTES line664) 판정이 라이브 실측과 불일치(멀티 카드는 379px라 폭 들쭉날쭉). 택1: (a).single-game 2열 가로(좌 제목/설명·우 메타+D-day) grid, 또는 (b)전열 span 제거+max-width 600px로 멀티카드와 폭 일관. styles.css 소규모. 우선순위 보통
- [디자이너 05-30] [일관성·SEO] SEO 카테고리 목록 페이지(/upcoming-games 등)의 '신규 서버' 카테고리 라벨이 '한국 MMO 신규 서버'로 찍혀 메인 앱('신규 서버')과 불일치 → build.js 라벨을 메인 categories 라벨 맵 단일 출처에서 가져오도록 통일. (기존 '카테고리 명칭 4곳 통일'은 메인 앱 한정, SEO는 추가 표면) 우선순위 낮음
- [디자이너 05-30] [정보구조·발견성] 활성 필터(카테고리/플랫폼/기간/검색/주칩/위시 6종)를 한 번에 되돌리는 '필터 초기화' 컨트롤 부재 → 비기본 필터 1개↑ 활성 시에만 '필터 초기화' 링크/버튼 노출, 클릭=전부 기본값 일괄 리셋(결과 0건 빈 상태 탈출구 겸). script.js 리셋함수+노출토글. 우선순위 보통
- [디자이너 05-31] [일관성·SEO페이지] 게임별 상세 페이지(/game/{id}, build.js 생성)에 D-day 카운트다운 부재 → 앱 핵심 지표(D-DAY/D-N)가 검색유입 첫 화면인 단독 페이지엔 없음. build.js 출시일 줄에 메인과 동일 계산 D-day 추가(approx면 '(예정)'). 우선순위 보통
- [디자이너 05-31] [일관성·SEO페이지] 상세 페이지 헤더/날짜 포맷이 메인과 불일치 — 헤더 중앙+큰 패딩·카드 중앙정렬(메인은 좌측 컴팩트), 날짜 '2026년 6월 3일'(메인은 '2026.06.03 (수)'). build.js를 메인 톤·날짜 헬퍼(요일 포함)와 통일. 우선순위 보통
- [디자이너 05-31] [a11y] 색+모양 dot 이중인코딩이 .day-dot/.legend-dot만 적용, 날짜 패널 .day-row-dot(styles.css 605~610)은 4색 모두 원형(색만) → 게임명 읽는 패널에서 색각이상 단서 소실. .day-row-dot에 동일 per-category 모양(사각/마름모/링)+title/aria-label 부여(4줄). 우선순위 보통
- [디자이너 05-31] [정보중복·SEO페이지] dev==publisher 동일 시 상세 페이지도 '개발사 X'/'배급사 X' 2줄 중복(build.js L87~88) → 모달·카드·build.js 공통 '개발·배급 X' 병합 규칙으로 세 표면 일관. 우선순위 낮음
- [디자이너 05-31] [정렬·모달] 상세 모달 메타 행 라벨 폭이 제각각(출시일/플랫폼/장르/개발/퍼블리셔)이라 값 시작점이 줄마다 들쭉날쭉 → .modal-row strong에 display:inline-block+min-width(또는 grid 2컬럼)로 값 좌측 컬럼 정렬. styles.css 소규모. 우선순위 보통
- [디자이너 05-31] [정보중복] 개발사==퍼블리셔 동일 게임이 '개발 X'/'퍼블리셔 X' 동일 값 2줄 중복(모달+리스트카드) → 같으면 '개발·퍼블리셔 X' 한 줄 병합, 다르면 2행 유지. script.js 분기. 우선순위 낮음
- [디자이너 05-31] [a11y] 월간 캘린더 그리드에 grid/row/columnheader/gridcell 시맨틱·요일 헤더 연결 부재 → SR에 요일×주 구조 미전달(WCAG 1.3.1). .calendar-grid role=grid+요일 columnheader+셀 gridcell, 셀 aria-label에 요일 포함. 외형 무변 JS 속성. 우선순위 보통
- [디자이너 05-31] **[버그·높음] 캘린더 날짜 패널 게임 행(.day-row) 마우스 클릭 시 상세 모달 미동작** (키보드 Enter는 정상→마우스/터치만 깨짐). 원인: `.day-row` openModal 처리가 gamesList(#games-list) 리스너에 있는데 .day-row는 #day-detail-panel 소속이라 도달 못함; dayPanel click 리스너는 .game-card만 처리. 수정: dayPanel click 핸들러를 `closest('.day-row, .game-card')`로 확장. .day-row가 cursor:pointer+hover로 클릭 광고하나 무반응이라 '고장' 인식 위험. 우선순위 높음
- [디자이너 05-31] [a11y·모바일] 위시 별(★)·모달 닫기(×) 등 아이콘 버튼 터치타겟 <44px(WCAG 2.5.5) → min 44×44 히트영역 확보(아이콘 크기 유지, 클릭영역만 확장). + .day-row:focus-visible가 outline 제거+hover와 동일 bg라 키보드 포커스 식별 약함→accent outline 부여. 우선순위 보통
- [디자이너 05-31] [a11y] (1) 위시 활성 별 색 표면마다 다름(#f5b400 카드/모달 vs #f5a623 패널)+패널선 '임박'색(#f5a623)과 충돌 → --wish 토큰으로 통일·임박 amber와 분리. (2) :focus-visible가 캘린더 셀·검색 외 모든 컨트롤(뷰토글/칩/select/위시별/클릭태그/링크/닫기버튼)에 없음 → 전역 focus-visible outline 적용. 우선순위 보통
- [디자이너 05-30] 페이지 하단 '바로가기' 칩이 상단 필터 버튼과 동일 외형이라 필터/페이지이동 어포던스 모호 + 캘린더↔푸터 빈 다크 밴드에 떠 위계 약함 → 칩 동작(필터?앵커?) 확인 후 외형 구분(링크형 or 섹션 박스로 감싸기), '바로가기:' 라벨 대비 상향, 상하 빈 여백 축소. 우선순위 보통
- [디자이너 05-30] '오늘' 셀이 파란 보더(today)+amber '오늘' 라벨(임박색)로 이중색 → '오늘' 라벨 색을 --accent(파랑)로 통일, amber는 '임박'에만 한정(색 토큰 재사용). 우선순위 낮음
- [디자이너 05-30] 지난 날짜 셀 클릭 시 패널 헤더("N일 이후")와 실제 목록(오늘 이후) 불일치 + 그 날 게임 누락(27셀=007퍼스트라이트 표시되나 패널엔 없음) → (a)클릭일 기준으로 그 날짜 게임 포함, 또는 (b)지난 날짜 셀 클릭 비활성/흐림+헤더 '오늘 이후'로 정정. 기간필터-패널 경계 동작 확인 필요. 우선순위 보통
- [디자이너 05-30] 이벤트 있는 셀↔빈 셀 배경 동일 → 출시 있는 .day에 옅은 배경 tint(rgba(74,144,226,0.06))+좌측 2px 카테고리색 악센트로 '여기 콘텐츠 있음'을 면으로 강조(점/라벨만으론 약함). 우선순위 보통
- [디자이너 05-30, 운영자요청] [클린미니멀] 이모지 전량 -> 인라인 SVG 라인 아이콘 세트(스프라이트+use, currentColor, Lucide톤). 헤더/토글/모달/위시★/네비‹› 전부. 새 이모지 추가 금지 규칙화. 우선순위 보통
- [디자이너 05-30, 운영자요청] [클린미니멀] 모던 한글 가변폰트(Pretendard 등) 도입 + 제목/부제 위계 정리(weight·letter-spacing). 폰트 1개 교체로 세련도 체감 큼. 우선순위 보통
- [디자이너 05-30, 운영자요청] [클린미니멀] 라운드(6->10~12px, --radius 토큰화)+여백 상향 통일. 라이트모드 선행 토큰화와 겹침. 우선순위 보통
- [디자이너 05-30, 운영자요청] 라이트/다크 테마 토글 — 단, 선행조건으로 (1)색 변수 토큰화 마무리(남은 회색/rgba/카테고리 4색까지 전부 var()로) 후 (2)`[data-theme="light"]`에 변수값만 덮어쓰는 방식. 토큰화 전 착수 금지. 우선순위 낮음(후속)
- [디자이너 23:04] 리스트 카드 메타 아이콘(⚔ 시리즈·🏛 개발사)이 라벨 없이 이모지만 → 의미 불명확+스크린리더 미스리딩. 짧은 라벨('시리즈:'/'개발사:') 또는 aria-label/title 부여. 우선순위 낮음
- [디자이너 13:02] 긴 리스트/날짜 패널 스크롤 시 날짜 그룹 헤더(.date-group-header)가 사라져 날짜 맥락 상실 → 헤더에 position:sticky;top:0(+불투명 배경)로 그룹 훑는 동안 날짜 고정. 리스트/패널 공통. 우선순위 보통
- [디자이너 20:50] 캘린더 날짜 셀 클릭 시 결과 패널이 그리드 아래(폴드 밖)서 열려 '반응 없음'처럼 보임 → 패널 렌더 후 scrollIntoView(smooth)+헤더 1회 강조 플래시. 캘린더 핵심 인터랙션 발견성. 우선순위 높음
- [디자이너 20:50] 모바일(≤480px) 캘린더 셀 게임명 라벨 과도 truncation(3~4글자) → ≤480px에서 .day-game-label 숨기고 카테고리 점만(상세는 셀 클릭 패널) 또는 건수 칩. 우선순위 보통
- [디자이너 23:02] '날짜 미정/유동적' 게임이 2026.12.31 그룹에 묶여 정확한 D-day(D-217) 표시 → 가짜 정밀도. date_tbd 플래그로 D-day 대신 '미정/2026 예정' 라벨, 패널/리스트 맨끝 '날짜 미정' 그룹 분리, 캘린더 미배치. 우선순위 보통
- [디자이너 23:02] 상단 통계줄(국내모바일 8…총 29)을 클릭 가능한 카테고리 필터로(세그먼트 클릭=해당 카테고리 적용+드롭다운 동기화, 활성 강조, button/aria-pressed). 우선순위 보통
- [디자이너 19:02] 로딩 실패/크래시 시 에러 상태(별도 inline script로 안내+새로고침 버튼) — 무한 '불러오는 중...' 방지 (우선순위 높음)
- [디자이너 19:02] 로딩 타임아웃 가드(8~10초 후 에러 상태 전환) + 스피너/스켈레톤 로딩 인디케이터
- [디자이너 05-29] 캘린더 '선택 셀' 보더가 '임박 셀(.day-soon)' 보더와 색 충돌 → 선택은 보더 대신 배경 채움+링으로 위계 분리(오늘=파랑/임박=amber 유지). 우선순위 보통
- [디자이너 05-29] 날짜 셀 클릭 어포던스 부재 → 게임 있는 셀에 cursor:pointer+호버 배경/보더, 키보드 접근(tabindex/role+focus-visible) 검토. 우선순위 보통
- [디자이너 05-29, 운영자요청] 날짜 클릭 패널의 내부 스크롤(고정높이+overflow) 제거→페이지 흐름으로 인라인 확장(스크롤 속 스크롤 해소). 컴팩트 행 작업과 묶어 처리. 우선순위 높음
- [디자이너 05-29, 운영자요청] 상단 텍스트 제목 제거→로고로 교체, 로고 클릭=홈/리셋(캘린더+현재월+필터 초기화). SEO용 h1/alt 유지, aria-label '홈'. 헤더 컴팩트화와 묶어 처리. 우선순위 높음
- [디자이너 05-29] 진입 시 현재 달이 텅 비어 보임 → calendarMonth를 '오늘 이후 가장 가까운 출시 달'로 초기화(또는 월 네비 옆 '이 달 N건·다음 달 N건' 카운트). 우선순위 높음
- [디자이너 05-29] 출시 0건인 달 캘린더 빈 상태 안내 부재 → 그리드에 '이 달 출시 없음, ‹ ›로 탐색' 한 줄 + '다음 출시(N월)로' 버튼. 우선순위 높음
- [디자이너 05-29, 운영자요청] 날짜 클릭 패널을 한 줄 컴팩트 행(색점·게임명·플랫폼·D-day·☆, 클릭=상세모달)으로. 표시범위 현행 유지. 우선순위 높음
- [디자이너 05-29, 운영자요청] 헤더 좌측정렬+컴팩트화해 캘린더를 첫 화면 위로(상단 ~310px→절감). 우선순위 높음
- [디자이너 05-29, 운영자요청] 진입 시 캘린더 뷰 고정(선택 기억 정책 확정). 우선순위 보통
- [디자이너 05-29] 리스트 뷰 가로 공간 낭비 해소: 날짜그룹 3열 그리드→가로형 풀폭 행 카드(또는 단일게임 단일컬럼). 우선순위 높음
- [디자이너 05-29] 카드 상단 배너 카테고리 라벨 중복 제거(배너에 게임명/썸네일 or 4px 컬러보더로 콤팩트화). 우선순위 보통
- 출시일별 그룹핑 (리스트 뷰 옵션)
- 한국 게임 vs 글로벌 게임 통계 차트
- 게임 트레일러 YouTube 임베드
- 카카오톡 공유 기능
- 일간/주간 뷰 (월간 안정화 후)

## 최근 변경 로그
- 2026-05-31 09:28 [개발자] 1순위 완료: **[정보중복] 개발사==퍼블리셔 동일 시 '개발·퍼블리셔 X' 한 줄 병합**. developer·publisher가 trim 후 동일한 게임에서 상세 모달은 '개발'/'퍼블리셔' 2행이 같은 값으로 중복되고, 리스트 카드 메타도 🛠️/🏢 2행이 동일 텍스트로 반복되던 문제 해소. 모달은 '개발·퍼블리셔 X' 1행으로 병합, 카드는 🏢 1행으로 dedup. 값이 다르면 기존 2행 유지, 한쪽만 있으면 그 행만. renderCard 메타·openModal 템플릿에 trim 동일성 분기(IIFE) 추가, data/games.json 무수정. node --check ✓, 런타임 테스트(동일/상이/dev-only/pub-only) 통과, 신규 색/CSS 없음. QA: developer==publisher 게임(예: 단일 퍼블리셔 자체개발 타이틀)에서 모달 1행·카드 1행, 서로 다른 게임은 2행 유지 실측 부탁. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 08:39 [개발자] 1순위 완료: **[a11y·구조] 리스트 뷰 게임 카드 제목 헤딩 레벨 h3→h4**. 리스트 뷰에서 날짜 그룹헤더(`.date-group-header`=h3)와 게임 카드 제목(`.info h3`)이 동일 h3라 SR 헤딩 탐색 시 날짜⊃게임 위계가 평면화되던 문제(WCAG 1.3.1) 해소. renderCard 제목 마크업 `<h3>`→`<h4>`(script.js L303 1곳) + styles.css `.info h3`→`.info h4` 셀렉터 치환(L240)으로 폰트/색 등 외형 무변경 유지. 모달 제목(h2)·날짜 헤더(h3) 불변. node --check ✓, CSS brace 균형, 신규 색 없음. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 07:28 [개발자] 1순위 완료: **[a11y·높음·버그] 닫힌 상세 모달 컨트롤 키보드/AT 포커스 잔존 해소**. 페이드용 `[hidden]{display:flex!important}`가 hidden을 무효화해 닫힌 모달의 ×/전체페이지/트레일러/링크복사/위시☆/출처보기가 Tab 포커스·제목이 a11y 트리 누출(WCAG 2.4.3/4.1.2)되던 문제 해소. `.modal-overlay`에 `visibility:visible`+transition에 `visibility 0s`, `[hidden]`에 `visibility:hidden`+`transition:... visibility 0s linear 0.18s`(페이드아웃 동안 보이다 끝에 가려짐, 열림 즉시 visible) 부여 → 닫힌 컨트롤이 탭 순서·a11y 트리에서 제거. reduced-motion엔 `[hidden]{transition:none}`로 즉시 가림. 스코프=포커스 누출만(role=dialog/트랩은 IDEAS). CSS-only(~4줄), script.js 무변경, 신규 색 없음, node --check ✓, CSS brace 279/279. QA: 닫힌 모달에서 Tab/`.focus()`로 내부 컨트롤 포커스 불가·페이드 인아웃 정상·열림 시 정상 조작 실측 부탁. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 06:30 [개발자] 1순위 완료: **[a11y·키보드] 리스트 뷰 게임 카드 키보드 포커스 + Enter/Space 모달 오픈**. 리스트 카드(`.game-card` article)에 tabindex/role 부재로 키보드·SR 사용자가 상세 모달 진입 불가(날짜패널 .day-row는 가능 → 표면 불일치, WCAG 2.1.1) 해소. renderCard article에 `tabindex="0" role="button" aria-label="{게임명} 상세 보기"` 추가, `gamesList.addEventListener("keydown")`로 Enter/Space 시 openModal 재사용(`card===e.target` 가드로 내부 위시버튼 native click과 중복 방지), styles.css `.game-card:focus-visible` accent outline 1규칙. script.js +8/−1, styles.css 1줄, 신규 색 없음, node --check ✓, CSS brace 278/278. QA: 마우스·Tab→Enter/Space·SR 모두 모달 오픈, ☆ 위시 토글 회귀 없음 확인 부탁. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 05:28 [개발자] 1순위 완료: **[모바일·핵심·스캔성] ≤480px 캘린더 셀 게임명 라벨 숨김 + 카테고리 점 확대**. styles.css `@media(max-width:480px)`에서 `.day-game-label{display:none}` 라벨 숨김 + `.day-dot` 7px→9px 확대(신규서버 링 border 1.5→2px). 모바일에서 점만으로 그날 카테고리/건수 스캔하게 하고 상세는 기존 셀 클릭 패널 활용. 셀 `aria-label="M월 D일, 출시 N건"`은 이미 L656 구현되어 있어 검증 갈음. 데스크톱 7px·점 모양·하단 정렬 유지, CSS-only(4줄)·script.js 무변경·신규 색 없음, CSS brace 277/277, node --check ✓. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 05:11 [기획자] TODO 큐 4→5개. 직전 1순위 '카테고리 라벨 단일출처화(CATEGORY_LABELS 4표면 통일)' 개발자 04:30 완료·QA 04:47 ✅(라이브 4표면 캐노니컬 통일·통계 36 일치)→완료 처리(큐 5→4). 디자이너 05:07 신규 발견 '[모바일·높음] ≤480px 캘린더 셀 게임명 라벨 숨김+카테고리 점 확대+셀 aria-label'(모바일 날짜별 출시 스캔 핵심 가치 약화)을 작고 명확한 CSS-위주 TODO로 **1순위 승격**(유일 '높음'·핵심 모바일 가치, IDEAS→큐, 중복 IDEA 제거). 기존 4건(카드 제목 h3→h4·dev==pub 병합·헤더 타임스탬프 대비·모달 빈 배너 축소)은 2~5순위로 한 칸씩 밀림. 활성 사용자 요청 0(SEO 보류). 미해결 코드 버그 0(BUGS 전 항목 ✅). 코드 미수정(문서만).
- 2026-05-31 04:30 [개발자] 1순위 완료: **[일관성] 카테고리 라벨 단일 출처화(4표면 통일)**. 단일 출처 맵 `CATEGORY_LABELS`(국내 모바일/국내 PC·콘솔/글로벌 대작/신규 서버) 신설 후 드롭다운·통계줄·범례·카드/모달 태그가 모두 참조. loadData 머지(`Object.assign({},data.categories,CATEGORY_LABELS)`)로 games.json 라벨 덮어쓰기, renderStatsSummary·updateCategoryCounts baseLabel 맵 참조, 신규 `renderLegend()`로 범례 라벨 채움(점 모양 보존). `new_server` 3종·`global_aaa` 2종 표기 분기 해소. index.html 정적 폴백도 캐노니컬 정렬. data/games.json 무수정. script.js 27+/9-, index.html 3±, 4표면 통일 테스트·node --check 통과·CSS brace 275/275. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 03:28 [개발자] 1순위 완료: **[a11y·폼] 게임명 검색 입력(#search-input) 접근형 이름(aria-label) 부여**. 검색 input에 label·aria-label이 없어 스크린리더가 용도를 못 읽던 문제(WCAG 4.1.2/3.3.2) 해소 → `aria-label="게임명 검색"` 1속성 추가, placeholder 보조 유지. index.html 1줄, script.js·CSS 무변경·외형/신규 색 없음. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 02:28 [개발자] 1순위 완료: **[캘린더·시각위계] '오늘' 셀 other-month 디밍 예외**. 캘린더 자동 점프로 당월 출시 0건이면 today가 인접월 trailing 셀(`.other-month` opacity 0.35)로 렌더돼 파란 보더/tint 강조가 거의 비가시던 문제 해소. styles.css `.calendar-grid .day.other-month.today { opacity:1; }` 1규칙 추가(line 353)로 today를 위치 무관 디밍 예외 처리. CSS-only, 신규 색 없음, brace 275/275, JS 무변경. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 01:30 [개발자] 1순위 완료: **[캘린더·정보손실] 데스크톱 월간 셀 '같은 날 2건↑' '+N' 배지**. 셀이 대표 1건 게임명+색점만 노출해 둘째 게임 이상(동일 카테고리 동색 점이면 식별 0)이 은닉되던 문제 해소. `renderCalendar`에 `extra=list.length-1` 계산 → 2건↑ 셀 day-dots 행 우측 끝 `.day-more`(`+N`) 배지, 1건 셀 미표시. CSS `.day-more` 1규칙(`margin-left:auto`로 우측 정렬→기존 `.day-dot-more` 점overflow와 위치 분리, 중립 #aaa+var(--border), 신규 색 없음), script.js 2줄. 검증: 1건→없음/2건→+1/3건→+2/5건→+4. node --check 통과, CSS brace 274/274. 잔여 TODO 3건 1~3순위로 당김.
- 2026-05-31 [개발자] 1순위 완료: **[일관성·정확성] approx(예정) 날짜 게임 그룹헤더/흡수행 요일 표기 통일**. approx 게임이 리스트·날짜패널 그룹헤더에서 확정 요일 `(월)`로 찍혀 모달(요일 생략·`(예정)`)·카드와 3곳 엇갈리던 문제 해소. 헬퍼 `weekdaySuffix(g)`(확정→`(요일)`/approx→요일 생략 후 `(예정)`) 신설 후 `renderGroupedList` 헤더·`renderDayRows` 헤더·흡수행 인라인 3곳을 헬퍼 호출로 단일화(미사용 `wdInline` 제거). 검증: 확정 2026-06-05→`(금)`, approx→`(예정)`. script.js 순증 ~12줄, 신규 색/CSS 없음, node --check 통과. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-30 23:30 [개발자] 1순위 완료: **[정확성·푸터] '데이터 마지막 갱신' 상대시간 미래(음수 diff) '(방금 전)' 오표기 가드**. `formatRelativeTime`에 `if (diffMin < 0) return '';` 가드 추가 → 미래 타임스탬프는 상대 라벨 생략, 푸터가 절대 시각만 노출(`rel ? absStr+(rel) : absStr` 분기 활용). 양수 diff 경로(방금 전/분/시간/일 전) 무변경. 런타임 검증 4케이스 통과(future→''/now→방금 전/5분/3시간). script.js 1줄, 신규 색/CSS 없음, node --check 통과. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 00:00 [기획자] TODO 큐 4→5개. 직전 사이클(22:12) 이후 개발자 22:31 'D-day 근접도 4단계+표면 색 통일' 완료·QA 22:47 ✅·디자이너 23:05 재점검(신규 0·큐 소진 권고)로 큐 4 유지. 개발자 처리량 확보 위해 디자이너 반복 지적 '[일관성] 카테고리 라벨 4표면 표기 통일'을 작고 명확한 TODO로 5순위 승격(IDEAS→큐) → 4→5. 기존 4건(푸터 음수 상대시간 가드·approx 그룹헤더 요일·흡수행 게임명 좌측 정렬 완결·검색입력 aria-label) 1~4순위 유지. 활성 사용자 요청 0(SEO 보류). 미해결 코드 버그 0. 코드 미수정(문서만).
- 2026-05-30 22:31 [개발자] 1순위 완료: **[시인성·일관성·D-day] D-day 배지 근접도 단계 + 표면 색 통일**. 신규 헬퍼 `ddayStageClass(diff)`(past/today/soon≤7/mid8~30/far>30) 추가, renderCard·renderDayRows 분기를 헬퍼 호출로 단순화. styles.css `.dday.*`/`.day-row-dday.*` 공유 블록으로 정리(임박=amber+굵게·today만 pulse / 8~30=`var(--text)` / >30=`var(--text-faint)` / past=faint), 중복 패널 규칙 2줄 제거. 표면 불일치 해소: D-DAY 색 리스트 빨강#e74c3c→amber, 먼미래 회색 #888/#aaa→--text-faint 통일. 신규 색 없음, node --check 통과, CSS brace 273/273. 변경: script.js·styles.css. 잔여 TODO 4건 1~4순위로 당김.
- 2026-05-30 22:12 [기획자] TODO 큐 4→5개. 직전 1순위 '리스트 뷰 카드 출시일 중복 표기 제거' 개발자 21:29 완료·QA 21:45 ✅→완료한 기능 이동(큐 5→4). 디자이너 22:01 신규 a11y 3건 중 임팩트 최대 '검색 입력(#search-input) 접근형 이름(aria-label) 부여'를 작고 명확한 TODO로 5순위 승격(IDEAS→큐). 잔여 4건(D-day 색통일·푸터 음수가드·approx 요일·흡수행 정렬) 1~4순위 유지. 활성 사용자 요청 0(SEO 보류). 미해결 코드 버그 0. 코드 미수정(문서만).
- 2026-05-30 21:29 [개발자] 1순위 완료: **[밀도·정보중복·리스트] 리스트 뷰 카드 출시일(.release-date) 중복 표기 제거(그룹헤더 맥락 한정)**. `renderCard`에 `grouped` 플래그 추가, `renderGroupedList`에서 항상 `grouped=true` 전달 → 그룹헤더가 날짜를 책임지는 리스트 뷰에서 카드 `.release-date` div를 미렌더(헤더1+카드N=N+1회 날짜 중복 해소). D-day 배지(card-header 별도)·grouped 미지정 단독/검색 맥락의 날짜 전체 노출은 유지. script.js 3줄(+0 신규 색/CSS), node --check 통과. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-30 21:20 [기획자] 21:18 heartbeat(큐 4건 정상) 후 실작업 1건 추가: 디자이너 21:09 선분석 반영, 개발자 20:20 '.day-row-date 우측정렬' 출고가 명시 목표 '게임명 좌측 x 정렬' 미달(~90px 잔존)임을 확인 → '흡수행↔그룹헤더행 게임명 좌측 x 정렬 완결' 후속 TODO 5순위 등재(큐 4→5). 수정방향=그룹헤더행 동일 좌측 인셋(a)/날짜 탈-flex 고정컬럼(b). 활성 요청 0·미해결 코드 버그 0. 코드 미수정(문서만).
- 2026-05-30 21:18 [기획자] 사이클 점검: TODO 큐 4건(정상 3~5) 유지, 활성 사용자 요청 0, 미해결 코드 버그 0. 보충 불필요로 신규 변경 없음(heartbeat 기록). 코드 미수정.
- 2026-05-30 20:20 [개발자] 1순위 완료: **[정렬·패널] 날짜 클릭 패널 '1건 흡수' 행 날짜 고정폭+우측정렬**. styles.css `.day-row-date`에 `min-width:6.5em; text-align:right`(+padding-right 0.15rem) 부여 → 가변폭이던 흡수행 인라인 날짜를 고정폭 우측정렬해 뒤따르는 점·게임명 시작 x를 흡수행끼리 통일하고 그룹헤더 행과의 좌측 컬럼 어긋남(디자이너 측정 78px) 축소. CSS-only 1규칙, 신규 색/JS 없음. 잔여 TODO 4건 1~4순위로 당김.
- 2026-05-30 20:11 [기획자] TODO 큐 5개 유지(변경 없음). 직전 기획자 사이클(19:10) 이후 신규 개발자 푸시 0 — 19:45 QA 배포 헬스 ✅, 20:50 디자이너 점검 '신규 트집 0·전부 기등록분'만 존재. 큐가 3~5 범위 가득(미소진)이라 보충/이동 불필요. 1순위 '흡수행 .day-row-date 고정폭+우측정렬'은 19:10 승격분으로 1사이클차(막힘 아님)→유지. 활성 사용자 요청 0(SEO 보류). 미해결 코드 버그 0(BUGS 전 항목 ✅). 개발자 큐 소진 우선 권고. 코드 미수정(문서만).

_(이전 76개 변경은 archive로 이동)_