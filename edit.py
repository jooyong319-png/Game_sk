import re, sys
def fail(m):
    print("FAIL:", m); sys.exit(1)

# ===== script.js =====
p="script.js"; s=open(p,encoding="utf-8").read()
a1="const searchCount = document.getElementById('search-count');"
if s.count(a1)!=1: fail("a1 "+str(s.count(a1)))
s=s.replace(a1, a1+"\nconst filterReset = document.getElementById('filter-reset');\nconst DEFAULT_PERIOD = periodFilter ? periodFilter.value : '365';",1)
a2="function renderGames() {\n  updateCategoryCounts();"
if s.count(a2)!=1: fail("a2 "+str(s.count(a2)))
s=s.replace(a2, "function renderGames() {\n  updateCategoryCounts();\n  updateFilterResetVisibility();",1)
if not s.rstrip().endswith("updateWishlistChipLabel();"): fail("tail")
block="""

// --- Filter reset control: show when any of the 6 filters is non-default; reset all on click ---
function isAnyFilterActive() {
  return (categoryFilter && categoryFilter.value !== '')
    || (platformFilter && platformFilter.value !== '')
    || (periodFilter && periodFilter.value !== DEFAULT_PERIOD)
    || (searchQuery && searchQuery.trim() !== '')
    || weekFilter !== null
    || wishlistOnly;
}
function updateFilterResetVisibility() {
  if (filterReset) filterReset.hidden = !isAnyFilterActive();
}
function resetAllFilters() {
  if (categoryFilter) categoryFilter.value = '';
  if (platformFilter) platformFilter.value = '';
  if (periodFilter) periodFilter.value = DEFAULT_PERIOD;
  if (searchInput) searchInput.value = '';
  searchQuery = '';
  if (searchClear) searchClear.hidden = true;
  if (searchCount) searchCount.hidden = true;
  weekFilter = null;
  wishlistOnly = false;
  applyWeekChips();
  applyWishlistChip();
  renderGames();
}
if (filterReset) filterReset.addEventListener('click', resetAllFilters);
updateFilterResetVisibility();
"""
s=s.rstrip("\n")+"\n"+block
open(p,"w",encoding="utf-8").write(s)

# ===== index.html =====
p="index.html"; s=open(p,encoding="utf-8").read()
anc="위시리스트만 보기</button>"
if s.count(anc)!=1: fail("idx "+str(s.count(anc)))
s=s.replace(anc, anc+'\n      <button id="filter-reset" class="chip-btn filter-reset" type="button" hidden>✕ 필터 초기화</button>',1)
open(p,"w",encoding="utf-8").write(s)

# ===== PROJECT_STATUS.md =====
p="PROJECT_STATUS.md"; s=open(p,encoding="utf-8").read()
h="## 완료한 기능\n"
if s.count(h)!=1: fail("ps_done")
s=s.replace(h, h+"- [x] **[UX·발견성] 활성 필터 '초기화' 컨트롤** — 6종 필터(카테고리/플랫폼/기간/검색/주칩/위시) 중 비기본값 1개↑ 활성 시에만 #filter-reset 버튼 노출, 클릭 시 전부 기본값 일괄 리셋(결과 0건 빈 상태 탈출구 겸). .chip-btn 톤 재사용·신규 색 없음 — 개발자 완료 2026-05-31 13:38\n",1)
start=s.index("## 다음 TODO"); end=s.index("### (큐 소진 후 후보")
head,body,tail=s[:start],s[start:end],s[end:]
i1=body.index("\n1. **"); i2=body.index("\n2. **")
body=body[:i1]+body[i2:]
body=body.replace("\n2. **","\n1. **").replace("\n3. **","\n2. **").replace("\n4. **","\n3. **")
s=head+body+tail
clh="## 최근 변경 로그\n"
if s.count(clh)!=1: fail("ps_log")
log=("- 2026-05-31 13:38 [개발자] 1순위 완료: **[UX·발견성] 활성 필터 '초기화' 컨트롤**. "
"6종 필터 중 비기본값 1개↑ 활성 시에만 `#filter-reset` 버튼(.chip-btn 톤 재사용·신규 색 없음) 노출, "
"클릭 시 전부 기본값 일괄 리셋 후 재렌더(결과 0건 빈 상태 탈출구 겸). "
"script.js: filterReset/DEFAULT_PERIOD const + isAnyFilterActive/updateFilterResetVisibility/resetAllFilters 함수 추가, "
"renderGames에 가시성 토글 훅 1줄. index.html: quick-chips에 버튼 1개. "
"node --check 통과, styles.css 미변경(brace 균형 유지). 잔여 TODO 3건 1~3순위로 당김.\n")
s=s.replace(clh, clh+log,1)
open(p,"w",encoding="utf-8").write(s)

# ===== CHAT.md =====
p="CHAT.md"; s=open(p,encoding="utf-8").read()
m=re.search(r"^## \[20", s, re.M)
if not m: fail("chat_anchor")
msg=("## [2026-05-31 13:38] [개발자]\n"
"완료: 1순위 TODO '활성 필터 초기화 컨트롤' 구현. 6종 필터 중 비기본값이 1개↑일 때만 '✕ 필터 초기화' 버튼 노출, 클릭 시 전부 기본값 리셋(결과 0건 빈 상태 탈출구 겸).\n"
"변경된 파일: index.html(버튼 1개), script.js(const 2 + 함수 3 + renderGames 훅 1줄 + 리스너/초기 호출). styles.css 미변경(.chip-btn 톤 재사용).\n"
"비고: node --check 통과. 가시성 토글은 모든 필터 변경이 거치는 renderGames에 1줄 훅. QA는 라이브에서 각 필터 변경 시 버튼 노출/리셋 + 초기 기본값 상태에서 버튼 숨김 확인 부탁.\n\n")
s=s[:m.start()]+msg+s[m.start():]
open(p,"w",encoding="utf-8").write(s)
print("EDITS_OK")
