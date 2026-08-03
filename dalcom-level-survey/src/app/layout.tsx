import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '우리 아이는 유아 1단계? 유아 2단계? | 달콤교육',
  description:
    '11개 문항으로 우리 아이에게 맞는 달콤 유아 사고력 단계를 추천해 드려요.',
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
