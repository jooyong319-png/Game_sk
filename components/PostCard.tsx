'use client';
import { useState } from 'react';
import { formatRelative, categoryLabel } from '@/lib/boardFormat';
import styles from './Board.module.css';

export interface Post {
  id: number;
  title: string | null;
  nickname: string;
  content: string;
  created_at: string;
  report_count: number;
  image_url: string | null;
  ip_prefix: string | null;
  category: string | null;
}

interface Props {
  post: Post;
  href?: string;                    // 있으면 제목·이미지·본문 클릭 시 상세로 이동
  onReport?: (id: number) => void;
  onDelete?: (id: number) => void;
}

// 게시글 카드 — 피드/상세 공용. 제목 중심(작성자는 익명).
export function PostCard({ post: p, href, onReport, onDelete }: Props) {
  const [imgError, setImgError] = useState(false);
  const showImg = p.image_url && !imgError;
  const realTitle = p.title?.trim();
  const title = realTitle || p.content?.trim().slice(0, 60) || '(제목 없음)';
  // 제목이 없어 내용을 제목으로 쓴 경우엔 본문 중복 방지로 숨김
  const showBody = !!(realTitle && p.content);

  const media = showImg ? (
    <div className={styles.media}>
      <img src={p.image_url!} alt="" loading="lazy" onError={() => setImgError(true)} />
    </div>
  ) : null;
  const body = showBody ? <p className={styles.cardBody}>{p.content}</p> : null;

  const titleInner = (
    <>
      <span className={styles.catBadge}>{categoryLabel(p.category)}</span>
      <span className={styles.postTitle}>{title}</span>
    </>
  );

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        {href ? <a href={href} className={styles.titleLink}>{titleInner}</a> : <div className={styles.titleLink}>{titleInner}</div>}
        <div className={styles.metaRow}>
          <span className={styles.metaAuthor}>{p.nickname || '익명'}</span>
          {p.ip_prefix && <span className={styles.cardIp}>({p.ip_prefix})</span>}
          <span className={styles.metaDot}>·</span>
          <time className={styles.cardDate}>{formatRelative(p.created_at)}</time>
        </div>
      </header>

      {href && (media || body) ? (
        <a href={href} className={styles.cardLink}>{media}{body}</a>
      ) : (
        <>{media}{body}</>
      )}

      {(onReport || onDelete) && (
        <footer className={styles.cardActions}>
          {onReport && <button type="button" className={styles.act} onClick={() => onReport(p.id)}>신고</button>}
          {onDelete && <button type="button" className={styles.act} onClick={() => onDelete(p.id)}>삭제</button>}
        </footer>
      )}
    </article>
  );
}
