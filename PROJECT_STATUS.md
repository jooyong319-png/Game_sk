# 프로젝트 현재 상태

마지막 갱신: 2026-05-31 08:20 (개발자 — 날짜패널 .day-row 마우스 클릭 모달 버그 수정 완료)

## 현재 단계
Phase 1 — 정적 JSON 기반 게임 출시 캘린더 (3개 카테고리)

## 🔁 방향 (2026-05-27 유지)
메인 뷰를 월간 캘린더로 전환 중. 카드 그리드는 "리스트 뷰"로 보존 → 5단계 토글에서 정리.
캘린더 1·2단계 완료. 남은 3·4·5단계를 한 사이클당 1개씩 진행.

## 아키텍처
- **프론트** → `/data/games.json` (리서처 Claude가 매일 9시 갱신)
- RAWG API 의존성 없음. 모든 데이터는 리서처 Claude가 WebSearch로 큐레이션.

## 완료한 기능
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

## 다음 TODO (우선순위 순)

> 갱신 2026-05-31 08:00 (기획자): 직전 1순위(D-day KST off-by-one)는 개발자 04:20 완료·QA·디자이너 04:50 라이브 ✅로 완료한 기능 이동 확인. 디자이너 04:50 점검에서 **[버그·높음] 날짜패널 .day-row 마우스 클릭 시 상세 모달 미동작**(키보드 Enter는 정상, 마우스/터치만 깨짐) 신규 발견 → 핵심 인터랙션 correctness 버그로 1순위 등재. 기존 잔여 4건은 2~5순위로 한 칸씩 밀림. 활성 사용자 요청 0. 큐 4→5개.

1. **[접근성] 카테고리 점 색+모양 이중 인코딩** (디자이너 05-30 '보통')
   - 캘린더 셀 `.day-dot`·범례 `.legend-dot`가 4색(hue)만으로 카테고리 구분 → 색각이상 사용자 구분난(WCAG 1.4.1 소지).
   - 색 외 단서 추가: 모바일=원 / PC·콘솔=사각(`border-radius:1px`) / 글로벌=마름모(`rotate(45deg)`) / 신규서버=링(`border`만). 범례 dot도 동일 모양 적용해 셀↔범례 매칭.
   - dot에 카테고리명 `title`/`aria-label` 부여(스크린리더·호버 보조). 기존 4색 유지, 모양만 추가. styles.css 중심 + script.js 속성 부여 소규모.

2. **[밀도] 날짜 클릭 패널 — 1건 날짜는 날짜를 행 안으로 흡수** (디자이너 05-30 '보통')
   - "OO 이후 출시 N건" 패널에서 1건뿐인 날짜도 독립 날짜 헤더+행으로 세로 반복 과다(헤더/행/헤더/행).
   - renderDayRows에서 dateCounts 분기: 1건 날짜는 `MM.DD(요일) · ●게임명 · 플랫폼 · D-day · ☆` 한 줄로 날짜를 행에 인라인, 독립 날짜 헤더는 2건↑만 유지(리스트 뷰 single-game 패턴 재사용).
   - script.js renderDayRows 분기 + styles.css 행 내 날짜 라벨 톤. 신규 색 없음.

3. **[스캔성] 출시 있는 셀에 옅은 면 강조** (디자이너 12:50/05-30 발견)
   - 이벤트(출시 게임) 있는 셀↔빈 셀 배경이 동일해 한눈에 '어디 콘텐츠 있는지' 스캔이 약함.
   - 출시 1건 이상인 `.day`에 옅은 배경 tint(`rgba(74,144,226,0.06)`) + 좌측 2px 카테고리색 악센트(or 중립 accent)로 '여기 콘텐츠 있음'을 면으로 강조. 점/라벨은 보조로 유지.
   - 오늘/임박(.day-soon)/선택(.day.selected) 강조와 색 충돌 없는지 확인(이들은 보더·채움+inset링이라 분리됨). styles.css 중심 소규모, 신규 색 없이 --accent 재사용.

4. **[색일관] 캘린더 '오늘' 셀 라벨 색 amber→--accent(파랑) 통일** (디자이너 05-30 '낮음')
   - '오늘' 셀이 today 파란 보더 + '오늘' 라벨 amber(임박색)로 색 이중인코딩 → amber 의미가 '임박(.day-soon)'과 충돌.
   - '오늘' 라벨(텍스트/배경)을 amber에서 `var(--accent)`(파랑)로 교체해 today 보더와 색 통일. `.day-soon`의 amber 강조는 그대로 유지(‘임박’ 전용으로 한정).
   - styles.css CSS-only 소규모(’오늘’ 라벨 규칙 1곳), 신규 색 없이 기존 토큰 재사용. node/brace 균형 확인.

### (큐 소진 후 후보, IDEAS에서)
카테고리 명칭 4곳(드롭다운/통계줄/범례/카드태그) 표기 통일, D-day 배지 근접도 색 단계화(≤7 amber/≤30 중립/>30 흐린톤), 위시 별 색 --wish 토큰 통일+전역 focus-visible(a11y), 리스트 뷰 풀폭 행 카드 폴리시 — 디자이너 재점검 후 끌어옴.


## 알려진 버그 (BUGS)
- [2026-05-31] ✅ 해소(개발자 fix 2026-05-31 08:20) — 캘린더 날짜 클릭 패널의 게임 행(.day-row) 마우스/터치 클릭 시 상세 모달 미동작. dayPanel click 핸들러의 `e.target.closest('.game-card')`→`closest('.day-row, .game-card')`로 확장해 .day-row도 openModal 도달. ☆ 위시/× 닫기 분기 유지, node --check 통과. QA께 라이브에서 (1)마우스 클릭 (2)터치 (3)키보드 Enter 모두 모달 열림 실측 부탁. [이전 보고] 키보드 Enter는 정상이나 마우스/터치만 무반응이라 '고장' 인식 위험. 원인: .day-row openModal이 #games-list 리스너 소속이라 #day-detail-panel의 .day-row 미도달; dayPanel click 리스너는 .game-card만 처리. 디자이너 04:50 Chrome 실측 발견.
- [2026-05-29] ✅ 해소(QA 22:40 라이브 확인) — 개발자 fix(2026-05-29 22:20): `const dayPanel` 선언을 모달 핸들부(L379, 첫 사용 L478 위)로 hoist + Stage4 중복 선언 제거 → TDZ 제거. QA Chrome 실측: gcalen.com 콘솔 ReferenceError 0건, 콘텐츠 정상 렌더 확인. [이전 보고] (배포 사이트 전체 미동작) script.js TDZ 에러: dayPanel을 L477(keydown 리스너)·L525(ESC)에서 참조하나 `const dayPanel`은 L652에 선언 → 모듈 로드 시 'Cannot access dayPanel before initialization' ReferenceError로 스크립트 중단. 결과: 캘린더 0셀, '불러오는 중...' 고착, 통계/리스트/모달 등 전 기능 미동작. 재현: gcalen.com 진입 후 DevTools 콘솔 확인(script.js:477). data/games.json은 29건/05-29T12:35로 정상(데이터 무관). 원인: 21:40 컴팩트행 커밋(8fbbba2)이 dayPanel 리스너를 선언부 위에 추가. node --check는 TDZ 미검출. 권고: `const dayPanel = document.getElementById('day-detail-panel');`를 첫 사용(L477) 위로 이동.
- [2026-05-29] ✅ 해소 — (모바일 캘린더 가로 오버플로) 개발자 fix: grid-template-columns repeat(7,1fr)→repeat(7,minmax(0,1fr)) + .day-game-label min-width:0. 트랙이 최장 게임명 폭으로 확장되던 원인 제거(minmax 0 바닥 + flex/grid 자식 min-width:0). QA 모바일폭 재측정 권고. [이전 보고] 모바일폭에서 .calendar-grid가 컨테이너를 넘쳐 깨짐. 재현: Chrome에서 .calendar-view 폭 360px 제약 시 grid clientWidth 326px vs scrollWidth 727px. 원인: repeat(7,1fr) + 셀 .day-game-label white-space:nowrap → 1fr min-content가 최장 게임명 폭으로 확장(overflow:hidden/ellipsis는 트랙 사이징에 무효). 권고: repeat(7,minmax(0,1fr)) 또는 .day/.day-game-label min-width:0.
- [2026-05-29] ✅ 해소 — (배포 지연) Chrome 실측 결과 배포본 gcalen.com 데이터 갱신 05-29 11:30·20건으로 최신화 확인. 직전 17건/05-28은 WebFetch 자체 캐시였음(실제 배포 정상). 빌드 파이프라인 이상 없음.
- [2026-05-29] ✅ 해소 — (데이터 중복) 프로야구 스피리츠 2026 중복(pro-spirit-2026 / pro-yakyu-spirits-2026). 리서처가 11:00 사이클에 pro-yakyu-spirits-2026 삭제. QA 확인: repo games.json 17건, release_date 2026-07-16 항목 1건(pro-spirit-2026)만 존재. 배포본 gcalen.com/data/games.json도 7/16 1건 확인.
- (코드 버그 없음) 05-27 09:40 QA가 배포본에 구 푸터 문구 잔존 보고 → 소스는 정상, Vercel/CDN 캐시 지연으로 판단. 시간 경과로 해소되었을 가능성 높음. 다음 QA 사이클에서 gcalen.com 재확인만 권고.

## 개선 아이디어 (IDEAS)
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
- [디자이너 23:04] 리스트 카드 칩 스타일 3종 혼재(카테고리=솔리드컬러/플랫폼=회색/장르=accent블루) + 비클릭 장르태그가 링크블루라 클릭가능처럼 보임 → 비인터랙티브 메타칩(플랫폼·장르)을 중립톤으로 통일, accent블루는 실제 링크/날짜에만 한정. 우선순위 보통
- [디자이너 23:04] 리스트 카드 메타 아이콘(⚔ 시리즈·🏛 개발사)이 라벨 없이 이모지만 → 의미 불명확+스크린리더 미스리딩. 짧은 라벨('시리즈:'/'개발사:') 또는 aria-label/title 부여. 우선순위 낮음
- [디자이너 13:02] 긴 리스트/날짜 패널 스크롤 시 날짜 그룹 헤더(.date-group-header)가 사라져 날짜 맥락 상실 → 헤더에 position:sticky;top:0(+불투명 배경)로 그룹 훑는 동안 날짜 고정. 리스트/패널 공통. 우선순위 보통
- [디자이너 13:02] D-day 배지가 임박(D-2)·원거리(D-217) 동일 색 → 근접도 단계화(≤7일 amber/≤30 중립/>30 흐린톤 +임박은 굵게)로 '곧 나올 게임' 시각 강조. 우선순위 낮음
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
- 2026-05-31 08:20 [개발자] 1순위 완료: **[버그·높음] 날짜 패널 .day-row 마우스/터치 클릭 시 상세 모달 미동작** 수정. dayPanel click 핸들러의 `e.target.closest('.game-card')`→`closest('.day-row, .game-card')` 확장(L742). 원인=.day-row openModal이 #games-list 리스너에만 있어 #day-detail-panel 소속 .day-row 미도달. ☆ 위시 토글·× 닫기 분기 유지, 마우스/터치/키보드 동작 통일. script.js 1줄(+0/-0 치환), node --check 통과. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 08:00 [기획자] TODO 큐 4→5개. 디자이너 04:50 라이브 발견 **[버그·높음] 날짜패널 .day-row 마우스/터치 클릭 시 상세 모달 미동작**(키보드 Enter만 정상)을 핵심 인터랙션 correctness 버그로 1순위 등재(IDEAS→큐 승격) + BUGS 활성 등록. 원인=.day-row openModal이 #games-list 리스너 소속이라 #day-detail-panel의 .day-row 미도달, 권고=dayPanel click 핸들러 `closest('.day-row, .game-card')` 확장. 기존 잔여 4건(dot 색+모양 이중인코딩·1건날짜 흡수·셀 면강조·'오늘' 라벨 색통일) 2~5순위로 한 칸씩 밀림. 직전 1순위(D-day KST off-by-one) 개발자 04:20 완료·디자이너 04:50 라이브 ✅. 활성 사용자 요청 0. 코드 미수정(문서만). ※디자이너 a11y 3건(터치타겟<44px·위시별 --wish 토큰·.day-row/전역 focus-visible)은 IDEAS 유지.
- 2026-05-31 04:20 [개발자] 1순위 완료: **[버그·높음] D-day KST off-by-one 수정**. release_date 파싱을 UTC자정(`new Date('YYYY-MM-DD')`)→로컬자정(`parseReleaseDate(str)`=`new Date(str+'T00:00:00')`)으로 통일해 로컬 기준 today와 일치시킴. script.js에 헬퍼 1개 추가 + 기존 `new Date(*.release_date)` 호출 15곳을 `parseReleaseDate(*.release_date)`로 치환(D-day diff/정렬/캘린더 배치 전부 동일 기준). 효과: 오늘 출시가 'D-1'→'D-DAY'로 교정, 캘린더 '오늘' 하이라이트와 모순 해소. 신규 색/기능 없음. node --check 통과. 잔여 TODO 4건 1~4순위로 한 칸씩 당김.
- 2026-05-31 04:00 [기획자] TODO 큐 4→5개. 디자이너 00:50 발견 **[버그·높음] D-day KST off-by-one**(release_date UTC자정 파싱 vs today 로컬자정 → 전 항목 +1, 오늘 출시가 'D-DAY' 대신 'D-1'·캘린더 '오늘' 하이라이트와 모순)을 correctness 버그로 1순위 등재(IDEAS→큐 승격). 기존 잔여 4건(dot 색+모양 이중인코딩·1건날짜 흡수·셀 면강조·'오늘' 라벨 색통일) 2~5순위로 한 칸씩 밀림. 직전 1순위(셀 어포던스+키보드) 개발자 21:20 완료·QA 22:40 ✅ 확인(이미 완료한 기능 이동). 활성 사용자 요청 0. 코드 미수정(문서만). ※디자이너 a11y 2건(위시별 색 토큰화·전역 focus-visible)은 IDEAS 유지, PoE2 신규서버 오태깅은 리서처 도메인.
- 2026-05-30 21:20 [개발자] 1순위 완료: 캘린더 게임 있는 셀에 클릭 어포던스(cursor/hover)+키보드 접근(role/tabindex/aria-label/Enter·Space/focus-visible). 빈 셀 cursor:default. script.js+styles.css
- 2026-05-30 21:00 [기획자] TODO 큐 4→5개 보충. 직전 1순위(지난 날짜 셀 클릭 패널 불일치 버그) 개발자 16:30 완료·QA 01:47 ✅ 확인(이미 완료한 기능으로 이동됨). 잔여 4건(어포던스·dot 이중인코딩·1건날짜 흡수·셀 면강조) 유지. 활성 사용자 요청 0·미해결 코드 버그 0. 디자이너 20:50 발견 중 '오늘 라벨 amber↔today 파랑 색충돌'을 IDEAS→5순위 승격(작고 명확한 CSS-only). 코드 미수정(문서만).
- 2026-05-30 20:50 [디자이너] 라이브 UX/UI 점검. 신규 3건(하단 바로가기 칩 어포던스/위계, 범례↔통계줄 카테고리 중복, '오늘' 라벨 amber↔today 파랑 색충돌) DESIGN_NOTES 등재, 임팩트 2건 IDEAS 추가. 12:50 발견 '지난날짜 패널 불일치'는 개발자 fix 실측 ✅. 코드 미수정(문서만).
- 2026-05-30 16:30 [개발자] 1순위(버그) 완료: 지난 날짜 셀 클릭 시 패널 헤더↔목록 불일치+당일 게임 누락 수정. 원인=getActiveFilteredGames 기간필터 하한이 today라 과거 게임(rel<today) 제외 → 지난 날짜 클릭해도 그날 게임 빠지고 헤더('N건 이후')와 목록 기준 불일치. 수정=getActiveFilteredGames(floorIso) 선택 인자 추가, days>0 하한을 floor(클릭한 날짜)로. renderDayPanel이 getActiveFilteredGames(iso) 호출 → 클릭한 날 포함, 헤더와 일치. 기간 상한(today+days)·카테고리/플랫폼/검색/주/위시 필터는 유지. script.js +2줄/-2줄(주석 1), node --check 통과.
- 2026-05-30 16:00 [기획자] TODO 큐 3→5개 보충. 디자이너 12:50 발견 '지난 날짜 셀 클릭 패널 헤더↔내용 불일치+당일 게임 누락'을 correctness 버그로 1순위 등재, '출시 있는 셀 면 강조'를 IDEAS→5순위 승격. 활성 사용자 요청 0·미해결 버그(코드) 0 확인. 코드 미수정(문서만).
- 2026-05-30 00:30 [개발자] 1순위 완료: [리스트/패널] 날짜 그룹 헤더 sticky 고정. `.date-group-header`(리스트 뷰·날짜 패널 공통 렌더)에 `position:sticky; top:0; z-index:2; background:var(--bg)` + `padding-top:0.4rem` 추가 → 긴 리스트/패널 스크롤 시 날짜 헤더가 뷰포트 상단에 고정되어 날짜 맥락 유지, 불투명 --bg 배경으로 뒤 카드 비침 방지. CSS-only(styles.css 1개 규칙 확장), 신규 색 없이 --bg 토큰 재사용. CSS brace 264/264 균형.
- 2026-05-30 00:20 [개발자] 1순위 완료: [캘린더] 선택 셀 위계 분리. `.day.selected`가 임박 셀(.day-soon)과 동일 amber 보더(#f5a623)를 써 색 충돌하던 것을 보더 제거→`background:rgba(74,144,226,0.18)` 옅은 채움 + `box-shadow:inset 0 0 0 2px var(--accent)` inset 링으로 교체. 오늘=파랑 외곽보더/임박=amber 외곽보더는 유지되어 오늘/임박/선택 3상태가 보더 vs 채움+inset링으로 위계 분리됨. styles.css 1줄 교체(주석 1줄 추가), 신규 색 없이 --accent 재사용. CSS brace 264/264.
- 2026-05-29 23:29 [개발자] 1순위 완료: [캘린더] 날짜 셀 클릭 패널 auto-scroll + 헤더 강조 플래시. renderDayPanel에서 `dayPanel.hidden=false` 직후 `scrollIntoView({behavior:'smooth',block:'start'})` 1회 호출(패널이 폴드 밖에 열려 '반응 없음'처럼 보이던 발견성 문제 해소) + `.day-panel-header`에 `flash` 클래스 재부여(remove→reflow→add)로 0.7s `day-panel-flash` 배경 페이드 강조. `prefers-reduced-motion:reduce` 시 behavior:'auto'·플래시 클래스 미부여·CSS animation:none 3중 가드. 신규 색 없이 --accent 재사용. script.js +6줄, styles.css +4줄(@keyframes 1·.flash·reduced-motion). node --check 통과, CSS brace 264/264.
- 2026-05-29 13:20 [개발자] 1순위 완료: [뷰] 진입 시 기본 뷰 캘린더 고정. 코드 점검 결과 view 토글 초기화부가 이미 `let savedView='calendar'` + `localStorage.getItem(VIEW_KEY) || 'calendar'`로 최초 방문 시 캘린더 기본값을 충족(빈/null/'' 모두 calendar로 폴백, 'list' 저장값은 보존). 기능은 이미 동작하므로 동작 변경 없이 의도 고정용 주석 2줄만 추가(미래 사이클 회귀 방지). script.js 주석 +2, node --check 통과. QA: 시크릿창(localStorage 비움) 진입 시 캘린더 뷰 활성 + 리스트 토글 후 새로고침 시 리스트 유지 실측 권고.
- 2026-05-29 13:06 [기획자] TODO 큐 2→5개 보충. 활성 사용자 요청 0·미해결 버그 0 확인 후 디자이너 높음/보통 제안 3건(날짜패널 auto-scroll·날짜그룹헤더 sticky·셀 키보드 접근)을 작고 명확한 TODO로 큐잉. 운영자 요청(기본 캘린더 뷰) 1순위 유지. 코드 미수정(문서만).
- 2026-05-29 12:30 [개발자] 1순위 완료: [헤더] 좌측정렬+컴팩트화. styles.css만 수정(+14/-5) — `header` 패딩 `2.5rem 1rem 1.5rem`→`1.25rem 1rem 1rem`·`text-align center→left`, `header h1` 2rem→1.7rem·margin-bottom 0.5→0.25rem, 헤더 3개 자식(h1/.subtitle/.last-updated)에 `max-width:1200px;margin:auto;padding:0 1rem`로 `<main>`과 좌측 정렬(gradient는 full-bleed 유지), `.stats-summary` text-align center→left. 상단 수직 높이 절감으로 캘린더가 첫 화면 위로. CSS-only(텍스트/기능 무변경), brace 258/258.
- 2026-05-29 [개발자] [안정성] 에러 fallback 가드 구현(index.html 독립 inline script + .load-fallback CSS). ⚠️ 기획자 11:11 커밋의 STATUS/USER_REQUESTS 회귀를 부모 커밋에서 복구.
- 2026-05-29 22:20 [개발자] 긴급 1순위 완료: 라이브 전체 다운(script.js TDZ dayPanel ReferenceError) 복구. `const dayPanel = document.getElementById('day-detail-panel');`를 모달 핸들 선언부(L379, 첫 사용 keydown L477·ESC L525 위)로 hoist하고 Stage4의 중복 선언(구 L652) 제거. node --check는 TDZ 미검출이라 runtime DOM 스텁으로 top-level 실행해 ReferenceError 0건 확인. script.js만 수정(+1/-1줄). QA에 라이브 콘솔 ReferenceError 0건+캘린더 셀 렌더+날짜 패널/ESC 동작 실측 요청.
- 2026-05-29 22:00 [기획자] 라이브 전체 다운(script.js TDZ dayPanel ReferenceError, QA 21:47 보고)을 긴급 1순위 TODO로 등재. 디자이너 에러상태 fallback(높음)을 2순위 승격. 기존 운영자/디자이너 TODO 3건은 3~5순위로 밀림. 큐 3→5개. 코드 미수정(문서만).
- 2026-05-29 21:40 [개발자] 1순위 완료: [캘린더] 날짜 패널 한 줄 컴팩트 행 전환. renderDayRows() 신설(카드형 대신), 행=색점·게임명·플랫폼·D-day·☆ min-height 44px, 날짜그룹 헤더 유지. 클릭/Enter·Space=openModal·☆=위시 토글 재사용(.day-row 핸들러 추가). 내부 스크롤(60vh/overflow) 제거→인라인 확장. 리스트 뷰 카드 미변경. script.js +renderDayRows·핸들러, styles.css +.day-row 규칙, node --check 통과·CSS brace 254/254.
- 2026-05-29 21:20 [개발자] 1순위(버그) 완료: 통계줄 총개수 vs 카테고리 드롭다운 '전체(N)' 불일치 수정. 원인: updateCategoryCounts의 카운트 base가 기본 기간필터(앞으로 1년)를 적용해 과거 출시 4건을 제외(29→25), 반면 renderStatsSummary는 allGames 전체(29) 집계. 해결: 카운트 base에서 기간 날짜창(days/today 블록) 제거 → 통계와 동일 모집단(allGames). 기본 상태 29=29 일치. 플랫폼/검색/주/위시 필터 카운트 반영 유지, 기간 필터는 renderGames(표시 목록)에만 작동. script.js -약7줄(days/today선언+date블록 제거, 주석 2줄 추가). node --check 통과, 외형/문구 무변경.
- 2026-05-29 [기획자] TODO 큐 3→5개 보충. 디자이너 보고 숫자 불일치(통계 총29 vs 드롭다운 전체25)를 버그로 1순위 등재, IDEAS 선택셀 위계분리를 5순위로 승격. 운영자 요청 3건 순위 유지.
- 2026-05-29 [개발자] 1순위 완료: [캘린더] 출시 0건인 달 빈 상태 안내. 빈 상태 인프라(#calendar-empty + dayMap 카운트 토글)는 기존 존재 → 일반 분기 문구를 기획자 스펙 '이 달 출시 일정이 없어요. ‹ ›로 다른 달을 살펴보세요.'(네비 힌트 포함)로 정렬. index.html 기본 텍스트 1줄 + script.js textContent 1줄 교체(위시리스트 빈 분기 유지). node --check 통과, 외형은 빈 달 안내 문구만 변경.
- 2026-05-29 [개발자] 1순위 완료: [캘린더] 진입 시 '오늘 이후 가장 가까운 출시 달' 자동 초기화. loadData에서 allGames 중 release_date>=오늘 가장 이른 게임의 연/월로 calendarYear/calendarMonth 설정(calendarMonthInitialized 가드로 최초 1회만, 사용자 ‹›네비 후엔 미재설정). 미래 게임 없으면 현재 달 유지. script.js +약14줄(loadData 내 init 블록 + 플래그 선언 1줄), node --check 통과. 외형은 초기 표시 월만 변경.
- 2026-05-29 [기획자] TODO 큐 0→5개 보충(캘린더 초기 월/빈 상태/날짜패널 컴팩트행/헤더 컴팩트/기본 캘린더뷰). 사용자요청 2건(날짜클릭 이후목록·가독성 4테마) 전 항목 완료 확인 → USER_REQUESTS 아카이브 이동.
- 2026-05-29 [개발자] (버그수정) 모바일 캘린더 가로 오버플로 해소. TODO 큐 비어있어 BUGS 등재된 사용자보고+QA검증 버그를 처리. styles.css 2줄: L336 `repeat(7,1fr)`→`repeat(7,minmax(0,1fr))`, L352 `.day-game-label`에 `min-width:0` 추가. minmax(0,*)로 그리드 트랙이 min-content 바닥(=최장 게임명 폭) 밑으로 줄어들 수 있게 하고, nowrap 라벨이 flex/grid 자식으로서 줄어들도록 min-width:0 부여 → ellipsis가 트랙 사이징에 반영됨. node --check 통과, CSS brace 239/239.
- 2026-05-29 17:40 [개발자] [캘린더] 출시 임박(오늘~+7일) 게임 있는 셀 .day-soon 강조 추가 (script.js +2줄, styles.css +1줄, CSS brace 217/217·node --check 통과)
- 2026-05-29 [개발자] 1순위 완료: [푸터] mailto 링크 hover/focus 강조. `footer a:hover, footer a:focus`에 `color:var(--accent)` + `text-decoration:underline` 적용(기존 511~513 색 hover 블록을 focus·밑줄 포함으로 확장). 평상시 톤 #aaa 유지, CSS-only(styles.css 1줄 교체). node/brace 216/216.
- 2026-05-29 16:28 [개발자] 1순위 완료: [모달] 열림/닫힘 페이드+스케일 트랜지션. `.modal` 박스에 `opacity`+`transform:scale` 트랜지션(0.18s ease) 추가, `.modal-overlay[hidden] .modal{opacity:0;scale(0.97)}`로 열림 시 살짝 확대되며 페이드인/닫힘 시 페이드아웃. 오버레이 opacity 페이드는 기존 구현 활용(무변경). `@media(prefers-reduced-motion:reduce)`에 `.modal` 트랜지션 제거+transform:none 분기 추가. JS 무변경(기존 modal.hidden 토글이 `[hidden]` 셀렉터 구동). styles.css +6, CSS brace 216/216, node --check 통과.
- 2026-05-29 16:17 [개발자] 1순위 완료: [리스트뷰] 카드 상단 배너 카테고리 라벨 중복 제거. 이미지 없는 카드의 110px 컬러 그래디언트 배너+카테고리명 텍스트(.card-image-placeholder)를 카테고리 컬러 4px 바(.card-banner)로 교체 → 본문 category-tag와 중복 제거. script.js renderCard placeholder 출력 1줄 교체(텍스트 제거), styles.css +6(.card-banner 기본+카테고리 4색, 기존 색 재사용). 이미지 있는 카드/모달 영향 없음. node --check 통과, CSS brace 213/213.
- 2026-05-29 16:11 [개발자] 1순위 완료: [리스트뷰] 단일 게임 날짜그룹 행 전체 폭. renderGroupedList에서 release_date별 건수(dateCounts) 집계 후 1건인 날짜의 renderCard에 single 플래그 전달 → article에 `single-game` 클래스. CSS `.games-grid .game-card.single-game{grid-column:1/-1}` 추가로 행 전체 폭, 2건↑ 날짜는 기존 그리드 유지. script.js +3, styles.css +4. node --check 통과, CSS brace 208/208.
- 2026-05-29 [개발자] 1순위 완료: [모달] 유튜브 트레일러 검색 링크. openModal 템플릿 modal-actions에 `▶ 트레일러 검색` 앵커 추가(새 탭, `https://www.youtube.com/results?search_query=`+encodeURIComponent(`{name_ko||name_en} 트레일러`)). 임베드 아닌 검색 링크. styles.css에 `.trailer-search-link`(copy-link-btn 톤 동일)+`.modal-actions` flex/gap. script.js 1줄, styles.css +12. node --check 통과, CSS brace 207/207.
- 2026-05-29 17:20 [개발자] 1순위 완료: [정리] 핵심 색 :root CSS 변수 1차 토큰화. styles.css 상단에 `:root` 7개 토큰(--bg/--surface/--border/--text/--text-dim/--text-faint/--accent) 정의, 최다 사용 5색(#0f1115→--bg, #1a1d24→--surface, #2a2e38→--border, #e6e6e6→--text, #4a90e2→--accent)을 var()로 치환. 치환 49곳(border16/accent12/text9/surface7/bg5). --text-dim/--text-faint는 토큰만 선언(치환은 차기). 외형/동작 무변화 리팩터. CSS brace 205/205.
- 2026-05-29 15:56 [개발자] 1순위 완료: [캘린더] 셀 키우고 대표 게임명 1건 텍스트 노출. renderCalendar에서 그날 첫 게임 name_ko를 `.day-game-label`(0.7rem, 1줄 ellipsis, title 툴팁)로 추가, 점(dot)은 보조 유지. `.calendar-grid .day` min-height 60→84(≤480px 44→60), 셀 flex-column 유지로 라벨은 날짜 아래·점은 하단. script.js +3, styles.css 3곳(min-height 2 + .day-game-label 규칙 신설). node --check 통과, CSS brace 204/204.
- 2026-05-29 15:46 [개발자] 1순위 완료: [컨트롤 정리] 퀵칩을 필터 행 끝으로 이동 + 모바일 가로 스크롤. `.quick-chips` section을 `.controls-row` 안(필터 뒤)으로 이동, 데스크탑은 `margin-left:auto`로 우측 끝 정렬. ≤480px에서 `flex-wrap:nowrap;overflow-x:auto`+chip `flex:0 0 auto`로 줄바꿈 대신 가로 스크롤. 동작 로직 미변경(위치/스타일만). index.html(위치 이동), styles.css +6. CSS brace 201/201.
- 2026-05-29 [개발자] 1순위 완료: [컨트롤 정리] 검색바+필터 한 줄 묶기. `.controls-row` flex 래퍼로 `.search-bar`+`.filters`를 같은 행에(align-items:flex-end, gap 1rem, flex-wrap). 자식 margin-bottom 0, 래퍼에 margin-bottom 1.5rem. ≤480px는 flex-direction:column·align-items:stretch로 세로. 검색 input max-width 360px 유지. index.html +3(래퍼 div), styles.css +5. CSS brace 197/197.
- 2026-05-29 [개발자] 1순위 완료: [가독성] 본문/메타 텍스트 대비·크기 상향(CSS only). styles.css 6곳 수정 — .subtitle #888→#9aa0ac, .info h3 1.05→1.1rem, .name-en #777→#8b92a0, .desc #bbb→#cdd2db, .meta-row 0.8→0.85rem·#999→#b3b8c2. 카테고리 태그/링크 색·모달 .name-en 미변경. CSS brace 192/192.
- 2026-05-29 [개발자] 1순위 완료: 캘린더 날짜 클릭 시 'release_date>=클릭일' 게임을 날짜별 그룹핑(renderGroupedList 재활용)으로 패널 표시. 패널 제목 'YYYY.MM.DD (요일) 이후 출시 N건', 현재 카테고리/플랫폼/기간/주/위시리스트/검색 필터 반영(getActiveFilteredGames 헬퍼 추가), 빈 셀도 이후 목록 노출. openModal·위시리스트 토글 재사용, .day-panel-list max-height:60vh 스크롤. script.js 교체, styles.css +2. node --check 통과, CSS brace 192/192.
- 2026-05-29 [기획자] 사용자 요청: 캘린더 날짜 클릭 시 '그날 하루'→'그날 이후 전체 목록'으로 교체(그룹핑 리스트 재활용). 1순위 등록, 기존 가독성 TODO들은 2~6순위로 한 칸씩 밀림.
- 2026-05-29 [기획자] 사용자 직접 요청 '전체적으로 보기 편하게' 접수 → 가독성 4테마(텍스트 대비/컨트롤 정리/캘린더 셀/CSS 변수)를 1시간 단위 TODO 5개로 쪼개 1~5순위 등록. 기존 트레일러 검색은 6순위로 밀림.
- 2026-05-29 15:29 [개발자] 공유 링크 진입 시 ?game={id} 모달 자동 오픈 구현 (loadData 후 openGameFromUrl, script.js +8)
- 2026-05-29 [개발자] 1순위 완료: 상세 모달 '링크 복사' 버튼. modal-actions 버튼 추가 → 클릭 시 location.origin+pathname+`?game={id}` 클립보드 복사(navigator.clipboard, 비지원 시 textarea+execCommand 폴백) + #toast '링크 복사됨' 2초 노출. index.html 미변경(모달 본문은 script.js 템플릿), script.js +~30, styles.css +33. node --check 통과, CSS brace 191/191. ※2순위(공유링크 진입 자동 오픈)가 짝 TODO.
- 2026-05-29 [개발자] 1순위 완료: 검색/필터 0건 빈 상태 안내. 기존 `.empty-state` 구현(commit a191012, styles.css 371-373) 확인 → 일반 분기 메시지를 기획자 스펙 문구('필터를 바꿔보세요.')에 정확히 정렬. script.js 1줄. node --check 통과.
- 2026-05-29 [개발자] 카테고리 통계 요약 한 줄 구현(renderStatsSummary + #stats-summary, 헤더 아래 표시, 현재 데이터 기준 카테고리별 건수+총합). index.html +2, script.js +17, styles.css +7. node --check 통과, styles.css brace 186/186.
- 2026-05-29 [기획자] 빈 TODO 큐 → 구체 TODO 5개 확정(통계 요약/빈 상태/링크 복사/공유 자동오픈/트레일러 검색). 개발자 3사이클 대기 해소. IDEAS 통계·공유·트레일러 항목을 작은 단위로 승격.
- 2026-05-29 [개발자] 리스트 뷰 출시일별 그룹핑 구현(renderGroupedList + .date-group-header). 기획자 미지정 상태라 TODO 후보 큐 최상단(출시일 그룹핑)을 선택해 진행함을 명시. script.js +15, styles.css +10. node --check 통과.
- 2026-05-29 [개발자] 큐 재정비: 캘린더 3·4·5단계+검색+카테고리 뱃지가 코드에 이미 구현됨을 확인(node --check 통과, 스타일 존재) → 완료한 기능으로 이동. 코드 변경 없음(문서만 갱신).
- 2026-05-29 [기획자] 푸터 교체 완료 처리(완료한 기능으로 이동, USER_REQUESTS 아카이브). 캘린더 3·4·5단계를 1~3순위로 승격, 검색·카테고리 개수 뱃지 추가하여 큐 5개 유지.
- 2026-05-27 09:40 [QA] 푸터 소스 검증 통과, 배포 캐시 잔존 보고
- 2026-05-27 09:30 [개발자] 푸터 교체 완료 (운영자 정보 2줄)
- 2026-05-27 08:30 [기획자] 사용자 직접 요청 반영: 푸터 교체를 1순위로 끼움
- 2026-05-27 08:20 [개발자] 캘린더 2단계 완료
- 2026-05-27 07:50 [개발자] 캘린더 1단계 완료
- 2026-05-27 07:30 [기획자] 방향 전환: 메인 뷰를 월간 캘린더로
- 2026-05-27 07:20 [개발자] 게임 카드 클릭 시 상세 모달 구현
- 2026-05-27 [Phase 0.5] RAWG API 제거, 정적 JSON + 리서처 Claude 구조로 전환
- 2026-05-27 [Phase 0] 초기 스켈레톤 + GitHub/Vercel 셋업
