import type { Metadata } from 'next';
import './globals.css';
import { HeaderNav } from '@/components/HeaderNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://gcalen.com'),
  title: {
    default: '게임 출시 캘린더 | 국내외 신작·신규 서버 일정 한눈에',
    template: '%s | 게임 출시 캘린더',
  },
  description: '국내 모바일·PC/콘솔 게임, 글로벌 대작, 한국 MMORPG 신규 서버 오픈 일정을 한눈에. 매일 업데이트되는 게임 출시 캘린더.',
  keywords: ['게임 출시일', '신작 게임', '신규 서버', '게임 캘린더', '모바일 게임 출시', 'PC 게임 출시', '콘솔 게임', '리니지 신서버', '메이플 신서버', '출시 일정'],
  openGraph: {
    type: 'website',
    siteName: '게임 출시 캘린더',
    locale: 'ko_KR',
    images: ['/og-image.png'],
    url: 'https://gcalen.com/',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'lzLVWegsUNGglPnfG4v2LZbpcqZufhIdksQHS1C9Vjc',
    other: {
      'naver-site-verification': '3ec567114e683e947e53e79a6f652d967c57231c',
    },
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();",
          }}
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8522919475398338"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <symbol id="ic-gamepad" viewBox="0 0 24 24"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.6 9.4 2 14.46 2 16a3 3 0 0 0 5 2l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.42.59L17 18a3 3 0 0 0 5-2c0-1.54-.6-6.6-.7-7.41A4 4 0 0 0 17.32 5z" /></symbol>
          <symbol id="ic-calendar" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></symbol>
          <symbol id="ic-list" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></symbol>
          <symbol id="ic-flame" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></symbol>
          <symbol id="ic-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" /></symbol>
          <symbol id="ic-file" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8" /></symbol>
          <symbol id="ic-arrow-ur" viewBox="0 0 24 24"><path d="M7 7h10v10M7 17 17 7" /></symbol>
          <symbol id="ic-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></symbol>
          <symbol id="ic-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></symbol>
        </svg>
        <header className="site-header">
          <h1 className="site-wordmark"><a href="/"><svg className="ic ic-gamepad" aria-hidden="true"><use href="#ic-gamepad" /></svg> 게임 출시 캘린더</a></h1>
          <HeaderNav />
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <p>© 2026 게임 출시 캘린더 (gcalen.com)</p>
          <p>문의: <a href="mailto:contact@gcalen.com">contact@gcalen.com</a> · <a href="/blog">블로그</a></p>
        </footer>
      </body>
    </html>
  );
}
