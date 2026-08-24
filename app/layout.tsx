import type { Metadata } from 'next';
import { StudyTabs } from './_components/StudyTabs';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '재무회계 학습 허브',
    template: '%s | 재무회계 학습 허브',
  },
  description: '문제풀이와 재무회계 이론 자료를 한곳에서 선택해 보는 학습 사이트',
  openGraph: {
    title: '재무회계 학습 허브',
    description: '문제풀이와 재무회계 이론 자료를 한곳에서 선택해 보는 학습 사이트',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '재무회계 학습 허브',
    description: '문제풀이와 재무회계 이론 자료를 한곳에서 선택해 보는 학습 사이트',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StudyTabs />
        {children}
      </body>
    </html>
  );
}
