import type { Metadata } from 'next';
import './globals.css';

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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8522919475398338"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <header className="site-header">
          <h1>
            <a href="/">🎮 게임 출시 캘린더</a>
          </h1>
        </header>
        <main id="main">{children}</main>
        {modal}
        <footer className="site-footer">
          <p>© 2026 게임 출시 캘린더 (gcalen.com)</p>
          <p>문의: <a href="mailto:contact@gcalen.com">contact@gcalen.com</a></p>
        </footer>
      </body>
    </html>
  );
}
