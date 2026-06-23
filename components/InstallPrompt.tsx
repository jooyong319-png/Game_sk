'use client';
import { useEffect, useState } from 'react';
import styles from './InstallPrompt.module.css';

const DISMISS_KEY = 'gcalen.installDismissed';
const DISMISS_DAYS = 1;

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // 이미 설치(standalone)면 숨김
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // 최근에 닫았으면 숨김
    try {
      const d = localStorage.getItem(DISMISS_KEY);
      if (d && Date.now() - Number(d) < DISMISS_DAYS * 86400000) return;
    } catch { /* ignore */ }

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onBIP);

    // iOS 사파리는 beforeinstallprompt 미지원 → 수동 안내
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|chrome|android/i.test(ua);
    if (isIos && isSafari) {
      setIosHint(true);
      setShow(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
    setShow(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try { await deferred.userChoice; } catch { /* ignore */ }
    setDeferred(null);
    setShow(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-label="앱 설치 안내">
      <span className={styles.icon} aria-hidden="true">
        <svg className="ic"><use href="#ic-gamepad" /></svg>
      </span>
      <div className={styles.text}>
        <strong className={styles.title}>앱으로 설치하기</strong>
        <span className={styles.sub}>
          {iosHint
            ? '공유 버튼 → "홈 화면에 추가"로 설치하세요.'
            : '홈 화면에서 바로 열고, 출시 알림까지 받아보세요.'}
        </span>
      </div>
      {!iosHint && <button type="button" className={styles.cta} onClick={install}>설치</button>}
      <button type="button" className={styles.close} onClick={dismiss} aria-label="닫기">×</button>
    </div>
  );
}
