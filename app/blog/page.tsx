import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatPostDate } from '@/lib/blog';
import { AdSlot } from '@/components/AdSlot';
import { PageShell } from '@/components/PageShell';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: '게임 출시 블로그 | 신작·신규 서버 큐레이션',
  description: '신규 게임 출시 정리, 신규 서버 일정, 추천 게임 큐레이션 등 게임 출시 캘린더가 직접 정리한 게임 정보 블로그.',
  alternates: { canonical: 'https://gcalen.com/blog' },
  openGraph: {
    url: 'https://gcalen.com/blog',
    type: 'website',
    title: '게임 출시 블로그',
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <PageShell>
      <section className={styles.indexSection}>
        <header className={styles.header}>
          <h2 className={styles.title}>📰 블로그</h2>
          <p className={styles.subtitle}>
            신작·신규 서버 큐레이션, 추천 게임 정리, 출시 일정 요약
          </p>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>아직 게시글이 없어요. 곧 첫 글이 올라옵니다!</p>
        ) : (
          <ul className={styles.postList}>
            {posts.map(p => (
              <li key={p.slug} className={styles.postCard}>
                <Link href={`/blog/${p.slug}`} className={styles.postLink}>
                  <time className={styles.postDate}>{formatPostDate(p.date)}</time>
                  <h3 className={styles.postTitle}>{p.title}</h3>
                  {p.description && <p className={styles.postDesc}>{p.description}</p>}
                  {p.tags.length > 0 && (
                    <div className={styles.postTags}>
                      {p.tags.map(t => (
                        <span key={t} className={styles.tag}>#{t}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <AdSlot slot="blog-index-bottom" size="mid" />
    </PageShell>
  );
}
