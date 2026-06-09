import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, markdownToHtml, formatPostDate } from '@/lib/blog';
import { AdSlot } from '@/components/AdSlot';
import styles from '../blog.module.css';

interface Props { params: { slug: string }; }

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: '게시글을 찾을 수 없음' };
  const url = `https://gcalen.com/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description.slice(0, 158),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const html = markdownToHtml(post.content);
  const url = `https://gcalen.com/blog/${post.slug}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: '게임 출시 캘린더' },
    publisher: { '@type': 'Organization', name: '게임 출시 캘린더', url: 'https://gcalen.com' },
    url,
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <article className={styles.post}>
        <Link href="/blog" className={styles.backLink}>← 블로그 목록으로</Link>
        <header className={styles.postHeader}>
          <time className={styles.postDate}>{formatPostDate(post.date)}</time>
          <h1 className={styles.postH1}>{post.title}</h1>
          {post.description && <p className={styles.postLead}>{post.description}</p>}
          {post.tags.length > 0 && (
            <div className={styles.postTags}>
              {post.tags.map(t => <span key={t} className={styles.tag}>#{t}</span>)}
            </div>
          )}
        </header>
        <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <AdSlot slot="blog-post-bottom" size="mid" />
    </>
  );
}
