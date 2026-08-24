import type { Chapter } from "../types/content";

type ChapterNavProps = {
  chapters: Chapter[];
};

export function ChapterNav({ chapters }: ChapterNavProps) {
  return (
    <nav className="chapter-nav" aria-label="대단원 이동">
      {chapters.map((chapter) => (
        <a key={chapter.id} href={`#${chapter.id}`}>
          {String(chapter.order).padStart(2, "0")} {chapter.title}
        </a>
      ))}
    </nav>
  );
}

