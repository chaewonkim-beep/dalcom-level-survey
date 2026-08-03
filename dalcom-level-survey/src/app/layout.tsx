import type { Metadata, Viewport } from 'next';
import './globals.css';

/**
 * 카카오톡·문자·SNS에 링크를 붙여넣었을 때 보이는 제목·설명·썸네일.
 * 배포 주소가 바뀌면 NEXT_PUBLIC_SITE_URL 환경변수만 바꿔주면 됩니다.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalcom-level.vercel.app';

const TITLE = '우리 아이는 유아 1단계? 유아 2단계?';
const DESCRIPTION =
  '아이의 연령, 경험, 현재 수준을 확인하고 우리 아이에게 맞는 단계를 찾아보세요. 약 1분 · 총 11문항';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: '달콤수학',
    locale: 'ko_KR',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '달콤 유아 사고력 1단계·2단계 프로젝트 교재',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fff7ed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-[100dvh] bg-brand-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
