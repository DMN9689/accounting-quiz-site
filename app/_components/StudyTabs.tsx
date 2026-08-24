'use client';

import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '문제풀이' },
  { href: '/full-note/', label: '전체 이론' },
  { href: '/theory/', label: '헷갈리는 이론' },
  { href: '/annotations/', label: '괄호 표기 Q&A' },
] as const;

function isCurrentPath(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function StudyTabs() {
  const pathname = usePathname();

  return (
    <header className="study-tabs-shell">
      <nav className="study-tabs" aria-label="재무회계 학습 자료 선택">
        {tabs.map((tab) => {
          const isCurrent = isCurrentPath(pathname, tab.href);

          return (
            <a
              key={tab.href}
              href={tab.href}
              className={isCurrent ? 'is-current' : undefined}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
