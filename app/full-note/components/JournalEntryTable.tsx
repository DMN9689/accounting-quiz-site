import type { JournalEntry, JournalExample, JournalLine } from "../types/content";
import { formatAmount } from "../utils/formatAmount";
import { RichTextRenderer } from "./RichTextRenderer";

type JournalEntryTableProps = {
  example: JournalExample;
  compact?: boolean;
};

type EntrySideProps = {
  title: "차변" | "대변";
  lines: JournalLine[];
};

function EntrySide({ title, lines }: EntrySideProps) {
  return (
    <div className="entry-side">
      <div className="entry-side-title">{title}</div>
      {lines.map((line, lineIndex) => (
        <div className="entry-line" key={`${line.account}-${lineIndex}`}>
          <span className="entry-account">
            {line.account}
            {line.counterparty ? (
              <span className="entry-counterparty"> · {line.counterparty}</span>
            ) : null}
          </span>
          <span className="entry-amount">{formatAmount(line.amount)}</span>
        </div>
      ))}
    </div>
  );
}

function Entry({ entry }: { entry: JournalEntry }) {
  return (
    <div className="journal-entry">
      {entry.date || entry.label ? (
        <div className="journal-entry-meta">
          {entry.date ? <span className="journal-date">{entry.date}</span> : null}
          {entry.label ? <strong>{entry.label}</strong> : null}
        </div>
      ) : null}
      <div className="entry-grid">
        <EntrySide title="차변" lines={entry.debit} />
        <EntrySide title="대변" lines={entry.credit} />
      </div>
    </div>
  );
}

export function JournalEntryTable({ example, compact = false }: JournalEntryTableProps) {
  return (
    <article className={`journal-example${compact ? " is-compact" : ""}`}>
      <div className="journal-question">
        <RichTextRenderer content={example.transaction} />
      </div>
      {example.presentation === "entries"
        ? example.entries.map((entry, entryIndex) => (
            <Entry entry={entry} key={`${example.id}-entry-${entryIndex}`} />
          ))
        : example.variants.map((variant, variantIndex) => (
            <section className="journal-variant" key={`${example.id}-variant-${variantIndex}`}>
              <h4>{variant.label}</h4>
              {variant.entries.map((entry, entryIndex) => (
                <Entry entry={entry} key={`${example.id}-${variantIndex}-${entryIndex}`} />
              ))}
            </section>
          ))}
      {example.note ? (
        <div className="journal-result">
          <RichTextRenderer content={example.note} />
        </div>
      ) : null}
    </article>
  );
}

