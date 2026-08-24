export type MarkType = "bold" | "highlight" | "account" | "warning";

export type RichTextSegment = {
  text: string;
  marks?: MarkType[];
};

export type RichText = RichTextSegment[];

export type TableCell = {
  content: RichText;
  header?: boolean;
  scope?: "row" | "col";
  rowSpan?: number;
  colSpan?: number;
};

export type ContentBlock =
  | { type: "paragraph"; content: RichText }
  | { type: "list"; items: RichText[] }
  | { type: "formula"; content: RichText }
  | {
      type: "callout";
      tone: "key" | "warning" | "process";
      content: RichText;
    }
  | {
      type: "table";
      caption?: RichText;
      columnCount: number;
      rows: TableCell[][];
    };

export type JournalLine = {
  account: string;
  amount: number;
  counterparty?: string;
};

export type JournalEntry = {
  date?: string;
  label?: string;
  debit: JournalLine[];
  credit: JournalLine[];
};

export type JournalVariant = {
  label: string;
  entries: JournalEntry[];
};

export type JournalExampleBase = {
  id: string;
  sourcePages: number[];
  transaction: RichText;
  note?: RichText;
};

export type JournalExample = JournalExampleBase &
  (
    | { presentation: "entries"; entries: JournalEntry[] }
    | { presentation: "variants"; variants: JournalVariant[] }
  );

export type TheoryItem = {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  sourcePages: number[];
  updatedAt: string;
  correctionIds?: string[];
  blocks: ContentBlock[];
  journal?: {
    representative: JournalExample;
    extras: JournalExample[];
  };
};

export type Chapter = {
  id: string;
  order: number;
  title: string;
  sourcePages: number[];
  theories: TheoryItem[];
};

export type AccountingNote = {
  source: {
    title: string;
    versionDate: string;
    pdfFile: string;
    mdFile: string;
    correctionLogFile: string;
  };
  updatedAt: string;
  chapters: Chapter[];
};

