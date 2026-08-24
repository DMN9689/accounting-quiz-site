import { useId, useState } from "react";

import type { JournalExample } from "../types/content";
import { ExtraExamplesDisclosure } from "./ExtraExamplesDisclosure";
import { JournalEntryTable } from "./JournalEntryTable";

type JournalDisclosureProps = {
  theoryId: string;
  representative: JournalExample;
  extras: JournalExample[];
};

export function JournalDisclosure({
  theoryId,
  representative,
  extras,
}: JournalDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId().replace(/:/g, "");
  const buttonId = `${theoryId}-journal-button-${uniqueId}`;
  const panelId = `${theoryId}-journal-panel-${uniqueId}`;

  return (
    <div className="journal-disclosure">
      <button
        className="journal-toggle"
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="toggle-symbol" aria-hidden="true">
          ＋
        </span>
        <span>{isOpen ? "대표분개 닫기" : "대표분개 보기"}</span>
      </button>
      <div
        className="journal-panel"
        id={panelId}
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        <JournalEntryTable example={representative} />
        <ExtraExamplesDisclosure parentId={theoryId} extras={extras} />
      </div>
    </div>
  );
}

