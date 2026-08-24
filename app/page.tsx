/* eslint-disable @next/next/no-css-tags -- route-specific legacy stylesheet is intentionally preserved */
import type { Metadata } from 'next';
import Script from 'next/script';
import quizSource from './quiz-source.html?raw';
import { extractBodyMarkup } from './_lib/extractBodyMarkup';

export const metadata: Metadata = {
  title: '문제풀이',
  description: '전산회계 1급·전산세무 2급 재무회계 기출문제 연습',
};

const quizMarkup = extractBodyMarkup(quizSource);

export default function QuizPage() {
  return (
    <>
      <link rel="stylesheet" href="/assets/quiz/style.css" />
      <div className="quiz-page" dangerouslySetInnerHTML={{ __html: quizMarkup }} />
      <Script src="/assets/quiz/app.js" strategy="afterInteractive" />
    </>
  );
}
