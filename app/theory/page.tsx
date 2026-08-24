/* eslint-disable @next/next/no-css-tags -- route-specific legacy stylesheet is intentionally preserved */
import type { Metadata } from 'next';
import Script from 'next/script';
import theorySource from '../theory-source.html?raw';
import { extractBodyMarkup } from '../_lib/extractBodyMarkup';

export const metadata: Metadata = {
  title: '헷갈리는 이론',
  description: '서로 헷갈리기 쉬운 재무회계 처리 기준 8개 항목',
};

const theoryMarkup = extractBodyMarkup(theorySource);

export default function TheoryPage() {
  return (
    <>
      <link rel="stylesheet" href="/assets/theory/style.css" />
      <div id="top" className="theory-page" dangerouslySetInnerHTML={{ __html: theoryMarkup }} />
      <Script src="/assets/theory/app.js" strategy="afterInteractive" />
    </>
  );
}
