import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전체 이론',
  description: '2026.08.24 재무회계 수업자료 전체 이론노트',
};

export default function FullNoteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
