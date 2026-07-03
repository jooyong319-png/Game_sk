'use client';
import { useState } from 'react';
import styles from './GameThumb.module.css';

// 게임 썸네일(정사각) — 비율 다양 대응(블러 배경 + contain), 없거나 깨지면 '이미지 없음'.
// 서버 컴포넌트(SeoLanding 등)에서도 자식으로 쓸 수 있게 분리한 클라 컴포넌트.
interface Props { src: string | null; alt: string; }

export function GameThumb({ src, alt }: Props) {
  const [err, setErr] = useState(false);
  const ok = src && !err;
  return (
    <div className={styles.thumb}>
      {ok ? (
        <>
          <img src={src} alt="" aria-hidden="true" className={styles.bg} loading="lazy" />
          <img src={src} alt={alt} className={styles.fg} loading="lazy" onError={() => setErr(true)} />
        </>
      ) : (
        <div className={styles.ph}>
          <svg className={styles.phIcon} aria-hidden="true"><use href="#ic-image" /></svg>
          <span className={styles.phText}>이미지 없음</span>
        </div>
      )}
    </div>
  );
}
