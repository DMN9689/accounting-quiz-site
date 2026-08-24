/* eslint-disable @next/next/no-css-tags -- route-specific article stylesheet is intentional */
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import sourceMarkdown from './content.md?raw';

export const metadata: Metadata = {
  title: '괄호 표기 Q&A',
  description: '분개 계정과목 뒤 괄호의 용도와 표기 기준을 정리한 질문과 답변',
};

const content = sourceMarkdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

export default function AnnotationsPage() {
  return (
    <>
      <link rel="stylesheet" href="/assets/annotations.css" />
      <main className="annotation-page">
        <article className="annotation-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </main>
    </>
  );
}
