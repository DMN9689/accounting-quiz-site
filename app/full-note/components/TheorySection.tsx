import type { TheoryItem } from "../types/content";
import { ContentBlockRenderer } from "./ContentBlockRenderer";
import { JournalDisclosure } from "./JournalDisclosure";

type TheorySectionProps = {
  theory: TheoryItem;
};

export function TheorySection({ theory }: TheorySectionProps) {
  return (
    <section
      className="theory"
      id={theory.id}
      data-theory-id={theory.id}
      aria-labelledby={`${theory.id}-title`}
    >
      <header className="theory-head">
        <span className="theory-index" aria-hidden="true">
          {theory.order}.
        </span>
        <h3 id={`${theory.id}-title`}>{theory.title}</h3>
        <span className="theory-source">p.{theory.sourcePages.join("·")}</span>
      </header>
      <ContentBlockRenderer blocks={theory.blocks} />
      {theory.journal ? (
        <JournalDisclosure
          theoryId={theory.id}
          representative={theory.journal.representative}
          extras={theory.journal.extras}
        />
      ) : null}
    </section>
  );
}

