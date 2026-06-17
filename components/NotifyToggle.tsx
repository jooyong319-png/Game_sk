'use client';
import { useEffect, useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { pushConfigured, pushSupported, getCurrentSubscription, subscribePush, unsubscribePush } from '@/lib/push';
import { showToast } from '@/lib/toast';
import styles from './NotifyToggle.module.css';

type State = 'loading' | 'on' | 'off' | 'denied' | 'hidden';

export function NotifyToggle() {
  const wishlist = useWishlist();
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    if (!pushConfigured() || !pushSupported()) { setState('hidden'); return; }
    if (Notification.permission === 'denied') { setState('denied'); return; }
    getCurrentSubscription().then(sub => setState(sub ? 'on' : 'off')).catch(() => setState('off'));
  }, []);

  if (state === 'hidden') return null;

  const onToggle = async () => {
    if (state === 'on') {
      setState('loading');
      await unsubscribePush();
      setState('off');
      showToast('출시 알림을 껐어요');
      return;
    }
    setState('loading');
    const r = await subscribePush([...wishlist.ids]);
    if (r === 'ok') { setState('on'); showToast('출시 알림을 켰어요'); }
    else if (r === 'denied') { setState('denied'); showToast('알림 권한이 거부됐어요'); }
    else { setState('off'); showToast('알림 설정에 실패했어요'); }
  };

  const disabled = state === 'loading' || state === 'denied';

  return (
    <div className={styles.box}>
      <span className={styles.icon} aria-hidden="true">
        <svg className="ic"><use href="#ic-bell" /></svg>
      </span>
      <div className={styles.text}>
        <strong>출시 알림</strong>
        <span className={styles.sub}>
          {state === 'denied'
            ? '브라우저 설정에서 알림을 허용해 주세요.'
            : '찜한 게임 출시 하루 전·당일에 알려드려요.'}
        </span>
      </div>
      <button
        type="button"
        className={`${styles.switch} ${state === 'on' ? styles.on : ''}`}
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={state === 'on'}
        aria-label="출시 알림 토글"
      >
        <span className={styles.knob} />
      </button>
    </div>
  );
}
