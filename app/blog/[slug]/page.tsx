import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts, markdownToHtml, formatPostDate } from '@/lib/blog';
import { PageShell } from '@/components/PageShell';
import { ViewCounter } from '@/components/ViewCounter';
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
  const ogImage = post.heroImage ?? 'https://gcalen.com/og-image.png';
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
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description.slice(0, 158),
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const html = markdownToHtml(post.content);
  const related = await getRelatedPosts(post.slug, 3);
  const url = `https://gcalen.com/blog/${post.slug}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    ...(post.heroImage ? { image: [post.heroImage] } : { image: ['https://gcalen.com/og-image.png'] }),
    author: { '@type': 'Organization', name: '게임 출시 캘린더', url: 'https://gcalen.com' },
    publisher: {
      '@type': 'Organization',
      name: '게임 출시 캘린더',
      url: 'https://gcalen.com',
      logo: { '@type': 'ImageObject', url: 'https://gcalen.com/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    keywords: post.tags.join(', '),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
      { '@type': 'ListItem', position: 2, name: '신작 가이드', item: 'https://gcalen.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <article className={styles.post}>
        <Link href="/blog" className={styles.backLink}>← 신작 가이드 목록으로</Link>
        {post.heroImage && (
          <div className={styles.hero}>
            <img src={post.heroImage} alt={post.title} loading="eager" />
          </div>
        )}
        <header className={styles.postHeader}>
          <time className={styles.postDate}>{formatPostDate(post.date)}</time>
          <h1 className={styles.postH1}>{post.title}</h1>
          <ViewCounter gameId={`blog:${post.slug}`} />
          {post.description && <p className={styles.postLead}>{post.description}</p>}
          {post.tags.length > 0 && (
            <div className={styles.postTags}>
              {post.tags.map(t => <span key={t} className={styles.tag}>#{t}</span>)}
            </div>
          )}
        </header>
        <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: html }} />

        {related.length > 0 && (
          <nav className={styles.related} aria-label="관련 가이드">
            <h2 className={styles.relatedTitle}>함께 보면 좋은 가이드</h2>
            <ul className={styles.relatedList}>
              {related.map(r => (
                <li key={r.slug} className={styles.relatedCard}>
                  <Link href={`/blog/${r.slug}`} className={styles.relatedLink}>
                    {r.heroImage && (
                      <div className={styles.relatedThumb}>
                        <img src={r.heroImage} alt="" aria-hidden="true" loading="lazy" />
                      </div>
                    )}
                    <div className={styles.relatedBody}>
                      <time className={styles.relatedDate}>{formatPostDate(r.date)}</time>
                      <span className={styles.relatedName}>{r.title}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </PageShell>
  );
}
