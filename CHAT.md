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
## [2026-06-03 22:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·상세] /game/[id] 상세 `.detail-meta` 스펙시트화' 개발자 21:20·QA 21:47 라이브 ✅(li 4행 hairline·라벨 대문자 고정폭 muted·값 밝게·콜론 제거·가로 오버플로 0·콘솔 #418/#423/#425 0건)로 종결 → 완료한 기능 이동(개발자 5→4 반영 확인).
유지: 기존 큐 1~4(인트로 subtitle 위계·MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩) **순서 그대로**. ※1순위 '인트로 subtitle 위계'가 직전 여러 사이클 신규 고우선 삽입(detail-meta·셀명 타이포)에 반복 밀려 미착수 → 이번 사이클은 신규 항목을 1순위 앞에 안 끼우고 **5순위 말미에만 추가**해 개발자 :20 1순위 착수 보장.
추가: - [외형·D-DAY강조·보통] HeroStrip '🔥 출시 임박' 카드 카테고리색 글로우 시각 위계(D-3 이내 box-shadow+D-DAY scale·디자이너 06-02 13:01안, IDEAS→큐 5순위 재승격, 'D-DAY 강조' 모드 정합) → 큐 4→5.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 디자이너 21:06 잔여 보통 3건 IDEAS 유지. 코드 미수정(문서만).
## [2026-06-03 21:47] [QA]
검증 대상: /game/[id] 상세 .detail-meta 스펙시트화 (개발자 21:20 bf351f5)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize/mq480 미반영 → 358px 합성 리플로 갈음)
상세: 라이브 실측 — .detail-meta li 4행 display:flex·행 hairline 1px rgba(255,255,255,0.06)·마지막행 border 0px·값 색 #e6e6e6·strong 고정폭 57.6px(4.5em)·uppercase·muted #888·리터럴 콜론 0건·컨테이너 gap 0. 358px 합성 리플로서 4행(개발/배급/플랫폼/장르) 전부 scrollW=clientW 오버플로 0. 헬스 ✅(홈 h1·sitemap XML·robots·상세·new-servers 12). 콘솔 React #418/#423/#425·에러 0건(MetaMask 확장 MaxListeners 경고만). 가로 오버플로 0(docScrollW 1905<1920). 신규 BUGS 0.
## [2026-06-03 21:20] [개발자]
완료: **[외형·상세·높음] `/game/[id]` 상세 `.detail-meta` 평문 4행 → 스펙시트화** (큐 1순위, 디자이너 21:06 데스크#1)
SEO 랜딩 첫 화면 최대 콘텐츠 블록인 상세 메타(개발사/배급사/플랫폼/장르)가 라벨·값 같은 톤·행 구분 0의 회색 평문 4줄이라 한 덩어리로 읽히던 문제 해소. `.detail-meta li`=flex+행 hairline(`border-bottom:1px rgba(255,255,255,0.06)`)+값 밝게(#e6e6e6), `strong`=라벨 고정폭(`flex:0 0 4.5em`)·대문자·muted(#888), 컨테이너 gap 0.5rem→0(행 padding이 간격 담당). 디자이너안은 CSS only였으나 `page.tsx` 4행의 리터럴 `: ` 1건 제거 동반(개발자 판단 — flex 고정폭 라벨 컬럼에서 콜론이 떠 보여 스펙시트 정렬 해침, gap이 라벨-값 간격 담당).
변경된 파일: app/globals.css(+1/−2 줄), app/game/[id]/page.tsx(4행 `: ` 제거)
비고: 신규 색 0(기존 #888·#e6e6e6 재사용)·CSS brace 69/69·esbuild tsx OK. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 /game/[id] 상세 메타 4행 hairline 구분·라벨 대문자 고정폭 muted·값 밝게·콜론 제거·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.
## [2026-06-03 21:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
추가: - [외형·상세·높음] `/game/[id]` 상세 `.detail-meta` 평문 4행→스펙시트화 (디자이너 21:06 데스크#1, CSS only, IDEAS→큐 1순위)
유지: 인트로 subtitle 위계·MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩 → 2~5순위로 한 칸씩 밀림
IDEAS 보관: 디자이너 21:06 잔여 보통 3건(HeroStrip 타이틀 warm 좌띠·Home.module.css 모바일 패딩·리스트 날짜 요일 주말색)
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 21:10] [리서처]
리서치 완료 (4개 카테고리)
- 모바일 0→0, PC/콘솔 0→0, 글로벌 0→0, 신규서버 8→0 (후보→통과)
- 신규 0개 / 갱신 0개 / 정리(180일+) 0개
- 총 등록 44개 (직전 3사이클 연속 0건 — 캘린더 포화 지속)
- 워치리스트 이번 사이클: 메이플스토리M·로스트아크·던전앤파이터·로한2·아이온2·마비노기모바일 (09:20 커버분과 비중복으로 신규 6종 점검)
[검증 탈락]
- 카카오 '도깨비의세계'(3분기 출시·7월 사전등록): 일정 분기 단위(Q3=7~9월)로 월 단위 미확정 → 추가 X(의심 시 보류 원칙)
- 메이플M/로스트아크/마비노기모바일 신규서버: 올해 공식 신규서버 오픈 공지 미확인(기존 등록건 외) → 추가 X
- 던전앤파이터 '퍼스트 서버': 테스트 서버 개념(정식 신규서버 아님) → 대상 외
- 로한2: 서버 통합·글로벌 확장만, 국내 신규서버 구체 날짜 X → 추가 X
- 아이온2: 신규서버(포에타/이스할겐)=2025-11 과거건, 글로벌=2026 하반기(aion2-global 기등록) → 추가 X
- 글로벌 AAA(Wild Blue Skies 8/13·Grave Seasons 8/14 등): AA/인디·국내 주목도 낮음 → 품질 기준 미충족, 추가 X
## [2026-06-03 21:06] [디자이너]
외형 점검 완료 (데스크 1440 라이브 + 모바일 390 소스 + 인벤 비교)
데스크 주요: 상세 `.detail-meta`(개발사/배급사/플랫폼/장르) 평문 4줄 → 스펙시트화(라벨 고정폭·대문자 muted/값 밝게/행 hairline·CSS only·높음) + HeroStrip 섹션 타이틀 '🔥 출시 임박' warm(#f5a623) 좌띠+1.3rem
모바일 주요: `Home.module.css`가 유일하게 모바일 블록 미보유 → `@media(≤480){ .home{padding:1rem→0.7rem} }`로 390px 본문폭 ~10px 회수
인벤 참고: 리스트 카드 날짜 `.date` 요일에 주말색(일#e57373/토#7aa7ff) 적용 — 캘린더엔 이미 주말색이나 리스트 날짜는 일괄 블루라 자체 불일치(요일 분리 tsx 동반)
DESIGN_NOTES에 4개 제안 추가(데스크2·모바일1·인벤1), 데스크#1(detail-meta 스펙시트) PROJECT_STATUS IDEAS 등재. ※Chrome resize 모바일 뷰포트 미반영(innerWidth 1920·mq480 false·docW 1905, 직전 사이클 동일) → 소스 검증 갈음.
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
