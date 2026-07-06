'use client';
import { AdFit } from './AdFit';

// 양옆 여백(gutter) 고정 광고. 넓은 화면(≥1650px)에서만 노출 — globals.css .side-rail 참고.
// 카카오 애드핏 160x600 유닛 ID를 넣으면 실제 광고 표시. 비어있으면 자리 표시용 박스.
const SIDE_AD_UNIT = 'DAN-wydIrmDap9p6SfsL'; // 애드핏 160x600
// 로컬(개발)에선 애드핏이 도메인 잠금으로 안 뜨므로 위치 확인용 placeholder 표시.
const IS_DEV = process.env.NODE_ENV === 'development';

function Rail() {
  if (IS_DEV || !SIDE_AD_UNIT) return <div className="side-rail-ph">광고 영역<br />160×600</div>;
  return <AdFit unit={SIDE_AD_UNIT} width={160} height={600} />;
}

export function SideRailAds() {
  return (
    <>
      <aside className="side-rail side-rail-left" aria-hidden="true"><Rail /></aside>
      <aside className="side-rail side-rail-right" aria-hidden="true"><Rail /></aside>
    </>
  );
}
