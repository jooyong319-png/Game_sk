'use client';
import { useEffect } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatKoreanDate, getKoreanWeekday } from '@/lib/utils';
import { ShareButton } from './ShareButton';
import styles from './GameModal.module.css';

interface Props {
  game: Game;
  onClose: () => void;
  wishlist: { has: (id: string) => boolean; toggle: (id: string) => void };
}

export function GameModal({ game, onClose, wishlist }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const diff = calcDayDiff(game.release_date);
  const dd = diff < 0 ? '출시됨' : diff === 0 ? 'D-DAY' : `D-${diff}`;
  const cat = CATEGORY_META[game.category];
  const dateStr = formatKoreanDate(game.release_date);
  const weekday = game.release_date_approx ? '' : ` (${getKoreanWeekday(game.release_date)})`;
  const isWished = wishlist.has(game.id);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">×</button>

        <div className={styles.header}>
          <div className={`${styles.image} cat-bg-${game.category}`}>
            {game.image_url ? (
              <>
                <img src={game.image_url} alt="" aria-hidden="true" className={styles.imageBg} loading="lazy" />
                <img src={game.image_url} alt={game.name_ko} className={styles.imageFg} loading="lazy" />
              </>
            ) : (
              <span className={styles.imagePh} aria-hidden="true" style={{ background: cat.color }}>
                <svg className={styles.phIcon} aria-hidden="true"><use href={`#${cat.icon}`} /></svg>
              </span>
            )}
          </div>

          <div className={styles.headerInfo}>
            <span className={`category-tag cat-bg-${game.category}`}>{cat.label}</span>
            <h2 id="modal-title" className={styles.title}>{game.name_ko}</h2>
            {game.name_en && game.name_en !== game.name_ko && (
              <div className={styles.nameEn}>{game.name_en}</div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <strong>출시일</strong>
          {dateStr}{weekday}{game.release_date_approx ? ' (예정)' : ''} · <span className={styles.dday}>{dd}</span>
        </div>
        {game.pre_registration && (
          <div className={styles.row}>
            <strong>사전예약</strong>
            {game.pre_registration_date ? `${formatKoreanDate(game.pre_registration_date)} 시작` : '진행 중'}
            {game.pre_registration_end_date ? ` ~ ${formatKoreanDate(game.pre_registration_end_date)} 마감` : (game.pre_registration_date ? ' (마감 미정)' : '')}
          </div>
        )}
        {game.platforms.length > 0 && <div className={styles.row}><strong>플랫폼</strong>{game.platforms.join(', ')}</div>}
        {game.genres.length > 0 && <div className={styles.row}><strong>장르</strong>{game.genres.join(', ')}</div>}
        {game.developer && <div className={styles.row}><strong>개발</strong>{game.developer}</div>}
        {game.publisher && game.publisher !== game.developer && (
          <div className={styles.row}><strong>퍼블리셔</strong>{game.publisher}</div>
        )}

        {game.description && <p className={styles.desc}>{game.description}</p>}

        {game.source_url && (
          <a className={styles.source} href={game.source_url} target="_blank" rel="noopener">
            출처 보기 <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
          </a>
        )}

        {game.pre_registration_url && (
          <a className={styles.preRegCta} href={game.pre_registration_url} target="_blank" rel="noopener">
            사전예약 하러 가기 <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
          </a>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.fav} ${isWished ? styles.favOn : ''}`}
            onClick={() => wishlist.toggle(game.id)}
            aria-pressed={isWished}
          >
            <svg className={`ic ${isWished ? 'ic-fill' : ''}`} aria-hidden="true"><use href="#ic-star" /></svg>
            {isWished ? '즐겨찾기됨' : '즐겨찾기'}
          </button>
          <a className={styles.detail} href={`/game/${game.id}`} target="_blank" rel="noopener">
            <svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg> 전체 페이지 <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
          </a>
          <ShareButton url={`/game/${game.id}`} title={game.name_ko} className={styles.share} />
        </div>
      </div>
    </div>
  );
}
