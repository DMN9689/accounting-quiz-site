import { ChapterNav } from "./components/ChapterNav";
import { ChapterSection } from "./components/ChapterSection";
import { SiteHeader } from "./components/SiteHeader";
import { accountingNote } from "./content";

export default function App() {
  const loadedSourcePages = accountingNote.chapters.flatMap(
    (chapter) => chapter.sourcePages,
  );
  const firstSourcePage = Math.min(...loadedSourcePages);
  const lastSourcePage = Math.max(...loadedSourcePages);

  return (
    <>
      <SiteHeader
        title="재무회계 이론노트"
        sourceDate={accountingNote.source.versionDate}
        updatedAt={accountingNote.updatedAt}
      />
      <section className="intro" aria-labelledby="page-title">
        <div className="intro-inner">
          <h1 id="page-title">재무회계 이론노트</h1>
          <div className="intro-meta">
            <span>
              <b>범위</b> 원문 p.{firstSourcePage}~{lastSourcePage}
            </span>
            <span>
              <b>표시</b> 이론 우선 · 분개 기본 닫힘
            </span>
          </div>
        </div>
        <ChapterNav chapters={accountingNote.chapters} />
      </section>
      <main className="study-main">
        {accountingNote.chapters.map((chapter) => (
          <ChapterSection chapter={chapter} key={chapter.id} />
        ))}
      </main>
    </>
  );
}
