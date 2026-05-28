# 프로젝트 현재 상태

마지막 갱신: 2026-05-28 09:20 KST (개발자 사이클 — 위시리스트 칩 개수 뱃지 완료)

## 현재 단계
Phase 1 — 정적 JSON 기반 게임 출시 캘린더 (3개 카테고리)

## 🔁 방향 전환 (2026-05-27 07:30)
사이트 이름이 "게임 출시 **캘린더**"인데 그동안 카드 그리드만 있었음.
유저 피드백 반영: **메인 뷰를 월간 캘린더로 전환**, 카드 그리드는 "리스트 뷰" 토글로 보존.
캘린더는 한 사이클에 전부 못 만드니까 5단계로 쪼갰음. 한 사이클당 1단계.

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
- [x] 푸터 교체: 운영자 정보 표시 (© 2026 게임 출시 캘린더 (gcalen.com) + 문의 mailto 링크), AI 협업 문구·GitHub 링크 제거
- [x] 월간 캘린더 뷰 3단계: 이전/다음 달 네비게이션 (‹ / › 버튼 + '오늘로'), year/month 상태 변수 도입, 셀의 점/오늘 강조 새 월 기준으로 재계산
- [x] 월간 캘린더 뷰 4단계: 셀 클릭 → 그날 게임 목록 패널 → 게임 클릭 시 기존 상세 모달 재사용 (빈 날짜 안내, 이전/다음 달 셀 클릭 시 해당 월로 이동, 같은 셀 재클릭 시 패널 토글)
- [x] 월간 캘린더 뷰 5단계: 캘린더/리스트 뷰 토글 (상단 📅/📋 버튼, `gcalen.view` localStorage 저장·복원, 기본값 calendar, 기존 카드 그리드는 리스트 뷰로 보존)
- [x] 검색 기능: 헤더 input (`#search-input`), `name_ko`/`name_en` 부분 일치(대소문자 무시), 기존 카테고리/플랫폼/기간 필터와 AND 결합, 200ms 디바운스
- [x] 카테고리 필터 개수 뱃지: `<select id="category-filter">` 옵션 라벨에 `(N)` 표시, 검색/플랫폼/기간 필터 반영, 카운트 0이면 회색(#666) dim 처리 (옵션 클릭은 가능)
- [x] 빈 상태 안내 메시지: 리스트 뷰 0건일 때 "조건에 맞는 게임이 없어요. 필터를 조정해 보세요." (`.empty-state` 클래스, 기존 `#999` 톤), 캘린더 뷰는 현재 월에 게임 0건일 때 그리드 하단에 "이 달에는 출시 예정 게임이 없어요." 1줄 (`#calendar-empty`)

- [x] 위시리스트 1단계: 카드 우상단 ⭐ 토글 버튼(빈★/채워진★), 클릭 시 `localStorage 'gcalen.wishlist'` 배열에 game.id add/remove, 페이지 로드 시 Set으로 복원해 카드 렌더 시 활성 상태 반영. 상세 모달 열림 방지 위해 별 클릭 시 `event.stopPropagation()`. 필터링은 다음 단계(IDEAS의 위시리스트 2단계). 색은 기존 강조 톤(`#f5b400`)만 사용.
- [x] 이번 주/다음 주 빠른 필터 칩: `.filters` 아래 `.quick-chips` 섹션에 `이번 주 출시`/`다음 주 출시` 버튼 2개. `weekFilter` 상태(`null|'this'|'next'`) + `getWeekRange(offset)` 헬퍼(월~일 범위, end는 다음 월요일 00:00 exclusive)로 release_date 매칭. `renderGames()` 필터 체인과 `updateCategoryCounts()` base에 모두 반영(기존 카테고리/플랫폼/기간/검색과 AND 결합). 토글식 — 같은 칩 재클릭 시 해제, 두 칩 중 하나만 활성 가능. 활성 시 `.chip-btn.active` (`.view-toggle-btn.active`와 동일한 파란 보더 + 밝은 배경 톤).
- [x] 캘린더 카테고리 색 범례: `.calendar-view` 내부, `.calendar-header` 아래·그리드 위에 `#calendar-legend` 4색(국내 모바일/국내 PC/콘솔/글로벌 대작/신규 서버) 범례 1줄 노출. 점 색은 기존 `.day-dot` 4색 그대로 재사용(신규 색 X). `flex-wrap:wrap`으로 모바일 줄바꿈 허용. 리스트 뷰 전환 시 `applyView()`에서 명시 토글 + 부모 `.calendar-view` hidden 캐스케이드 양쪽으로 안전 처리.
- [x] 위시리스트 2단계: `.quick-chips`에 `#chip-wishlist` (`위시리스트만 보기`) 칩 추가. `wishlistOnly` 불리언 상태 신설, `renderGames()` 필터 체인 및 `updateCategoryCounts()` base 양쪽에 `if (wishlistOnly && !wishlist.has(g.id)) return false;` 분기 추가. 이번 주/다음 주 칩과 **독립 토글**(셋 다 동시 활성 가능). 활성 시 기존 `.chip-btn.active` 스타일 재사용(신규 색·CSS X). 위시리스트 비어있을 때 칩 켜면 기존 `.empty-state` 메시지 자동 노출. 새로고침 시 휘발(저장 X — 이번 주/다음 주 칩과 동일 정책).
- [x] 푸터에 데이터 마지막 갱신일 표시: `index.html` 푸터 운영자 정보 2줄 아래에 `<p class="footer-updated">데이터 마지막 갱신: <span id="footer-updated-date">—</span></p>` 추가. `script.js`에 `footerUpdatedEl`/`footerUpdatedWrap` 참조 + `loadData()` 응답 파싱 직후 분기 신설: `data.last_updated` ISO 문자열을 `new Date(...)`로 파싱, 유효하면 `YYYY-MM-DD HH:mm` 형식(브라우저 로컬 TZ, 한국 사용자 → KST)으로 텍스트 주입 + `hidden=false`, 비어있거나 `isNaN`이면 `<p>` `hidden=true`. `styles.css` 끝에 `.footer-updated`(#999, 0.8rem, 0.4rem margin-top) + `[hidden]` 보강 2줄. 신규 색·폰트 도입 X(기존 푸터 #666/#999 톤만 사용).
- [x] 카드 hover 시 D-Day 라벨 펄스 강조 (CSS-only): `.game-card:hover .dday`에 `@keyframes pulse-dday` (`transform: scale(1)→1.06→1`, 1s ease-in-out infinite) 적용. `display:inline-block`로 inline `<span>`에서도 transform 적용 보장. 신규 색 도입 X (기존 D-Day 톤 그대로). `@media (prefers-reduced-motion: reduce)`에서 `animation: none` 분기로 접근성 보장. JS 변경 0.

- [x] 캘린더 day-detail-panel ESC 키로 닫기: `script.js`의 기존 모달 ESC 핸들러를 확장. `e.key !== 'Escape'`이면 조기 return, `!modal.hidden`이면 기존대로 `closeModal()` 호출 후 return(모달 우선). 그 외에 `dayPanel && !dayPanel.hidden`이면 `dayPanel.hidden = true; selectedDay = null; renderCalendar();`로 패널 닫기 + 셀의 `.selected` 클래스 제거. JS 단일 파일, +9/-1.
- [x] 위시리스트 칩에 개수 뱃지 표시: `#chip-wishlist` 버튼 라벨을 `위시리스트만 보기 (N)` 형식으로 동적 갱신. `updateWishlistChipLabel()` 헬퍼 신설 — 첫 호출 시 원본 라벨을 `chipWish.dataset.baseLabel`에 캐싱, 매번 `baseLabel + ' (' + wishlist.size + ')'`로 textContent 재할당. 페이지 로드 시 1회 호출 + 카드 별 토글 click 핸들러의 `saveWishlist()` 직후에도 호출(별 토글 시 라벨 즉시 갱신). N=0이어도 `(0)` 그대로 표시. 칩 활성/비활성 시각 변화 없음(스타일·HTML·CSS 변경 0). 변경: script.js +8/-0.

## 다음 TODO (우선순위 순)

### 1순위 — 상세 모달 헤더에 위시리스트 별 토글 버튼 추가
- 게임 상세 모달(`#game-modal`) 헤더의 제목(`#modal-title`) 오른쪽에 `<button class="modal-wishlist-btn">★/☆</button>` 추가.
- 카드의 별과 동일한 동작: 클릭 시 `wishlist` Set add/remove + `saveWishlist()` + 같은 게임의 카드 별(`.wishlist-btn[data-game-id="..."]`)도 in-place 동기화 + 칩 라벨 갱신(2순위와 연동).
- 비활성=`☆`+`#666`, 활성=`★`+`#f5b400` (기존 톤 그대로). 신규 색 도입 X.
- 모달 열 때 현재 게임 id에 대해 `wishlist.has(id)`로 초기 상태 반영.
- 변경: index.html (모달 구조 살짝 수정), script.js, styles.css. 총 +20 LOC 내외.

### 2순위 — 카드 image_url null 일 때 placeholder 처리
- 현재 `game.image_url` 사용 위치를 점검(없으면 카드/모달에서 누락된 영역이 있을 수 있음). 카드 또는 모달의 이미지 영역이 비어있을 때 카테고리 색 그라데이션 placeholder를 표시.
- 카테고리별 색은 기존 `.day-dot.category-*` 4색 재사용(#81c784/#64b5f6/#ba68c8/#ff8a65). 그라데이션은 해당 색 → 30% 어두운 색 linear-gradient(135deg).
- placeholder 안에는 카테고리 한글 라벨 텍스트(`#ddd`, 0.85rem) 1줄 중앙 정렬. 신규 색 도입 X.
- 클릭/접근성은 기존 카드와 동일하게 유지(별도 cursor 변경 없음).
- 변경: script.js + styles.css. 총 +20 LOC 내외.

### 3순위 — 캘린더 요일 헤더 한국식 색상 (CSS-only)
- 캘린더 그리드의 요일 헤더(`일/월/화/수/목/금/토`) 텍스트 색을 한국식으로: 일요일=빨강 톤(#e57373, 기존 D-Day 톤), 토요일=파랑 톤(#64b5f6, 기존 PC/콘솔 카테고리 색). 그 외 요일은 기존 톤 유지.
- 셀 자체(`.day`)의 텍스트 색은 변경하지 않음 — 헤더만(과한 시각적 잡음 방지). 신규 색 도입 X(기존 팔레트에서 차용).
- 구현: `.weekday:nth-child(1) { color:#e57373 }` / `.weekday:nth-child(7) { color:#64b5f6 }` 2줄. JS/HTML 변경 0.
- 변경: styles.css +4 LOC 내외.

## 알려진 버그 (BUGS)
- [2026-05-27] ✅ (수정됨 12:20, QA 검증 12:40) 캘린더 4단계 배포 후 사이트 전체 렌더 실패 — `script.js`에서 `selectedDay`를 TDZ 상태로 참조하던 문제. `let selectedDay = null;` 선언을 모듈 최상단(line 12, `let categories = {};` 직후)으로 끌어올려 해결. QA 재검증 완료: 콘솔 에러 0, 캘린더/패널/네비/모달 7개 요건 모두 정상 동작.

## 개선 아이디어 (IDEAS)
- 출시일별 그룹핑 (리스트 뷰 옵션)
- 한국 게임 vs 글로벌 게임 통계 차트
- 게임 트레일러 YouTube 임베드
- 카카오톡 공유 기능
- 일간/주간 뷰 (월간 안정화 후)

## 최근 변경 로그
- 2026-05-28 09:20 [개발자] 위시리스트 칩에 개수 뱃지 표시 완료: `script.js`에 `updateWishlistChipLabel()` 헬퍼 신설(파일 끝, `chipWish` click 핸들러 직후) — `chipWish.dataset.baseLabel`이 없으면 첫 호출 시 현재 `textContent.trim()`을 캐싱, 매번 `baseLabel + ' (' + wishlist.size + ')'`로 라벨 재할당. 모듈 로드 직후 1회 호출(초기 라벨 세팅). `gamesList` click 핸들러의 별 토글 분기에서 `saveWishlist()` 직후 `updateWishlistChipLabel()` 추가 호출 — 별 ★/☆ 토글 시 라벨 즉시 갱신(즉, localStorage 갱신 시점과 동기). N=0이어도 `(0)` 그대로 표시(대시보드 일관성 유지). 칩 활성/비활성 시각 변화 없음(`.active` 클래스 토글은 기존 `applyWishlistChip()`이 그대로 담당). HTML/CSS 변경 0 — `<button>` 텍스트만 동적 갱신. 함수 선언(function declaration)이므로 호이스팅으로 forward 참조 안전(런타임 호출 시점엔 `chipWish` const도 이미 초기화 완료). 변경: script.js +8/-0 (50줄 한참 미달, 예상치 +10과 거의 일치).
- 2026-05-28 08:20 [개발자] 캘린더 day-detail-panel ESC 닫기 완료: `script.js`의 기존 keydown 핸들러를 확장 — `e.key !== 'Escape'` 조기 return, `!modal.hidden`이면 `closeModal()` 후 return(**모달 우선** 정책 유지), 그 외 `dayPanel && !dayPanel.hidden`이면 `dayPanel.hidden = true; selectedDay = null; renderCalendar();` 실행해 패널 닫기 + 셀의 `.selected` 클래스 제거. `renderCalendar()` 재호출로 `selectedDay === iso` 비교가 모두 false가 되어 자연스럽게 `.selected`가 사라짐(기존 토글식 셀 재클릭과 동일 경로). 모달이 열려있을 땐 기존 단일 ESC 동작(모달만 닫힘) 그대로 보존 — 사용자가 다시 ESC를 누르면 그때 패널이 닫힘. `dayPanel` 참조는 keydown 콜백 내부라 이벤트 발생 시점엔 이미 모듈 전체 평가가 끝나 있어 TDZ 무관(추가로 null-guard `dayPanel &&` 포함). 변경: script.js +9/-1 = 총 +8 (50줄 한참 미달, 예상치 +10과 거의 일치).
- 2026-05-28 08:00 [기획자] TODO 큐 1개 → 5개로 보충: 캘린더 패널 ESC 닫기(1, 기존 유지) + 위시리스트 칩 개수 뱃지(2) + 상세 모달 별 토글(3) + 카드 image_url placeholder(4) + 캘린더 요일 헤더 한국식 색(5). 위시리스트 2단계가 안정화된 흐름을 이어 위시리스트 UX 보강 2건(2,3순위) 추가. image_url placeholder는 데이터에 null 값이 다수라 시각 마감용으로 끌어옴. 완료 처리: 0개(직전 카드 hover D-Day 펄스는 PROJECT_STATUS 완료 섹션에 이미 반영됨, QA ✅ 07:40). IDEAS 이동: 0개(3사이클째 머문 항목 없음). IDEAS에서 끌어옴: 0개(IDEAS의 출시일별 그룹핑/통계 차트/YouTube 임베드/카카오톡 공유/일간 뷰는 모두 50줄 초과 가능성 있어 보류). 사용자 요청 처리: 활성 0개, 보류 SEO는 지시대로 손대지 않음.
- 2026-05-28 07:20 [개발자] 카드 hover D-Day 펄스 강조(CSS-only) 완료: `styles.css` 끝에 `@keyframes pulse-dday`(`transform: scale(1)→1.06→1`) 정의 + `.game-card:hover .dday { display:inline-block; animation: pulse-dday 1s ease-in-out infinite; }` 추가. inline `<span>`에서도 transform 적용되도록 `display:inline-block` 명시. 신규 색 도입 X (기존 D-Day `.dday`/`.dday.soon`/`.dday.today`/`.dday.past` 톤 그대로 — 색 변경 0). `@media (prefers-reduced-motion: reduce) { .game-card:hover .dday { animation: none; } }` 분기로 모션 민감 사용자 접근성 보장. JS/HTML 변경 0. 변경: styles.css +13/-0 = 총 +13/-0 (50줄 한참 미달, 예상치 +10과 거의 일치 — 주석 1줄 + reduced-motion 분기로 약간 늘어남).
- 2026-05-28 06:20 [개발자] 푸터 데이터 마지막 갱신일 표시 완료: `index.html` 푸터에 `<p class="footer-updated">데이터 마지막 갱신: <span id="footer-updated-date">—</span></p>` 한 줄 추가(기존 운영자 정보 2줄 바로 아래). `script.js`에 `footerUpdatedEl`/`footerUpdatedWrap` 모듈 상단 참조 + `loadData()` 내 `lastUpdatedEl` 블록 직후 분기 신설: `data.last_updated` ISO → `new Date(...)` 파싱, 유효(`!isNaN`) 시 `pad(n)` 헬퍼로 `YYYY-MM-DD HH:mm`(브라우저 로컬 TZ — KST 사용자는 그대로 KST) 주입 + `wrap.hidden=false`, 비어있거나 파싱 실패 시 `wrap.hidden=true`. `styles.css` 끝에 `.footer-updated { color:#999; margin-top:0.4rem; font-size:0.8rem; }` + `.footer-updated[hidden] { display:none; }` 2줄 추가(신규 색 X — 기존 푸터 #666/#999 톤 그대로). 변경: index.html +1/-0, script.js +13/-0, styles.css +3/-0 = 총 +17/-0 (50줄 한참 미달, 예상치 +1/+6/+2=9와 거의 일치 — 안전한 fallback 로직 더해져 약간 늘어남).
- 2026-05-28 05:20 [개발자] 위시리스트 2단계(`위시리스트만 보기` 토글 칩) 완료: `index.html` `.quick-chips`에 `<button id="chip-wishlist" class="chip-btn">위시리스트만 보기</button>` 세 번째 칩 추가. `script.js`에 `let wishlistOnly = false` 상태(`weekFilter` 아래) + `renderGames()` 필터 체인과 `updateCategoryCounts()` base 양쪽에 `if (wishlistOnly && !wishlist.has(g.id)) return false;` 분기 추가. 파일 끝에 `chipWish` 참조 + `applyWishlistChip()` 헬퍼(클래스+aria-pressed 동기화) + click 핸들러(독립 토글). 이번 주/다음 주 칩과 셋 다 동시 활성 가능(별도 변수). 활성 시 기존 `.chip-btn.active` 스타일 그대로 재사용(신규 CSS X). 위시리스트 비어있을 때 켜면 기존 `.empty-state` 자동 노출. 새로고침 시 휘발(이번 주/다음 주 칩과 동일 정책). 변경: index.html +1/-0, script.js +13/-0, styles.css +0/-0 = 총 +14/-0 (50줄 한참 미달, 예상치 +1/+15/+0=16과 거의 일치).
- 2026-05-28 04:20 [개발자] 캘린더 카테고리 색 범례 완료: `index.html` `.calendar-view` 내부, `.calendar-header` 바로 아래에 `<div id="calendar-legend" class="calendar-legend">` 신설(4색 점+한글 라벨 — 국내 모바일/국내 PC/콘솔/글로벌 대작/신규 서버). `styles.css` 끝에 `.calendar-legend`(flex + flex-wrap + center + #aaa 텍스트 + 0.78rem) / `.legend-item`(inline-flex gap) / `.legend-dot`(8px 원형) / 카테고리별 `.legend-dot.category-*` 4색(`.day-dot`과 동일한 #81c784/#64b5f6/#ba68c8/#ff8a65) 9블록 추가. `script.js`에 `calendarLegendEl` 참조 + `applyView()` 내 `calendarLegendEl.hidden = (v !== 'calendar')` 명시 토글. 부모 `.calendar-view` hidden 캐스케이드와 이중 안전. 변경: index.html +6/-0, script.js +2/-0, styles.css +10/-0 = 총 +18/-0 (50줄 한계 미달).
- 2026-05-28 04:00 [기획자] TODO 큐 1개 → 5개로 보충: 캘린더 카테고리 색 범례(1) + 위시리스트 2단계 필터 칩(2) + 푸터 데이터 갱신일 표시(3) + 카드 hover D-Day 펄스(4) + 캘린더 패널 ESC 닫기(5). 위시리스트 2단계와 카드 hover 카운트다운은 IDEAS에서 끌어옴(IDEAS에서 제거). USER_REQUESTS의 푸터 교체는 이미 완료·QA ✅이므로 활성 → 처리 완료 아카이브로 이동. SEO 보류 요청은 그대로 보류. 완료 처리: 0개(직전 빠른 필터 칩은 PROJECT_STATUS 완료 섹션에 이미 반영됨, QA ✅ 03:40).
- 2026-05-28 02:40 [개발자] 이번 주/다음 주 빠른 필터 칩 완료: `index.html`에 `.filters` 바로 아래 `.quick-chips` 섹션 신설, `<button id="chip-this-week"|"chip-next-week" class="chip-btn">` 2개. `script.js`에 `let weekFilter = null` 상태 + `getWeekRange(offset)` 헬퍼(월요일 시작, end는 다음 월요일 00:00 exclusive — Sunday 포함). `renderGames()` 필터 체인과 `updateCategoryCounts()` base 양쪽에 `weekFilter` 분기 추가(기존 카테고리/플랫폼/기간/검색과 AND). 칩 click 핸들러는 토글식 — 같은 칩 재클릭 시 해제, 다른 칩 클릭 시 교체(둘 중 하나만 활성). `applyWeekChips()`로 `.active` 클래스 + `aria-pressed` 일괄 동기화. `styles.css`에 `.quick-chips` flex 줄 + `.chip-btn` 기본 톤(기존 `.view-toggle-btn`과 동일 #2a2e38/#3a3e48) + `.chip-btn.active`(파란 보더 #4a90e2 + 밝은 배경 rgba(74,144,226,0.15) — `.view-toggle-btn.active`와 정확히 같은 톤). 변경: index.html +5/-0, script.js +32/-0, styles.css +7/-0 = 총 +44/-0 (50줄 한계 미달).
- 2026-05-28 02:20 [개발자] 위시리스트 1단계 완료: `script.js`에 `WISHLIST_KEY='gcalen.wishlist'` 상수와 `wishlist` Set 초기화(localStorage JSON 파싱, try/catch), `saveWishlist()` 헬퍼 신설(페이지 로드 1회). `renderCard()`의 `.card-header` 우측을 `.card-header-right` 그룹으로 감싸 기존 D-Day 라벨 옆에 `<button class="wishlist-btn">★/☆</button>` 추가, 활성 시 `.active` 클래스 + `★` + `aria-pressed="true"`. `gamesList` click 핸들러 맨 앞에 `.wishlist-btn` 가로채기 분기 — `stopPropagation()` 후 Set add/remove + 클래스/텍스트/aria-pressed in-place 토글 + `saveWishlist()`. 재렌더 없이 즉시 UI 반영. `styles.css` 끝에 `.card-header-right`(flex gap 0.5rem), `.wishlist-btn`(transparent, color #666, font 1.15rem), hover/active/`.active` 색은 모두 기존 #f5b400 톤만 사용. 필터링은 미포함(다음 단계). 변경: script.js +20/-1, styles.css +7/-0 = 총 +27/-1 (50줄 한계 미달).
- 2026-05-28 01:20 [개발자] 빈 상태 안내 메시지 완료: 리스트 뷰는 기존 `<p class="loading">…</p>`를 `<p class="empty-state">조건에 맞는 게임이 없어요. 필터를 조정해 보세요.</p>`로 교체 (텍스트 + 클래스 변경). 캘린더 뷰는 `#calendar-empty` 1줄 신설(`.calendar-view` 하단, 기본 hidden), `renderCalendar()` 끝에서 `dayMap` 키 개수가 0이면 노출. CSS는 `.empty-state` (#999 톤) + `.games-grid .empty-state {grid-column:1/-1}` + 캘린더용 `.empty-state--inline` (셀 카드와 동일 다크 박스). 변경: index.html +1, script.js +3/-1, styles.css +5/-0 = 총 +9/-1.
- 2026-05-28 00:29 [개발자] 카테고리 필터 개수 뱃지 완료: `updateCategoryCounts()` 신설 — 검색/플랫폼/기간 필터 적용된 base 집합에서 카테고리별 카운트 집계 후 `<option>` 라벨을 `원라벨 (N)`으로 갱신, "전체"는 base.length, 카운트 0은 inline `color:#666` dim. `renderGames()` 첫 줄에서 호출, 옵션 원본 라벨은 `dataset.baseLabel`에 캐싱. 변경: script.js +32/-0 (단일 파일)
- 2026-05-28 00:00 [기획자] TODO 큐 2개 → 5개로 보충: 위시리스트 1단계(별 토글+localStorage), 이번 주/다음 주 빠른 필터 칩, 캘린더 카테고리 색 범례 3건 추가. 위시리스트·빠른 필터 칩은 IDEAS에서 끌어옴. 위시리스트 2단계(필터 칩)는 IDEAS에 신규 등재. 직전 사이클 검색 기능은 QA ✅로 완료 섹션에 이미 반영됨.
- 2026-05-27 22:46 [개발자] 검색 기능 완료: 헤더 search input (`#search-input`, view-toggle 아래/필터 위, max-width 360px), `name_ko`+`name_en` 합쳐 소문자 부분 일치, 200ms setTimeout 디바운스, 기존 카테고리/플랫폼/기간 필터와 AND 결합. 입력값 비우면 검색 해제. 모바일 풀폭. 변경: index.html +4, styles.css +7, script.js +17 = 총 +28/-0 (50줄 한계 미달)
- 2026-05-27 22:20 [개발자] 캘린더 5단계 완료: 필터 줄 위에 `📅 캘린더` / `📋 리스트` 토글 두 개, 활성 뷰만 표시(다른 뷰 hidden), `localStorage 'gcalen.view'`로 선택값 저장·새로고침 복원, 기본값 `calendar`. 기존 카드 그리드는 리스트 뷰로 보존, 새 색/폰트 미도입(다크 팔레트 재사용)
- 2026-05-27 12:40 [QA] ✅ TDZ 핫픽스 배포 검증 완료 — 콘솔 에러 0, 5/27 today/점/카드/패널/네비/모달 7개 요건 모두 통과. BUGS 항목 클로즈.
- 2026-05-27 12:20 [개발자] 🔴→✅ 핫픽스: 캘린더 4단계 TDZ 버그 수정 — `let selectedDay = null;` 선언을 script.js 268번 줄에서 12번 줄(`let categories = {};` 직후)로 hoist. 모듈 상단 첫 `renderCalendar()` 호출 시점에 변수가 초기화되어 있어 `ReferenceError: Cannot access 'selectedDay' before initialization` 해소. 변경: script.js 단일 파일, 한 줄 이동 (실질 +1/-1)
- 2026-05-27 11:20 [개발자] 캘린더 4단계 완료: 셀 클릭 → `#day-detail-panel`에 그날 게임 카드(색 박스+이름+카테고리 뱃지) 렌더, 같은 셀 재클릭 시 패널 토글, 게임 카드 클릭 시 기존 openModal() 재사용, 빈 날짜는 안내 문구, 이전/다음 달 dim 셀 클릭 시 해당 월로 이동, 선택 셀 노란 하이라이트
- 2026-05-27 20:00 [기획자] TODO 큐 2개 → 5개로 보충 (캘린더 4·5단계 + 검색 + 카테고리 개수 뱃지 + 빈 상태 안내). 모호했던 "검색/위시리스트/카테고리 개수 뱃지/빈 상태 안내"를 작고 명확한 단위로 쪼갬. 위시리스트는 IDEAS로 이동(캘린더 안정화 우선).
- 2026-05-27 09:50 [개발자] 캘린더 3단계 완료: ‹ / › 이전·다음 달 버튼 + '오늘로' 버튼, year/month 상태 변수 도입, 점·오늘 강조 모두 표시 중인 월 기준으로 재계산
- 2026-05-27 09:30 [개발자] 푸터 교체 완료: 운영자 정보 2줄 표시 (© 2026 게임 출시 캘린더 (gcalen.com) + 문의 mailto 링크), AI 협업 문구·GitHub 링크 제거, CSS 미수정
- 2026-05-27 08:30 [기획자] 사용자 직접 요청 반영: 푸터 교체를 1순위로 끼움(캘린더 3단계는 2순위로 밀림)
- 2026-05-27 08:20 [개발자] 캘린더 2단계 완료: 각 .day 셀에 그날 출시 게임 카테고리 색상 점 표시 (최대 3개 + "+N", title 툴팁, 현재 월 셀만)
- 2026-05-27 07:50 [개발자] 캘린더 1단계 완료: 현재 월(2026년 5월) 7x6 그리드 뼈대, 오늘 셀 강조, 이전/다음 달 칸 dim
- 2026-05-27 07:30 [기획자] 방향 전환: 메인 뷰를 월간 캘린더로 → 5단계 분할, 이번 사이클은 뼈대만
- 2026-05-27 07:20 [개발자] 게임 카드 클릭 시 상세 모달 구현
- 2026-05-27 [Phase 0.5] RAWG API 제거, 정적 JSON + 리서처 Claude 구조로 전환
- 2026-05-27 [Phase 0] 초기 스켈레톤 + GitHub/Vercel 셋업
