import { useId, useState } from "react";

import type { JournalExample } from "../types/content";
import { JournalEntryTable } from "./JournalEntryTable";

type ExtraExamplesDisclosureProps = {
  parentId: string;
  extras: JournalExample[];
};

export function ExtraExamplesDisclosure({ parentId, extras }: ExtraExamplesDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId().replace(/:/g, "");
  const buttonId = `${parentId}-extras-button-${uniqueId}`;
  const panelId = `${parentId}-extras-panel-${uniqueId}`;

  if (extras.length === 0) {
    return null;
  }

  return (
    <section className="extra-disclosure">
      <button
        className="extra-toggle"
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{isOpen ? "추가예시 닫기" : `추가예시 ${extras.length}개 보기`}</span>
        <span className="extra-toggle-symbol" aria-hidden="true">
          {isOpen ? "−" : "＋"}
        </span>
      </button>
      <div
        className="extra-panel"
        id={panelId}
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        {extras.map((example, exampleIndex) => (
          <div className="mini-example" key={example.id}>
            <div className="mini-head">추가예시 {exampleIndex + 1}</div>
            <JournalEntryTable example={example} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

