

---

_(오래된 137 개 항목은 archive/CHAT_2026-05.md로 이동됨)_

## [2026-06-02 10:29] [개발자]
완료: 1순위 [외형·히어로] 메인 헤더 풀블리드 그라데이션 히어로 밴드 + h1 그라데이션 텍스트.
변경된 파일: styles.css, index.html, PROJECT_STATUS.md, CHAT.md
비고: header에 radial+linear 2겹 히어로 그라데이션 밴드(padding 2.2/1.8rem), h1 2.2rem background-clip:text 그라데이션 텍스트. 🎮는 .h1-emoji span으로 clip 제외해 원색 유지. 좌측정렬·컴팩트 기조 유지. CSS-only 중심, node --check 통과, CSS brace 283/283 균형. 다른 TODO 미터치. QA 권고 — 라이브에서 밴드 그라데이션·h1 그라데이션 텍스트·이모지 원색·모바일 폭 회귀 여부 실측.

## [2026-05-30 00:50] [디자이너]
운영자 요청 접수: 이모지 쓰지 말고 SVG로 -> 클린 미니멀과 한 묶음.
이모지 전수 인벤토리(헤더🎮/토글📅📋/모달📅🛠️🏢📄▶🔗/위시★☆/네비‹›) 작성 후, 인라인 SVG 스프라이트+use(currentColor, Lucide톤) 전환 제안 4개 등록. IDEAS에 1개 올림.
규칙화 권고: 새 이모지 추가 금지를 AGENTS.md에 명문화(디자이너는 권한상 직접 수정 안 함 -> 기획자/개발자에게 위임).

## [2026-05-30 00:30] [디자이너]
운영자 요청 접수: 디자인 '더 트렌디하게' -> 방향 **클린 미니멀(Linear/Vercel 풍)** 확정.
DESIGN_NOTES에 구체 실행안 5개(폰트+위계 / 라운드·여백 토큰 / hairline+미세깊이 / 컨트롤 일관화·펄스제거 / 캘린더 색절제) 등록, IDEAS에 상위 2개(폰트·라운드) 올림.
라이트/다크 토글도 운영자요청으로 IDEAS 등록(선행: 색 토큰화 완료, 후속 우선순위). 라운드·색 토큰화가 라이트모드 선행작업과 겹쳐 묶어 처리 권고.

## [2026-05-30 00:30] [개발자]
완료: 1순위 TODO — [리스트/패널] 날짜 그룹 헤더 sticky 고정 (디자이너 '보통').
- 긴 리스트 뷰/날짜 클릭 패널을 스크롤할 때 `.date-group-header`(날짜 그룹 헤더)가 위로 사라져 날짜 맥락을 잃던 문제 해소.
- `.date-group-header`에 `position:sticky; top:0; z-index:2; background:var(--bg)` + `padding-top:0.4rem` 추가 → 그룹을 훑는 동안 날짜 헤더가 뷰포트 상단에 고정.
- 리스트 뷰와 날짜 패널 모두 같은 `.date-group-header`를 렌더하므로 한 규칙으로 공통 적용됨. 날짜 패널 컨테이너(.day-detail-panel)도 `var(--bg)` 배경이라 불투명 배경이 정확히 매칭되어 뒤 카드 비침 없음.
- CSS-only, 신규 색 없이 기존 --bg 토큰 재사용.
변경된 파일: styles.css, PROJECT_STATUS.md, CHAT.md
비고: CSS brace 264/264 균형 확인. QA께 — (1) 리스트 뷰에서 여러 날짜 그룹을 스크롤할 때 현재 날짜 헤더가 상단에 고정되다 다음 그룹 헤더로 교체되는지, (2) 날짜 클릭 패널의 날짜 헤더도 스크롤 중 고정되는지, (3) 고정된 헤더 뒤로 카드 텍스트가 비치지 않는지(불투명) 실측 부탁드립니다. 다음 사이클 1순위는 [접근성] 날짜 셀 클릭 어포던스 + 키보드 접근.

## [2026-05-30 00:20] [개발자]
완료: 1순위 TODO — [캘린더] 선택 셀 위계 분리(보더→배경 채움+inset 링) (디자이너 '보통').
- `.day.selected`가 임박 셀(.day-soon)과 같은 amber 보더(#f5a623)를 써 두 상태 보더 색이 충돌하던 문제 해소.
- 선택 표현을 보더 제거 → `background:rgba(74,144,226,0.18)` 옅은 채움 + `box-shadow:inset 0 0 0 2px var(--accent)` inset 링으로 교체.
- 오늘=파랑 외곽보더 / 임박=amber 외곽보더는 그대로 유지 → 오늘·임박·선택 3상태가 (외곽보더 색) vs (채움+inset링)으로 위계 분리됨.
- 신규 색 없이 기존 --accent 토큰 재사용, CSS-only 1줄 교체(주석 1줄 추가).
변경된 파일: styles.css, PROJECT_STATUS.md, CHAT.md
비고: CSS brace 264/264 균형 확인. QA께 — 캘린더에서 (1) 임박(.day-soon) 셀을 클릭했을 때 amber 보더가 유지된 채 파란 채움+inset 링으로 선택이 구분되는지, (2) 오늘 셀 선택 시 파란 보더+파란 채움이 과하지 않은지, (3) 다른 날 클릭 시 선택 채움/링이 교체되는지 실측 부탁드립니다. 다음 사이클 1순위는 [리스트/패널] 날짜 그룹 헤더 sticky 고정.

## [2026-05-30 00:00] [기획자]
TODO 큐 현황: 3개 → 5개로 보충
이번 사이클 추가: - [접근성] 카테고리 점 색+모양 이중 인코딩(디자이너 05-30) - [밀도] 날짜 클릭 패널 1건 날짜 행 흡수(디자이너 05-30)
완료 처리: 0개 (직전 1순위 auto-scroll 등은 개발자가 이미 완료·정리됨)
IDEAS 이동: 0개 / IDEAS→큐 승격: 2개
사용자 요청 처리: 0개 (활성 요청 없음, SEO는 보류 유지)
비고: 기존 1~3순위(선택셀 위계·날짜그룹헤더 sticky·셀 어포던스/키보드) 유지. 미해결 버그 0·활성 요청 0 확인.

## [2026-05-30 00:05] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 실측: 캘린더·날짜 패널·셀 dot zoom 확대 / 창 리사이즈 렌더 미반영로 모바일은 CSS 병행).
검증: 날짜 패널 컴팩트 행+인라인 확장 OK, 통계줄=드롭다운 '29' 일치(이전 29 vs 25 불일치 해소 확인). 미반영 잔존: 헤더 로고화·선택셀 보더충돌·셀 hover/키보드.
주요 발견(신규): (1)카테고리 색-only 색각이상 a11y, (2)날짜 패널 1건 날짜 헤더 반복.
DESIGN_NOTES에 4개 제안 추가(신규 a11y·패널 헤더·오늘로 버튼·빈 주 밀도), IDEAS에 2개 올림.

## [2026-05-29 23:47] [QA]
검증 대상: (개발자 23:29) [캘린더] 날짜 셀 클릭 시 결과 패널 auto-scroll + 헤더 강조 플래시
결과: ✅ 정상
상세: Chrome 데스크톱(1516px) 실측 — 캘린더 뷰에서 5/30(토, 패스 오브 엑자일) 셀 클릭 시 결과 패널('2026.05.30 (토) 이후 출시 25건', 컴팩트 행 색점·게임명·플랫폼·D-day·☆)로 페이지 부드럽게 스크롤 이동(폴드 밖→상단) 후 정상 렌더. 콘솔 에러 0건. HTML 200·games.json 29건(05-29T12:35) 파싱 OK. 소스 검증: script.js L687 scrollIntoView(reduced-motion 가드)·L688-689 flash 재부여, styles.css 538-540 day-panel-flash @keyframes+.flash+reduced-motion 가드 확인, node --check 통과·CSS brace 264/264.

## [2026-05-29 23:29] [개발자]
완료: 1순위 TODO — [캘린더] 날짜 셀 클릭 시 결과 패널 auto-scroll + 헤더 강조 플래시 (디자이너 '높음').
- renderDayPanel에서 `dayPanel.hidden = false` 직후 `dayPanel.scrollIntoView({behavior:'smooth', block:'start'})`를 1회 호출 → 그리드 아래(폴드 밖)에 열려 '반응 없음'처럼 보이던 발견성 문제 해소.
- 패널 헤더(`.day-panel-header`)에 `flash` 클래스를 remove→reflow(void offsetWidth)→add로 재부여해 0.7s `day-panel-flash` 배경 1회 페이드 강조(--accent→transparent).
- `prefers-reduced-motion: reduce` 3중 가드: scrollIntoView behavior 'auto', 플래시 클래스 미부여, CSS `animation:none`.
- 신규 색 없이 기존 --accent 토큰 재사용.
변경된 파일: script.js (+6줄), styles.css (+4줄: @keyframes 1·.flash 규칙·reduced-motion), PROJECT_STATUS.md, CHAT.md
비고: node --check 통과, CSS brace 264/264 균형. QA께 — (1) 캘린더에서 게임 있는 날짜 셀 클릭 시 패널로 부드럽게 스크롤되는지, (2) 패널 헤더가 한 번 강조 플래시 후 사라지는지, (3) OS reduced-motion 켠 상태에서 즉시 이동·플래시 없음인지 실측 부탁드립니다. 다음 사이클 1순위는 [캘린더] 선택 셀 위계 분리(보더→배경 채움+링).

## [2026-05-29 23:04] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 1516px 실측: 캘린더/리스트/날짜패널, 콘솔 에러 0건). 날짜패널 컴팩트 인라인행·기본 캘린더뷰·헤더 컴팩트 라이브 반영 확인. 모바일은 resize 미반영로 CSS 병행.
주요 발견: (1) 리스트 카드에 칩 스타일 3종 혼재 + 비클릭 장르태그가 링크블루라 클릭가능처럼 보임(어포던스 거짓신호), (2) 메타 아이콘(⚔/🏛)이 라벨 없이 이모지뿐이라 의미 불명확+스크린리더 미스리딩.
DESIGN_NOTES에 신규 4개 추가(칩 일관성·메타아이콘 라벨·'오늘로' disabled·검색 placeholder 단축키힌트), IDEAS에 2개 올림. 기존 등록/큐 대기 항목은 중복 등록 안 함.

## [2026-05-29 22:47] [QA]
검증 대상: (개발자 13:20) [뷰] 진입 시 기본 뷰 캘린더 고정 (주석 +2줄, 로직 무변경)
결과: ✅ 정상
상세: Chrome 실측 — localStorage 'gcalen.view' 비운 신규방문 시 캘린더 활성(view-calendar aria-pressed=true·active, calendar-view 노출/games-list hidden, 42셀·'2026년 5월'), getItem 후 'calendar' 폴백 저장 확인. 📋 리스트 토글→새로고침 시 'list' 유지(list aria-pressed=true, 리스트 노출). 콘솔 에러 0건, HTML 200·footer 운영자정보 정상, games.json 29건(05-29T12:35) 파싱 OK.

## [2026-05-29 13:20] [개발자]
완료: 1순위 TODO — [뷰] 진입 시 기본 뷰를 캘린더로 고정 (운영자 요청).
- 코드 점검 결과 view 토글 초기화부가 이미 기본값 calendar를 충족하고 있었음:
  `let savedView = 'calendar';` + `savedView = localStorage.getItem(VIEW_KEY) || 'calendar';`
  → 최초 방문(키 없음/null/'') 시 모두 calendar로 폴백, 사용자가 토글로 'list' 선택 시 그 값 보존(applyView가 setItem).
- 동작은 이미 정상이므로 로직 변경 없이, 의도가 명확하도록 초기화부에 주석 2줄만 추가(미래 사이클에서 기본값이 '실수로 보이는 코드'로 오인·회귀되지 않도록 고정).
변경된 파일: script.js (주석 +2줄), PROJECT_STATUS.md, CHAT.md
비고: QA께 — (1) 시크릿창/localStorage 비운 상태로 gcalen.com 진입 시 📅 캘린더 뷰가 활성(aria-pressed=true)인지, (2) 📋 리스트로 토글 후 새로고침 시 리스트가 유지되는지 실측 부탁드립니다. 다음 사이클 1순위는 [캘린더] 날짜 셀 클릭 패널 auto-scroll + 헤더 강조 플래시.

## [2026-05-29 13:06] [기획자]
TODO 큐 현황: 2개 → 5개로 보충
이번 사이클 추가:
- [캘린더] 날짜 셀 클릭 시 결과 패널 auto-scroll + 헤더 강조 플래시 (디자이너 높음 → 2순위)
- [리스트/패널] 날짜 그룹 헤더 sticky 고정 (디자이너 보통 → 4순위)
- [접근성] 날짜 셀 클릭 어포던스 + 키보드 접근(tabindex/role/Enter·Space/focus-visible) (디자이너 보통 → 5순위)
유지: [뷰] 기본 캘린더 뷰 고정(운영자, 1순위), [캘린더] 선택 셀 위계 분리(3순위)
완료 처리: 0개 (직전 사이클까지 완료분은 이미 정리됨)
IDEAS 이동: 0개 (3사이클 정체 항목 없음)
사용자 요청 처리: 0개 (활성 요청 없음, SEO는 '보류' 유지·미터치)
비고: 미해결 코드 버그 없음(BUGS 전부 ✅). '날짜 미정' D-day 가짜정밀도 건은 games.json 스키마(리서처 영역) 연계라 큐잉 보류 — IDEAS 유지.

## [2026-05-29 13:02] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 1516px 실측: 캘린더/리스트/날짜패널/검색/모달, 콘솔 에러 0건). 헤더 컴팩트화(개발자 12:30) 라이브 반영 확인, 사이트 복구 후 정상.
주요 발견: (1) 긴 리스트/날짜패널 스크롤 시 날짜 그룹 헤더가 사라져 날짜 맥락 상실 → sticky 헤더 제안, (2) D-day 배지가 임박/원거리 동일 색이라 긴급도 신호 없음.
DESIGN_NOTES에 신규 4개 제안 추가(sticky 헤더·D-day 색단계·리스트카드 날짜중복·검색시 컨트롤바 reflow), IDEAS에 2개 올림. 기존 등록 항목 중복 안 함.

## [2026-05-29 21:47] [QA]
검증 대상: (개발자 12:30) [헤더] 좌측정렬+컴팩트화 (CSS-only)
결과: ✅ 정상
상세: Chrome 데스크톱(1920px) 실측 — header text-align:left, h1 좌측 edge(353px)가 main 콘텐츠(353px)와 정확히 정렬, gradient 배경 full-bleed(header left=0) 유지, h1 1.7rem·padding 1.25rem 반영. 콘솔 에러 0건, games.json 29건(05-29T12:35) 파싱 OK, fallback 미노출. 헤더 컴팩트(headerBottom 131px)로 캘린더 상향 확인.


## [2026-05-29 12:30] [개발자]
완료: 1순위 TODO — [헤더] 좌측정렬 + 컴팩트화로 캘린더를 첫 화면 위로 (운영자 요청).
- `header`: 패딩 `2.5rem 1rem 1.5rem` → `1.25rem 1rem 1rem`, `text-align` center → left.
- `header h1`: 2rem → 1.7rem, margin-bottom 0.5 → 0.25rem.
- 헤더 자식(h1/.subtitle/.last-updated)에 `max-width:1200px; margin:0 auto; padding:0 1rem` → `<main>`(max-width 1200px·1rem gutter)과 좌측 정렬. gradient 배경은 full-bleed 유지(자식만 제약).
- `.stats-summary` text-align center → left (헤더 좌측정렬과 시각 일관, 한 줄 유지).
- 효과: 상단 수직 높이 절감(첫 화면에 캘린더가 더 위로). CSS-only, 텍스트/기능 무변경.
변경된 파일: styles.css (+14/-5)
비고: QA께 — (1) 데스크톱·모바일(≤480px)에서 제목/부제 좌측정렬·정렬 깨짐 없음, (2) 헤더 텍스트 좌측 edge가 main 콘텐츠와 정렬(특히 >1200px 와이드 화면), (3) gradient 배경 full-bleed 유지, (4) 캘린더가 첫 화면에서 더 위로 올라왔는지 실측 부탁드립니다. 다음 사이클 1순위는 [뷰] 진입 시 기본 뷰 캘린더 고정.

## [2026-05-29 20:50] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 실측: 리스트/캘린더/날짜 클릭 패널, 콘솔 에러 0건). 모바일은 resize 미반영로 styles.css 병행.
주요 발견: (1) 날짜 셀 클릭 시 결과 패널이 그리드 아래(폴드 밖)서 열려 scrollIntoView 부재 → '반응 없음'처럼 보임 (2) 캘린더 셀에 role/tabindex 없어 키보드 접근 불가.
DESIGN_NOTES에 4개 신규 제안 추가, IDEAS에 2개 올림(클릭 패널 auto-scroll·모바일 셀 라벨). 기존 등록·큐 대기 항목은 중복 등록 안 함.

## [2026-05-29 20:46] [QA]
검증 대상: (개발자 12:20) [안정성] 로딩/크래시 에러 상태 fallback 가드 추가
결과: ✅ 정상
상세: gcalen.com HTML 200·footer 운영자정보(© 2026/contact@gcalen.com, GitHub·AI문구 제거 확인), games.json 파싱 OK(29건·05-29T12:35). index.html 독립 inline 가드(500ms 폴링+9초 setTimeout→.load-fallback) 및 styles.css 규칙 존재, node --check OK. WebFetch는 JS 미실행이라 라이브 fallback 동작은 코드 검증으로 대체.

## [2026-05-29 12:20] [개발자]
완료: [안정성] 로딩/크래시 에러 상태 fallback (복구된 큐 1순위).
- index.html에 script.js와 **독립된** inline `<script>` 가드 추가: 9초 내 `#calendar-grid`(셀)·`#games-list`(카드)가 렌더 안 되면 `.load-fallback`로 '데이터를 불러오지 못했어요' + 새로고침 버튼 노출. 500ms 폴링으로 정상 렌더 감지 시 setTimeout/Interval 자기-해제. 메인 스크립트가 TDZ 등으로 죽어도 동작(무한 '불러오는 중...' 방지) — 21:47 TDZ 다운 류 재발 시 안전망.
- styles.css에 `.load-fallback` 규칙 추가(기존 토큰 --surface/--border/--text/--accent 재사용, 신규 색 없음).
- 검증: DOM 스텁 + 가짜 타이머로 두 경로 확인 — 렌더 성공 시 fallback 미표시·타이머 정리 / 렌더 실패 시 fallback 표시. node --check OK.

⚠️ **긴급 발견 + 복구**: 직전 [기획자] 11:11 커밋(3fe7976)이 PROJECT_STATUS.md와 USER_REQUESTS.md를 **옛 스냅샷으로 회귀**시켰습니다(완료기능 ~25건·BUGS/IDEAS 이력 소실, 이미 배포 완료된 캘린더 3·4·5단계/검색/뱃지를 "다음 TODO"로 재등재, USER_REQUESTS의 최근 완료 아카이브 2건 삭제). 실제 라이브 코드는 그대로 정상이며 문서만 어긋난 상태였습니다. 이번 사이클에 부모 커밋(a3c71b5)에서 두 파일을 복구했습니다(CHAT.md는 추가분이라 보존). 
변경된 파일: index.html (+18줄), styles.css (+18줄), PROJECT_STATUS.md(복구+갱신), USER_REQUESTS.md(복구)
비고: 기획자께 — 차기 사이클에 복구된 큐(현재 1순위 [헤더] 컴팩트화) 재확인 부탁드립니다. QA께 — 라이브 정상 시 fallback 미노출 확인 + (가능하면) script.js 강제 오류 주입 시 9초 후 새로고침 안내 표시 확인 부탁드립니다.

## [2026-05-29 11:11] [기획자]
TODO 큐 현황: 4개(푸터 완료분 제외) → 5개로 보충 유지
이번 사이클 추가/재정렬:
- 캘린더 3단계(이전/다음 달 네비) → 1순위로 승격
- 캘린더 4단계(셀 클릭→그날 게임→모달 재사용) → 2순위
- 캘린더 5단계(캘린더/리스트 뷰 토글) → 3순위
- 검색 기능(게임명 부분 일치) → 4순위 신규
- 카테고리별 개수 뱃지 → 5순위 신규
완료 처리: 1개 (푸터 교체 → "완료한 기능" 이동 + USER_REQUESTS 아카이브)
IDEAS 이동: 0개
사용자 요청 처리: 1개 완료 / 활성 요청 0개 (SEO는 "보류" 유지, 건드리지 않음)
비고: 푸터 배포 캐시 잔존은 시간 경과로 해소 예상 → 다음 QA가 gcalen.com 재확인 권장.

## [2026-05-29 23:02] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 실측: 캘린더/리스트/날짜패널/모달, 콘솔 에러 0건). 모바일은 resize 미반영로 CSS 병행.
복구 확인: QA 22:40 TDZ 복구 라이브 정상 — 날짜 패널 컴팩트 행+인라인 확장, 통계 29=드롭다운29 모두 정상 반영됨.
주요 발견: (1) '날짜 미정/유동적' 게임 5건이 12.31 그룹에 묶여 'D-217' 가짜 정밀도 표시(정보 모순) (2) 모달 상단 배너 카테고리 라벨 중복+빈 그라데이션 세로 낭비.
DESIGN_NOTES에 4개 신규 제안 추가, IDEAS에 2개 올림(날짜미정 D-day·통계줄 클릭필터). 기존 높음 미반영건은 TODO 큐에 있어 중복 등록 안 함.

## [2026-05-29 22:40] [QA]
검증 대상: (개발자 22:20) 라이브 전체 다운 — script.js TDZ 'dayPanel' ReferenceError 복구
결과: ✅ 정상
상세: Chrome 실측 — gcalen.com 재로드 시 콘솔 ReferenceError/에러 0건, '불러오는 중...' 고착 해소되고 게임 카드/콘텐츠 정상 렌더(games.json 29건·05-29T12:35 파싱 OK). 소스도 const dayPanel L379 hoist(첫 사용 L478/L526 위) 확인. 21:47 TDZ 다운 회귀 복구 완료.

## [2026-05-29 22:20] [개발자]
완료: 긴급 1순위 — 라이브 전체 다운(script.js TDZ 'dayPanel' ReferenceError) 복구.
조치: `const dayPanel = document.getElementById('day-detail-panel');` 선언이 Stage4(구 L652)에 있어 그 위 keydown 리스너(L477)·ESC 핸들러(L525)가 참조 → 모듈 로드 시 TDZ ReferenceError로 스크립트 전체 중단이었음. 선언을 모달 핸들부(L379, modal/modalBody 옆)로 hoist하고 Stage4 중복 선언을 제거.
검증: node --check는 TDZ를 못 잡으므로 DOM 스텁으로 script.js를 실제 top-level 실행 → 'no ReferenceError' 확인(이후 나오는 fetch 에러는 스텁에 fetch 미구현 때문이며 모든 리스너 등록 이후 발생, TDZ와 무관). 
변경된 파일: script.js (+1/-1줄), PROJECT_STATUS.md, CHAT.md
비고: QA 권고 — 라이브 gcalen.com 콘솔에서 ReferenceError 0건, 캘린더 셀 렌더, 날짜 셀 클릭 패널·ESC 닫기 동작 실측 부탁드립니다. 다음 사이클 1순위는 [안정성] 로딩/크래시 에러 상태 fallback.

## [2026-05-29 22:00] [기획자]
TODO 큐 현황: 3개 → 5개로 보충
이번 사이클 추가: - [긴급·버그] script.js TDZ 'dayPanel' ReferenceError 복구(라이브 전체 다운), - [안정성] 로딩/크래시 에러 상태 fallback(디자이너 높음 승격)
완료 처리: 0개, IDEAS 이동: 0개
사용자 요청 처리: 0개 (활성 요청 없음, 보류 항목 미터치)
메모: QA 21:47 보고대로 라이브가 TDZ로 완전 다운(const dayPanel L652 선언이 L477/L525 참조 아래). 1순위로 긴급 등재 — 개발자는 선언을 첫 사용 위로 이동 + node --check가 아닌 **브라우저 콘솔 실측**으로 검증 필수. 기존 헤더/기본뷰/선택셀 TODO는 3~5순위로 유지.

## [2026-05-29 19:02] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 실측 + 콘솔). 모바일은 다운 상태라 보류.
주요 발견: 라이브 **완전 다운** — script.js:477 TDZ(dayPanel) 그대로, 본문 "불러오는 중..." 영구 고착(QA 21:47 등재 회귀, 중복 등록 안 함). 렌더 의존 항목은 평가 불가.
신규 제안: 사이트가 죽어도 보이는 '로딩/에러 상태'만 — 에러 상태 fallback(별도 inline script, 높음)·로딩 타임아웃 가드·로딩 인디케이터. DESIGN_NOTES에 3개 추가, IDEAS에 2개 올림. 최우선은 TDZ 회귀 복구.
## [2026-05-29 21:47] [QA]
검증 대상: (개발자 21:40) [캘린더] 날짜 패널 한 줄 컴팩트 행 전환
결과: ❌ 배포 실패 (사이트 전체 미동작)
상세: gcalen.com 진입 시 콘솔에 ReferenceError 'Cannot access dayPanel before initialization' (script.js:477) → 스크립트 실행 중단으로 캘린더 0셀·'불러오는 중...' 고착(전 기능 미동작). games.json은 29건 정상 응답이라 데이터 아닌 코드 회귀. 원인: dayPanel const 선언이 L652인데 keydown 리스너(L477)·ESC 핸들러(L525)가 그 위에서 참조(TDZ). node --check는 문법만 봐서 미검출. 21:40 컴팩트행 커밋(8fbbba2) 회귀. BUGS 1순위 등재.

## [2026-05-29 21:40] [개발자]
완료: 1순위 — [캘린더] 날짜 클릭 패널을 한 줄 컴팩트 행으로 전환.
조치: 패널 전용 renderDayRows() 신설(카드형 renderGroupedList 대신) → 각 행 `[카테고리 색점] 게임명 · 대표 플랫폼 · D-day · ☆`, min-height 44px 터치타겟, 날짜 그룹 헤더는 유지. 행 클릭/Enter·Space=openModal 재사용, ☆=기존 위시 토글 핸들러 재사용(.day-row 셀렉터 추가). 표시 범위 '그날 이후 전체' 현행 유지. 내부 스크롤(max-height:60vh/overflow) 제거 → 페이지 흐름 인라인 확장(디자이너 '높음').
변경된 파일: script.js, styles.css, PROJECT_STATUS.md
비고: 리스트 뷰 탭 카드(renderGroupedList/renderCard) 미변경. node --check 통과, CSS brace 254/254. QA 권고 — 라이브에서 날짜 셀 클릭 시 행 표시/클릭 모달/☆ 토글, 모바일 폭에서 행 가로 넘침 없는지, 패널 내부 스크롤 사라지고 인라인 확장되는지 확인.

## [2026-05-29 21:20] [개발자]
완료: 1순위 버그 — 통계줄 '총 N' vs 카테고리 드롭다운 '전체 (N)' 숫자 불일치 수정.
원인: updateCategoryCounts의 카운트 base가 기본 기간필터(앞으로 1년)를 적용 → 과거 출시 4건 제외(29→25). renderStatsSummary는 allGames 전체(29) 집계라 불일치.
조치: 카운트 base에서 기간 날짜창(days/today 블록) 제거 → 통계와 동일 모집단(allGames). 기본 상태에서 29=29 일치. 플랫폼/검색/주/위시 필터 카운트 반영은 유지, 기간 필터는 표시 목록(renderGames)에만 적용.
변경된 파일: script.js, PROJECT_STATUS.md
비고: node --check 통과, 외형/문구 무변경. QA 권고 — 라이브에서 기본 진입 시 stats '총 N'과 카테고리 드롭다운 '전체 (N)' 동일한지, 플랫폼/검색 적용 시 드롭다운 카운트가 동적으로 줄어드는지 확인.

## [2026-05-29 21:00] [기획자]
TODO 큐 현황: 3개 → 5개로 보충
이번 사이클 추가: - [버그] 통계줄 총개수 vs 드롭다운 '전체(N)' 숫자 불일치(디자이너 18:05 보고: 총29 vs 25), - [캘린더] 선택 셀 위계 분리(보더→배경+링, IDEAS 승격)
완료 처리: 0개, IDEAS 이동: 0개
사용자 요청 처리: 0개 (활성 요청 없음, 보류 항목 미터치)
메모: 디자이너 18:05 '선택 셀 보더 충돌'은 5순위 TODO로 픽업. 숫자 불일치는 같은 모집단 참조하도록 정렬 권고.

## [2026-05-29 18:40] [QA]
검증 대상: (개발자 09:18) [캘린더] 출시 0건인 달 빈 상태 안내 문구 정렬
결과: ✅ 정상
상세: gcalen.com HTML 200·games.json 파싱 OK. 라이브 실측 — 게임 있는 달은 #calendar-empty hidden=true, ‹ ›로 빈 달(9월) 이동 시 hidden=false로 노출되고 문구가 신규 스펙('이 달 출시 일정이 없어요. ‹ ›로 다른 달을 살펴보세요.')과 일치. 위시리스트 빈 분기 별도 유지. 콘솔 에러 0건, node --check 통과.

## [2026-05-29 18:05] [디자이너]
UX/UI 점검 완료 (Chrome 데스크톱 실측, 셀 보더/라벨 zoom 확대 / 모바일 뷰포트 미반영로 CSS 병행)
주요 발견: 선택 셀 보더가 임박 셀 보더와 색 충돌해 상태 위계 모호 + 통계줄 '총 29' vs 드롭다운 '전체 (25)' 숫자 불일치
DESIGN_NOTES에 4개 신규 제안 추가, IDEAS에 2개 올림. 기존 운영자 요청(헤더 로고화·날짜 패널)은 여전히 미반영(중복 등록 안 함).
