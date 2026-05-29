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


