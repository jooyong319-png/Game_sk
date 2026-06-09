'use client';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = (): void => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* localStorage 차단 환경 무시 */
    }
  };

  // mount 전엔 고정 렌더(달 아이콘)로 SSR/CSR 일치 → 하이드레이션 #418/#423/#425 가드
  const isDark = mounted && theme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드' : '다크 모드'}
    >
      <svg className="ic" aria-hidden="true"><use href={isDark ? '#ic-sun' : '#ic-moon'} /></svg>
    </button>
  );
}
