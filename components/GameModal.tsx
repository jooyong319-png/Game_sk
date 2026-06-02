'use client';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatKoreanDate, getKoreanWeekday } from '@/lib/games';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';
import { useWishlist } from './useWishlist';
import styles from './GameModal.module.css';

export function GameModal({ game }: { game: Game }) {
  const router = useRouter();
  const wishlist = useWishlist();

  const close = useCallback(() => {
    router.back();
  }, [router]);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [close]);

  const diff = calcDayDiff(game.release_date);
  const dd = diff < 0 ? '출시됨' : diff === 0 ? 'D-DAY' : `D-${diff}`;
  const cat = CATEGORY_META[game.category];
  const dateStr = formatKoreanDate(game.release_date);
  const weekday = game.release_date_approx ? '' : ` (${getKoreanWeekday(game.release_date)})`;
  const isWished = wishlist.has(game.id);

  return (
    <div className={styles.overlay} onClick={close} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={close} aria-label="닫기">×</button>

        <div className={`${styles.image} cat-bg-${game.category}`}>
          <span className={styles.imageEmoji}>{cat.emoji}</span>
        </div>

        <span className={`category-tag cat-bg-${game.category}`}>{cat.label}</span>

        <div className={styles.titleRow}>
          <h2 id="modal-title" className={styles.title}>{game.name_ko}</h2>
          <button
            type="button"
            className={`${styles.wish} ${isWished ? styles.wishOn : ''}`}
            onClick={() => wishlist.toggle(game.id)}
            aria-pressed={isWished}
            aria-label="위시리스트 토글"
          >
            {isWished ? '★' : '☆'}
          </button>
        </div>

        {game.name_en && game.name_en !== game.name_ko && (
          <div className={styles.nameEn}>{game.name_en}</div>
        )}

        <div className={styles.row}>
          <strong>출시일</strong>
          {dateStr}{weekday}{game.release_date_approx ? ' (예정)' : ''} · <span className={styles.dday}>{dd}</span>
        </div>
        {game.platforms.length > 0 && (
          <div className={styles.row}><strong>플랫폼</strong>{game.platforms.join(', ')}</div>
        )}
        {game.genres.length > 0 && (
          <div className={styles.row}><strong>장르</strong>{game.genres.join(', ')}</div>
        )}
        {game.developer && <div className={styles.row}><strong>개발</strong>{game.developer}</div>}
        {game.publisher && game.publisher !== game.developer && (
          <div className={styles.row}><strong>퍼블리셔</strong>{game.publisher}</div>
        )}

        {game.description && <p className={styles.desc}>{game.description}</p>}

        {game.source_url && (
          <a className={styles.source} href={game.source_url} target="_blank" rel="noopener">
            출처 보기 ↗
          </a>
        )}

        <div className={styles.actions}>
          <a className={styles.gcal} href={buildGoogleCalendarUrl(game)} target="_blank" rel="noopener">
            📅 캘린더 추가
          </a>
          <a className={styles.detail} href={`/game/${game.id}`} target="_blank" rel="noopener">
            📄 전체 페이지 ↗
          </a>
        </div>
      </div>
    </div>
  );
}
