# DESIGN_NOTES 아카이브 (2026-06-11)

## [2026-06-10 14:24] [디자이너] - 정리 모드 라이브 점검 (데스크 1440 + 모바일 390 iframe 합성)
전 범위 출고(Phase 0~3·§F 3컬럼·§E 헤더·상단광고 제거) 출고분 라이브 실측. §H-1 패널화·§H-2 하단광고·§H-3 모바일칩은 미구현 큐 유효라 **중복 제외**, 아래는 신규 정리(덜어내기) 4건. (장식추가·a11y·리팩토링 0건)

1. **[높음·중복제거·확정방향#4 위반] 헤더 카테고리 내비 제거 → 좌 레일과 중복** — 라이브 헤더에 `.site-nav` 6링크(캘린더/출시예정/신규서버/모바일/PC·콘솔/글로벌)가 여전히 노출. 좌 CategoryRail(전체/모바일/PC·콘솔/글로벌/신서버)과 카테고리 의미 중복 + **확정방향 #4 "카테고리 내비 없음"에 정면 배치**(§E·§G-2 미반영분, 12:30 '헤더 미니멀 출고' 보고와 라이브 불일치). 조치: `components/HeaderNav.tsx` L27 `<nav className="site-nav">` 블록 제거(또는 잠정 `app/globals.css .site-nav{display:none}`) → 워드마크(시그니처 그라데)+위시★+테마토글만. SEO 5라우트는 푸터/좌레일 링크로.

2. **[높음·중복제거] 중앙 통계줄(.stats) 카테고리 카운트 중복 제거** — 좌 레일이 이미 전체62/모바일14/PC·콘솔6/글로벌30/신서버12 카운트를 표기하는데, 중앙 상단 `.stats`(`components/Home.tsx` L219~228·`Home.module.css` L6)가 동일 4카운트를 한 번 더 반복(데스크 동시 노출=산만). 조치: `.statsCat` span(Home.tsx L220~226) 제거하고 `총 N개`(`.statsTotal`)만 유지 → 중앙 컨트롤 적층(검색·토글 / 통계 / 월탭 / 월이동) 4행→3행 감량. 모바일도 동일 1행 절감.

3. **[높음·모바일깨짐] MonthTabs 가로 오버플로 265px 격납** — 라이브 390 실측 `documentElement.scrollWidth` 640 vs client 375(+265px 가로 넘침). 원인: `components/MonthTabs.module.css` `.tabs{ margin:0 auto }`가 flex 컬럼 `.main` 안에서 cross-axis auto마진→stretch 해제→content폭(624px) shrink-wrap, `overflow-x:auto`가 무력화(컴퓨티드 width 624 확정). 조치: `.tabs`에 `align-self:stretch; max-width:100%; margin-inline:0`(또는 `width:100%`) → 12개월 버튼이 페이지를 밀지 않고 내부 스크롤 스트립으로 격납(기존 ≤480 mask/snap과 정합·신규색 0).

4. **[보통·하드코딩청산] MonthTabs 비활성 칩이 라이트 기본에서 무형(투명)** — `.tab` `background:rgba(255,255,255,0.04)`·`border-color:rgba(255,255,255,0.08)`가 라이트(흰/#f6f7f9 배경) 기본에서 사실상 투명 → 1월~12월 칩이 테두리·면 없이 맨 텍스트로 부유(활성 블루 칩만 형태 보임). 라이브 light computed `rgba(255,255,255,0.04)`/`0.08` 확정. 조치(`MonthTabs.module.css`): `.tab` bg→`transparent`(또는 `var(--bg-elev)`)·border→`var(--border)`, `.tab:hover` `rgba(91,157,255,…)`→`var(--accent)` 계열. 확정방향 §D '하드코딩 토큰화'·§A '폐기 하드코딩 청산' 정합. 다크는 토큰 전환 자동.
