import type { Chapter } from "../types/content";
import { TheorySection } from "./TheorySection";

type ChapterSectionProps = {
  chapter: Chapter;
};

function formatSourcePages(sourcePages: number[]): string {
  return `원문 p.${sourcePages.join("·")}`;
}

export function ChapterSection({ chapter }: ChapterSectionProps) {
  return (
    <article className="chapter" id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
      <header className="chapter-head">
        <span className="chapter-no" aria-hidden="true">
          {String(chapter.order).padStart(2, "0")}
        </span>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <span className="source-page">{formatSourcePages(chapter.sourcePages)}</span>
      </header>
      {chapter.theories.map((theory) => (
        <TheorySection key={theory.id} theory={theory} />
      ))}
      {chapter.theories.length > 0 ? (
        <footer className="chapter-foot">
          대표분개는 이론 바로 아래에서 펼쳐지며 추가예시는 그 내부에 표시됩니다.
        </footer>
      ) : null}
    </article>
  );
}

